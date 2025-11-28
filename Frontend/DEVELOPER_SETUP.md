# AfriGuard Verify - Developer Setup Guide

This guide will help backend developers integrate the API with the existing frontend.

## Project Overview

AfriGuard Verify is a WhatsApp-first deepfake detection dashboard built with:
- **Frontend**: React + TypeScript + Tailwind CSS + Vite
- **UI Components**: Shadcn/ui
- **State Management**: TanStack Query
- **Routing**: React Router v6
- **Charts**: Recharts
- **HTTP Client**: Axios
- **WebSockets**: Native WebSocket API

---

## Quick Start

### 1. Install Dependencies

```bash
npm install
```

### 2. Configure Environment Variables

```bash
cp .env.example .env
```

Edit `.env` and set your backend API URLs:
```env
VITE_API_BASE_URL=http://localhost:3000/api
VITE_WS_BASE_URL=ws://localhost:3000
```

### 3. Run Development Server

```bash
npm run dev
```

The app will be available at `http://localhost:8080`

### 4. Build for Production

```bash
npm run build
```

The production build will be in the `dist/` folder.

---

## Project Structure

```
src/
├── components/          # Reusable UI components
│   ├── ui/             # Shadcn UI components
│   ├── Sidebar.tsx     # Main sidebar navigation
│   ├── Topbar.tsx      # Top navigation bar
│   ├── StatsCard.tsx   # Statistics card component
│   ├── CaseTable.tsx   # Case listing table
│   ├── LoadingSkeleton.tsx  # Loading states
│   ├── ProtectedRoute.tsx   # Auth route wrapper
│   └── DashboardLayout.tsx  # Main layout wrapper
│
├── pages/              # Page components (routes)
│   ├── Login.tsx       # Login page
│   ├── Dashboard.tsx   # Main dashboard
│   ├── Cases.tsx       # Case history page
│   ├── CaseDetails.tsx # Individual case details
│   ├── Queue.tsx       # Real-time queue monitoring
│   ├── Feedback.tsx    # User feedback page
│   └── Settings.tsx    # Settings page
│
├── services/           # API service layer (INTEGRATE HERE!)
│   ├── AuthService.ts      # Authentication API calls
│   ├── CaseService.ts      # Case management API calls
│   ├── FeedbackService.ts  # Feedback API calls
│   └── QueueService.ts     # WebSocket queue connection
│
├── types/              # TypeScript type definitions
│   ├── Case.ts         # Case-related types
│   ├── Stats.ts        # Statistics types
│   ├── Feedback.ts     # Feedback types
│   └── Queue.ts        # Queue types
│
├── hooks/              # Custom React hooks
├── lib/                # Utility functions
├── App.tsx             # Root component with routing
└── main.tsx            # App entry point
```

---

## Backend Integration Steps

### Step 1: Update Service Files

All API calls are centralized in `src/services/`. Replace mock implementations with real API calls.

**Example (AuthService.ts):**

```typescript
// CURRENT (Mock):
async login(credentials: LoginCredentials): Promise<AuthResponse> {
  return new Promise((resolve) => {
    setTimeout(() => resolve({ /* mock data */ }), 1000);
  });
}

// REPLACE WITH (Real API):
async login(credentials: LoginCredentials): Promise<AuthResponse> {
  const response = await axios.post(`${API_BASE_URL}/auth/login`, credentials);
  return response.data;
}
```

### Step 2: Test Each Endpoint

1. Start with `AuthService.ts` - get login working
2. Then `CaseService.ts` - verify data fetching
3. Next `FeedbackService.ts` - test feedback submission
4. Finally `QueueService.ts` - implement WebSocket connection

### Step 3: Handle Authentication

The app stores JWT tokens in localStorage. Backend should:
- Return JWT token on successful login
- Validate JWT token on all protected endpoints
- Return 401 for invalid/expired tokens

**Frontend handles:**
- Storing token in localStorage
- Sending token in Authorization header (you may need to configure axios interceptor)
- Redirecting to login on 401 errors

### Step 4: WebSocket Integration

Update `QueueService.ts` to connect to your WebSocket server:

```typescript
this.ws = new WebSocket(`${WS_BASE_URL}/queue`);

this.ws.onmessage = (event) => {
  const items: QueueItem[] = JSON.parse(event.data);
  this.notifyListeners(items);
};
```

---

## API Documentation

See `API_DOCUMENTATION.md` for complete API endpoint specifications including:
- Request/response formats
- Authentication requirements
- Error handling
- WebSocket message formats

---

## Environment Variables

| Variable | Description | Example |
|----------|-------------|---------|
| `VITE_API_BASE_URL` | Backend API base URL | `http://localhost:3000/api` |
| `VITE_WS_BASE_URL` | WebSocket server URL | `ws://localhost:3000` |
| `VITE_APP_ENV` | Environment mode | `development` or `production` |
| `VITE_DEBUG` | Enable debug logging | `true` or `false` |

**Note:** Vite requires environment variables to be prefixed with `VITE_` to be exposed to the client.

---

## Adding Axios Interceptors (Recommended)

To automatically attach JWT tokens to all requests, add an axios interceptor:

```typescript
// src/lib/axios.ts (create this file)
import axios from 'axios';
import AuthService from '@/services/AuthService';

const axiosInstance = axios.create({
  baseURL: import.meta.env.VITE_API_BASE_URL,
});

// Request interceptor - add auth token
axiosInstance.interceptors.request.use(
  (config) => {
    const token = AuthService.getToken();
    if (token) {
      config.headers.Authorization = `Bearer ${token}`;
    }
    return config;
  },
  (error) => Promise.reject(error)
);

// Response interceptor - handle auth errors
axiosInstance.interceptors.response.use(
  (response) => response,
  (error) => {
    if (error.response?.status === 401) {
      AuthService.logout();
      window.location.href = '/login';
    }
    return Promise.reject(error);
  }
);

export default axiosInstance;
```

Then use this instance instead of importing axios directly in service files.

---

## Testing

### Manual Testing Checklist

- [ ] Login with valid credentials
- [ ] Login with invalid credentials (should show error)
- [ ] Dashboard loads stats and charts
- [ ] Case list displays and filters work
- [ ] Case details page shows complete information
- [ ] Real-time queue updates (WebSocket)
- [ ] Feedback submission works
- [ ] Settings can be saved
- [ ] Logout redirects to login page
- [ ] Protected routes require authentication

### Running Tests

```bash
# Install testing dependencies (if adding tests later)
npm install -D vitest @testing-library/react @testing-library/jest-dom

# Run tests
npm run test
```

---

## Common Issues & Solutions

### CORS Errors
**Problem:** Browser blocks API requests  
**Solution:** Configure CORS on backend to allow frontend domain

### WebSocket Connection Failed
**Problem:** WebSocket connection refused  
**Solution:** Ensure WebSocket server is running and URL is correct

### Authentication Not Persisting
**Problem:** User logged out on page refresh  
**Solution:** Check if JWT token is being stored in localStorage correctly

### Build Errors
**Problem:** TypeScript errors during build  
**Solution:** Ensure all types match between frontend and backend API responses

---

## Deployment

### Frontend Deployment

1. Build the production bundle:
   ```bash
   npm run build
   ```

2. Deploy the `dist/` folder to your hosting service (Vercel, Netlify, etc.)

3. Set environment variables in your hosting platform:
   - `VITE_API_BASE_URL` = Your production API URL
   - `VITE_WS_BASE_URL` = Your production WebSocket URL

### Backend Requirements

- CORS enabled for frontend domain
- HTTPS recommended for production
- WSS (secure WebSocket) for production WebSocket connections
- JWT token expiration handling
- Rate limiting on sensitive endpoints

---

## Next Steps

1. Review `API_DOCUMENTATION.md` for complete endpoint specifications
2. Set up your backend server with required endpoints
3. Replace mock implementations in service files
4. Test each feature thoroughly
5. Deploy to production

---

## Support & Resources

- **API Docs**: See `API_DOCUMENTATION.md`
- **TypeScript Types**: All types defined in `src/types/`
- **UI Components**: Built with [Shadcn/ui](https://ui.shadcn.com/)
- **Tailwind**: [Tailwind CSS Docs](https://tailwindcss.com/docs)

---

## Questions?

If you encounter issues during integration:
1. Check the browser console for errors
2. Verify API endpoint URLs are correct
3. Ensure request/response formats match API documentation
4. Check CORS configuration on backend
5. Verify JWT token is being sent correctly

Good luck with the integration! 🚀
