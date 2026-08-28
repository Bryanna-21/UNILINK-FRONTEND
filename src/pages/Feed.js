import { useEffect, useState } from "react";
import { FaImage, FaVideo, FaTimes } from "react-icons/fa";
import API from "../services/api";
import PostCard from "../components/PostCard";
import "../styles/Feed.css";

export default function Feed() {
  const [posts, setPosts] = useState([]);
  const [title, setTitle] = useState("");
  const [content, setContent] = useState("");
  const [mediaFiles, setMediaFiles] = useState([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  const fetchFeed = async () => {
    try {
      setLoading(true);
      setError("");
      const res = await API.get("/posts");
      setPosts(res.data.data || []);
    } catch (err) {
      console.error("Error fetching posts:", err);
      setError("Failed to load posts");
    } finally {
      setLoading(false);
    }
  };

  const handleMediaSelect = (e) => {
    const files = Array.from(e.target.files || []);
    if (mediaFiles.length + files.length > 4) {
      setError("You can attach up to 4 files per post.");
      return;
    }
    setMediaFiles((prev) => [...prev, ...files]);
  };

  const removeMediaFile = (index) => {
    setMediaFiles((prev) => prev.filter((_, i) => i !== index));
  };

  const createPost = async () => {
    // Validation
    if (!title.trim()) {
      setError("Please enter a title");
      return;
    }
    if (title.trim().length < 5) {
      setError("Title must be at least 5 characters");
      return;
    }
    if (!content.trim()) {
      setError("Please enter content");
      return;
    }
    if (content.trim().length < 10) {
      setError("Content must be at least 10 characters");
      return;
    }

    try {
      setLoading(true);
      setError("");

      const formData = new FormData();
      formData.append("title", title.trim());
      formData.append("content", content.trim());
      mediaFiles.forEach((file) => formData.append("media", file));

      await API.post("/posts", formData, {
        headers: { "Content-Type": "multipart/form-data" },
      });

      setTitle("");
      setContent("");
      setMediaFiles([]);
      await fetchFeed();
    } catch (err) {
      console.error("Error creating post:", err);
      setError(err.response?.data?.message || "Error creating post");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchFeed();
  }, []);

  return (
    <>
      <div className="feed-container">
        {/* Post Creation Box */}
        <div className="post-creation-box">
          <h3>Create a New Post</h3>
          {error && <div className="error-message">{error}</div>}

          <input
            placeholder="Post Title (min 5 characters)"
            value={title}
            onChange={(e) => setTitle(e.target.value)}
            className="input-field"
            disabled={loading}
          />

          <textarea
            placeholder="Share something... (min 10 characters)"
            value={content}
            onChange={(e) => setContent(e.target.value)}
            className="textarea-field"
            rows="4"
            disabled={loading}
          />

          {mediaFiles.length > 0 && (
            <div className="media-preview-row">
              {mediaFiles.map((file, i) => (
                <div className="media-preview-chip" key={i}>
                  <span>{file.name}</span>
                  <button
                    type="button"
                    onClick={() => removeMediaFile(i)}
                    disabled={loading}
                  >
                    <FaTimes size={11} />
                  </button>
                </div>
              ))}
            </div>
          )}

          <div className="post-actions-row">
            <label className="media-attach-btn">
              <FaImage /> <FaVideo />
              <span>Add photos/videos</span>
              <input
                type="file"
                accept="image/*,video/*"
                multiple
                onChange={handleMediaSelect}
                disabled={loading || mediaFiles.length >= 4}
                hidden
              />
            </label>

            <button
              onClick={createPost}
              className="create-post-btn"
              disabled={loading}
            >
              {loading ? "Creating..." : "Post"}
            </button>
          </div>
        </div>

        {/* Posts List */}
        <div className="posts-list">
          {loading && posts.length === 0 && <p>Loading posts...</p>}
          {!loading && posts.length === 0 && <p>No posts yet. Be the first to post!</p>}
          {posts.map((p) => (
            <PostCard key={p.id || p._id} post={p} refresh={fetchFeed} />
          ))}
        </div>
      </div>
    </>
  );
}
