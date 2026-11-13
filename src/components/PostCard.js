import { useEffect, useState } from "react";
import API from "../services/api";
import { useAuth } from "../context/AuthContext";
import DocumentPager from "./DocumentPager";
import { audienceBadge } from "../utils/audience";
import { savePostMedia } from "../utils/savePost";
import "../styles/Postcard.css";
import "../styles/postDocument.css";

// How often a document that is still being prepared is checked for new page images, and for how long.
// Pages are drawn a few at a time (1 and 2 first), so the check goes on until the document is finished.
const DOC_POLL_MS = 4000;
const DOC_POLL_MAX = 60;

const waitingForPages = (media) =>
  Array.isArray(media) &&
  media.some((item) => item.type === "document" && item.processingStatus === "pending");

// A fingerprint of how far every document is, so the post only updates when something changed.
const progressOf = (media) =>
  (Array.isArray(media) ? media : [])
    .filter((item) => item.type === "document")
    .map((item) => `${item.processingStatus}:${(item.pages || []).length}`)
    .join("|");

// A posted document (PDF or Word). Every document gets the same header (name,
// page count, Open). The backend renders each page to an image (media.pages),
// shown one at a time. When there are no page images the card says why, so a
// document is never just a blank or broken box:
//   - still being prepared (checked again automatically),
//   - preparing failed,
//   - an older post whose pages have not been made yet.
function DocumentItem({ item }) {
  const pages = Array.isArray(item.pages)
    ? [...item.pages].sort((a, b) => a.page - b.page)
    : [];
  const name = item.originalName || "Document";
  const count = Math.max(item.pageCount || 0, pages.length);
  const preparing = item.processingStatus === "pending" && pages.length > 0;
  const partlyFailed = item.processingStatus === "failed" && pages.length > 0;
  const longNote = item.totalPages && item.totalPages > count ? `Showing the first ${count} of ${item.totalPages} pages` : null;

  let note = null;
  if (pages.length === 0) {
    if (item.processingStatus === "pending") {
      note = "Preparing the pages. They will appear here by themselves.";
    } else if (item.processingStatus === "failed") {
      note = "The pages could not be prepared. Use Open to read the file.";
    } else {
      note = "The pages for this file are not ready yet. Use Open to read it now.";
    }
  }

  return (
    <div className="post-doc">
      <div className="post-doc__head">
        <span className="post-doc__icon" aria-hidden="true">📄</span>

        <div className="post-doc__meta">
          <strong>{name}</strong>
          {count > 0 && <span>{longNote || (count === 1 ? "1 page" : `${count} pages`)}</span>}
        </div>

        <a className="post-doc__open" href={item.url} target="_blank" rel="noopener noreferrer">
          Open
        </a>
      </div>

      {pages.length > 0 ? (
        <>
          <DocumentPager name={name} pages={pages} expected={count} preparing={preparing} />
          {partlyFailed && (
            <p className="post-doc__note" role="status">Some pages could not be prepared. Use Open to read the whole file.</p>
          )}
        </>
      ) : (
        <p className="post-doc__note" role="status">{note}</p>
      )}
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
  const [media, setMedia] = useState(post.media);

  // A new post, or the feed refreshing, brings fresh media.
  useEffect(() => {
    setMedia(post.media);
  }, [post.media]);

  // A document posted a moment ago has no page images yet. Check for them every
  // few seconds, so the pages appear without anyone having to refresh.
  const postId = post.id || post._id;
  const pending = waitingForPages(media);
  useEffect(() => {
    if (!pending || !postId) return undefined;
    let tries = 0;
    let stopped = false;
    const timer = setInterval(async () => {
      tries += 1;
      try {
        const res = await API.get(`/posts/${postId}`);
        const fresh = res?.data?.data?.media;
        // Replace only when a page arrived or the status changed, so a page being read does not jump.
        if (!stopped && Array.isArray(fresh)) setMedia((current) => (progressOf(current) === progressOf(fresh) ? current : fresh));
      } catch {
        // Quiet: the next check tries again.
      }
      if (tries >= DOC_POLL_MAX) clearInterval(timer);
    }, DOC_POLL_MS);
    return () => {
      stopped = true;
      clearInterval(timer);
    };
  }, [pending, postId]);

  const [saving, setSaving] = useState(false);
  const handleSave = async () => {
    if (saving) return;
    setSaving(true);
    setError("");
    try {
      const result = await savePostMedia(post, media);
      if (result.failed > 0 && result.saved + result.opened === 0) setError("The files could not be saved. Check your connection and try again.");
    } finally {
      setSaving(false);
    }
  };

  const postAuthorId = post.userId;
  const isAuthor = user && String(postAuthorId) === String(user.id);
  const isAdmin = user?.role === "admin";
  const canDelete = isAuthor || isAdmin;
  const hasMedia = Array.isArray(media) && media.length > 0;

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

        {Array.isArray(media) && media.length > 0 && (
          <div className="post-media-grid">
            {media.map((item, i) => (
              <MediaItem key={item.publicId || i} item={item} />
            ))}
          </div>
        )}
      </div>

      <div className="post-footer">
        <small>
          📅 {new Date(post.createdAt).toLocaleDateString()}
          {audienceBadge(post.audience) ? ` · ${audienceBadge(post.audience)}` : ""}
        </small>

        {(hasMedia || canDelete) && (
          <div className="post-actions">
            {hasMedia && (
              <button type="button" onClick={handleSave} className="save-btn" disabled={saving} aria-label="Save this post's files">
                {saving ? "Saving..." : "⬇️ Save"}
              </button>
            )}
            {canDelete && (
              <button
                onClick={handleDelete}
                className="delete-btn"
                disabled={loading}
              >
                {loading ? "Deleting..." : "🗑️ Delete"}
              </button>
            )}
          </div>
        )}
      </div>
    </div>
  );
}
