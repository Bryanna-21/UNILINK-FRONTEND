import { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import Card from "./common/Card";
import { getLegalStatus } from "../services/legalService";
import { formatDate } from "../utils/legalUi";

// Settings > Privacy. Shows what is true: which version of the Privacy Notice you confirmed, and where to read it.
export default function PrivacySettingsCard() {
  const [status, setStatus] = useState(undefined); // undefined = loading, null = unavailable

  useEffect(() => {
    let live = true;
    getLegalStatus()
      .then((s) => live && setStatus(s))
      .catch(() => live && setStatus(null));
    return () => {
      live = false;
    };
  }, []);

  let line = "Loading…";
  if (status === null) line = "We couldn’t check this right now.";
  else if (status) {
    line = status.acknowledgedVersion
      ? `You confirmed you read version ${status.acknowledgedVersion}${status.acknowledgedAt ? ` on ${formatDate(status.acknowledgedAt)}` : ""}.`
      : "You haven’t confirmed you’ve read the current Privacy Notice yet.";
  }

  return (
    <Card title="Privacy" subtitle="Your information and your rights.">
      <p>
        <Link to="/privacy">Read the Privacy Notice</Link>
      </p>
      <p>{line}</p>
      <p>
        To delete your account, use the UniLink app (Settings, then Delete my account). The website can’t do this yet; if you need help, the contact details are in the Privacy Notice.
      </p>
    </Card>
  );
}
