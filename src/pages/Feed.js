import { useEffect, useState } from "react";
import API from "../services/api";
import PostCard from "../components/PostCard";

export default function Feed() {
  const [posts, setPosts] = useState([]);
  const [content, setContent] = useState("");

  const fetchFeed = async () => {
    try {
      const res = await API.get("/posts/feed");
      setPosts(res.data);
    } catch {
      alert("Failed to load feed");
    }
  };

  const createPost = async () => {
    if (!content) return;

    await API.post("/posts/create", { content });
    setContent("");
    fetchFeed();
  };

  useEffect(() => {
    fetchFeed();
  }, []);

  return (
    <div>
      <h2>🌍 Global Feed</h2>

      <div>
        <input
          placeholder="What's happening?"
          value={content}
          onChange={(e) => setContent(e.target.value)}
        />
        <button onClick={createPost}>Post</button>
      </div>

      {posts.map((post) => (
        <PostCard key={post._id} post={post} refresh={fetchFeed} />
      ))}
    </div>
  );
}
