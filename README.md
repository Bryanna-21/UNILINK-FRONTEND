# UniLink Student Web

A production-focused student experience for the UniLink platform. The web app follows the same navigation model as the UniLink mobile client: Home, Courses, Community, Explore, AI and Profile, with academic tools available inside the student workspace.

## Included
- Student authentication and protected routes
- New-device one-time verification flow
- Password change with one-time verification
- UniLink AI through the backend proxy
- Courses, units, assignments, notes, exams, results, timetable and attendance
- Community, messages, events, notifications and search
- Responsive desktop/mobile shell with mobile bottom navigation
- Persistent light/dark mode
- Vercel-ready React build

## Environment
Set `REACT_APP_API_URL` to the deployed API base URL, for example `https://your-api.example.com/api`.

The AI provider key must remain on the server. Never place provider secrets in this repository or browser bundle.

## Authentication contract
The client expects the API to support `/auth/login`, `/auth/verify-login-otp`, `/auth/resend-login-otp`, `/auth/register`, `/auth/verify-otp`, `/auth/resend-otp`, `/auth/request-password-change`, and `/auth/confirm-password-change`. A new-device login should return `requiresTwoFactor` (or `requiresLoginOtp`) and a `userId`; the verification endpoint returns the normal token and student user object.

## Production check
Run `npm install` then `npm run build`. The resulting `build/` directory can be deployed to Vercel.
