import { useState } from "react";
import { Link } from "react-router-dom";

import Card from "./common/Card";
import { useAuth } from "../context/AuthContext";
import "../styles/pages/security.css";

// Settings > Security: change password, and sign out of every device (a lost phone, or a password someone else may know).
export default function SecurityCard() {
  // Tolerates a page rendered without a sign-in context (for example in a test), instead of crashing the whole page.
  const { logoutEverywhere } = useAuth() || {};
  const [busy, setBusy] = useState(false);
  const [error, setError] = useState("");

  const signOutEverywhere = async () => {
    if (!logoutEverywhere) return;
    if (!window.confirm("Sign out of all devices? Every phone and browser signed in to your account will be signed out, including this one.")) return;
    setBusy(true);
    setError("");
    const result = await logoutEverywhere();
    setBusy(false);
    if (!result.success) setError(result.message);
  };

  return (
    <Card title="Security" subtitle="Keep your account safe.">
      <div className="sec-actions">
        <Link className="get-app-download-btn" to="/settings/change-password">Change password</Link>
        <button type="button" className="get-app-download-btn sec-danger" onClick={signOutEverywhere} disabled={busy}>
          {busy ? "Signing out..." : "Sign out of all devices"}
        </button>
      </div>
      {error && <p className="sec-error" role="alert">{error}</p>}
    </Card>
  );
}
