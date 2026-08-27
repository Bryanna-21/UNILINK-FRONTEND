import { useEffect, useState } from "react";
import { FaBook, FaLaptop, FaClipboardList, FaUndo } from "react-icons/fa";
import libraryService from "../services/libraryService";
import Skeleton from "../components/common/Skeleton";
import Toast from "../components/common/Toast";
import "./Library.css";

const TABS = [
  { key: "books", label: "Physical Books", icon: FaBook },
  { key: "digital", label: "Digital Library", icon: FaLaptop },
  { key: "loans", label: "My Loans", icon: FaClipboardList },
];

const Library = () => {
  const [activeTab, setActiveTab] = useState("books");
  const [books, setBooks] = useState([]);
  const [digital, setDigital] = useState([]);
  const [loans, setLoans] = useState([]);
  const [loading, setLoading] = useState(true);
  const [borrowingId, setBorrowingId] = useState(null);
  const [returningId, setReturningId] = useState(null);
  const [toast, setToast] = useState({ show: false, type: "success", message: "" });

  useEffect(() => {
    loadAll();
  }, []);

  const loadAll = async () => {
    setLoading(true);
    try {
      const [booksRes, digitalRes, loansRes] = await Promise.all([
        libraryService.getBooks(),
        libraryService.getDigitalResources(),
        libraryService.getMyLoans(),
      ]);
      setBooks(booksRes?.data ?? []);
      setDigital(digitalRes?.data ?? []);
      setLoans(loansRes?.data ?? []);
    } catch (error) {
      setToast({ show: true, type: "error", message: "Could not load the library." });
    } finally {
      setLoading(false);
    }
  };

  const handleBorrow = async (book) => {
    setBorrowingId(book._id);
    try {
      await libraryService.borrowBook(book._id);
      setToast({ show: true, type: "success", message: `"${book.title}" added to your loans.` });
      loadAll();
    } catch (error) {
      setToast({
        show: true,
        type: "error",
        message: error.response?.data?.message || "Could not borrow this book.",
      });
    } finally {
      setBorrowingId(null);
    }
  };

  const handleReturn = async (loan) => {
    setReturningId(loan._id);
    try {
      await libraryService.returnBook(loan._id);
      setToast({ show: true, type: "success", message: "Book returned." });
      loadAll();
    } catch (error) {
      setToast({
        show: true,
        type: "error",
        message: error.response?.data?.message || "Could not return this book.",
      });
    } finally {
      setReturningId(null);
    }
  };

  return (
    <div className="library-page">
      <div className="library-header">
        <h1>
          <FaBook /> Library
        </h1>
        <p>Browse physical books, digital resources, and manage your loans.</p>
      </div>

      <div className="library-tabs">
        {TABS.map((tab) => {
          const Icon = tab.icon;
          return (
            <button
              key={tab.key}
              className={activeTab === tab.key ? "library-tab active" : "library-tab"}
              onClick={() => setActiveTab(tab.key)}
            >
              <Icon /> {tab.label}
            </button>
          );
        })}
      </div>

      {loading ? (
        <Skeleton variant="card" count={6} />
      ) : (
        <>
          {activeTab === "books" && (
            <div className="library-grid">
              {books.length === 0 ? (
                <div className="library-empty">
                  <FaBook size={40} />
                  <p>No books available yet.</p>
                </div>
              ) : (
                books.map((book) => (
                  <div className="library-card" key={book._id}>
                    <h3>{book.title}</h3>
                    {book.author && <p className="library-muted">{book.author}</p>}
                    <div className="library-card-footer">
                      <span className="library-muted">
                        {typeof book.availableCopies === "number"
                          ? `${book.availableCopies} available`
                          : ""}
                      </span>
                      <button
                        className="library-borrow-btn"
                        disabled={borrowingId === book._id || book.availableCopies === 0}
                        onClick={() => handleBorrow(book)}
                      >
                        {borrowingId === book._id ? "Borrowing..." : "Borrow"}
                      </button>
                    </div>
                  </div>
                ))
              )}
            </div>
          )}

          {activeTab === "digital" && (
            <div className="library-grid">
              {digital.length === 0 ? (
                <div className="library-empty">
                  <FaLaptop size={40} />
                  <p>No digital resources yet.</p>
                </div>
              ) : (
                digital.map((res) => (
                  <div className="library-card" key={res._id}>
                    <h3>{res.title}</h3>
                    {res.type && <p className="library-muted">{res.type}</p>}
                  </div>
                ))
              )}
            </div>
          )}

          {activeTab === "loans" && (
            <div className="library-grid">
              {loans.length === 0 ? (
                <div className="library-empty">
                  <FaClipboardList size={40} />
                  <p>You have no active loans.</p>
                </div>
              ) : (
                loans.map((loan) => (
                  <div className="library-card" key={loan._id}>
                    <h3>{books.find((b) => b._id === loan.bookId)?.title || "Book unavailable"}</h3>
                    <p className="library-muted">{loan.status} &middot; due {loan.dueDate ? new Date(loan.dueDate).toLocaleDateString() : "N/A"}</p>
                    <button
                      className="library-return-btn"
                      disabled={returningId === loan._id}
                      onClick={() => handleReturn(loan)}
                    >
                      <FaUndo /> {returningId === loan._id ? "Returning..." : "Return"}
                    </button>
                  </div>
                ))
              )}
            </div>
          )}
        </>
      )}

      <Toast
        show={toast.show}
        type={toast.type}
        message={toast.message}
        onClose={() => setToast((prev) => ({ ...prev, show: false }))}
      />
    </div>
  );
};

export default Library;
