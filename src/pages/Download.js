import { Link } from "react-router-dom";
import DownloadCards from "../components/download/DownloadCards";

import "../styles/pages/download.css";

// Public page: reachable whether or not the visitor is signed in, so it
// lives OUTSIDE PublicRoute (which would redirect signed-in users away).
//
// The download cards, and the environment variables that configure them
// (REACT_APP_APK_URL and friends), live in components/download/DownloadCards.js,
// shared with the signed-in Apps page.
export default function Download() {
  const icon = `${process.env.PUBLIC_URL || ""}/app-icon.png`;

  return (
    <div className="dl-page">
      <div className="dl-wrap">
        <div className="dl-nav">
          <div className="dl-brand">
            <img src={icon} alt="" />
            <span>
              Uni<b>Link</b>
            </span>
          </div>
          <Link to="/login">Sign in on the web</Link>
        </div>

        <div className="dl-hero">
          <img src={icon} alt="UniLink app icon" />
          <h1>Get the UniLink app</h1>
          <p>Connect · Learn · Grow, on your phone.</p>
        </div>

        <DownloadCards />

        <div className="dl-foot">
          By installing UniLink you agree to how we handle your data, described in our{" "}
          <Link to="/privacy">Privacy Policy</Link>.
        </div>
      </div>
    </div>
  );
}
