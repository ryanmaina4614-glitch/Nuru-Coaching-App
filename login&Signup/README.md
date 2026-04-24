Nuru Coaching Auth Portal
An elegant, editorial-inspired authentication portal designed for Nuru Coaching. This application provides a sophisticated user experience for logging in, signing up, and managing account access.

Features
Modern Editorial Aesthetic: High-contrast design with a teal-and-white palette (#105554), serif typography, and curated imagery.
Firebase Integration: Full authentication suite using Firebase Auth.
Email/Password Login & Signup.
Social Login (Google & Facebook).
Password Reset flow.
Security First:
Real-time password strength indicator (Entropy Score).
Character limits (6-15) enforced on password fields.
Secure session management.
Responsive Design: Fluid layout that adapts seamlessly from ultra-wide desktops to mobile devices.
Motion UI: Smooth transitions and stagger animations using motion/react for a premium feel.
Tech Stack
Framework: React 18+ with Vite
Styling: Tailwind CSS
Animations: Motion (formerly Framer Motion)
Database/Auth: Firebase
Icons: Lucide React
Typography: Playfair Display (Serif) & Inter (Sans-serif)
Getting Started
Prerequisites
Node.js (v18 or higher)
A Firebase Project
Installation
Clone the repository (once exported to GitHub):

git clone <your-repo-url>
cd nuru-coaching-auth
Install dependencies:

npm install
Configure Firebase: Update firebase-applet-config.json with your Firebase project credentials.

Start the development server:

npm run dev
Design System
Primary Color: #105554 (Nuru Teal)
Background: #FFFFFF
Typography:
Headlines: Playfair Display
Body/UI: Inter
Components: Rounded inputs (full radius), rounded-full buttons, and bento-inspired card layout.
Deployment
To deploy this application, you can use the built-in Cloud Run deployment in Google AI Studio or export the code to your preferred static hosting provider like Vercel, Netlify, or Firebase Hosting.

Crafted with precision for the Nuru Collective © 2026