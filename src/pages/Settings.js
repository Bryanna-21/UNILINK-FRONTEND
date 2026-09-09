import Card from "../components/common/Card";
import "../styles/pages/settings.css";

// NOTE for whoever fills in the real link: replace ANDROID_APK_URL
// below with the actual GitHub Releases URL once one exists. Left as
// an obvious placeholder rather than a guessed URL, since a wrong
// link that looks real is worse than an honest "not set yet" state —
// it would 404 silently and nobody would know until a user complained.
const ANDROID_APK_URL = "REPLACE_WITH_GITHUB_RELEASES_URL";

const androidLinkIsSet = ANDROID_APK_URL !== "REPLACE_WITH_GITHUB_RELEASES_URL";

export default function Settings() {
  return (
    <div className="settings-page">
      <h2>Settings</h2>

      <Card title="Account Settings" subtitle="Profile settings will appear here.">
        <p>Coming soon.</p>
      </Card>

      <Card title="Privacy" subtitle="Privacy settings will appear here.">
        <p>Coming soon.</p>
      </Card>

      <Card
        title="Get the App"
        subtitle="UniLink is also available as a mobile app."
      >
        <div className="get-app-platforms">
          <div className="get-app-platform">
            <div className="get-app-platform-name">
              Android
              <span className="get-app-platform-status get-app-platform-status--available">
                Available
              </span>
            </div>
            <p className="get-app-platform-note">
              Download the APK directly — UniLink isn't on the Play Store yet.
            </p>

            {androidLinkIsSet ? (
              <a
                className="get-app-download-btn"
                href={ANDROID_APK_URL}
                target="_blank"
                rel="noopener noreferrer"
              >
                Download for Android
              </a>
            ) : (
              <>
                <span className="get-app-download-btn get-app-download-btn--disabled">
                  Download for Android
                </span>
                <p className="get-app-placeholder-note">
                  Link not set yet — add the GitHub Releases URL in Settings.js.
                </p>
              </>
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
              An iOS build isn't published yet. Check back soon.
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
