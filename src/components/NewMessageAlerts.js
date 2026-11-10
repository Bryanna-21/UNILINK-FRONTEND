import { useEffect, useRef } from "react";
import { useLocation, useNavigate } from "react-router-dom";
import { toast } from "react-hot-toast";

import { useAuth } from "../context/AuthContext";
import messageService from "../services/messageService";

// Live alerts for new messages, the way the app tells you when one arrives:
//  - a small toast when a message comes in for a conversation you are not looking at, and
//  - the unread total in the browser tab title, "(3) UniLink", so it is noticed from another tab.
// New messages are found by asking for the conversation list now and then (every 15 seconds while
// the tab is in front, every minute when it is not). The first answer only sets the baseline, so
// opening UniLink never toasts about messages you already had.
export const POLL_VISIBLE_MS = 15000;
export const POLL_HIDDEN_MS = 60000;

const TITLE_PREFIX = /^\(\d+\)\s+/;

const nameOf = (conv, myId) => {
  if (conv.type === "course" || conv.type === "group") return conv.title || "A group";
  const other = (conv.participantProfiles || []).find((p) => String(p.id) !== String(myId));
  return other?.name || "Someone";
};

export default function NewMessageAlerts() {
  const { user } = useAuth();
  const navigate = useNavigate();
  const location = useLocation();
  const unread = useRef(null); // conversation id -> unread count; null until the first answer
  const total = useRef(0);
  const pathRef = useRef(location.pathname);

  pathRef.current = location.pathname;

  const showTitle = () => {
    const base = document.title.replace(TITLE_PREFIX, "");
    document.title = total.current > 0 ? `(${total.current > 99 ? "99+" : total.current}) ${base}` : base;
  };

  // A page can change the title when you move around; put the count back after it does.
  useEffect(() => {
    showTitle();
  }, [location.pathname]); // eslint-disable-line react-hooks/exhaustive-deps

  useEffect(() => {
    if (!user?.id) return undefined;
    let stopped = false;
    let timer = null;

    const openConversation = (id) => navigate(`/messages/${id}`);

    const announce = (arrived) => {
      if (arrived.length === 0) return;
      const single = arrived.length === 1 ? arrived[0] : null;
      toast.custom(
        (t) => (
          <button
            type="button"
            className="nma-toast"
            style={{
              opacity: t.visible ? 1 : 0,
              display: "block",
              maxWidth: 340,
              padding: "12px 16px",
              border: "1px solid #cbd5e1",
              borderRadius: 12,
              background: "#fff",
              color: "#1e293b",
              boxShadow: "0 6px 20px rgba(0,0,0,0.15)",
              textAlign: "left",
              cursor: "pointer",
              font: "inherit",
            }}
            onClick={() => {
              toast.dismiss(t.id);
              if (single) openConversation(single.id);
              else navigate("/messages");
            }}
          >
            <strong style={{ display: "block" }}>
              {single ? `New message from ${single.name}` : `${arrived.length} conversations have new messages`}
            </strong>
            {single && single.preview ? <span style={{ color: "#475569" }}>{single.preview}</span> : null}
          </button>
        ),
        { duration: 6000, id: single ? `msg-${single.id}` : "msg-many" }
      );
    };

    const poll = async () => {
      try {
        const res = await messageService.getConversations();
        if (stopped) return;
        const list = Array.isArray(res?.data) ? res.data : [];
        const next = {};
        let sum = 0;
        const arrived = [];
        const openId = (pathRef.current.match(/^\/messages\/([^/]+)/) || [])[1];

        for (const conv of list) {
          const count = Number(conv.unreadCount) || 0;
          next[conv._id] = count;
          sum += count;
          const before = unread.current ? unread.current[conv._id] ?? 0 : null;
          // Only a rise, only after the baseline, and not for the chat that is open in front of you.
          if (before !== null && count > before && String(conv._id) !== String(openId)) {
            arrived.push({ id: conv._id, name: nameOf(conv, user.id), preview: conv.lastMessage?.preview || "" });
          }
        }

        unread.current = next;
        total.current = sum;
        showTitle();
        announce(arrived);
      } catch (error) {
        // Quiet: the next poll tries again.
      } finally {
        if (!stopped) {
          timer = setTimeout(poll, document.visibilityState === "hidden" ? POLL_HIDDEN_MS : POLL_VISIBLE_MS);
        }
      }
    };

    poll();
    return () => {
      stopped = true;
      if (timer) clearTimeout(timer);
      unread.current = null;
      total.current = 0;
      document.title = document.title.replace(TITLE_PREFIX, "");
    };
  }, [user?.id]); // eslint-disable-line react-hooks/exhaustive-deps

  return null;
}
