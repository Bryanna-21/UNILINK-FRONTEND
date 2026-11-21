import { useState } from "react";
import { Link } from "react-router-dom";

import Card from "../components/common/Card";
import { useAuth } from "../context/AuthContext";
import "../styles/pages/settings.css";
import "../styles/pages/security.css";

// Change your password, in two steps like the app: enter the old and the new one, then the 6-digit code that is
// emailed. The server then ends EVERY session of the account (including this one) and emails the owner, so the person
// signs in again with the new password.
export default function ChangePassword() {
  const { requestPasswordChange, confirmPasswordChange, logout } = useAuth();

  const [step, setStep] = useState("form"); // form -> code -> done
  const [current, setCurrent] = useState("");
  const [next, setNext] = useState("");
  const [again, setAgain] = useState("");
  const [code, setCode] = useState("");
  const [busy, setBusy] = useState(false);
  const [error, setError] = useState("");
  const [info, setInfo] = useState("");

  const start = async (e) => {
    e.preventDefault();
    setError("");
    if (!current || !next || !again) return setError("Please fill in all three password fields.");
    if (next.length < 8) return setError("New password must be at least 8 characters long.");
    if (next !== again) return setError("The new passwords do not match.");
    setBusy(true);
    const result = await requestPasswordChange(current, next, again);
    setBusy(false);
    if (!result.success) return setError(result.message);
    setInfo(result.message);
    setStep("code");
  };

  const confirm = async (e) => {
    e.preventDefault();
    setError("");
    if (!/^\d{6}$/.test(code.trim())) return setError("Enter the 6-digit code from your email.");
    setBusy(true);
    const result = await confirmPasswordChange(code.trim());
    setBusy(false);
    if (!result.success) return setError(result.message);
    setInfo(result.message);
    setStep("done");
  };

  return (
    <div className="settings-page">
      <h2>Change password</h2>

      {step === "form" && (
        <Card title="Your password" subtitle="Use at least 8 characters. Avoid common passwords and your own name or email.">
          <form className="sec-form" onSubmit={start} noValidate>
            <label htmlFor="cp-current">Current password</label>
            <input id="cp-current" type="password" autoComplete="current-password" value={current} onChange={(e) => setCurrent(e.target.value)} disabled={busy} />
            <label htmlFor="cp-new">New password</label>
            <input id="cp-new" type="password" autoComplete="new-password" value={next} onChange={(e) => setNext(e.target.value)} disabled={busy} />
            <label htmlFor="cp-again">Repeat the new password</label>
            <input id="cp-again" type="password" autoComplete="new-password" value={again} onChange={(e) => setAgain(e.target.value)} disabled={busy} />
            {error && <p className="sec-error" role="alert">{error}</p>}
            <div className="sec-actions">
              <button type="submit" className="get-app-download-btn" disabled={busy}>{busy ? "Sending code..." : "Send me a code"}</button>
              <Link className="get-app-download-btn" to="/settings">Cancel</Link>
            </div>
          </form>
        </Card>
      )}

      {step === "code" && (
        <Card title="Enter the code" subtitle={info || "We emailed you a 6-digit code."}>
          <form className="sec-form" onSubmit={confirm} noValidate>
            <label htmlFor="cp-code">6-digit code</label>
            <input id="cp-code" inputMode="numeric" autoComplete="one-time-code" maxLength={6} value={code} onChange={(e) => setCode(e.target.value)} disabled={busy} />
            <p className="sec-hint">The code expires in 10 minutes. Five wrong tries cancel it and you will need a new one.</p>
            {error && <p className="sec-error" role="alert">{error}</p>}
            <div className="sec-actions">
              <button type="submit" className="get-app-download-btn" disabled={busy}>{busy ? "Checking..." : "Change my password"}</button>
              <button type="button" className="get-app-download-btn" onClick={() => { setStep("form"); setCode(""); setError(""); }} disabled={busy}>Back</button>
            </div>
          </form>
        </Card>
      )}

      {step === "done" && (
        <Card title="Password changed">
          <p className="sec-ok" role="status">{info || "Password changed. Please sign in again with your new password."}</p>
          <div className="sec-actions">
            <button type="button" className="get-app-download-btn" onClick={logout}>Sign in again</button>
          </div>
        </Card>
      )}
    </div>
  );
}
