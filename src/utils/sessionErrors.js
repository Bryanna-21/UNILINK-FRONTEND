// Only these 401 answers mean the saved login is really finished (bad or expired token, password
// changed, no token). Any other failure (a busy server, a wrong password on the login form) must
// leave the saved login alone: signing people out on every hiccup is what made every update ask
// them to sign in again.
const DEAD_SESSION_MESSAGES = [
  "Invalid token",
  "Session expired. Please login again.",
  "No token provided",
];

export function isDeadSession(error) {
  const message = error && error.response && error.response.data && error.response.data.message;
  return error?.response?.status === 401 && typeof message === "string" && DEAD_SESSION_MESSAGES.includes(message);
}
