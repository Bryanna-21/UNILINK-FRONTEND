import { useCallback, useEffect, useRef, useState } from "react";
import {
  FaHeart,
  FaRegHeart,
  FaRegComment,
  FaShare,
  FaVolumeUp,
  FaVolumeMute,
  FaPlay,
} from "react-icons/fa";

const firstVideo = (post) => post.media?.find((item) => item.type === "video");

// One full-height reel. Plays only while it is the active reel, loops,
// and a tap on the video pauses or resumes it.
function Reel({ post, active, muted, onToggleMute, onLike, onReshare, onComments }) {
  const videoRef = useRef(null);
  const [paused, setPaused] = useState(false);
  const video = firstVideo(post);

  useEffect(() => {
    if (!active) setPaused(false);
  }, [active]);

  useEffect(() => {
    if (videoRef.current) videoRef.current.muted = muted;
  }, [muted]);

  useEffect(() => {
    const el = videoRef.current;
    if (!el) return undefined;

    if (active && !paused) {
      const attempt = el.play();
      // Browsers can refuse autoplay; show the play button instead.
      if (attempt && typeof attempt.catch === "function") {
        attempt.catch(() => setPaused(true));
      }
    } else {
      el.pause();
    }

    return () => el.pause();
  }, [active, paused]);

  if (!video) return null;

  const authorInitial = (post.authorName || "?").trim().charAt(0).toUpperCase();

  return (
    <section className="reel" data-id={post._id} aria-label={`Reel by ${post.authorName || "a student"}`}>
      <video
        ref={videoRef}
        className="reel-video"
        src={video.url}
        loop
        muted
        playsInline
        preload="metadata"
        onClick={() => active && setPaused((value) => !value)}
      />

      {paused && active && (
        <button type="button" className="reel-play" onClick={() => setPaused(false)} aria-label="Play">
          <FaPlay />
        </button>
      )}

      <div className="reel-info">
        <div className="reel-author">
          {post.authorAvatarUrl ? (
            <img src={post.authorAvatarUrl} alt="" />
          ) : (
            <span className="reel-avatar" aria-hidden="true">{authorInitial}</span>
          )}
          <strong>{post.authorName || "Campus student"}</strong>
        </div>

        {post.title && <p className="reel-title">{post.title}</p>}
        {post.content && <p className="reel-caption">{post.content}</p>}
      </div>

      <div className="reel-rail">
        <button
          type="button"
          className="reel-action"
          onClick={() => onLike(post)}
          aria-pressed={Boolean(post.liked)}
          aria-label={post.liked ? "Unlike" : "Like"}
        >
          {post.liked ? <FaHeart className="reel-liked" /> : <FaRegHeart />}
          <span>{post.likes || 0}</span>
        </button>

        <button type="button" className="reel-action" onClick={() => onComments(post)} aria-label="Comments">
          <FaRegComment />
          <span>{post.commentsCount || 0}</span>
        </button>

        <button type="button" className="reel-action" onClick={() => onReshare(post)} aria-label="Share">
          <FaShare />
          <span>Share</span>
        </button>

        <button
          type="button"
          className="reel-action"
          onClick={onToggleMute}
          aria-label={muted ? "Turn sound on" : "Turn sound off"}
        >
          {muted ? <FaVolumeMute /> : <FaVolumeUp />}
        </button>
      </div>
    </section>
  );
}

// The Reels view: full-height, one video per screen, snap scrolling, as
// in the app. The stage fills the space left under the page header (and
// above the phone tab bar), measured like the app measures its list.
export default function ReelsFeed({ reels, onLike, onReshare, onComments }) {
  const shellRef = useRef(null);
  const listRef = useRef(null);

  const [height, setHeight] = useState(560);
  const [activeId, setActiveId] = useState(null);
  const [muted, setMuted] = useState(true);

  const measure = useCallback(() => {
    const shell = shellRef.current;
    if (!shell) return;

    const tabs = document.querySelector(".bottom-tabs");
    const tabsHeight =
      tabs && window.getComputedStyle(tabs).display !== "none" ? tabs.offsetHeight : 0;

    const top = shell.getBoundingClientRect().top;
    setHeight(Math.max(320, Math.floor(window.innerHeight - top - tabsHeight - 12)));
  }, []);

  useEffect(() => {
    measure();
    window.addEventListener("resize", measure);
    return () => window.removeEventListener("resize", measure);
  }, [measure]);

  // Whichever reel is at least 60% visible is the active one.
  useEffect(() => {
    const list = listRef.current;
    if (!list || reels.length === 0) return undefined;

    if (typeof IntersectionObserver === "undefined") {
      setActiveId((current) => current || reels[0]._id);
      return undefined;
    }

    const observer = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          if (entry.isIntersecting && entry.intersectionRatio >= 0.6) {
            setActiveId(entry.target.getAttribute("data-id"));
          }
        });
      },
      { root: list, threshold: [0.6] }
    );

    list.querySelectorAll(".reel").forEach((node) => observer.observe(node));

    return () => observer.disconnect();
  }, [reels, height]);

  useEffect(() => {
    if (reels.length > 0 && !reels.some((reel) => reel._id === activeId)) {
      setActiveId(reels[0]._id);
    }
  }, [reels, activeId]);

  const onKeyDown = (event) => {
    if (event.key !== "ArrowDown" && event.key !== "ArrowUp") return;

    event.preventDefault();
    listRef.current?.scrollBy({
      top: event.key === "ArrowDown" ? height : -height,
      behavior: "smooth",
    });
  };

  return (
    <div className="reels-shell" ref={shellRef} style={{ height }}>
      {reels.length === 0 ? (
        <div className="reels-empty">
          <h3>No Reels yet</h3>
          <p>Tap + to share a video with campus.</p>
        </div>
      ) : (
        <div className="reels" ref={listRef} tabIndex={0} onKeyDown={onKeyDown} aria-label="Reels">
          {reels.map((post) => (
            <Reel
              key={post._id}
              post={post}
              active={post._id === activeId}
              muted={muted}
              onToggleMute={() => setMuted((value) => !value)}
              onLike={onLike}
              onReshare={onReshare}
              onComments={onComments}
            />
          ))}
        </div>
      )}
    </div>
  );
}
