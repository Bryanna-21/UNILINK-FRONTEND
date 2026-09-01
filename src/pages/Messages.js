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

  useEffect(() => {
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

    if (user?.id) {
      fetchConversations();
    }
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

  // NOTE: Unread is not backed by real data yet — the backend has no
  // per-user unread count or "last read" tracking beyond the readBy
  // array on individual messages, which isn't aggregated anywhere.
  // This tab intentionally shows an honest empty state rather than a
  // fabricated count, so it doesn't look broken OR lie about being
  // functional. Real unread tracking is separate, unbuilt backend work.
  const filteredConversations = useMemo(() => {
    switch (activeTab) {
      case "Unread":
        return [];
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

        {!loading && activeTab === "Unread" && (
          <p className="conversation-list-empty">
            Unread tracking isn't available yet.
          </p>
        )}

        {!loading && activeTab !== "Unread" && filteredConversations.length === 0 && (
          <p className="conversation-list-empty">No conversations here yet.</p>
        )}

        {!loading &&
          filteredConversations.map((conv) => (
            <div
              key={conv._id}
              className="conversation-list-item"
              onClick={() => navigate(`/messages/${conv._id}`)}
            >
              <div className="conversation-title">{getDisplayTitle(conv)}</div>
              {conv.type !== "direct" && (
                <span className="conversation-type-badge">{conv.type}</span>
              )}
            </div>
          ))}
      </div>

    </div>
  );
};

export default Messages;
