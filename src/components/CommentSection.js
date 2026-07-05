import { useState } from "react";

export default function CommentSection() {
  const [comment, setComment] =
    useState("");

  const [comments, setComments] =
    useState([]);

  const submitComment = () => {
    if (!comment.trim()) return;

    setComments([
      ...comments,
      comment
    ]);

    setComment("");
  };

  return (
    <div>
      <h4>Comments</h4>

      {comments.map((c, i) => (
        <p key={i}>{c}</p>
      ))}

      <input
        value={comment}
        onChange={e =>
          setComment(e.target.value)
        }
      />

      <button onClick={submitComment}>
        Comment
      </button>
    </div>
  );
}
