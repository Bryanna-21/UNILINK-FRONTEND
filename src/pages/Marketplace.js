import { useEffect, useState } from "react";
import { FaStore, FaBriefcase, FaTag } from "react-icons/fa";
import marketplaceService from "../services/marketplaceService";
import Skeleton from "../components/common/Skeleton";
import Toast from "../components/common/Toast";
import "./Marketplace.css";

const Marketplace = () => {
  const [listings, setListings] = useState([]);
  const [jobs, setJobs] = useState([]);
  const [loading, setLoading] = useState(true);
  const [toast, setToast] = useState({ show: false, type: "error", message: "" });

  useEffect(() => {
    loadMarketplace();
  }, []);

  const loadMarketplace = async () => {
    setLoading(true);
    try {
      const [listingsRes, jobsRes] = await Promise.all([
        marketplaceService.getListings(),
        marketplaceService.getJobListings(),
      ]);
      setListings(listingsRes?.data ?? []);
      setJobs(jobsRes?.data ?? []);
    } catch (error) {
      setToast({
        show: true,
        type: "error",
        message: "Could not load the marketplace. Please try again.",
      });
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="marketplace-page">
      <div className="marketplace-header">
        <h1>
          <FaStore /> Marketplace
        </h1>
        <p>Buy, sell, and find opportunities within your campus community.</p>
      </div>

      {loading ? (
        <Skeleton variant="card" count={6} />
      ) : (
        <>
          <section className="marketplace-section">
            <h2>Listings</h2>
            {listings.length === 0 ? (
              <div className="marketplace-empty">
                <FaTag size={40} />
                <p>No listings yet.</p>
              </div>
            ) : (
              <div className="marketplace-grid">
                {listings.map((item) => (
                  <div className="listing-card" key={item._id}>
                    <div className="listing-card-header">
                      <h3>{item.title}</h3>
                      {item.sold && <span className="sold-tag">Sold</span>}
                    </div>
                    {item.category && (
                      <span className="listing-category">{item.category}</span>
                    )}
                    {typeof item.price === "number" && (
                      <span className="listing-price">
                        KSh {item.price.toLocaleString()}
                      </span>
                    )}
                  </div>
                ))}
              </div>
            )}
          </section>

          <section className="marketplace-section">
            <h2>
              <FaBriefcase /> Jobs &amp; Internships
            </h2>
            {jobs.length === 0 ? (
              <div className="marketplace-empty">
                <FaBriefcase size={40} />
                <p>No job listings yet.</p>
              </div>
            ) : (
              <div className="marketplace-grid">
                {jobs.map((job) => (
                  <div className="listing-card" key={job._id}>
                    <h3>{job.title}</h3>
                    {job.company && (
                      <span className="listing-category">{job.company}</span>
                    )}
                  </div>
                ))}
              </div>
            )}
          </section>
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

export default Marketplace;
