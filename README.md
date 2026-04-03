# CINT Lab Website

The CINT Lab Website, built with [Next.js](https://nextjs.org/) and Tailwind CSS.

## 🚀 Getting Started

This project is a React-based Next.js application. Node.js is required to run this project.

### 1. Install Dependencies

First, ensure you have [Node.js](https://nodejs.org/) installed on your system.
Then, install the project dependencies by running:

```bash
npm install
```
*(Note for teammates: Since this is a Node.js project, dependencies are managed in `package.json` and not via a Python `requirements.txt`)*

### 2. Run the Development Server

Start the local development server:

```bash
npm run dev
```

Open [http://localhost:3000](http://localhost:3000) with your browser to see the website. The page will auto-update as you edit the files in the `src/` directory.

## 📁 Project Structure

- `src/app/`: Contains the main application routes (`/contact`, `/publications`, `/research`, `/team`, etc.) and page layouts.
- `src/components/`: Reusable React frontend components (e.g., `navbar.jsx`).
- `src/data/`: Static JSON data files (e.g., `team.json`).
- `public/`: Static assets such as images and icons.

## 🛠️ Tech Stack

- **Framework**: [Next.js](https://nextjs.org/) (React 19)
- **Styling**: [Tailwind CSS v4](https://tailwindcss.com/)
- **Linting**: ESLint

## 📝 Scripts

- `npm run dev`: Starts the development server.
- `npm run build`: Creates an optimized production build.
- `npm run start`: Starts the production server (after building).
- `npm run lint`: Runs ESLint for code formatting and standard checks.
