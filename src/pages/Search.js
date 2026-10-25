import React, { useEffect, useRef, useState } from "react";
import { useSearchParams } from "react-router-dom";

import StateMessage from "../components/common/StateMessage";
import peopleService from "../services/peopleService";

import { getErrorMessage } from "../utils/errors";

import "../styles/pages/lists.css";

// The backend matches usernames by prefix, 3 to 20 characters of
// letters, numbers, dots and underscores.
const normalize = (raw) => raw.trim().replace(/^@+/, "").toLowerCase();
const isSearchable = (value) => /^[a-z0-9_.]{3,20}$/.test(value);

export default function Search() {
  const [params, setParams] = useSearchParams();
  const [query, setQuery] = useState(params.get("q") || "");
  const [results, setResults] = useState([]);
  const [searched, setSearched] = useState(false);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const latest = useRef(0);

  const term = normalize(query);

  useEffect(() => {
    if (!isSearchable(term)) {
      setResults([]);
      setSearched(false);
      setError("");
      setLoading(false);
      return undefined;
    }

    const requestId = ++latest.current;

    const timer = setTimeout(async () => {
      setLoading(true);
      setError("");

      try {
        const response = await peopleService.search(term);

        if (requestId !== latest.current) return;

        setResults(Array.isArray(response?.data) ? response.data : []);
        setSearched(true);
      } catch (err) {
        if (requestId !== latest.current) return;

        setResults([]);
        setSearched(false);
        setError(getErrorMessage(err, "Search isn't working right now."));
      } finally {
        if (requestId === latest.current) setLoading(false);
      }
    }, 350);

    return () => clearTimeout(timer);
  }, [term]);

  const handleChange = (event) => {
    const value = event.target.value;
    setQuery(value);
    setParams(value ? { q: value } : {}, { replace: true });
  };

  return (
    <div className="list-page">
      <div className="list-page-header">
        <div>
          <h2>Find people</h2>
          <p>Search students and lecturers at your university by @username.</p>
        </div>
      </div>

      <input
        className="list-input"
        type="text"
        placeholder="Type a username, e.g. @jane"
        value={query}
        onChange={handleChange}
        aria-label="Search people by username"
        autoComplete="off"
        autoCapitalize="none"
        spellCheck="false"
      />

      <p className="list-hint">Usernames are 3 to 20 characters long.</p>

      {error ? (
        <StateMessage kind="error" title="Search unavailable" text={error} />
      ) : loading ? (
        <StateMessage kind="loading" text="Searching..." />
      ) : term && !isSearchable(term) ? (
        <StateMessage
          title="Keep typing"
          text="Enter at least 3 characters: letters, numbers, dots or underscores."
        />
      ) : searched && results.length === 0 ? (
        <StateMessage
          title="No one found"
          text={`Nobody at your university has a username starting with "${term}".`}
        />
      ) : results.length > 0 ? (
        <div className="list-stack">
          {results.map((person) => (
            <div className="list-card" key={person._id}>
              <div className="list-card-body">
                <h3>{person.name}</h3>
                {person.username && <p>@{person.username}</p>}
              </div>

              <span className="list-badge">{person.role}</span>
            </div>
          ))}
        </div>
      ) : null}
    </div>
  );
}
