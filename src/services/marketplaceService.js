import api from "./api";
/**
 * Marketplace Service
 *
 * Handles:
 * - Listings (buy/sell items between students)
 * - Job/internship listings
 */
const marketplaceService = {
  /**
   * Get all marketplace listings
   */
  getListings: async () => {
    try {
      const response = await api.get("/marketplace/listings");
      return response.data;
    } catch (error) {
      console.error("Failed to fetch listings:", error);
      throw error;
    }
  },
  /**
   * Get a single listing by id
   */
  getListingById: async (listingId) => {
    try {
      const response = await api.get(`/marketplace/listings/${listingId}`);
      return response.data;
    } catch (error) {
      console.error("Failed to fetch listing:", error);
      throw error;
    }
  },
  /**
   * Create a new listing
   */
  createListing: async (listingData) => {
    try {
      const response = await api.post("/marketplace/listings", listingData);
      return response.data;
    } catch (error) {
      console.error("Failed to create listing:", error);
      throw error;
    }
  },
  /**
   * Mark a listing as sold
   */
  markListingSold: async (listingId) => {
    try {
      const response = await api.patch(`/marketplace/listings/${listingId}/sold`);
      return response.data;
    } catch (error) {
      console.error("Failed to mark listing sold:", error);
      throw error;
    }
  },
  /**
   * Upload/attach an image to a listing
   */
  addListingImage: async (listingId, formData) => {
    try {
      const response = await api.post(
        `/marketplace/listings/${listingId}/image`,
        formData,
        { headers: { "Content-Type": "multipart/form-data" } }
      );
      return response.data;
    } catch (error) {
      console.error("Failed to upload listing image:", error);
      throw error;
    }
  },
  /**
   * Get all job/internship listings
   */
  getJobListings: async () => {
    try {
      const response = await api.get("/marketplace/jobs");
      return response.data;
    } catch (error) {
      console.error("Failed to fetch job listings:", error);
      throw error;
    }
  },
  /**
   * Create a new job/internship listing
   */
  createJobListing: async (jobData) => {
    try {
      const response = await api.post("/marketplace/jobs", jobData);
      return response.data;
    } catch (error) {
      console.error("Failed to create job listing:", error);
      throw error;
    }
  },
};
export default marketplaceService;
