import { Link } from "react-router-dom";

import "../styles/pages/download.css";

// Public page (outside PublicRoute). IMPORTANT: this is a plain-language
// DRAFT written from what the code actually does (verified against the
// backend models/controllers and the mobile app config on 2 Oct 2026). It is
// not legal advice. Have it reviewed before relying on it, especially against
// Kenya's Data Protection Act, 2019, and update it whenever the app starts
// collecting something new (location, contacts, analytics, a new provider).
const CONTACT_EMAIL = process.env.REACT_APP_CONTACT_EMAIL || "";

export default function Privacy() {
  const icon = `${process.env.PUBLIC_URL || ""}/app-icon.png`;

  return (
    <div className="dl-page">
      <div className="dl-wrap legal">
        <div className="dl-nav">
          <div className="dl-brand">
            <img src={icon} alt="" />
            <span>
              Uni<b>Link</b>
            </span>
          </div>
          <Link to="/download">Get the app</Link>
        </div>

        <div className="dl-card">
          <h1>Privacy Policy</h1>
          <p className="legal-date">Last updated: 2 October 2026</p>

          <p>
            UniLink is a university management platform available on the web and as an Android
            app. This page explains, in plain language, what information UniLink handles, why,
            who can see it, and the choices you have.
          </p>

          <h2>1. Information we collect</h2>
          <p>
            <strong>Your account.</strong> Your name, university email address, password (stored
            only in scrambled, hashed form), role (student, lecturer or admin), university,
            and, if you add them, your admission number, phone number, bio, profile photo and
            cover photo.
          </p>
          <p>
            <strong>What you create.</strong> Posts, comments, messages, club and community
            activity, assignments and submissions, files you upload, marketplace and lost-and-found
            listings, and event check-ins.
          </p>
          <p>
            <strong>Safety features.</strong> If you add emergency (trusted) contacts, we store
            each contact's name, phone number and relationship to you. If you submit an emergency
            or help report, we store its type, your message, the location you describe and,
            where provided, coordinates. We may send an SMS alert to your trusted contacts when
            SMS is set up.
          </p>
          <p>
            <strong>Your device.</strong> A push notification token so we can notify you, and a
            login session kept in your phone's secure storage. The app also keeps a temporary
            offline copy of some screens (such as your dashboard and courses) on your phone so
            they still show when you have no signal. That copy is deleted when you log out.
          </p>

          <h2>2. Permissions the app asks for</h2>
          <ul>
            <li><strong>Camera:</strong> only to scan event check-in QR codes.</li>
            <li>
              <strong>Face ID / fingerprint:</strong> only to unlock the app on your phone. The
              check happens on your device, and UniLink never receives your biometric data.
            </li>
            <li><strong>Notifications:</strong> to alert you about messages, announcements and reports.</li>
            <li><strong>Photos and files:</strong> only the ones you choose to upload.</li>
          </ul>
          <p>The app does not ask for access to your contacts.</p>

          <h2>3. How we use it</h2>
          <ul>
            <li>To run UniLink: sign you in, show your courses, messages and community.</li>
            <li>To verify your email and keep your account secure, including login codes by email.</li>
            <li>To send notifications you have allowed.</li>
            <li>To handle safety reports and reach your trusted contacts if you ask us to.</li>
            <li>To power the AI assistant, if you use it (see below).</li>
          </ul>

          <h2>4. Who can see your information</h2>
          <p>
            People at your university can see what you choose to share on the platform, such as
            your name, role, profile photo and posts. Messages are visible to the people in the
            conversation. Emergency and help reports are visible to authorised university staff.
            The most sensitive report types are restricted to safeguarding-authorised staff and
            are not shown to lecturers. We do not sell your information.
          </p>

          <h2>5. Services that process data for us</h2>
          <ul>
            <li><strong>Hosting and database:</strong> cloud providers that run our servers and store your data.</li>
            <li><strong>Cloudinary:</strong> stores uploaded images and files.</li>
            <li><strong>Email delivery provider:</strong> sends verification and login-code emails.</li>
            <li><strong>Expo:</strong> delivers push notifications to your phone.</li>
            <li>
              <strong>Google (Gemini):</strong> if you use the AI assistant, the text you type
              and the recent turns of that conversation are sent to Google's Gemini service to
              generate a reply. Do not put sensitive personal information into the assistant.
            </li>
          </ul>

          <h2>6. Deleting your account</h2>
          <p>
            You can delete your account yourself in the app: <strong>Settings → Delete my account</strong>.
            You will need to enter your password. When you do, we erase your name, email, photo,
            bio, phone number and emergency contacts, and sign you out everywhere. Posts, comments
            and messages you wrote stay visible to other people because their conversations depend
            on them, but they are shown as "Deleted User". Copies held in our providers' backups
            may take additional time to disappear. Admin accounts cannot be deleted from the app
            and must be removed by a senior administrator.
          </p>

          <h2>7. Security</h2>
          <p>
            Passwords are stored hashed, connections to our servers are encrypted, and your login
            session on the app lives in your phone's secure storage. No system is perfectly secure,
            so please use a strong password you do not use anywhere else.
          </p>

          <h2>8. Your choices and rights</h2>
          <p>
            You can edit your profile at any time and delete your account as described above.
            Depending on the law that applies to you, including Kenya's Data Protection Act, 2019,
            you may also have the right to ask what we hold about you, to have it corrected, or to
            have it erased.
          </p>

          <h2>9. Children</h2>
          <p>
            UniLink is intended for university students and staff, not for young children.
          </p>

          <h2>10. Changes to this policy</h2>
          <p>
            If we change how we handle your information, we will update this page and the date at
            the top.
          </p>

          <h2>11. Contact</h2>
          <p>
            {CONTACT_EMAIL ? (
              <>
                Questions about your data can be sent to{" "}
                <a href={`mailto:${CONTACT_EMAIL}`}>{CONTACT_EMAIL}</a>.
              </>
            ) : (
              <>Questions about your data can be raised with your university's UniLink administrator.</>
            )}
          </p>
        </div>
      </div>
    </div>
  );
}
