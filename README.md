# m3terscan

A web-based explorer for meters on the **M3tering Protocol** — a platform (blockchain + APIs) for interacting with on-chain metering devices.

---

## 🚀 Project Overview

`m3terscan` is a full stack app built with **React Router (formerly Remix)** that lets users:

- View a list of registered meters on the M3tering network
- Explore individual meter details
- Navigate on-chain meter metadata and usage data
- Serve as a frontend interface to the M3tering ecosystem

This repo contains the client application and its build/deployment configuration.

---

## 🧠 Key Concepts

- **M3tering Protocol** — A protocol where metering devices (NFTs representing real-world energy meters) publish cryptographically signed readings to a blockchain.
- **Explorer UI** — This project consumes M3tering API data to display meter details, search, and navigation in a user-friendly way.

---

## 📦 Technology Stack

- **React** with TypeScript
- **Vite** for development & build tooling
- **TailwindCSS** for styling
- **Docker** support included for containerized builds
- **Bun** a runtime for first class typescript support in development and production

---

## 📍 Features

| Feature | Description |
|---|---|
| Meter listing | Browse all available meters on the protocol |
| Search & filter | Find meters by ID or metadata |
| Meter detail view | View individual meter properties and on-chain stats |
| Responsive UI | Optimized for desktop and mobile |

The app connects to the M3tering API and blockchain data sources to retrieve this information.

---

## 🛠️ Setup & Installation

Make sure you have **Bun 1.3.3+** installed.

**1. Clone the repository**

```bash
git clone https://github.com/michaelchristwin/m3terscan.git
cd m3terscan
```

**2. Install dependencies**

```bash
bun install
# or
npm install
# or
pnpm install
```

**3. Run locally**

```bash
bun run dev
```

The development server will start at `http://localhost:5173` by default.

---

## 📦 Build

To start in production:

```bash
bun run start
```

Generated assets will be placed in the `dist/` folder.

---

## 🐳 Docker (Optional)

Build and run using Docker:

```bash
docker build -t m3terscan .
docker run -p 3000:3000 m3terscan
```

---

## 📁 Project Structure

```
├── app/               # React app source
├── public/            # Static assets
├── package.json
├── tsconfig.json
├── vite.config.ts
├── Dockerfile         # Optional container config
└── README.md
```

---

## ⚙️ Environment & Configuration

If required, environment variables such as API base URLs or GraphQL endpoints can be added to `.env` files and referenced in the code.

---

## 📌 Deployment

You can host the built site on any static host. Simply point the host to the `dist/` directory after building.

- [Vercel](https://vercel.com)
- [Netlify](https://netlify.com)
- [Cloudflare Pages](https://pages.cloudflare.com)
- [GitHub Pages](https://pages.github.com)

---

## 🧪 Contributing

1. Fork the project
2. Create a branch (`feature/my-feature`)
3. Commit your changes & push
4. Open a Pull Request
