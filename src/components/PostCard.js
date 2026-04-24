import API from "../services/api";

export default function PostCard({ post, refresh }) {

  const likePost = async () => {
    await API.post(`/posts/like/${post._id}`);
    refresh();
  };

  return (
    <div style={{
      border: "1px solid #ddd",
      padding: "10px",
      margin: "10px"
    }}>
      <p>{post.content}</p>

      <small>👍 {post.likes}</small>

      <br />

      <button onClick={likePost}>Like</button>
    </div>
  );
}
