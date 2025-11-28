# AfriGuard Verify - Frontend Dashboard

WhatsApp-first deepfake detection system with AI-powered analysis for images, videos, and audio.

## 🚀 Quick Start

```bash
# Install dependencies
npm install

# Copy environment variables
cp .env.example .env

# Start development server
npm run dev
```

## 📚 Documentation

- **[Developer Setup Guide](DEVELOPER_SETUP.md)** - Complete setup and integration instructions
- **[API Documentation](API_DOCUMENTATION.md)** - Backend API specifications and endpoints
- **[Lovable Project](https://lovable.dev/projects/ac5aeb2b-5a60-47b5-ba2a-d946eb88a212)** - Edit via Lovable platform

## 🛠️ Tech Stack

- React 18 + TypeScript
- Vite (Build tool)
- Tailwind CSS (Styling)
- Shadcn/ui (UI components)
- React Router v6 (Routing)
- TanStack Query (Data fetching)
- Recharts (Data visualization)
- Axios (HTTP client)

## 📁 Project Structure

```
src/
├── components/     # Reusable UI components
├── pages/         # Page components (routes)
├── services/      # API service layer (BACKEND INTEGRATION HERE)
├── types/         # TypeScript type definitions
├── hooks/         # Custom React hooks
└── lib/           # Utility functions
```

## 🔧 Available Scripts

```bash
npm run dev        # Start development server
npm run build      # Build for production
npm run preview    # Preview production build
npm run lint       # Run ESLint
```

## 🌐 Environment Variables

See `.env.example` for required environment variables.

## 📖 Features

- 🔐 Authentication with JWT
- 📊 Real-time analytics dashboard
- 📝 Case management with filtering
- 🔄 Live queue monitoring (WebSocket)
- 💬 User feedback system
- ⚙️ Customizable settings
- 📱 Fully responsive design

## 🔌 Backend Integration

The frontend is ready for backend integration. All API calls are centralized in `src/services/`:

- `AuthService.ts` - Authentication
- `CaseService.ts` - Case management
- `FeedbackService.ts` - User feedback
- `QueueService.ts` - Real-time queue

See **[API_DOCUMENTATION.md](API_DOCUMENTATION.md)** for endpoint specifications.

## 🚢 Deployment

### Option 1: Deploy via Lovable
Simply open [Lovable](https://lovable.dev/projects/ac5aeb2b-5a60-47b5-ba2a-d946eb88a212) and click Share → Publish.

### Option 2: Manual Deployment
```bash
npm run build
# Deploy the dist/ folder to your hosting service
```

### Option 3: GitHub Integration
1. Connect to GitHub via Lovable
2. Enable automatic deployments on your hosting platform
3. Changes sync automatically

## 📝 License

This project was created with [Lovable](https://lovable.dev).
