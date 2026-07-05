import { useState } from "react";
import API from "../services/api";
import "../styles/PostCard.css";

export default function PostCard({ post, refresh }) {
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  const handleDelete = async () => {
    if (window.confirm("Are you sure you want to delete this post?")) {
      try {
        setLoading(true);
        await API.delete(`/posts/${post.id || post._id}`);
        refresh();
      } catch (err) {
        console.error("Error deleting post:", err);
        setError("Failed to delete post");
      } finally {
        setLoading(false);
      }
    }
  };

  return (
    <div className="post-card">
      {error && <div className="error-message">{error}</div>}
      
      <div className="post-header">
        <h4>{post.title || "Untitled"}</h4>
      </div>
      
      <div className="post-body">
        <p>{post.content}</p>
      </div>
      
      <div className="post-footer">
        <small>
          📅 {new Date(post.createdAt).toLocaleDateString()}
        </small>
        
        <div className="post-actions">
          <button 
            onClick={handleDelete} 
            className="delete-btn"
            disabled={loading}
          >
            {loading ? "Deleting..." : "🗑️ Delete"}
          </button>
        </div>
      </div>
    </div>
  );
}
