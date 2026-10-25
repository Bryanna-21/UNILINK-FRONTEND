import { useCallback, useEffect, useRef, useState } from "react";
import useAuth from "../hooks/useAuth";
import { acknowledgePrivacy, getLegalStatus } from "../services/legalService";
import { needsGate } from "../utils/legalUi";
import "../styles/components/privacyGate.css";

// Shown after sign-in when the person has not yet confirmed they have read the CURRENT Privacy Notice (new accounts, and
// everyone again whenever the notice changes). It records exactly what the person did: that they confirmed they had read
// version X. It is an acknowledgement of a notice, not consent to anything optional.
//
// Fails open: if the status cannot be loaded, nothing is shown, so an outage never locks anyone out.
export default function PrivacyNoticeGate() {
  const { logout } = useAuth();
  const [status, setStatus] = useState(null);
  const [saving, setSaving] = useState(false);
  const [message, setMessage] = useState("");
  const buttonRef = useRef(null);

  const load = useCallback(async () => {
    try {
      setStatus(await getLegalStatus());
    } catch (e) {
      setStatus(null); // fail open
    }
  }, []);

  useEffect(() => {
    load();
  }, [load]);

  const open = needsGate(status);

  useEffect(() => {
    if (open && buttonRef.current) buttonRef.current.focus();
  }, [open]);

  if (!open) return null;

  const first = !status.acknowledgedVersion;

  const confirm = async () => {
    setSaving(true);
    setMessage("");
    try {
      await acknowledgePrivacy(status.currentVersion);
      setStatus({ ...status, needsAcknowledgement: false, acknowledgedVersion: status.currentVersion });
    } catch (e) {
      if (e && e.response && e.response.status === 409) {
        setMessage("The Privacy Notice was just updated. Please read the latest version, then confirm again.");
        await load();
      } else {
        setMessage("We couldn’t save that. Please check your connection and try again.");
      }
    } finally {
      setSaving(false);
    }
  };

  return (
    <div className="pn-gate" role="presentation">
      <div className="pn-gate-box" role="dialog" aria-modal="true" aria-labelledby="pn-gate-title">
        <h2 id="pn-gate-title">{first ? "Before you continue" : "Our Privacy Notice has changed"}</h2>
        <p>
          {first
            ? "Please read the UniLink Privacy Notice. "
            : "We’ve updated the UniLink Privacy Notice. "}
          It explains what we collect, who can see it, which companies help us run UniLink, how to delete your account, and your rights.
        </p>
        <p>
          <a href="/privacy" target="_blank" rel="noopener noreferrer">
            Read the Privacy Notice (opens in a new tab)
          </a>
        </p>
        {message ? (
          <p className="pn-gate-error" role="alert">
            {message}
          </p>
        ) : null}
        <div className="pn-gate-actions">
          <button type="button" className="pn-gate-primary" ref={buttonRef} onClick={confirm} disabled={saving}>
            {saving ? "Saving…" : "I have read the Privacy Notice"}
          </button>
          <button type="button" className="pn-gate-secondary" onClick={logout} disabled={saving}>
            Log out
          </button>
        </div>
      </div>
    </div>
  );
}
