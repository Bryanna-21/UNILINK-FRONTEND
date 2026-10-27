import { Link } from "react-router-dom";

import DownloadCards from "../components/download/DownloadCards";

import "../styles/pages/apps.css";

// The signed-in "Apps" tab: the same download cards as the public
// /download page (same environment variables), inside the app layout.
export default function Apps() {
  const icon = `${process.env.PUBLIC_URL || ""}/app-icon.png`;

  return (
    <div className="apps-page">
      <header className="apps-header">
        <img src={icon} alt="" />
        <div>
          <h1>Apps</h1>
          <p>Get UniLink on your phone. Connect, learn and grow, wherever you are.</p>
        </div>
      </header>

      <DownloadCards signedIn />

      <p className="apps-foot">
        By installing UniLink you agree to how we handle your data, described in our{" "}
        <Link to="/privacy">Privacy Policy</Link>.
      </p>
    </div>
  );
}
