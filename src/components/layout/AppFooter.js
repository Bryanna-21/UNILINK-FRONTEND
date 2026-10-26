import { Link } from "react-router-dom";
import "../../styles/layout/footer.css";

// Set REACT_APP_CONTACT_EMAIL in Vercel to show a Contact link. The
// year is computed, so it never goes stale.
const CONTACT_EMAIL = process.env.REACT_APP_CONTACT_EMAIL || "";

export default function AppFooter() {
  return (
    <footer className="app-footer">
      <span>&copy; {new Date().getFullYear()} UniLink</span>

      <nav aria-label="Footer">
        <Link to="/privacy">Privacy</Link>
        <Link to="/download">Get the app</Link>
        {CONTACT_EMAIL && <a href={`mailto:${CONTACT_EMAIL}`}>Contact</a>}
      </nav>
    </footer>
  );
}
