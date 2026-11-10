import { useCallback, useEffect, useRef, useState } from "react";
import { Link } from "react-router-dom";
import { toast } from "react-hot-toast";

import StateMessage from "../components/common/StateMessage";
import * as people from "../services/profilePeopleService";
import { getErrorMessage } from "../utils/errors";

import "../styles/pages/safetyPages.css";

// The people you have blocked, with a way to unblock them (the app's Settings > Blocked people).
export default function BlockedPeople() {
  const [list, setList] = useState([]);
  const [status, setStatus] = useState("loading"); // loading | error | ready
  const [errorText, setErrorText] = useState("");
  const [busyId, setBusyId] = useState(null);
  const lock = useRef(false);

  const load = useCallback(async () => {
    setStatus("loading");
    try {
      setList(await people.listBlocks());
      setStatus("ready");
    } catch (error) {
      setErrorText(getErrorMessage(error, "Could not load your blocked people."));
      setStatus("error");
    }
  }, []);

  useEffect(() => {
    load();
  }, [load]);

  const unblock = async (person) => {
    const ok = window.confirm(`Unblock ${person.name}? They will be able to find you and message you again.`);
    if (!ok || lock.current) return;
    lock.current = true;
    setBusyId(person._id);
    try {
      await people.unblock(person._id);
      setList((prev) => prev.filter((p) => p._id !== person._id));
      toast.success(`${person.name} is unblocked.`);
    } catch (error) {
      toast.error(getErrorMessage(error, "Could not unblock this person."));
    } finally {
      lock.current = false;
      setBusyId(null);
    }
  };

  return (
    <div className="safety-page">
      <p><Link to="/settings">&larr; Settings</Link></p>
      <h1>Blocked people</h1>
      <p className="safety-intro">
        Blocked people can't follow you or message you, and you don't appear in each other's search.
      </p>

      {status === "loading" && <StateMessage kind="loading" text="Loading..." />}
      {status === "error" && (
        <StateMessage
          kind="error"
          title="Couldn't load this list"
          text={errorText}
          action={<button type="button" className="safety-btn" onClick={load}>Try again</button>}
        />
      )}
      {status === "ready" && list.length === 0 && (
        <StateMessage kind="empty" title="No one blocked" text="You haven't blocked anyone." />
      )}
      {status === "ready" && list.length > 0 && (
        <ul className="safety-list">
          {list.map((person) => (
            <li key={person._id}>
              <div>
                <strong>{person.name}</strong>
                {person.username && <span> @{person.username}</span>}
              </div>
              <button type="button" className="safety-btn" disabled={busyId === person._id} onClick={() => unblock(person)}>
                Unblock
              </button>
            </li>
          ))}
        </ul>
      )}
    </div>
  );
}
