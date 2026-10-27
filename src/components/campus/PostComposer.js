import { useEffect, useState } from "react";
import { FaImage, FaVideo, FaTimes } from "react-icons/fa";

import API from "../../services/api";
import { getErrorMessage } from "../../utils/errors";

// The post composer, now a dialog opened by the "+" button (as in the
// app) instead of a column beside the feed. Validation and the upload
// itself are unchanged from the old Feed page.
export default function PostComposer({ onClose, onPosted }) {
  const [title, setTitle] = useState("");
  const [content, setContent] = useState("");
  const [mediaFiles, setMediaFiles] = useState([]);
  const [submitting, setSubmitting] = useState(false);
  const [error, setError] = useState("");

  useEffect(() => {
    const onKey = (event) => {
      if (event.key === "Escape" && !submitting) onClose();
    };

    document.addEventListener("keydown", onKey);
    return () => document.removeEventListener("keydown", onKey);
  }, [onClose, submitting]);

  const handleMediaSelect = (event) => {
    const files = Array.from(event.target.files || []);

    if (mediaFiles.length + files.length > 4) {
      setError("You can attach up to 4 files per post.");
      return;
    }

    setError("");
    setMediaFiles((prev) => [...prev, ...files]);
    event.target.value = "";
  };

  const removeMediaFile = (index) =>
    setMediaFiles((prev) => prev.filter((_, i) => i !== index));

  const submit = async () => {
    const cleanTitle = title.trim();
    const cleanContent = content.trim();

    if (!cleanTitle) return setError("Please enter a title");
    if (cleanTitle.length < 5) return setError("Title must be at least 5 characters");
    if (!cleanContent) return setError("Please enter content");
    if (cleanContent.length < 10) return setError("Content must be at least 10 characters");

    setSubmitting(true);
    setError("");

    try {
      const formData = new FormData();
      formData.append("title", cleanTitle);
      formData.append("content", cleanContent);
      mediaFiles.forEach((file) => formData.append("media", file));

      await API.post("/posts", formData, {
        headers: { "Content-Type": "multipart/form-data" },
      });

      onPosted();
    } catch (err) {
      console.error("Error creating post:", err);
      setError(getErrorMessage(err, "Error creating post"));
      setSubmitting(false);
    }
  };

  return (
    <div className="campus-modal-backdrop" onMouseDown={() => !submitting && onClose()}>
      <div
        className="campus-modal"
        role="dialog"
        aria-modal="true"
        aria-label="Create a post"
        onMouseDown={(event) => event.stopPropagation()}
      >
        <div className="campus-modal-head">
          <h3>Create a post</h3>
          <button type="button" className="campus-icon-btn" onClick={onClose} disabled={submitting} aria-label="Close">
            <FaTimes />
          </button>
        </div>

        {error && <div className="campus-error" role="alert">{error}</div>}

        <input
          className="campus-input"
          placeholder="Title"
          value={title}
          onChange={(event) => setTitle(event.target.value)}
          maxLength={150}
          disabled={submitting}
        />

        <textarea
          className="campus-input"
          placeholder="What's on your mind?"
          rows={4}
          value={content}
          onChange={(event) => setContent(event.target.value)}
          disabled={submitting}
        />

        {mediaFiles.length > 0 && (
          <div className="campus-chips">
            {mediaFiles.map((file, index) => (
              <span className="campus-chip" key={`${file.name}-${index}`}>
                {file.name}
                <button type="button" onClick={() => removeMediaFile(index)} aria-label={`Remove ${file.name}`}>
                  <FaTimes />
                </button>
              </span>
            ))}
          </div>
        )}

        <div className="campus-modal-actions">
          <label className="campus-attach">
            <FaImage /> <FaVideo />
            <span>Add photos/videos</span>
            <input
              type="file"
              accept="image/*,video/*"
              multiple
              onChange={handleMediaSelect}
              disabled={submitting || mediaFiles.length >= 4}
              hidden
            />
          </label>

          <button type="button" className="campus-btn" onClick={submit} disabled={submitting}>
            {submitting ? "Posting..." : "Post"}
          </button>
        </div>
      </div>
    </div>
  );
}
