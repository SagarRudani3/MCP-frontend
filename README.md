# Google Calendar OAuth with Composio

A complete implementation of Google Calendar OAuth integration using Composio, with a React frontend and Node.js/Express backend.

## Project Structure

```
project/
├── backend/
│   ├── server.js              # Express server
│   ├── routes/
│   │   └── composio.js        # Composio API routes
│   ├── .env                   # Backend environment variables
│   └── package.json
├── src/                       # Frontend source
│   ├── components/
│   │   ├── GoogleSignInButton.jsx
│   │   ├── ConnectedAccounts.jsx
│   │   └── CalendarDashboard.jsx
│   ├── pages/
│   │   └── OAuthCallback.jsx
│   └── App.jsx               # Main app with routing
├── .env.local                # Frontend environment variables
└── README.md
```

## Features

- Google OAuth authentication flow via Composio
- View connected Google accounts
- Display upcoming Google Calendar events
- Disconnect accounts
- Real-time connection status
- Responsive UI with Tailwind CSS

## Prerequisites

- Node.js 18+ installed
- Composio account and API key
- Google Calendar API enabled in Composio

## Setup Instructions

### 1. Get Composio API Key

1. Sign up at [Composio](https://app.composio.dev)
2. Navigate to Settings > API Keys
3. Create a new API key
4. Copy the API key

### 2. Install Backend Dependencies

```bash
cd backend
npm install
```

### 3. Configure Backend Environment

Edit `backend/.env`:

```env
COMPOSIO_API_KEY=your_composio_api_key_here
PORT=3000
FRONTEND_URL=http://localhost:5173
```

### 4. Install Frontend Dependencies

```bash
# From project root
npm install
```

### 5. Configure Frontend Environment

The `.env.local` file is already created with:

```env
"https://mcp-backend-s0np.onrender.com"=http://localhost:3000
```

## Running the Application

### Start Backend Server (Terminal 1)

```bash
cd backend
npm start
```

The backend will start on `http://localhost:3000`

### Start Frontend Dev Server (Terminal 2)

```bash
# From project root
npm run dev
```

The frontend will start on `http://localhost:5173`

## Usage

1. Open your browser to `http://localhost:5173`
2. Click "Sign in with Google"
3. Authorize Composio to access your Google Calendar
4. You'll be redirected back to the dashboard
5. View your connected accounts and upcoming calendar events

## API Endpoints

### Backend Endpoints

| Method | Endpoint                                                 | Description              |
| ------ | -------------------------------------------------------- | ------------------------ |
| GET    | `/api/composio/connectedAccounts?entityId=xxx`           | Fetch connected accounts |
| POST   | `/api/composio/initiate`                                 | Initiate OAuth flow      |
| GET    | `/api/composio/callback`                                 | Handle OAuth callback    |
| GET    | `/api/calendar/events?entityId=xxx`                      | Fetch calendar events    |
| DELETE | `/api/composio/disconnect?entityId=xxx&connectionId=xxx` | Disconnect account       |
| GET    | `/health`                                                | Health check             |

## OAuth Flow

1. User clicks "Sign in with Google" button
2. Frontend calls `POST /api/composio/initiate`
3. Backend returns Google OAuth URL
4. User redirects to Google and authorizes
5. Google redirects to `http://localhost:3000/api/composio/callback`
6. Backend processes callback and redirects to frontend
7. Frontend shows success message and redirects to dashboard
8. Dashboard fetches and displays calendar events

## Entity Management

The application uses `default_user` as the entity ID for testing. In production, replace this with actual user IDs from your authentication system.

## Tech Stack

### Backend

- Express.js
- Composio Core SDK (v3 API)
- CORS enabled
- dotenv for environment variables

### Frontend

- React 18
- React Router v6
- Tailwind CSS
- Lucide React icons
- Vite

## Troubleshooting

### Backend won't start

- Verify `COMPOSIO_API_KEY` is set in `backend/.env`
- Check that port 3000 is not in use
- Ensure all dependencies are installed: `cd backend && npm install`

### Frontend won't connect

- Verify backend is running on port 3000
- Check `"https://mcp-backend-s0np.onrender.com"` in `.env.local`
- Clear browser cache and reload

### OAuth fails

- Verify Google Calendar integration is enabled in Composio dashboard
- Check that redirect URLs match in Composio settings
- Look at browser console and backend logs for errors

### No events showing

- Ensure you have upcoming events in your Google Calendar
- Check that the connection status is "ACTIVE"
- Try clicking the Refresh button
- Check backend logs for API errors

## Development

### Backend Development

The backend uses Node.js watch mode for development:

```bash
cd backend
npm run dev
```

### Frontend Development

Vite provides hot module replacement:

```bash
npm run dev
```

## Environment Variables

### Backend (`backend/.env`)

| Variable           | Description           | Default               |
| ------------------ | --------------------- | --------------------- |
| `COMPOSIO_API_KEY` | Your Composio API key | Required              |
| `PORT`             | Backend server port   | 3000                  |
| `FRONTEND_URL`     | Frontend URL for CORS | http://localhost:5173 |

### Frontend (`.env.local`)

| Variable                                  | Description     | Default               |
| ----------------------------------------- | --------------- | --------------------- |
| `"https://mcp-backend-s0np.onrender.com"` | Backend API URL | http://localhost:3000 |

## Production Deployment

### Backend

1. Set environment variables in your hosting platform
2. Update `FRONTEND_URL` to your production frontend URL
3. Deploy backend code
4. Ensure port 3000 is accessible

### Frontend

1. Update `"https://mcp-backend-s0np.onrender.com"` to your production backend URL
2. Build frontend: `npm run build`
3. Deploy `dist` folder to your hosting platform

### Composio Configuration

Update callback URL in Composio dashboard to match your production backend URL:

```
https://your-backend-domain.com/api/composio/callback
```

## Security Notes

- Never commit `.env` files with real API keys
- Use environment variables for all sensitive data
- Enable HTTPS in production
- Implement proper user authentication before production use
- Replace `default_user` entity ID with actual user IDs

## License

MIT

## Support

For issues with:

- **Composio**: Check [Composio Documentation](https://docs.composio.dev)
- **This implementation**: Open an issue in the repository
