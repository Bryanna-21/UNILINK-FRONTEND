import React, { useEffect, useState, useMemo } from "react";
import { useNavigate } from "react-router-dom";
import { toast } from "react-hot-toast";

import messageService from "../services/messageService";
import userService from "../services/userService";
import { useAuth } from "../context/AuthContext";

import "../styles/messages.css";

const TABS = ["Messages", "Unread", "Communities", "Lecturers"];

const Messages = () => {
  const navigate = useNavigate();
  const { user } = useAuth();

  const [activeTab, setActiveTab] = useState("Messages");
  const [conversations, setConversations] = useState([]);
  const [participantNames, setParticipantNames] = useState({});
  const [participantRoles, setParticipantRoles] = useState({});
  const [loading, setLoading] = useState(true);

  const fetchConversations = async () => {
    try {
      setLoading(true);
      const response = await messageService.getConversations();
      const list = response?.data || [];
      setConversations(list);

      // Resolve every direct conversation's "other participant"
      // into a name + role, since we need role to populate the
      // Lecturers tab and name to display Messages/Lecturers rows.
      // Course/group conversations already carry their own title,
      // no lookup needed for those.
      const directOtherIds = list
        .filter((c) => c.type === "direct")
        .map((c) => c.participantIds.find((id) => id !== user?.id))
        .filter(Boolean);

      const uniqueIds = [...new Set(directOtherIds)];
      const results = await Promise.allSettled(
        uniqueIds.map((id) => userService.getUserSummary(id))
      );

      const names = {};
      const roles = {};
      results.forEach((result, i) => {
        if (result.status === "fulfilled") {
          names[uniqueIds[i]] = result.value?.data?.name || "Unknown User";
          roles[uniqueIds[i]] = result.value?.data?.role || "student";
        } else {
          names[uniqueIds[i]] = "Unknown User";
          roles[uniqueIds[i]] = "student";
        }
      });
      setParticipantNames(names);
      setParticipantRoles(roles);
    } catch (error) {
      toast.error(
        error.response?.data?.message || "Failed to load conversations."
      );
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    if (user?.id) {
      fetchConversations();
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [user?.id]);

  const getOtherParticipantId = (conv) =>
    conv.participantIds.find((id) => id !== user?.id);

  const getDisplayTitle = (conv) => {
    if (conv.type === "course" || conv.type === "group") {
      return conv.title || "Untitled";
    }
    const otherId = getOtherParticipantId(conv);
    return participantNames[otherId] || "...";
  };

  const filteredConversations = useMemo(() => {
    switch (activeTab) {
      case "Unread":
        return conversations.filter((c) => (c.unreadCount || 0) > 0);
      case "Communities":
        return conversations.filter(
          (c) => c.type === "course" || c.type === "group"
        );
      case "Lecturers":
        return conversations.filter((c) => {
          if (c.type !== "direct") return false;
          const otherId = getOtherParticipantId(c);
          return participantRoles[otherId] === "lecturer";
        });
      case "Messages":
      default:
        return conversations;
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [activeTab, conversations, participantNames, participantRoles]);

  // A conversation row is navigated into (which marks it read via
  // getMessages on the thread page) then the list is re-fetched on
  // return, so refreshOnFocus below catches the count dropping back
  // down without needing a manual "mark as read" action here.
  const handleOpenConversation = (conversationId) => {
    navigate(`/messages/${conversationId}`);
  };

  // Re-fetch when the tab regains focus (e.g. navigating back from a
  // thread after reading it) so unread counts reflect what was just
  // read, without needing a full page reload or a websocket.
  useEffect(() => {
    const handleFocus = () => {
      if (user?.id) fetchConversations();
    };
    window.addEventListener("focus", handleFocus);
    return () => window.removeEventListener("focus", handleFocus);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [user?.id]);

  return (
    <div className="messages-page">

      <div className="messages-header">
        <h1>Messages</h1>
      </div>

      <div className="messages-tabs">
        {TABS.map((tab) => (
          <button
            key={tab}
            className={`messages-tab ${activeTab === tab ? "active" : ""}`}
            onClick={() => setActiveTab(tab)}
          >
            {tab}
          </button>
        ))}
      </div>

      <div className="conversation-list">
        {loading && <p>Loading conversations...</p>}

        {!loading && filteredConversations.length === 0 && (
          <p className="conversation-list-empty">
            {activeTab === "Unread"
              ? "Nothing unread."
              : "No conversations here yet."}
          </p>
        )}

        {!loading &&
          filteredConversations.map((conv) => (
            <div
              key={conv._id}
              className="conversation-list-item"
              onClick={() => handleOpenConversation(conv._id)}
            >
              <div className="conversation-title">{getDisplayTitle(conv)}</div>
              <div className="conversation-list-item-right">
                {conv.type !== "direct" && (
                  <span className="conversation-type-badge">{conv.type}</span>
                )}
                {conv.unreadCount > 0 && (
                  <span className="unread-count-badge">{conv.unreadCount}</span>
                )}
              </div>
            </div>
          ))}
      </div>

    </div>
  );
};

export default Messages;
