# Racket UM6P - Frontend Platform

A comprehensive web platform for managing racket-sport clubs at UM6P, developed as a final project for the 1337 curriculum. 

This repository contains the **frontend** application. It is designed to interface with the project's NestJS, PostgreSQL, and Docker backend architecture to handle club management, ranked matches, and real-time notifications.

## 🚀 Tech Stack

*   **Framework:** Next.js (App Router)
*   **Language:** TypeScript
*   **Styling:** Tailwind CSS
*   **Performance:** React Compiler (Enabled)
*   **Linting:** ESLint
*   **Containerization:** Docker
*   **Architecture:** `src` directory structure

## 🎯 Platform Features

Racket UM6P supports the complete lifecycle of university racket sports, featuring distinct flows for different user access levels:

*   **Role-Based Dashboards:** Customized interfaces for Visitors, Members, Leaders, and Coaches.
*   **Club Management:** Tools to organize, schedule, and oversee club sessions.
*   **Ranked Matches:** Competitive matchmaking, score tracking, and leaderboards.
*   **System Notifications:** Updates for match schedules, club announcements, and administrative alerts.

## 📁 Project Structure

This project utilizes the `src` directory to separate application source code from configuration files at the root level.

```text
racket-um6p-frontend/
├── src/
│   ├── app/            # Next.js App Router (pages, layouts, loading, error states)
│   │   ├── globals.css # Global stylesheets and Tailwind directives
│   │   ├── layout.tsx  # Root layout
│   │   └── page.tsx    # Homepage (Visitor view)
│   ├── components/     # Reusable UI components (buttons, cards, forms)
│   ├── lib/            # Utility functions and shared logic
│   ├── hooks/          # Custom React hooks
│   └── types/          # Global TypeScript interfaces and type definitions
├── public/             # Static assets (images, icons, fonts)
├── Dockerfile          # Docker configuration for building the image
├── .dockerignore       # Files to ignore during Docker build
├── .eslintrc.json      # ESLint configuration
├── next.config.mjs     # Next.js configuration (React Compiler enabled)
├── tailwind.config.ts  # Tailwind CSS configuration
└── tsconfig.json       # TypeScript configuration
```

## 🛠️ Getting Started

### Prerequisites

Ensure you have the following installed before setting up the project:
*   Node.js (v18.17 or later recommended) and your preferred package manager (npm, yarn, pnpm, bun)
*   **Docker** (if running via containers)
*   The backend NestJS API running locally or accessible via Docker.

### Local Development Setup

1. Clone the repository:
   ```bash
   git clone <repository-url> frontend
   cd frontend
   ```

2. Install dependencies:
   ```bash
   npm install
   ```

3. Configure your environment variables. Create a `.env.local` file in the root directory:
   ```env
   NEXT_PUBLIC_API_URL=http://localhost:3000/api
   ```

4. Start the development server:
   ```bash
   npm run dev
   ```

5. Open [http://localhost:3000](http://localhost:3000) with your browser.

### 🐳 Docker Setup

You can also run the frontend entirely within a Docker container.

1. Build the Docker image:
   ```bash
   docker build -t racket-um6p-frontend .
   ```

2. Run the container:
   ```bash
   docker run -p 3000:3000 racket-um6p-frontend
   ```
   *Note: If you need to pass environment variables to the container, use the `-e` flag (e.g., `-e NEXT_PUBLIC_API_URL=http://localhost:3000/api`).*

## ⚙️ Configuration Notes

*   **React Compiler:** This project utilizes the experimental React Compiler. Ensure your components follow strict React rules to benefit from automatic memoization without manual `useMemo` or `useCallback` hooks.
*   **Routing:** All routes are defined inside the `src/app` directory. Folders define routes, and `page.tsx` files make them publicly accessible.

## 🤝 Development & Collaboration

When contributing to this phase of the project:
*   Ensure all new components are strictly typed with TypeScript.
*   Run `npm run lint` before committing to catch ESLint warnings.
*   Keep styling strictly within Tailwind utility classes where possible to maintain design consistency across the platform.