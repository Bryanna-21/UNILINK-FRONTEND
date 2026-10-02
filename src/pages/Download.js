import { Link } from "react-router-dom";
import { FaAndroid, FaApple, FaDownload, FaGlobe } from "react-icons/fa";

import "../styles/pages/download.css";

// Public page: reachable whether or not the visitor is signed in, so it
// lives OUTSIDE PublicRoute (which would redirect signed-in users away).
//
// Everything that changes per release comes from environment variables, so
// publishing a new APK is a Vercel settings change plus a redeploy, not a
// code change:
//   REACT_APP_APK_URL      direct link to the APK (e.g. a GitHub Release asset)
//   REACT_APP_APK_VERSION  shown to users, optional
//   REACT_APP_APK_SHA256   lets careful users verify the file, optional
// With no URL set the button is disabled and says so: never a dead link.
const APK_URL = process.env.REACT_APP_APK_URL || "";
const APK_VERSION = process.env.REACT_APP_APK_VERSION || "";
const APK_SHA256 = process.env.REACT_APP_APK_SHA256 || "";

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

        <section className="dl-card" aria-labelledby="dl-android">
          <h2 id="dl-android">
            <FaAndroid aria-hidden="true" /> Android
          </h2>
          <p className="dl-sub">
            Install the app directly. It is not on the Google Play Store yet.
          </p>

          {APK_URL ? (
            <a className="dl-btn" href={APK_URL} rel="noopener noreferrer">
              <FaDownload aria-hidden="true" /> Download for Android
            </a>
          ) : (
            <button className="dl-btn" disabled>
              Download link coming soon
            </button>
          )}

          {APK_VERSION && <div className="dl-meta">Version {APK_VERSION}</div>}

          <h3 style={{ margin: "22px 0 8px", fontSize: 16 }}>How to install</h3>
          <ol className="dl-steps">
            <li>Tap <strong>Download for Android</strong> and let the file finish downloading.</li>
            <li>
              Open the downloaded file. Android will ask whether to let your browser
              install apps. Allow it for this install.
            </li>
            <li>Tap <strong>Install</strong>, then open UniLink and sign in with your university account.</li>
          </ol>

          <div className="dl-note">
            <strong>Why you may see a warning.</strong> Android and Google Play Protect
            show a notice for any app installed from outside the Play Store. That is
            expected here. Only install the file if you downloaded it from this page,
            and never from a link someone sent you in a message.
          </div>

          {APK_SHA256 && (
            <div className="dl-hash">
              To check your download is genuine, compare its SHA-256 fingerprint with this:
              <code>{APK_SHA256}</code>
            </div>
          )}
        </section>

        <section className="dl-card" aria-labelledby="dl-ios">
          <h2 id="dl-ios">
            <FaApple aria-hidden="true" /> iPhone
          </h2>
          <p className="dl-sub">
            The iPhone app is not available yet. Apple does not allow installing apps from a
            website link, so it will arrive through the App Store when it is ready.
          </p>
          <Link className="dl-btn" to="/login">
            <FaGlobe aria-hidden="true" /> Use the web version in the meantime
          </Link>
        </section>

        <div className="dl-foot">
          By installing UniLink you agree to how we handle your data, described in our{" "}
          <Link to="/privacy">Privacy Policy</Link>.
        </div>
      </div>
    </div>
  );
}
