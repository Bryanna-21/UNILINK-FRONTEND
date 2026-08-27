import api from "./api";
/**
 * Library Service
 *
 * Handles:
 * - Browsing physical books and digital resources
 * - Borrowing and returning books
 * - Viewing your own active loans
 */
const libraryService = {
  /**
   * Get all physical books
   */
  getBooks: async () => {
    try {
      const response = await api.get("/library/books");
      return response.data;
    } catch (error) {
      console.error("Failed to fetch books:", error);
      throw error;
    }
  },
  /**
   * Get all digital resources
   */
  getDigitalResources: async () => {
    try {
      const response = await api.get("/library/digital");
      return response.data;
    } catch (error) {
      console.error("Failed to fetch digital resources:", error);
      throw error;
    }
  },
  /**
   * Borrow a physical book
   */
  borrowBook: async (bookId) => {
    try {
      const response = await api.post(`/library/books/${bookId}/borrow`);
      return response.data;
    } catch (error) {
      console.error("Failed to borrow book:", error);
      throw error;
    }
  },
  /**
   * Return a borrowed book
   */
  returnBook: async (loanId) => {
    try {
      const response = await api.patch(`/library/loans/${loanId}/return`);
      return response.data;
    } catch (error) {
      console.error("Failed to return book:", error);
      throw error;
    }
  },
  /**
   * Get the current user's active loans
   */
  getMyLoans: async () => {
    try {
      const response = await api.get("/library/my-loans");
      return response.data;
    } catch (error) {
      console.error("Failed to fetch loans:", error);
      throw error;
    }
  },
};
export default libraryService;
