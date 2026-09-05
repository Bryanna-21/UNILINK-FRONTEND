import React, { useState, useRef, useEffect } from "react";
import { toast } from "react-hot-toast";
import { FaPaperPlane, FaRobot } from "react-icons/fa";

import aiService from "../services/aiService";

import "./AiAssistant.css";

// Full-page chat interface for the study assistant (POST /api/ai/ask).
// Chat history lives only in this component's state - there is no
// backend persistence for AI conversations, each page load starts
// fresh. remainingToday is tracked from the backend's own response
// rather than computed client-side, since the backend is the actual
// source of truth for the daily count.
const AiAssistant = () => {
  const [messages, setMessages] = useState([]);
  const [input, setInput] = useState("");
  const [sending, setSending] = useState(false);
  const [remainingToday, setRemainingToday] = useState(null);

  const bottomRef = useRef(null);

  useEffect(() => {
    bottomRef.current?.scrollIntoView({ behavior: "smooth" });
  }, [messages]);

  const handleSend = async () => {
    const trimmed = input.trim();
    if (!trimmed || sending) return;

    const userMessage = { role: "user", content: trimmed };
    const nextMessages = [...messages, userMessage];
    setMessages(nextMessages);
    setInput("");
    setSending(true);

    try {
      // Send the conversation as it existed BEFORE this new message,
      // matching the backend's history + message shape - the new
      // user message is passed separately as `message`, not
      // duplicated inside `history` too.
      const res = await aiService.ask(trimmed, messages);
      const reply = res?.data?.reply;

      if (reply) {
        setMessages((prev) => [...prev, { role: "assistant", content: reply }]);
      }
      if (typeof res?.data?.remainingToday === "number") {
        setRemainingToday(res.data.remainingToday);
      }
    } catch (error) {
      const status = error.response?.status;
      const backendMessage = error.response?.data?.message;

      if (status === 429) {
        toast.error(backendMessage || "You've reached today's AI request limit.");
      } else if (status === 503) {
        toast.error(backendMessage || "AI assistant is not available right now.");
      } else if (status === 502) {
        toast.error(backendMessage || "AI assistant is temporarily unavailable.");
      } else {
        toast.error(backendMessage || "Something went wrong. Please try again.");
      }

      // Roll back the optimistically-added user message on failure so
      // the visible log doesn't show a question that never got a
      // reply and can't be retried in place.
      setMessages(messages);
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

  return (
    <div className="ai-assistant-page">

      <div className="ai-header">
        <div className="ai-header-title">
          <FaRobot />
          <h1>Study Assistant</h1>
        </div>
        {remainingToday !== null && (
          <span className="ai-remaining">{remainingToday} requests left today</span>
        )}
      </div>

      <div className="ai-messages">
        {messages.length === 0 && (
          <div className="ai-empty">
            <FaRobot size={32} />
            <p>Ask me to summarize a topic, explain a concept, generate quiz questions, or help plan your study schedule.</p>
          </div>
        )}

        {messages.map((m, i) => (
          <div key={i} className={`ai-message ${m.role}`}>
            <div className="ai-bubble">{m.content}</div>
          </div>
        ))}

        {sending && (
          <div className="ai-message assistant">
            <div className="ai-bubble ai-typing">Thinking...</div>
          </div>
        )}

        <div ref={bottomRef} />
      </div>

      <div className="ai-input-row">
        <textarea
          value={input}
          onChange={(e) => setInput(e.target.value)}
          onKeyDown={handleKeyDown}
          placeholder="Ask something..."
          rows={2}
          disabled={sending}
        />
        <button
          className="ai-send-btn"
          onClick={handleSend}
          disabled={sending || !input.trim()}
        >
          <FaPaperPlane />
        </button>
      </div>

    </div>
  );
};

export default AiAssistant;
