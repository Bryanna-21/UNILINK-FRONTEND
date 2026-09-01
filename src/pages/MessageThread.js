import React, { useEffect, useState, useRef, useCallback } from "react";
import { useParams, useNavigate, Link } from "react-router-dom";
import { toast } from "react-hot-toast";

import messageService from "../services/messageService";
import userService from "../services/userService";
import { useAuth } from "../context/AuthContext";

import "../styles/messages.css";

// Polling interval matches the mobile app's existing chat screen
// (4s) for consistency, rather than inventing a different cadence
// for web. There is no Socket.io layer yet — see the note in
// message.controller.js — so this is genuinely re-fetching, not a
// live subscription.
const POLL_INTERVAL_MS = 4000;

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

  const bottomRef = useRef(null);
  const pollRef = useRef(null);

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
          setMessages(msgs);
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
        setMessages(msgs);
      } catch {
        // Silent on poll failure — a transient network hiccup every
        // 4s shouldn't spam error toasts. A real failure will already
        // have surfaced on initial load.
      }
    }, POLL_INTERVAL_MS);

    return () => clearInterval(pollRef.current);
  }, [loadMessages]);

  useEffect(() => {
    bottomRef.current?.scrollIntoView({ behavior: "smooth" });
  }, [messages]);

  const handleSend = async () => {
    if (!text.trim() || sending) return;

    const outgoing = text.trim();
    setText("");
    setSending(true);

    try {
      await messageService.sendMessage(conversationId, outgoing);
      const msgs = await loadMessages();
      setMessages(msgs);
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

        {messages.map((m) => {
          const isMine = m.senderId === user?.id;
          const senderName = isMine
            ? "You"
            : participantNames[m.senderId] || "...";

          return (
            <div
              key={m._id}
              className={`thread-message ${isMine ? "mine" : "theirs"}`}
            >
              {!isMine && (conversation.type === "course" || conversation.type === "group") && (
                <div className="message-sender">{senderName}</div>
              )}
              <div className="message-bubble">{m.text}</div>
            </div>
          );
        })}

        <div ref={bottomRef} />
      </div>

      <div className="thread-input">
        <textarea
          value={text}
          onChange={(e) => setText(e.target.value)}
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
