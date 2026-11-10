import { useCallback, useEffect, useRef, useState } from "react";
import { useNavigate, useParams } from "react-router-dom";
import { toast } from "react-hot-toast";

import { useAuth } from "../context/AuthContext";
import PostCard from "../components/PostCard";
import StateMessage from "../components/common/StateMessage";
import * as people from "../services/profilePeopleService";
import { getErrorMessage } from "../utils/errors";

import "../styles/pages/userProfile.css";

// Another person's profile (the app's "user" screen): who they are, follow, message, block, and
// their posts. Reached from a name on a post, a search result or a notification.
export default function UserProfile() {
  const { id } = useParams();
  const { user } = useAuth();
  const navigate = useNavigate();

  const [status, setStatus] = useState("loading"); // loading | error | ready
  const [errorText, setErrorText] = useState("");
  const [profile, setProfile] = useState(null);
  const [posts, setPosts] = useState([]);
  const [isFollowing, setIsFollowing] = useState(false);
  const [followBusy, setFollowBusy] = useState(false);
  const [messageBusy, setMessageBusy] = useState(false);
  const latest = useRef(0);
  // State updates are not instant, so a fast double click could slip past the disabled button.
  // A ref is updated at once, so it is what actually stops the second click.
  const followLock = useRef(false);
  const messageLock = useRef(false);

  const isMe = !!user?.id && String(user.id) === String(id);

  // Your own profile is the Profile page.
  useEffect(() => {
    if (isMe) navigate("/profile", { replace: true });
  }, [isMe, navigate]);

  const load = useCallback(async () => {
    const requestId = ++latest.current;
    setStatus("loading");
    try {
      const [summary, following] = await Promise.all([
        people.getSummary(id),
        people.getFollowStatus(id),
      ]);
      if (requestId !== latest.current) return;
      if (!summary) throw new Error("not found");

      // Posts are secondary: if they fail, the profile still shows.
      let list = [];
      try {
        list = await people.getPosts(id);
      } catch (error) {
        list = [];
      }
      if (requestId !== latest.current) return;

      setProfile(summary);
      setIsFollowing(following);
      setPosts(list.map((p) => ({ ...p, authorName: p.authorName || summary.name })));
      setStatus("ready");
    } catch (error) {
      if (requestId !== latest.current) return;
      setErrorText(
        error?.response?.status === 404
          ? "This person isn't available."
          : getErrorMessage(error, "Could not load this profile.")
      );
      setStatus("error");
    }
  }, [id]);

  useEffect(() => {
    if (!isMe) load();
  }, [load, isMe]);

  const toggleFollow = async () => {
    if (followLock.current) return;
    followLock.current = true;
    setFollowBusy(true);
    const was = isFollowing;
    const bump = (n) => setProfile((p) => (p ? { ...p, followersCount: Math.max(0, (p.followersCount || 0) + n) } : p));
    setIsFollowing(!was);
    bump(was ? -1 : 1);
    try {
      if (was) await people.unfollow(id);
      else await people.follow(id);
    } catch (error) {
      // Put it back exactly as it was.
      setIsFollowing(was);
      bump(was ? 1 : -1);
      toast.error(getErrorMessage(error, "That didn't work. Please try again."));
    } finally {
      followLock.current = false;
      setFollowBusy(false);
    }
  };

  const message = async () => {
    if (messageLock.current) return;
    messageLock.current = true;
    setMessageBusy(true);
    try {
      const conversationId = await people.startChat(id);
      if (!conversationId) throw new Error("no conversation");
      navigate(`/messages/${conversationId}`);
    } catch (error) {
      toast.error(getErrorMessage(error, "Could not start a conversation."));
    } finally {
      messageLock.current = false;
      setMessageBusy(false);
    }
  };

  const blockPerson = async () => {
    const ok = window.confirm(
      `Block ${profile.name}? They won't be able to follow you or message you, and you won't appear in each other's search. Any follows between you are removed.`
    );
    if (!ok) return;
    try {
      await people.block(id);
      toast.success(`${profile.name} is blocked.`);
      navigate("/search", { replace: true });
    } catch (error) {
      toast.error(getErrorMessage(error, "Could not block this person."));
    }
  };

  if (isMe) return null;
  if (status === "loading") return <div className="up-page"><StateMessage kind="loading" text="Loading profile..." /></div>;
  if (status === "error") {
    return (
      <div className="up-page">
        <StateMessage
          kind="error"
          title="Profile unavailable"
          text={errorText}
          action={<button type="button" className="up-btn" onClick={load}>Try again</button>}
        />
      </div>
    );
  }

  const initial = (profile.name || "?").trim().charAt(0).toUpperCase();

  return (
    <div className="up-page">
      <header className="up-card">
        <div className="up-avatar" aria-hidden="true">
          {profile.avatarUrl ? <img src={profile.avatarUrl} alt="" /> : initial}
        </div>

        <h1>{profile.name}</h1>
        {profile.username && <p className="up-username">@{profile.username}</p>}
        <span className="up-role">{profile.role}</span>
        {profile.bio && <p className="up-bio">{profile.bio}</p>}

        <dl className="up-stats">
          <div><dt>Posts</dt><dd>{profile.postsCount ?? 0}</dd></div>
          <div><dt>Followers</dt><dd>{profile.followersCount ?? 0}</dd></div>
          <div><dt>Following</dt><dd>{profile.followingCount ?? 0}</dd></div>
        </dl>

        <div className="up-actions">
          <button
            type="button"
            className={`up-btn ${isFollowing ? "" : "up-btn--primary"}`}
            onClick={toggleFollow}
            disabled={followBusy}
            aria-pressed={isFollowing}
          >
            {isFollowing ? "Following" : "Follow"}
          </button>
          <button type="button" className="up-btn" onClick={message} disabled={messageBusy}>
            Message
          </button>
          <button type="button" className="up-btn up-btn--danger" onClick={blockPerson}>
            Block
          </button>
        </div>
      </header>

      <section className="up-posts" aria-label={`Posts by ${profile.name}`}>
        <h2>Posts</h2>
        {posts.length === 0 ? (
          <p className="up-empty">No posts yet.</p>
        ) : (
          posts.map((post) => <PostCard key={post._id} post={post} refresh={load} />)
        )}
      </section>
    </div>
  );
}
