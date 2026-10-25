import { Link } from "react-router-dom";

import Card from "../components/common/Card";
import "../styles/pages/settings.css";

// The Android download link comes from the same environment variable
// as the public Download page (REACT_APP_APK_URL), so publishing a new
// APK is one Vercel setting, not a code change. With no link set the
// button is disabled and says so plainly.
const ANDROID_APK_URL = process.env.REACT_APP_APK_URL || "";

export default function Settings() {
  return (
    <div className="settings-page">
      <h2>Settings</h2>

      <Card
        title="Account"
        subtitle="Update your name, bio and profile details."
      >
        <Link className="get-app-download-btn" to="/profile/edit">
          Edit profile
        </Link>
      </Card>

      <Card
        title="Privacy"
        subtitle="How UniLink collects and uses your information."
      >
        <Link className="get-app-download-btn" to="/privacy">
          Read the privacy notice
        </Link>
      </Card>

      <Card
        title="Get the App"
        subtitle="UniLink is also available as a mobile app."
      >
        <div className="get-app-platforms">
          <div className="get-app-platform">
            <div className="get-app-platform-name">
              Android
              <span
                className={`get-app-platform-status ${
                  ANDROID_APK_URL
                    ? "get-app-platform-status--available"
                    : "get-app-platform-status--unavailable"
                }`}
              >
                {ANDROID_APK_URL ? "Available" : "Coming soon"}
              </span>
            </div>

            <p className="get-app-platform-note">
              Download the APK directly. UniLink isn't on the Play Store yet.
            </p>

            {ANDROID_APK_URL ? (
              <a
                className="get-app-download-btn"
                href={ANDROID_APK_URL}
                target="_blank"
                rel="noopener noreferrer"
              >
                Download for Android
              </a>
            ) : (
              <span className="get-app-download-btn get-app-download-btn--disabled">
                Download link coming soon
              </span>
            )}
          </div>

          <div className="get-app-platform">
            <div className="get-app-platform-name">
              iOS
              <span className="get-app-platform-status get-app-platform-status--unavailable">
                Not available yet
              </span>
            </div>

            <p className="get-app-platform-note">
              An iOS build isn't published yet.
            </p>

            <span className="get-app-download-btn get-app-download-btn--disabled">
              Download for iOS
            </span>
          </div>
        </div>
      </Card>
    </div>
  );
}
