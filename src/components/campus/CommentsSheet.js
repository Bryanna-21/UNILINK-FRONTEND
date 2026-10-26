import { useCallback, useEffect, useState } from "react";
import { FaTimes } from "react-icons/fa";

import API from "../../services/api";
import { useAuth } from "../../context/AuthContext";
import { getErrorMessage } from "../../utils/errors";
import { formatDateTime } from "../../utils/format";

// Comments for one post, from GET and POST /posts/:id/comments.
export default function CommentsSheet({ post, onClose, onCountChange }) {
  const { user } = useAuth();

  const [comments, setComments] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [text, setText] = useState("");
  const [sending, setSending] = useState(false);

  const load = useCallback(async () => {
    setLoading(true);
    setError("");

    try {
      const res = await API.get(`/posts/${post._id}/comments`);
      setComments(Array.isArray(res.data?.data) ? res.data.data : []);
    } catch (err) {
      setComments([]);
      setError(getErrorMessage(err, "We couldn't load the comments."));
    } finally {
      setLoading(false);
    }
  }, [post._id]);

  useEffect(() => {
    load();
  }, [load]);

  useEffect(() => {
    const onKey = (event) => {
      if (event.key === "Escape") onClose();
    };

    document.addEventListener("keydown", onKey);
    return () => document.removeEventListener("keydown", onKey);
  }, [onClose]);

  const send = async (event) => {
    event.preventDefault();

    const content = text.trim();
    if (!content || sending) return;

    setSending(true);
    setError("");

    try {
      const res = await API.post(`/posts/${post._id}/comments`, { content });
      const created = res.data?.data;

      // The create response has no author fields, so use the signed-in user.
      setComments((prev) => [
        ...prev,
        { ...created, authorName: created?.authorName || user?.name || "You" },
      ]);
      setText("");
      onCountChange((post.commentsCount || 0) + 1);
    } catch (err) {
      setError(getErrorMessage(err, "We couldn't post your comment."));
    } finally {
      setSending(false);
    }
  };

  return (
    <div className="campus-modal-backdrop campus-sheet-backdrop" onMouseDown={onClose}>
      <div
        className="campus-modal campus-sheet"
        role="dialog"
        aria-modal="true"
        aria-label="Comments"
        onMouseDown={(event) => event.stopPropagation()}
      >
        <div className="campus-modal-head">
          <h3>Comments</h3>
          <button type="button" className="campus-icon-btn" onClick={onClose} aria-label="Close">
            <FaTimes />
          </button>
        </div>

        <div className="campus-comments">
          {loading ? (
            <p className="campus-muted">Loading comments...</p>
          ) : comments.length === 0 && !error ? (
            <p className="campus-muted">No comments yet. Start the conversation.</p>
          ) : (
            comments.map((comment) => (
              <div className="campus-comment" key={comment._id}>
                <strong>{comment.authorName}</strong>
                <p>{comment.content}</p>
                <span className="campus-muted">{formatDateTime(comment.createdAt)}</span>
              </div>
            ))
          )}
        </div>

        {error && <div className="campus-error" role="alert">{error}</div>}

        <form className="campus-comment-form" onSubmit={send}>
          <input
            className="campus-input"
            placeholder="Add a comment..."
            value={text}
            onChange={(event) => setText(event.target.value)}
            disabled={sending}
          />
          <button type="submit" className="campus-btn" disabled={sending || !text.trim()}>
            {sending ? "..." : "Send"}
          </button>
        </form>
      </div>
    </div>
  );
}
