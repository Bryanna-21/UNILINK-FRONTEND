import { Link } from "react-router-dom";

import "../styles/pages/studentHome.css";

// The shared page behind "Lecturer Tools" and "Admin Tools": titled groups of cards, the same
// look as the student's Academics hub.
export default function ToolsHub({ title, intro, groups }) {
  return (
    <div className="sh-page">
      <header className="sh-header">
        <h1>{title}</h1>
        <p>{intro}</p>
      </header>

      {groups.map((group) => (
        <section className="sh-section" key={group.title}>
          <h2>{group.title}</h2>

          <div className="sh-card-grid">
            {group.cards.map(([name, text, path]) => (
              <Link className="sh-nav-card" to={path} key={path}>
                <strong>{name}</strong>
                <span>{text}</span>
              </Link>
            ))}
          </div>
        </section>
      ))}
    </div>
  );
}
