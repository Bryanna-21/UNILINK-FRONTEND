import { useCallback, useEffect, useMemo, useState } from "react";
import { FaPlus } from "react-icons/fa";

import API from "../services/api";
import PostCard from "../components/PostCard";
import ReelsFeed from "../components/campus/ReelsFeed";
import CommentsSheet from "../components/campus/CommentsSheet";
import PostComposer from "../components/campus/PostComposer";
import StateMessage from "../components/common/StateMessage";

import { getErrorMessage } from "../utils/errors";
import { notify } from "../utils/notify";

import "../styles/Feed.css";
import "../styles/pages/campus.css";

// Like the app's Campus tab: Reels (full-screen videos) and Chronicles
// (the written feed), switched at the top, with a + to create a post.
// Change DEFAULT_MODE to "chronicles" to open on the written feed.
const DEFAULT_MODE = "reels";

const hasVideo = (post) =>
  Array.isArray(post.media) && post.media.some((item) => item.type === "video");

export default function Feed() {
  const [posts, setPosts] = useState([]);
  const [mode, setMode] = useState(DEFAULT_MODE);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [composing, setComposing] = useState(false);
  const [commentsFor, setCommentsFor] = useState(null);

  const fetchFeed = useCallback(async () => {
    try {
      setError("");
      const res = await API.get("/posts");
      const list = Array.isArray(res.data?.data) ? res.data.data : [];
      // Some responses carry id, some _id; keep one key for everything below.
      setPosts(list.map((post) => ({ ...post, _id: post._id || post.id })));
    } catch (err) {
      console.error("Error fetching posts:", err);
      setError(getErrorMessage(err, "Failed to load posts"));
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    fetchFeed();
  }, [fetchFeed]);

  // The reels page fills the screen, so the footer would only ever sit
  // below the fold; hide it while Reels is showing.
  useEffect(() => {
    document.body.classList.toggle("has-reels", mode === "reels");
    return () => document.body.classList.remove("has-reels");
  }, [mode]);

  const reels = useMemo(() => posts.filter(hasVideo), [posts]);

  const patchPost = (id, patch) =>
    setPosts((prev) =>
      prev.map((post) =>
        post._id === id ? { ...post, ...(typeof patch === "function" ? patch(post) : patch) } : post
      )
    );

  const handleLike = async (post) => {
    const wasLiked = Boolean(post.liked);

    // Update the heart straight away, then settle on what the server says.
    patchPost(post._id, (current) => ({
      liked: !wasLiked,
      likes: Math.max(0, (current.likes || 0) + (wasLiked ? -1 : 1)),
    }));

    try {
      const res = await API.post(`/posts/like/${post._id}`);
      const serverPost = res.data?.data?.post;
      const serverLiked = res.data?.data?.liked;

      patchPost(post._id, {
        ...(typeof serverLiked === "boolean" ? { liked: serverLiked } : {}),
        ...(typeof serverPost?.likes === "number" ? { likes: serverPost.likes } : {}),
      });
    } catch (err) {
      if (err?.response?.status === 409) {
        // "Already liked": the server already has it, so keep the heart filled.
        patchPost(post._id, { liked: true });
        return;
      }

      patchPost(post._id, { liked: wasLiked, likes: post.likes || 0 });
      notify.error(getErrorMessage(err, "We couldn't update your like."));
    }
  };

  const handleReshare = async (post) => {
    try {
      await API.post(`/posts/reshare/${post._id}`);
      notify.success("Reshared to your profile.");
    } catch (err) {
      notify.error(getErrorMessage(err, "We couldn't reshare this post."));
    }
  };

  const handlePosted = async () => {
    setComposing(false);
    setLoading(true);
    await fetchFeed();
    notify.success("Posted.");
  };

  return (
    <div className="campus-page">
      <div className="campus-bar">
        <h2>Campus</h2>

        <div className="campus-modes" role="group" aria-label="Feed view">
          <button
            type="button"
            className={`campus-mode${mode === "reels" ? " campus-mode--active" : ""}`}
            aria-pressed={mode === "reels"}
            onClick={() => setMode("reels")}
          >
            Reels
          </button>

          <button
            type="button"
            className={`campus-mode${mode === "chronicles" ? " campus-mode--active" : ""}`}
            aria-pressed={mode === "chronicles"}
            onClick={() => setMode("chronicles")}
          >
            Chronicles
          </button>
        </div>
      </div>

      {loading ? (
        <StateMessage kind="loading" text="Loading posts..." />
      ) : error ? (
        <StateMessage
          kind="error"
          title="Campus unavailable"
          text={error}
          action={
            <button type="button" className="list-btn" onClick={() => { setLoading(true); fetchFeed(); }}>
              Try again
            </button>
          }
        />
      ) : mode === "reels" ? (
        <ReelsFeed
          reels={reels}
          onLike={handleLike}
          onReshare={handleReshare}
          onComments={setCommentsFor}
        />
      ) : posts.length === 0 ? (
        <StateMessage title="No posts yet" text="Be the first to post! Tap + to share." />
      ) : (
        <div className="chronicles">
          {posts.map((post) => (
            <PostCard key={post._id} post={post} />
          ))}
        </div>
      )}

      <button type="button" className="campus-fab" onClick={() => setComposing(true)} aria-label="Create a post">
        <FaPlus />
      </button>

      {composing && <PostComposer onClose={() => setComposing(false)} onPosted={handlePosted} />}

      {commentsFor && (
        <CommentsSheet
          post={commentsFor}
          onClose={() => setCommentsFor(null)}
          onCountChange={(count) => {
            patchPost(commentsFor._id, { commentsCount: count });
            setCommentsFor((current) => (current ? { ...current, commentsCount: count } : current));
          }}
        />
      )}
    </div>
  );
}
