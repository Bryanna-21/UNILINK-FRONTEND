import { useState } from "react";
import API from "../services/api";
import { useAuth } from "../context/AuthContext";
import "../styles/Postcard.css";

// Renders one attachment. Images/videos come from Cloudinary with a
// real `type`; anything else (PDFs etc.) isn't supported by the
// backend's media schema yet - see media.type enum in Post.js - so
// there's nothing to render for that case today, only image/video.
function MediaItem({ item }) {
  if (item.type === "video") {
    return (
      <video className="post-media" controls src={item.url} />
    );
  }

  return (
    <img className="post-media" src={item.url} alt="" />
  );
}

export default function PostCard({ post, refresh }) {
  const { user } = useAuth();
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  const postAuthorId = post.userId;
  const isAuthor = user && String(postAuthorId) === String(user.id);
  const isAdmin = user?.role === "admin";
  const canDelete = isAuthor || isAdmin;

  const handleDelete = async () => {
    if (window.confirm("Are you sure you want to delete this post?")) {
      try {
        setLoading(true);
        await API.delete(`/posts/${post.id || post._id}`);
        refresh();
      } catch (err) {
        console.error("Error deleting post:", err);
        setError(err.response?.data?.message || "Failed to delete post");
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
        <span className="post-author">
          Posted by {post.authorName || "Unknown user"}
        </span>
      </div>

      <div className="post-body">
        <p>{post.content}</p>

        {Array.isArray(post.media) && post.media.length > 0 && (
          <div className="post-media-grid">
            {post.media.map((item, i) => (
              <MediaItem key={item.publicId || i} item={item} />
            ))}
          </div>
        )}
      </div>

      <div className="post-footer">
        <small>
          📅 {new Date(post.createdAt).toLocaleDateString()}
        </small>

        {canDelete && (
          <div className="post-actions">
            <button
              onClick={handleDelete}
              className="delete-btn"
              disabled={loading}
            >
              {loading ? "Deleting..." : "🗑️ Delete"}
            </button>
          </div>
        )}
      </div>
    </div>
  );
}
