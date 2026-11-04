import { Link } from "react-router-dom";

import "../styles/pages/studentHome.css";

// A page of cards that leads to a role's tools, in the same style as the student Academics hub.
// Used by Lecturer Tools and Admin Tools. Every card links to a page that exists.
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
            {group.cards.map(([cardTitle, text, path]) => (
              <Link className="sh-nav-card" to={path} key={path}>
                <strong>{cardTitle}</strong>
                <span>{text}</span>
              </Link>
            ))}
          </div>
        </section>
      ))}
    </div>
  );
}
