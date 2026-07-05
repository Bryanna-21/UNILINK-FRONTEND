import { useEffect, useState } from "react";
import API from "../services/api";

export default function usePosts() {
  const [posts, setPosts] = useState([]);

  useEffect(() => {
    loadPosts();
  }, []);

  const loadPosts = async () => {
    try {
      const res = await API.get("/posts");

      setPosts(res.data.data);
    } catch (err) {
      console.error(err);
    }
  };

  return {
    posts,
    refreshPosts: loadPosts
  };
}
