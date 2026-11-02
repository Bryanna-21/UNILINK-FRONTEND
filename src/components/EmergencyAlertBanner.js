import { useCallback, useEffect, useRef, useState } from "react";
import { Link } from "react-router-dom";
import { useAuth } from "../context/AuthContext";
import emergencyAlertService from "../services/emergencyAlertService";
import emergencyService from "../services/emergencyService";
import { playSiren, shouldRing } from "../utils/alertRing";

// A red banner across the top of every page for admins while an SOS in their university is
// still unacknowledged. It rings (a siren, repeated every 3 seconds) until the alert is
// acknowledged by anyone, or muted for this browser. A NEW SOS rings again even after a mute.
//
// It asks the server every 10 seconds, which also works when no push or socket arrives. Browsers
// only allow sound after the person has clicked or pressed a key on the page once; until then the
// banner says so, with a button.

const POLL_MS = 10000;
const RING_MS = 3000;
const ADMIN_ROLES = ["admin", "superadmin"];

export default function EmergencyAlertBanner() {
  const { user } = useAuth();
  const isAdmin = ADMIN_ROLES.includes(user?.role);

  const [alerts, setAlerts] = useState([]);
  const [numbers, setNumbers] = useState([]);
  const [muted, setMuted] = useState(() => new Set());
  const [audioReady, setAudioReady] = useState(true);
  const [busyId, setBusyId] = useState(null);
  const [problem, setProblem] = useState("");

  const ctxRef = useRef(null);

  const load = useCallback(async () => {
    try {
      const res = await emergencyAlertService.getActiveAlerts();
      setAlerts(Array.isArray(res?.data) ? res.data : []);
      setNumbers(Array.isArray(res?.numbers) ? res.numbers : []);
    } catch {
      // A failed check changes nothing on screen; the next one tries again.
    }
  }, []);

  useEffect(() => {
    if (!isAdmin) return undefined;
    load();
    const id = setInterval(load, POLL_MS);
    const onVisible = () => {
      if (document.visibilityState === "visible") load();
    };
    document.addEventListener("visibilitychange", onVisible);
    return () => {
      clearInterval(id);
      document.removeEventListener("visibilitychange", onVisible);
    };
  }, [isAdmin, load]);

  const unlockAudio = useCallback(async () => {
    try {
      const Ctor = window.AudioContext || window.webkitAudioContext;
      if (!Ctor) return false;
      if (!ctxRef.current) ctxRef.current = new Ctor();
      if (ctxRef.current.state === "suspended") await ctxRef.current.resume();
      const ok = ctxRef.current.state === "running";
      setAudioReady(ok);
      return ok;
    } catch {
      setAudioReady(false);
      return false;
    }
  }, []);

  // The first click or key press anywhere on the page unlocks sound for the rest of the visit.
  useEffect(() => {
    if (!isAdmin) return undefined;
    const handler = () => unlockAudio();
    window.addEventListener("pointerdown", handler);
    window.addEventListener("keydown", handler);
    return () => {
      window.removeEventListener("pointerdown", handler);
      window.removeEventListener("keydown", handler);
    };
  }, [isAdmin, unlockAudio]);

  const ringing = isAdmin && shouldRing(alerts, muted);

  useEffect(() => {
    if (!ringing) return undefined;
    const ring = () => {
      const ctx = ctxRef.current;
      if (!ctx || ctx.state !== "running") {
        setAudioReady(false);
        return;
      }
      setAudioReady(true);
      playSiren(ctx);
    };
    ring();
    const id = setInterval(ring, RING_MS);
    return () => clearInterval(id);
  }, [ringing]);

  const acknowledge = async (id) => {
    setBusyId(id);
    setProblem("");
    try {
      await emergencyService.acknowledgeReport(id);
      setAlerts((list) => list.filter((a) => a._id !== id));
    } catch (err) {
      setProblem(err?.response?.data?.message || "Could not acknowledge. Try again.");
    } finally {
      setBusyId(null);
    }
  };

  const muteAll = () => setMuted(new Set(alerts.map((a) => String(a._id))));

  if (!isAdmin || alerts.length === 0) return null;

  return (
    <div role="alert" aria-live="assertive" style={styles.bar}>
      <div style={styles.head}>
        <strong style={styles.title}>
          SOS ALERT{alerts.length > 1 ? ` (${alerts.length})` : ""}
        </strong>
        <span style={styles.actions}>
          {!audioReady && (
            <button type="button" style={styles.ghost} onClick={unlockAudio}>
              Turn on alert sound
            </button>
          )}
          {ringing && (
            <button type="button" style={styles.ghost} onClick={muteAll}>
              Mute sound
            </button>
          )}
          <Link to="/lecturer/emergency-reports" style={styles.ghost}>
            Open reports
          </Link>
        </span>
      </div>

      {alerts.map((a) => (
        <div key={a._id} style={styles.row}>
          <span>
            <strong>{a.studentName}</strong>
            {a.location ? ` · ${a.location}` : ""}
            {a.studentPhone ? (
              <>
                {" · "}
                <a href={`tel:${a.studentPhone}`} style={styles.link}>
                  {a.studentPhone}
                </a>
              </>
            ) : null}
          </span>
          <button type="button" style={styles.ack} disabled={busyId === a._id} onClick={() => acknowledge(a._id)}>
            {busyId === a._id ? "…" : "Acknowledge"}
          </button>
        </div>
      ))}

      {numbers.length > 0 && (
        <div style={styles.numbers}>
          Emergency services:{" "}
          {numbers.map((n) => (
            <a key={n.phone} href={`tel:${n.phone}`} style={styles.link}>
              {n.name} {n.phone}
            </a>
          ))}
        </div>
      )}
      {problem && <div style={styles.numbers}>{problem}</div>}
    </div>
  );
}

const styles = {
  bar: { position: "fixed", top: 0, left: 0, right: 0, zIndex: 2000, background: "#b91c1c", color: "#fff", padding: "10px 16px", boxShadow: "0 2px 12px rgba(0,0,0,0.4)" },
  head: { display: "flex", justifyContent: "space-between", alignItems: "center", flexWrap: "wrap", gap: "8px", marginBottom: "6px" },
  title: { fontSize: "16px", letterSpacing: "1px" },
  actions: { display: "flex", gap: "8px", flexWrap: "wrap" },
  ghost: { background: "rgba(255,255,255,0.15)", color: "#fff", border: "1px solid rgba(255,255,255,0.5)", borderRadius: "6px", padding: "4px 10px", cursor: "pointer", fontSize: "13px", textDecoration: "none" },
  row: { display: "flex", justifyContent: "space-between", alignItems: "center", gap: "10px", padding: "4px 0", flexWrap: "wrap" },
  ack: { background: "#fff", color: "#b91c1c", border: "none", borderRadius: "6px", padding: "6px 14px", fontWeight: 800, cursor: "pointer" },
  numbers: { fontSize: "13px", marginTop: "4px", display: "flex", gap: "12px", flexWrap: "wrap" },
  link: { color: "#fff", fontWeight: 700 },
};
