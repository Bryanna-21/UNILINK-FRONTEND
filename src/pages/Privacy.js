import { useCallback, useEffect, useState } from "react";
import { Link } from "react-router-dom";

import PrivacyNoticeBody from "../components/PrivacyNoticeBody";
import { getPrivacyNotice } from "../services/legalService";
import { formatDate } from "../utils/legalUi";
import "../styles/pages/download.css";

// Public page (outside the sign-in gate). The text is served by the backend (GET /api/legal/privacy) so the website and
// the mobile app show the same, versioned notice. It is a DRAFT until the owner marks it reviewed.
export default function Privacy() {
  const icon = `${process.env.PUBLIC_URL || ""}/app-icon.png`;
  const [notice, setNotice] = useState(null);
  const [failed, setFailed] = useState(false);

  const load = useCallback(() => {
    setFailed(false);
    getPrivacyNotice()
      .then(setNotice)
      .catch(() => setFailed(true));
  }, []);

  useEffect(() => {
    load();
  }, [load]);

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
          {failed ? (
            <>
              <h1>Privacy Notice</h1>
              <p role="alert">The Privacy Notice could not be loaded right now.</p>
              <p>
                <button type="button" onClick={load}>
                  Try again
                </button>
              </p>
            </>
          ) : !notice ? (
            <p>Loading…</p>
          ) : (
            <>
              <h1>{notice.notice.title}</h1>
              <p className="legal-date">
                Version {notice.version} · Effective {formatDate(notice.effectiveDate)}
              </p>
              {notice.reviewStatus !== "reviewed" ? (
                <p role="note">
                  <strong>Draft.</strong> This notice has not yet been reviewed by a lawyer. Where a detail is shown as “Owner to provide”, it has not been supplied yet.
                </p>
              ) : null}
              <PrivacyNoticeBody notice={notice.notice} />
            </>
          )}
        </div>
      </div>
    </div>
  );
}
