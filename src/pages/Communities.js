import React, { useCallback, useEffect, useState } from "react";
import { Link } from "react-router-dom";

import StateMessage from "../components/common/StateMessage";
import communityService from "../services/communityService";

import { getErrorMessage } from "../utils/errors";
import { notify } from "../utils/notify";

import "../styles/pages/lists.css";

const TYPE_LABELS = {
  "university-wide": "University",
  department: "Department",
  course: "Course",
  club: "Club",
  interest: "Interest",
};

// Communities at the user's university, from GET /communities.
// University-wide communities are automatic, private ones are not
// joinable yet, so those get a label instead of a button.
export default function Communities() {
  const [communities, setCommunities] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [busyId, setBusyId] = useState(null);

  const load = useCallback(async () => {
    setLoading(true);
    setError("");

    try {
      const response = await communityService.getCommunities();
      setCommunities(Array.isArray(response?.data) ? response.data : []);
    } catch (err) {
      setCommunities([]);
      setError(getErrorMessage(err, "We couldn't load communities."));
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    load();
  }, [load]);

  const toggleMembership = async (community) => {
    setBusyId(community._id);

    try {
      if (community.isMember) {
        await communityService.leave(community._id);
        notify.success(`You left ${community.name}.`);
      } else {
        await communityService.join(community._id);
        notify.success(`You joined ${community.name}.`);
      }

      await load();
    } catch (err) {
      notify.error(getErrorMessage(err, "We couldn't update your membership."));
    } finally {
      setBusyId(null);
    }
  };

  const renderAction = (community) => {
    if (community.type === "university-wide") {
      return <span className="list-badge">Member</span>;
    }

    if (!community.isMember && !community.isPublic) {
      return <span className="list-badge">Private</span>;
    }

    return (
      <button
        type="button"
        className={community.isMember ? "list-btn list-btn--ghost" : "list-btn"}
        disabled={busyId === community._id}
        onClick={() => toggleMembership(community)}
      >
        {busyId === community._id
          ? "Please wait..."
          : community.isMember
          ? "Leave"
          : "Join"}
      </button>
    );
  };

  return (
    <div className="list-page">
      <div className="list-page-header">
        <div>
          <h2>Communities</h2>
          <p>Groups at your university you can join.</p>
        </div>

        <Link className="list-btn" to="/communities/create">
          Create community
        </Link>
      </div>

      {loading ? (
        <StateMessage kind="loading" text="Loading communities..." />
      ) : error ? (
        <StateMessage
          kind="error"
          title="Communities unavailable"
          text={error}
          action={
            <button type="button" className="list-btn" onClick={load}>
              Try again
            </button>
          }
        />
      ) : communities.length === 0 ? (
        <StateMessage
          title="No communities yet"
          text="Be the first to start one for your university."
        />
      ) : (
        <div className="list-stack">
          {communities.map((community) => (
            <div className="list-card" key={community._id}>
              <div className="list-card-body">
                <h3>{community.name}</h3>

                {community.description && <p>{community.description}</p>}

                <div className="list-card-meta">
                  <span className="list-badge">
                    {TYPE_LABELS[community.type] || community.type}
                  </span>
                </div>
              </div>

              {renderAction(community)}
            </div>
          ))}
        </div>
      )}
    </div>
  );
}
