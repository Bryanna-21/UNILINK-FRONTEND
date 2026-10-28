import React, { useEffect, useState, useRef, useCallback } from "react";
import { useParams, useNavigate, Link } from "react-router-dom";
import { toast } from "react-hot-toast";
import { io } from "socket.io-client";

import env from "../config/env";
import messageService from "../services/messageService";
import userService from "../services/userService";
import { useAuth } from "../context/AuthContext";

import "../styles/messages.css";

// Same behaviour as the mobile chat screen. New messages arrive by polling
// every 4 seconds; "typing" is live over Socket.IO (the backend's socket.js
// only relays typing events, nothing is stored).
const POLL_INTERVAL_MS = 4000;
// Typing stops this long after the last keystroke, as on mobile.
const TYPING_IDLE_MS = 1200;
// How long a new message keeps its "arriving" animation class.
const ARRIVE_MS = 600;

const MessageThread = () => {
  const { conversationId } = useParams();
  const navigate = useNavigate();
  const { user } = useAuth();

  const [conversation, setConversation] = useState(null);
  const [messages, setMessages] = useState([]);
  const [participantNames, setParticipantNames] = useState({});
  const [text, setText] = useState("");
  const [loading, setLoading] = useState(true);
  const [sending, setSending] = useState(false);
  const [isOtherTyping, setIsOtherTyping] = useState(false);
  const [arrivingIds, setArrivingIds] = useState([]);

  const bottomRef = useRef(null);
  const pollRef = useRef(null);
  const socketRef = useRef(null);
  const typingTimerRef = useRef(null);
  const knownIdsRef = useRef(null);

  // There is no single "get one conversation" endpoint — only
  // getConversations (the full list) and getMessages (messages only,
  // no conversation metadata). Reusing getConversations here and
  // finding this one by id is the only way to get title/type/
  // participantIds without a new backend endpoint. Inefficient for a
  // large conversation list, but correct, and matches what's real.
  const loadConversationMeta = useCallback(async () => {
    const response = await messageService.getConversations();
    const list = response?.data || [];
    const found = list.find((c) => c._id === conversationId);
    if (!found) {
      throw new Error("Conversation not found or you are not a participant.");
    }
    return found;
  }, [conversationId]);

  const loadMessages = useCallback(async () => {
    const response = await messageService.getMessages(conversationId);
    return response?.data || [];
  }, [conversationId]);

  // Shows the messages, and marks the ones that were not there a moment ago so
  // they slide in. The first load never animates (knownIdsRef is still null).
  const applyMessages = useCallback((next) => {
    const known = knownIdsRef.current;
    const fresh = known ? next.filter((m) => !known.has(m._id)).map((m) => m._id) : [];
    knownIdsRef.current = new Set(next.map((m) => m._id));
    setMessages(next);
    if (fresh.length > 0) {
      setArrivingIds((prev) => [...prev, ...fresh]);
      setTimeout(() => {
        setArrivingIds((prev) => prev.filter((id) => !fresh.includes(id)));
      }, ARRIVE_MS);
    }
  }, []);

  // Resolves participantIds into display names via userService, only
  // for ids we haven't already looked up — avoids re-fetching the
  // same user's name on every poll tick.
  const resolveParticipantNames = useCallback(async (participantIds) => {
    const unknownIds = participantIds.filter((id) => !participantNames[id]);
    if (unknownIds.length === 0) return;

    const results = await Promise.allSettled(
      unknownIds.map((id) => userService.getUserSummary(id))
    );

    setParticipantNames((prev) => {
      const next = { ...prev };
      results.forEach((result, i) => {
        if (result.status === "fulfilled") {
          next[unknownIds[i]] = result.value?.data?.name || "Unknown User";
        } else {
          next[unknownIds[i]] = "Unknown User";
        }
      });
      return next;
    });
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [participantNames]);

  useEffect(() => {
    let cancelled = false;

    const initialLoad = async () => {
      try {
        setLoading(true);
        const meta = await loadConversationMeta();
        const msgs = await loadMessages();

        if (!cancelled) {
          setConversation(meta);
          knownIdsRef.current = null;
          applyMessages(msgs);
          if (meta.type === "direct" || meta.type === "group") {
            resolveParticipantNames(meta.participantIds);
          }
        }
      } catch (error) {
        toast.error(error.message || "Failed to load conversation.");
        navigate("/messages");
      } finally {
        if (!cancelled) setLoading(false);
      }
    };

    initialLoad();

    return () => {
      cancelled = true;
    };
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [conversationId]);

  // Polling for new messages. Deliberately does NOT re-poll
  // conversation metadata (title/participants rarely change mid-chat)
  // — only messages, to keep each poll tick cheap.
  useEffect(() => {
    pollRef.current = setInterval(async () => {
      try {
        const msgs = await loadMessages();
        applyMessages(msgs);
      } catch {
        // Silent on poll failure — a transient network hiccup every
        // 4s shouldn't spam error toasts. A real failure will already
        // have surfaced on initial load.
      }
    }, POLL_INTERVAL_MS);

    return () => clearInterval(pollRef.current);
  }, [loadMessages, applyMessages]);

  // Live typing. A failed connection is not an error: messages still arrive by
  // polling, the typing dots just do not show.
  useEffect(() => {
    const token = localStorage.getItem("token");
    if (!conversationId || !token || !user?.id) return undefined;

    const socket = io(env.SOCKET_URL, { auth: { token }, transports: ["websocket"] });
    socketRef.current = socket;

    socket.on("connect", () => socket.emit("conversation:join", conversationId));

    const isThisChat = (payload) =>
      String(payload?.conversationId) === String(conversationId) &&
      String(payload?.userId) !== String(user.id);

    socket.on("typing:start", (payload) => {
      if (isThisChat(payload)) setIsOtherTyping(true);
    });
    socket.on("typing:stop", (payload) => {
      if (isThisChat(payload)) setIsOtherTyping(false);
    });

    return () => {
      if (typingTimerRef.current) {
        clearTimeout(typingTimerRef.current);
        typingTimerRef.current = null;
      }
      socket.emit("typing:stop", conversationId);
      socket.emit("conversation:leave", conversationId);
      socket.disconnect();
      socketRef.current = null;
      setIsOtherTyping(false);
    };
  }, [conversationId, user?.id]);

  useEffect(() => {
    bottomRef.current?.scrollIntoView({ behavior: "smooth" });
  }, [messages, isOtherTyping]);

  const stopTyping = () => {
    if (typingTimerRef.current) {
      clearTimeout(typingTimerRef.current);
      typingTimerRef.current = null;
    }
    socketRef.current?.emit("typing:stop", conversationId);
  };

  const handleChange = (e) => {
    const value = e.target.value;
    setText(value);

    const socket = socketRef.current;
    if (!socket?.connected) return;

    if (!value.trim()) {
      stopTyping();
      return;
    }

    socket.emit("typing:start", conversationId);
    if (typingTimerRef.current) clearTimeout(typingTimerRef.current);
    typingTimerRef.current = setTimeout(stopTyping, TYPING_IDLE_MS);
  };

  const handleSend = async () => {
    if (!text.trim() || sending) return;

    const outgoing = text.trim();
    stopTyping();
    setText("");
    setSending(true);

    try {
      await messageService.sendMessage(conversationId, outgoing);
      const msgs = await loadMessages();
      applyMessages(msgs);
    } catch (error) {
      toast.error(
        error.response?.data?.message || "Failed to send message."
      );
      setText(outgoing); // restore so the user doesn't lose what they typed
    } finally {
      setSending(false);
    }
  };

  const handleKeyDown = (e) => {
    if (e.key === "Enter" && !e.shiftKey) {
      e.preventDefault();
      handleSend();
    }
  };

  const conversationTitle = () => {
    if (!conversation) return "";
    if (conversation.type === "course" || conversation.type === "group") {
      return conversation.title || "Untitled";
    }
    // direct: show the OTHER participant's name, not the current user's
    const otherId = conversation.participantIds.find((id) => id !== user?.id);
    return participantNames[otherId] || "...";
  };

  // Seen: only under the last message you sent, only in a direct chat, and only
    // once the other person has read it. Same rule as the mobile chat screen.
  const otherId =
    conversation?.type === "direct"
      ? conversation.participantIds.find((id) => id !== user?.id)
      : null;
  let lastMineIndex = -1;
  messages.forEach((m, i) => {
    if (m.senderId === user?.id) lastMineIndex = i;
  });

  if (loading) {
    return (
      <div className="message-thread-page">
        <p>Loading conversation...</p>
      </div>
    );
  }

  if (!conversation) {
    return null;
  }

  return (
    <div className="message-thread-page">

      <div className="thread-header">
        <Link to="/messages" className="btn btn-outline">
          ← Back
        </Link>
        <h2>{conversationTitle()}</h2>
      </div>

      <div className="thread-messages">
        {messages.length === 0 && (
          <p className="thread-empty">No messages yet. Say hello.</p>
        )}

        {messages.map((m, index) => {
          const isMine = m.senderId === user?.id;
          const isSeen =
            isMine &&
            index === lastMineIndex &&
            !!otherId &&
            Array.isArray(m.readBy) &&
            m.readBy.includes(otherId);
          const senderName = isMine
            ? "You"
            : participantNames[m.senderId] || "...";

          return (
            <div
              key={m._id}
              className={`thread-message ${isMine ? "mine" : "theirs"}${
                arrivingIds.includes(m._id) ? " is-arriving" : ""
              }`}
            >
              {!isMine && (conversation.type === "course" || conversation.type === "group") && (
                <div className="message-sender">{senderName}</div>
              )}
              <div className="message-bubble">{m.text}</div>
              {isSeen && (
                <span className="message-seen" aria-label="Seen">
                  Seen
                </span>
              )}
            </div>
          );
        })}

        {isOtherTyping && (
          <div className="thread-message theirs typing-row" role="status" aria-label="The other person is typing">
            <div className="message-bubble typing-bubble" aria-hidden="true">
              <span className="typing-dot" />
              <span className="typing-dot" />
              <span className="typing-dot" />
            </div>
          </div>
        )}

        <div ref={bottomRef} />
      </div>

      <div className="thread-input">
        <textarea
          value={text}
          onChange={handleChange}
          onKeyDown={handleKeyDown}
          placeholder="Type a message..."
          rows={2}
        />
        <button
          className="btn btn-primary"
          onClick={handleSend}
          disabled={sending || !text.trim()}
        >
          Send
        </button>
      </div>

    </div>
  );
};

export default MessageThread;
