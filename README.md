# Nuru Coaching Auth Portal

An elegant, editorial-inspired authentication portal designed for Nuru Coaching. This application provides a sophisticated user experience for logging in, signing up, and managing account access.

## Features

- **Custom Backend Ready**: Pre-architected to connect with your own API for authentication and user management.
- **Modern Editorial Aesthetic**: High-contrast design with a teal-and-white palette (`#105554`), serif typography, and curated imagery.
- **Authentication Suite**:
  - Email/Password Login & Signup.
  - Social Login placeholders (Google & Facebook).
  - Password Reset flow.
- **Security First**: 
  - Real-time password strength indicator (Entropy Score).
  - Character limits (6-15) enforced on password fields.
  - Token-based session management (Bearer Token).
- **Responsive Design**: Fluid layout that adapts seamlessly from ultra-wide desktops to mobile devices.
- **Motion UI**: Smooth transitions and stagger animations using `motion/react` for a premium feel.

## Tech Stack

- **Framework**: React 18+ with Vite
- **Styling**: Tailwind CSS
- **Animations**: Motion (formerly Framer Motion)
- **API Communication**: Fetch API (Bearer Token Auth)
- **Icons**: Lucide React
- **Typography**: Playfair Display (Serif) & Inter (Sans-serif)

## Getting Started

### Prerequisites

- Node.js (v18 or higher)
- A custom backend API (Node.js, Python, Go, etc.)

### Installation

1. Clone the repository (once exported to GitHub):
   ```bash
   git clone <your-repo-url>
   cd nuru-coaching-auth
   ```

2. Install dependencies:
   ```bash
   npm install
   ```

3. Configure Backend:
   Create a `.env` file in the root directory and add your API URL:
   ```env
   VITE_API_URL=https://your-api-endpoint.com
   ```

4. Start the development server:
   ```bash
   npm run dev
   ```

## Custom Backend Integration

The app uses a modular API service located in `src/lib/api.ts`. You can easily adjust the endpoints and request/response structures to match your backend.

Expected Endpoints:
- `POST /auth/login`: `{ email, password }` -> `{ user, token }`
- `POST /auth/signup`: `{ email, password, name }` -> `{ user, token }`
- `POST /auth/reset-password`: `{ email }` -> `void`
- `GET /auth/me`: `headers: { Authorization: Bearer <token> }` -> `{ user }`

## Design System

- **Primary Color**: `#105554` (Nuru Teal)
- **Background**: `#FFFFFF`
- **Typography**: 
  - Headlines: `Playfair Display`
  - Body/UI: `Inter`
- **Components**: Rounded inputs (full radius), rounded-full buttons, and bento-inspired card layout.

## Deployment

To deploy this application, you can use the built-in Cloud Run deployment in Google AI Studio or export the code to your preferred static hosting provider like Vercel, Netlify, or Firebase Hosting.

---

*Crafted with precision for the Nuru Collective &copy; 2026*
