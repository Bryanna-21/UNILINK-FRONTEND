import { useCallback, useEffect, useState } from "react";

import Skeleton from "../../components/common/Skeleton";
import StateMessage from "../../components/common/StateMessage";
import announcementService from "../../services/announcementService";
import { getErrorMessage } from "../../utils/errors";
import { formatDate } from "../../utils/format";

import "../../styles/pages/studentHome.css";

// What a student reads: announcements from lecturers and the university (GET /community/announcements). Posting is done
// from the Lecturer page. The text is drawn as plain text, never as markup.
export default function StudentAnnouncements() {
  const [items, setItems] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  const load = useCallback(async () => {
    setLoading(true);
    setError("");
    try {
      const res = await announcementService.getAnnouncements();
      setItems(Array.isArray(res?.data) ? res.data : []);
    } catch (err) {
      setError(getErrorMessage(err, "We couldn't load announcements."));
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    load();
  }, [load]);

  return (
    <div className="sh-page">
      <h2>Announcements</h2>
      {loading ? (
        <Skeleton variant="card" count={3} />
      ) : error ? (
        <StateMessage
          kind="error"
          title="Something went wrong"
          text={error}
          action={<button type="button" className="get-app-download-btn" onClick={load}>Try again</button>}
        />
      ) : items.length === 0 ? (
        <div className="sh-empty">No announcements yet.</div>
      ) : (
        <ul className="sh-list" style={{ listStyle: "none", padding: 0 }}>
          {items.map((a) => (
            <li key={a._id} className="sh-card" style={{ marginBottom: 12 }}>
              <h4 style={{ margin: "0 0 4px" }}>{a.title}</h4>
              <p style={{ margin: "0 0 6px", whiteSpace: "pre-wrap" }}>{a.body}</p>
              <small>{formatDate(a.createdAt)}</small>
            </li>
          ))}
        </ul>
      )}
    </div>
  );
}
