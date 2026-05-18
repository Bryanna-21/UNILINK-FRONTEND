# UniLink Frontend

A React-based frontend for the UniLink university network platform.

## Features

- User Authentication (Register & Login)
- Create, Read, and Delete Posts
- Real-time Feed
- Responsive Design
- Token-based Authorization
- Error Handling

## Prerequisites

- Node.js (v14 or higher)
- npm or yarn
- Backend API running on http://localhost:5000

## Installation

1. Clone the repository:
   ```bash
   git clone https://github.com/Bryanna-21/UNILINK-FRONTEND.git
   cd UNILINK-FRONTEND
   ```

2. Install dependencies:
   ```bash
   npm install
   ```

3. Create `.env` file:
   ```bash
   cp .env.example .env
   ```

4. Update `.env` with your backend URL (if different):
   ```
   REACT_APP_BACKEND_URL=http://localhost:5000/api
   ```

## Running the Application

### Development Mode
```bash
npm start
```
The app will open at `http://localhost:3000`

### Build for Production
```bash
npm run build
```

### Run Tests
```bash
npm test
```

## Project Structure

```
src/
├── components/       # Reusable React components
│   └── PostCard.js   # Post component
├── pages/            # Page components
│   ├── Login.js      # Login page
│   ├── Register.js   # Register page
│   └── Feed.js       # Main feed page
├── layout/           # Layout components
│   └── MainLayout.js # Main layout wrapper
├── services/         # API and services
│   └── api.js        # Axios API instance
├── styles/           # CSS files
│   ├── App.css
│   ├── Auth.css
│   ├── Feed.css
│   ├── MainLayout.css
│   ├── PostCard.css
│   └── index.css
├── App.js            # Main App component
└── index.js          # Entry point
```

## API Endpoints

### Authentication
- `POST /auth/register` - Register new user
- `POST /auth/login` - Login user

### Posts (Requires Authentication)
- `GET /posts` - Get all posts
- `GET /posts/:id` - Get post by ID
- `POST /posts` - Create new post
- `PUT /posts/:id` - Update post
- `DELETE /posts/:id` - Delete post

## Environment Variables

- `REACT_APP_BACKEND_URL` - Backend API URL (default: http://localhost:5000/api)
- `REACT_APP_ENV` - Environment (development/production)

## Authentication

The app uses JWT tokens for authentication. The token is stored in localStorage and automatically attached to all API requests.

### Token Expiration
If the token expires (401 error), the user is automatically redirected to the login page.

## Troubleshooting

### "Cannot GET /feed"
- Ensure backend is running on http://localhost:5000
- Check `REACT_APP_BACKEND_URL` in `.env`
- Make sure you're authenticated (have a valid token)

### "Login failed"
- Verify backend is running
- Check email and password
- Ensure backend and frontend are on correct URLs

### "Network Error"
- Check if backend server is running
- Verify `REACT_APP_BACKEND_URL` matches backend address
- Check browser console for CORS errors

## Deployment

### Deploy to Vercel/Netlify

1. Build the project:
   ```bash
   npm run build
   ```

2. Set environment variables in deployment platform:
   - `REACT_APP_BACKEND_URL=<your-backend-url>`

3. Deploy the `build` folder

## Technologies Used

- React 18
- React Router v6
- Axios
- CSS3

## License

MIT License

## Author

Bryanna-21
