import { useEffect, useRef, useState } from "react";
import API from "../../services/api";
import { useAuth } from "../../context/AuthContext";
import { AUDIENCE_OPTIONS, audienceOption } from "../../utils/audience";
import "../../styles/audience.css";

// "Who can see this post?" for the composer: Everyone, My university, Chosen universities, Followers,
// Friends or Specific people. The two list choices open a finder:
//   - universities: GET /auth/universities?search= (3+ letters)
//   - people: the people you follow are listed at once (GET /follow/:me/following); GET /people/search?q=
//     finds anyone else on UniLink by username (3+ characters).
// The server enforces the choice; this only collects it.
const MAX_UNIVERSITIES = 50;
const MAX_PEOPLE = 100;

export default function AudienceSelect({ value, onChange, disabled }) {
  const { user } = useAuth();
  const myId = user?.id;

  const [uniQuery, setUniQuery] = useState("");
  const [uniResults, setUniResults] = useState([]);
  const [uniBusy, setUniBusy] = useState(false);
  const [personQuery, setPersonQuery] = useState("");
  const [personResults, setPersonResults] = useState([]);
  const [personBusy, setPersonBusy] = useState(false);
  const [following, setFollowing] = useState([]);
  const [followingLoaded, setFollowingLoaded] = useState(false);
  const [note, setNote] = useState("");
  const uniRequest = useRef(0);
  const personRequest = useRef(0);

  const personTerm = personQuery.trim().replace(/^@+/, "");

  // The people you follow, loaded once, the first time "Specific people" is chosen.
  useEffect(() => {
    if (value.kind !== "people" || followingLoaded || !myId) return undefined;
    let cancelled = false;
    API.get(`/follow/${myId}/following`)
      .then((res) => {
        if (cancelled) return;
        setFollowing((res.data?.data || []).map((u) => ({ _id: String(u._id), name: u.name, username: u.username })));
        setFollowingLoaded(true);
      })
      .catch(() => {
        if (!cancelled) setFollowingLoaded(true);
      });
    return () => {
      cancelled = true;
    };
  }, [value.kind, followingLoaded, myId]);

  useEffect(() => {
    const term = uniQuery.trim();
    if (value.kind !== "universities" || term.length < 3) {
      setUniResults([]);
      return undefined;
    }
    const id = ++uniRequest.current;
    setUniBusy(true);
    const timer = setTimeout(async () => {
      try {
        const res = await API.get("/auth/universities", { params: { search: term } });
        if (id === uniRequest.current) setUniResults((res.data?.data || []).map((u) => ({ _id: String(u._id), name: u.name })));
      } catch {
        if (id === uniRequest.current) setUniResults([]);
      } finally {
        if (id === uniRequest.current) setUniBusy(false);
      }
    }, 300);
    return () => clearTimeout(timer);
  }, [uniQuery, value.kind]);

  useEffect(() => {
    if (value.kind !== "people" || personTerm.length < 3) {
      setPersonResults([]);
      return undefined;
    }
    const id = ++personRequest.current;
    setPersonBusy(true);
    const timer = setTimeout(async () => {
      try {
        const res = await API.get("/people/search", { params: { q: personTerm } });
        if (id === personRequest.current) setPersonResults((res.data?.data || []).map((u) => ({ _id: String(u._id), name: u.name, username: u.username })));
      } catch {
        if (id === personRequest.current) setPersonResults([]);
      } finally {
        if (id === personRequest.current) setPersonBusy(false);
      }
    }, 300);
    return () => clearTimeout(timer);
  }, [personTerm, value.kind]);

  const choose = (kind) => {
    setNote("");
    onChange({ ...value, kind });
  };

  const toggleUniversity = (u) => {
    const has = value.universities.some((x) => x._id === u._id);
    if (!has && value.universities.length >= MAX_UNIVERSITIES) return setNote(`You can choose up to ${MAX_UNIVERSITIES} universities.`);
    setNote("");
    onChange({ ...value, universities: has ? value.universities.filter((x) => x._id !== u._id) : [...value.universities, u] });
  };

  const togglePerson = (p) => {
    const has = value.people.some((x) => x._id === p._id);
    if (!has && value.people.length >= MAX_PEOPLE) return setNote(`You can choose up to ${MAX_PEOPLE} people.`);
    setNote("");
    onChange({ ...value, people: has ? value.people.filter((x) => x._id !== p._id) : [...value.people, p] });
  };

  const personRows = (list) =>
    list.map((p) => {
      const picked = value.people.some((x) => x._id === p._id);
      return (
        <li key={p._id}>
          <button type="button" className="audience-row" onClick={() => togglePerson(p)} disabled={disabled} aria-pressed={picked}>
            <span className="audience-row__name">
              {p.name}
              {p.username ? <small> @{p.username}</small> : null}
            </span>
            <span className={picked ? "audience-row__on" : "audience-row__add"}>{picked ? "Added ✓" : "Add"}</span>
          </button>
        </li>
      );
    });

  const chips = (list, remove) =>
    list.length > 0 && (
      <div className="audience-chips">
        {list.map((item) => (
          <button key={item._id} type="button" className="audience-chip" onClick={() => remove(item)} disabled={disabled} aria-label={`Remove ${item.name}`}>
            {item.name} <span aria-hidden="true">✕</span>
          </button>
        ))}
      </div>
    );

  const current = audienceOption(value.kind);

  return (
    <div className="audience">
      <label className="audience__label" htmlFor="audience-kind">Who can see this post?</label>
      <select id="audience-kind" className="campus-input audience__select" value={value.kind} onChange={(e) => choose(e.target.value)} disabled={disabled}>
        {AUDIENCE_OPTIONS.map((o) => (
          <option key={o.kind} value={o.kind}>{`${o.icon} ${o.label}`}</option>
        ))}
      </select>
      <p className="audience__hint">{current.hint}</p>

      {value.kind === "universities" && (
        <div className="audience__finder">
          <input className="campus-input" placeholder="Search universities (3+ letters)" value={uniQuery} onChange={(e) => setUniQuery(e.target.value)} disabled={disabled} aria-label="Search universities" />
          {chips(value.universities, toggleUniversity)}
          {uniBusy && <p className="audience__hint">Searching…</p>}
          <ul className="audience__list">
            {uniResults.map((u) => {
              const picked = value.universities.some((x) => x._id === u._id);
              return (
                <li key={u._id}>
                  <button type="button" className="audience-row" onClick={() => toggleUniversity(u)} disabled={disabled} aria-pressed={picked}>
                    <span className="audience-row__name">{u.name}</span>
                    <span className={picked ? "audience-row__on" : "audience-row__add"}>{picked ? "Added ✓" : "Add"}</span>
                  </button>
                </li>
              );
            })}
          </ul>
          {uniQuery.trim().length >= 3 && !uniBusy && uniResults.length === 0 && <p className="audience__hint">No university matches that.</p>}
          <p className="audience__hint">Your own university is not included unless you add it.</p>
        </div>
      )}

      {value.kind === "people" && (
        <div className="audience__finder">
          <input className="campus-input" placeholder="Search by username (3+ characters)" value={personQuery} onChange={(e) => setPersonQuery(e.target.value)} disabled={disabled} aria-label="Search people" autoComplete="off" />
          {chips(value.people, togglePerson)}
          {personBusy && <p className="audience__hint">Searching…</p>}
          <ul className="audience__list">{personRows(personResults)}</ul>
          {personTerm.length >= 3 && !personBusy && personResults.length === 0 && <p className="audience__hint">Nobody found with that username.</p>}
          {personTerm.length < 3 && (
            <>
              <p className="audience__sub">People you follow</p>
              {!followingLoaded ? (
                <p className="audience__hint">Loading…</p>
              ) : following.length === 0 ? (
                <p className="audience__hint">You do not follow anyone yet. Search by username above.</p>
              ) : (
                <ul className="audience__list">{personRows(following)}</ul>
              )}
            </>
          )}
        </div>
      )}

      {note && <p className="audience__error" role="alert">{note}</p>}
    </div>
  );
}
