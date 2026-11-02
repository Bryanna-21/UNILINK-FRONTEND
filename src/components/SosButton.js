import { useCallback, useEffect, useRef, useState } from "react";
import emergencyService from "../services/emergencyService";

// SOS on the web, the same way the app does it: press and HOLD for 3 seconds, then a 5 second
// countdown that can be cancelled, then the alert is sent (type "sos", which the server treats as
// the highest priority, alerts the right admins and texts the student's trusted contacts).
//
// Works with a mouse, a finger, or the keyboard (hold Space or Enter). A quick tap does nothing,
// so it cannot be sent by accident. The number can only be dialled: tapping a number opens the
// phone dialler, it is never called automatically.

export const HOLD_MS = 3000;
export const COUNTDOWN_FROM = 5;

export default function SosButton({ contacts = [] }) {
  // idle | holding | countdown | sending | sent | error
  const [phase, setPhase] = useState("idle");
  const [seconds, setSeconds] = useState(COUNTDOWN_FROM);
  const [place, setPlace] = useState("");
  const [notified, setNotified] = useState(0);
  const [errorText, setErrorText] = useState("");

  const holdTimer = useRef(null);
  const sendingLock = useRef(false);
  const placeRef = useRef("");
  placeRef.current = place;

  const clearHold = () => {
    if (holdTimer.current) {
      clearTimeout(holdTimer.current);
      holdTimer.current = null;
    }
  };

  // Leaving the page mid-hold must not leave a timer that later starts a countdown.
  useEffect(() => {
    const timers = holdTimer;
    return () => {
      if (timers.current) clearTimeout(timers.current);
    };
  }, []);

  const send = useCallback(async () => {
    // One send per SOS, however many times the timer or the user fires.
    if (sendingLock.current) return;
    sendingLock.current = true;
    setPhase("sending");
    try {
      const res = await emergencyService.reportEmergency({
        type: "sos",
        location: placeRef.current.trim() || undefined,
      });
      const list = res?.data?.notifiedContacts;
      setNotified(Array.isArray(list) ? list.length : 0);
      setPhase("sent");
    } catch (err) {
      setErrorText(err?.response?.data?.message || "Check your connection.");
      setPhase("error");
    } finally {
      sendingLock.current = false;
    }
  }, []);

  // One tick a second; at zero the alert goes out.
  useEffect(() => {
    if (phase !== "countdown") return undefined;
    if (seconds <= 0) {
      send();
      return undefined;
    }
    const t = setTimeout(() => setSeconds((s) => s - 1), 1000);
    return () => clearTimeout(t);
  }, [phase, seconds, send]);

  const beginHold = () => {
    if (phase !== "idle" || holdTimer.current) return;
    setPhase("holding");
    holdTimer.current = setTimeout(() => {
      holdTimer.current = null;
      setSeconds(COUNTDOWN_FROM);
      setPhase("countdown");
    }, HOLD_MS);
  };

  const endHold = () => {
    if (!holdTimer.current) return;
    clearHold();
    setPhase("idle");
  };

  const reset = () => {
    clearHold();
    setSeconds(COUNTDOWN_FROM);
    setPhase("idle");
  };

  const dial = (
    <div style={styles.dialRow}>
      {contacts.map((c) => (
        <a key={`${c.name}-${c.phone}`} href={`tel:${c.phone}`} style={styles.dial}>
          Call {c.phone}
        </a>
      ))}
    </div>
  );

  if (phase === "countdown") {
    return (
      <div style={styles.card} role="alert" aria-live="assertive">
        <div style={styles.big}>{seconds}</div>
        <div style={styles.text}>Sending SOS…</div>
        <button type="button" style={styles.cancel} onClick={reset}>
          Cancel
        </button>
      </div>
    );
  }

  if (phase === "sending") {
    return (
      <div style={styles.card} role="status">
        <div style={styles.text}>Sending SOS…</div>
      </div>
    );
  }

  if (phase === "sent") {
    return (
      <div style={styles.card} role="status">
        <div style={styles.text}>SOS sent. Campus admins have been alerted.</div>
        {notified > 0 && <div style={styles.smallRed}>Your trusted contacts were also alerted.</div>}
        <div style={styles.smallRed}>If you are in danger, call now:</div>
        {dial}
        <button type="button" style={styles.cancel} onClick={reset}>
          Done
        </button>
      </div>
    );
  }

  if (phase === "error") {
    return (
      <div style={styles.card} role="alert">
        <div style={styles.text}>SOS could not be sent</div>
        <div style={styles.smallRed}>{errorText} If you are in danger, call emergency services now:</div>
        {dial}
        <button type="button" style={styles.cancel} onClick={reset}>
          Try again
        </button>
      </div>
    );
  }

  const holding = phase === "holding";

  return (
    <div style={styles.wrap}>
      <button
        type="button"
        style={styles.sos}
        onPointerDown={(e) => {
          if (e.button > 0) return;
          beginHold();
        }}
        onPointerUp={endHold}
        onPointerLeave={endHold}
        onPointerCancel={endHold}
        onContextMenu={(e) => e.preventDefault()}
        onKeyDown={(e) => {
          if ((e.key === " " || e.key === "Enter") && !e.repeat) {
            e.preventDefault();
            beginHold();
          }
        }}
        onKeyUp={(e) => {
          if (e.key === " " || e.key === "Enter") endHold();
        }}
        onBlur={endHold}
        aria-label="SOS. Press and hold for 3 seconds to send an emergency alert."
      >
        SOS
      </button>
      <div style={styles.track} aria-hidden="true">
        <div
          data-testid="sos-fill"
          style={{
            ...styles.fill,
            width: holding ? "100%" : "0%",
            transition: holding ? `width ${HOLD_MS}ms linear` : "none",
          }}
        />
      </div>
      <div style={styles.small}>Press and hold for 3 seconds. You can cancel during the countdown.</div>
      <input
        type="text"
        value={place}
        onChange={(e) => setPlace(e.target.value)}
        placeholder="Where are you? (optional)"
        maxLength={200}
        style={styles.input}
        aria-label="Where are you, optional"
      />
    </div>
  );
}

const styles = {
  wrap: { display: "flex", flexDirection: "column", alignItems: "center", gap: "6px", padding: "6px 4px 10px" },
  sos: {
    width: "96px",
    height: "96px",
    borderRadius: "50%",
    border: "6px solid #fecaca",
    background: "#dc2626",
    color: "#fff",
    fontSize: "24px",
    fontWeight: 800,
    letterSpacing: "2px",
    cursor: "pointer",
    userSelect: "none",
    touchAction: "none",
  },
  track: { width: "96px", height: "5px", borderRadius: "3px", background: "#e5e7eb", overflow: "hidden" },
  fill: { height: "5px", background: "#dc2626" },
  small: { fontSize: "12px", color: "#6b7280", textAlign: "center" },
  smallRed: { fontSize: "12px", color: "#fee2e2", textAlign: "center" },
  text: { fontSize: "14px", fontWeight: 700, textAlign: "center" },
  big: { fontSize: "48px", fontWeight: 800, lineHeight: 1 },
  input: { width: "100%", boxSizing: "border-box", padding: "8px", border: "1px solid #d1d5db", borderRadius: "8px", fontSize: "13px" },
  card: { background: "#dc2626", color: "#fff", borderRadius: "10px", padding: "12px", display: "flex", flexDirection: "column", alignItems: "center", gap: "6px", margin: "4px 0 10px" },
  cancel: { background: "#fff", color: "#dc2626", border: "none", borderRadius: "8px", padding: "8px 24px", fontWeight: 800, cursor: "pointer" },
  dialRow: { display: "flex", flexWrap: "wrap", gap: "6px", justifyContent: "center" },
  dial: { background: "#fff", color: "#dc2626", borderRadius: "8px", padding: "6px 10px", fontWeight: 800, textDecoration: "none", fontSize: "13px" },
};
