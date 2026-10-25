// One place to turn a failed request into a message a student can read.
// Server errors (5xx) never leak their internals to the screen; client
// errors (4xx) carry a deliberate message from the backend, so show it.
// The shared axios instance rejects network failures as a plain
// { message } object with no response, which the last branch covers.
export const getErrorMessage = (
  error,
  fallback = "Something went wrong. Please try again."
) => {
  const status = error?.response?.status;
  const serverMessage = error?.response?.data?.message;

  if (status && status < 500 && serverMessage) return serverMessage;
  if (!error?.response && error?.message) return error.message;

  return fallback;
};
