import { useCallback, useEffect, useRef, useState } from "react";
import { useNavigate } from "react-router-dom";
import { io } from "socket.io-client";

import env from "../config/env";
import { useAuth } from "../context/AuthContext";
import { createAlarm } from "../utils/alarm";
import "../styles/emergencyAlert.css";

const STAFF = ["lecturer", "admin", "superadmin"];

// A phone number is only ever turned into a link when it looks exactly like one: an optional +,
// then digits (spaces allowed between them), 3 to 16 characters. Anything else is dropped.
const PHONE = /^\+?\d[\d ]{1,14}\d$/;
const isPhone = (value) => typeof value === "string" && PHONE.test(value.trim());
const dialable = (value) => String(value || "").replace(/[^\d+]/g, "");

function parseNumbers(raw) {
  try {
    const list = JSON.parse(raw || "[]");
    return Array.isArray(list)
      ? list.filter((n) => n && isPhone(n.number)).slice(0, 6)
      : [];
  } catch (error) {
    return [];
  }
}

// When an emergency is reported and you can help (an admin, or the emergency contact of the person
// in trouble), this takes over the screen with what you need and sounds the alarm. It listens live
// (Socket.IO), so it only works while UniLink is open in a tab; phones are alerted by push.
export default function EmergencyAlertListener() {
  const { user } = useAuth();
  const navigate = useNavigate();
  const [alert, setAlert] = useState(null);
  const [soundBlocked, setSoundBlocked] = useState(false);
  const alarmRef = useRef(null);
  const titleRef = useRef(null);
  const seen = useRef(new Set());

  const silence = useCallback(() => {
    if (alarmRef.current) alarmRef.current.stop();
    alarmRef.current = null;
    setSoundBlocked(false);
  }, []);

  const dismiss = useCallback(() => {
    silence();
    setAlert(null);
  }, [silence]);

  useEffect(() => {
    const token = localStorage.getItem("token");
    if (!token || !user?.id) return undefined;

    const socket = io(env.SOCKET_URL, { auth: { token }, transports: ["websocket"] });

    socket.on("emergency:alert", async (payload) => {
      if (!payload || !payload.reportId || seen.current.has(payload.reportId)) return;
      seen.current.add(payload.reportId);
      setAlert(payload);
      if (payload.ring === "1") {
        if (alarmRef.current) alarmRef.current.stop();
        alarmRef.current = createAlarm();
        const playing = await alarmRef.current.start();
        // Only worth asking for a click when this browser can play the sound at all.
        setSoundBlocked(!playing && alarmRef.current.isSupported);
      }
    });

    return () => {
      socket.disconnect();
      if (alarmRef.current) alarmRef.current.stop();
      alarmRef.current = null;
    };
  }, [user?.id]);

  // The browser only allows sound after a click, so the first click anywhere starts it.
  useEffect(() => {
    if (!soundBlocked) return undefined;
    const enable = async () => {
      const playing = alarmRef.current ? await alarmRef.current.resume() : false;
      if (playing) setSoundBlocked(false);
    };
    document.addEventListener("pointerdown", enable, { once: true });
    document.addEventListener("keydown", enable, { once: true });
    return () => {
      document.removeEventListener("pointerdown", enable);
      document.removeEventListener("keydown", enable);
    };
  }, [soundBlocked]);

  // The tab title flashes the alert, so it is noticed from another tab.
  useEffect(() => {
    if (!alert) return undefined;
    if (titleRef.current === null) titleRef.current = document.title;
    let on = true;
    const timer = setInterval(() => {
      document.title = on ? "🚨 EMERGENCY - UniLink" : titleRef.current;
      on = !on;
    }, 800);
    return () => {
      clearInterval(timer);
      document.title = titleRef.current ?? document.title;
      titleRef.current = null;
    };
  }, [alert]);

  if (!alert) return null;

  const numbers = parseNumbers(alert.numbers);
  const staff = STAFF.includes(user?.role);
  const ringing = alert.ring === "1";

  return (
    <div className="ea-overlay" role="alertdialog" aria-modal="true" aria-labelledby="ea-title" aria-describedby="ea-body">
      <div className={`ea-card ${ringing ? "ringing" : ""}`}>
        <h2 id="ea-title" className="ea-title">{alert.title || "Emergency"}</h2>

        <div id="ea-body" className="ea-body">
          {alert.student && <p><strong>{alert.student}</strong> needs help.</p>}
          {alert.message && <p>{alert.message}</p>}
          {alert.location && <p>Location: {alert.location}</p>}
          {!alert.student && !alert.message && !alert.location && <p>{alert.body}</p>}
        </div>

        {soundBlocked && (
          <p className="ea-sound" role="status">
            The alarm sound is waiting for a click. Click anywhere on this screen to turn it on.
          </p>
        )}

        <div className="ea-actions">
          {isPhone(alert.phone) && (
            <a className="ea-call primary" href={`tel:${dialable(alert.phone)}`}>
              Call {alert.student || "them"}
            </a>
          )}
          {numbers.map((n) => (
            <a key={n.number} className="ea-call" href={`tel:${dialable(n.number)}`}>
              Call {n.number}
              <span> {n.label}</span>
            </a>
          ))}
          {staff && (
            <button
              type="button"
              className="ea-btn"
              onClick={() => {
                dismiss();
                navigate("/lecturer/emergency-reports");
              }}
            >
              Open reports
            </button>
          )}
          {ringing && (
            <button type="button" className="ea-btn" onClick={silence}>
              Silence
            </button>
          )}
          <button type="button" className="ea-btn" onClick={dismiss}>
            Dismiss
          </button>
        </div>
      </div>
    </div>
  );
}
