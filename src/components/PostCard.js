import { useState } from "react";
import API from "../services/api";
import { useAuth } from "../context/AuthContext";
import "../styles/Postcard.css";
import "../styles/postDocument.css";

// A posted document (PDF or Word). The backend renders each page to an
// image (media.pages), so the pages can be read right here by scrolling
// sideways, like the app. Without page images (still preparing, or the
// render failed) the card falls back to a plain "Open" link.
function DocumentItem({ item }) {
  const pages = Array.isArray(item.pages)
    ? [...item.pages].sort((a, b) => a.page - b.page)
    : [];
  const name = item.originalName || "Document";
  const count = item.pageCount || pages.length;

  return (
    <div className="post-doc">
      <div className="post-doc__head">
        <span className="post-doc__icon" aria-hidden="true">📄</span>

        <div className="post-doc__meta">
          <strong>{name}</strong>
          {count > 0 && <span>{count === 1 ? "1 page" : `${count} pages`}</span>}
        </div>

        <a className="post-doc__open" href={item.url} target="_blank" rel="noopener noreferrer">
          Open
        </a>
      </div>

      {pages.length > 0 ? (
        <div className="post-doc__pages" tabIndex={0} aria-label={`${name}, scroll sideways to read every page`}>
          {pages.map((page) => (
            <img
              key={page.page}
              src={page.url}
              alt={`${name}, page ${page.page}`}
              loading="lazy"
            />
          ))}
        </div>
      ) : item.processingStatus === "pending" ? (
        <p className="post-doc__note">Preparing the pages. Use Open to read it now.</p>
      ) : null}
    </div>
  );
}

// Renders one attachment: video, document or image (the backend's media.type).
function MediaItem({ item }) {
  if (item.type === "video") {
    return (
      <video className="post-media" controls src={item.url} />
    );
  }

  if (item.type === "document") {
    return <DocumentItem item={item} />;
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
        if (typeof refresh === "function") refresh();
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
