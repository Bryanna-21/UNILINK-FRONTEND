import { useEffect, useState } from "react";
import API from "../services/api";
import PostCard from "../components/PostCard";
import MainLayout from "../layout/MainLayout";

export default function Feed() {
  const [posts, setPosts] = useState([]);
  const [content, setContent] = useState("");

  const fetchFeed = async () => {
    const res = await API.get("/posts/feed");
    setPosts(res.data);
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
    <MainLayout>
      <div className="post-box">
        <input
          placeholder="Share something..."
          value={content}
          onChange={(e) => setContent(e.target.value)}
        />
        <button onClick={createPost}>Post</button>
      </div>

      {posts.map((p) => (
        <PostCard key={p._id} post={p} refresh={fetchFeed} />
      ))}
    </MainLayout>
  );
}
