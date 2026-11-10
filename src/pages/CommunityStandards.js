import { useCallback, useEffect, useState } from "react";
import { Link } from "react-router-dom";

import StateMessage from "../components/common/StateMessage";
import * as people from "../services/profilePeopleService";
import { getErrorMessage } from "../utils/errors";

import "../styles/pages/safetyPages.css";

// The UniLink Community Standards, read from the server (GET /safety/standards) so the website
// and the app always show the same words and a wording change never needs a new build.
export default function CommunityStandards() {
  const [standards, setStandards] = useState(null);
  const [status, setStatus] = useState("loading");
  const [errorText, setErrorText] = useState("");

  const load = useCallback(async () => {
    setStatus("loading");
    try {
      const data = await people.getStandards();
      if (!data || !Array.isArray(data.sections)) throw new Error("bad response");
      setStandards(data);
      setStatus("ready");
    } catch (error) {
      setErrorText(getErrorMessage(error, "Could not load the Community Standards."));
      setStatus("error");
    }
  }, []);

  useEffect(() => {
    load();
  }, [load]);

  return (
    <div className="safety-page">
      <p><Link to="/settings">&larr; Settings</Link></p>

      {status === "loading" && <StateMessage kind="loading" text="Loading..." />}
      {status === "error" && (
        <StateMessage
          kind="error"
          title="Couldn't load the standards"
          text={errorText}
          action={<button type="button" className="safety-btn" onClick={load}>Try again</button>}
        />
      )}

      {status === "ready" && (
        <>
          <h1>{standards.title || "Community Standards"}</h1>
          <p className="safety-meta">
            Version {standards.version}
            {standards.effectiveDate ? `, effective ${standards.effectiveDate}` : ""}
          </p>
          {standards.intro && <p className="safety-intro">{standards.intro}</p>}

          {standards.sections.map((section) => (
            <section key={section.id || section.number} className="safety-section" id={section.id}>
              <h2>
                {section.number}. {section.title}
              </h2>
              {section.summary && <p className="safety-summary">{section.summary}</p>}
              {Array.isArray(section.rules) && (
                <ul>
                  {section.rules.map((rule, i) => (
                    <li key={i}>{rule}</li>
                  ))}
                </ul>
              )}
            </section>
          ))}
        </>
      )}
    </div>
  );
}
