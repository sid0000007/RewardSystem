# 🎁 RealMint - Earn & Collect Reward

A modern web-based reward experience where users unlock digital tokens by completing real-world tasks. Built with Next.js 15, TypeScript, and Tailwind CSS, RealMint simulates a gamified system where physical actions like checking in at locations, watching content, or scanning codes are tracked and rewarded.

## 🛠️ Tech Stack

### Core Technologies

- **Next.js 15** - React framework with App Router
- **TypeScript** - Type-safe JavaScript
- **Tailwind CSS 4** - Utility-first CSS framework
- **React 19** - Latest React with concurrent features

### UI & Animation

- **Framer Motion** - Smooth animations and transitions
- **Radix UI** - Accessible component primitives
- **Lucide React** - Beautiful icons
- **Sonner** - Toast notifications

### State Management & Data

- **Zustand** - Lightweight state management
- **React Hook Form** - Form handling with validation
- **Zod** - Schema validation
- **UUID** - Unique identifier generation

### Audio & Media

- **use-sound** - Audio playback for reward sounds
- **HTML5 Video API** - Video progress tracking

### Development Tools

- **ESLint** - Code linting
- **PostCSS** - CSS processing
- **next-themes** - Dark/light theme support

## 🚀 Setup Guide

### Prerequisites

- Node.js 18+
- npm or yarn package manager

### Step 1: Clone the Repository

```bash
git clone https://github.com/sid0000007/RewardSystem
cd RealMint
```

### Alternative: Setup from ZIP File

If you have downloaded the project as a ZIP file:

1. **Extract the ZIP file**

   ```bash
   # Extract to your desired directory
   unzip RealMint.zip
   cd RealMint
   ```

2. **Verify the project structure**
   ```bash
   # Check if all files are present
   ls -la
   # Should show: app/, components/, package.json, etc.
   ```

### Step 2: Install Dependencies

```bash
npm install
# or
yarn install
```

### Step 3: Run Development Server

```bash
npm run dev
# or
yarn dev
```

### Step 4: Open Your Browser

Navigate to [http://localhost:3000](http://localhost:3000) to see the application.

### Step 5: Build for Production

```bash
npm run build
npm start
```

## ✨ Features

### 🎯 Core Reward Actions

- **QR Code Scanning** - Scan product codes to unlock instant rewards
- **Video Watching** - Watch videos for 15+ seconds to earn tokens
- **Location Check-in** - Visit specific locations to collect rewards

### 💰 Wallet System

- **Persistent Storage** - Rewards saved in localStorage across sessions
- **Reward History** - Track all earned rewards with timestamps
- **Multiple Rewards** - Collect multiple instances of the same reward
- **Wallet Reset** - Option to reset wallet and start fresh

### 🎨 User Experience

- **Dark/Light Theme** - Toggle between themes
- **Sound Effects** - Audio feedback for actions and rewards
- **Animations** - Smooth transitions and micro-interactions
- **Progress Tracking** - Visual progress indicators
- **Cooldown System** - Prevent spam with time-based restrictions

### 📱 Responsive Design

- **Mobile-First** - Optimized for all screen sizes
- **Touch-Friendly** - Gesture support for mobile devices
- **Accessible** - WCAG compliant components

## 📄 Pages in Project

### 🏠 Dashboard (`/dashboard`)

- **Main Hub** - Central navigation to all features
- **Action Cards** - Quick access to scanning, watching, and check-in
- **Welcome Section** - User onboarding and instructions
- **Theme Toggle** - Switch between light and dark modes

### 📦 Product Scanner (`/product`)

- **QR Code Scanner** - Camera-based code scanning
- **Manual Code Entry** - Type codes manually for testing
- **Product Catalog** - Browse available snack products
- **Scan History** - Track all previous scans
- **Reward Animation** - Celebrate successful scans

### 🎥 Video Watcher (`/watch`)

- **Video Library** - Collection of educational videos
- **Progress Tracking** - Monitor 15-second watch requirement
- **Reward Unlocking** - Earn tokens after minimum watch time
- **Video History** - Track watched videos and rewards earned

### 📍 Location Check-in (`/checkin`)

- **Geolocation** - Use browser location services
- **Nearby Locations** - Display check-in opportunities
- **Distance Calculation** - Show proximity to venues
- **Check-in Rewards** - Earn tokens for location visits

### 💼 Wallet (`/wallet`)

- **Reward Collection** - View all earned tokens and badges
- **Metadata Display** - Time earned, earning method, icons
- **Wallet Reset** - Clear all rewards option
- **Export Data** - Download wallet data

### 👤 Profile (`/profile`)

- **User Information** - Customize profile details
- **Statistics** - Track total rewards and achievements
- **Preferences** - Sound, theme, and notification settings

### 📊 Documentation (`/docs`)

- **Project Information** - Learn about RealMint
- **How It Works** - Explanation of reward mechanics-

## 🎮 How It Works

1. **Choose an Action** - Select from scanning, watching, or checking in
2. **Complete the Task** - Follow the specific requirements for each action
3. **Earn Rewards** - Receive digital tokens and badges
4. **Track Progress** - View your collection in the wallet
5. **Repeat** - Continue earning more rewards

## 🔧 Development

### Project Structure

```
RealMint/
├── app/                 # Next.js App Router pages
├── components/          # Reusable UI components
│   ├── actions/        # Action-specific components
│   └── ui/            # Base UI components
├── hooks/              # Custom React hooks
├── lib/                # Utility functions
├── data/               # Static data and configurations
├── types/              # TypeScript type definitions
└── public/             # Static assets
```

### Key Components

- **CodeScanner** - QR code scanning and validation
- **VideoWatcher** - Video progress tracking
- **LocationChecker** - Geolocation and check-in logic
- **WalletView** - Reward display and management
- **RewardAnimation** - Celebration animations

## 🚀 Deployment

The project is ready for deployment on:

- **Vercel** (recommended for Next.js)
- Any static hosting service
