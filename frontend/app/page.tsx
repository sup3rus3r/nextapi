import { Header } from "@/components/header"
import Image from "next/image"
import Link from "next/link"

const features = [
  {
    title: "JWT Authentication",
    description: "Credentials-based auth via NextAuth v5. Login and registration payloads are AES-256-CBC encrypted client-side before transmission. The backend decrypts, validates, and returns a signed JWT containing the user id, username, and role. Token expiry and algorithm are configurable via environment variables.",
    label: "NextAuth v5 / python-jose",
  },
  {
    title: "FastAPI Backend",
    description: "Async Python API built on FastAPI with Pydantic v2 validation, SQLAlchemy 2.0 session management, and structured route registration. Includes /auth/register, /auth/login, /health, /get_user_details, /user/toggle-role, and full API client management endpoints.",
    label: "FastAPI / SQLAlchemy / Pydantic",
  },
  {
    title: "Dual Database Support",
    description: "Ships with SQLite out of the box - zero config, file-backed, persistent via Docker volume. Switch to MongoDB by setting DATABASE_TYPE=mongo in your .env. Both backends implement the same interface so switching does not require route changes.",
    label: "SQLite / MongoDB (Motor)",
  },
  {
    title: "Role-Based Access Control",
    description: "Three roles: admin, user, and guest. The role is embedded in the JWT and enforced at the backend route level and frontend route/component level independently. Route config in config/routes.ts drives both the middleware guards and the conditional UI rendering.",
    label: "3-tier RBAC / Stateless",
  },
  {
    title: "API Key Authentication",
    description: "Beyond user sessions, the backend supports machine-to-machine auth via X-API-Key and X-API-Secret headers. API clients are created per user, stored with a bcrypt-hashed secret, and subject to their own configurable rate limit (default 100 req/min).",
    label: "API Key / Secret / bcrypt",
  },
  {
    title: "Docker Compose Stack",
    description: "Frontend, backend, and an optional nginx reverse proxy with SSL are all defined in docker-compose.yml. The backend SQLite database is persisted via a named volume. Configure your .env and run docker compose up to have the full stack running.",
    label: "Docker / nginx / SSL optional",
  },
]

export default function Landing() {
  return (
    <div className="min-h-screen bg-white dark:bg-zinc-950 text-zinc-900 dark:text-zinc-100">
      <Header />

      <section className="mx-auto flex max-w-5xl flex-col items-center gap-10 px-6 py-24 text-center">
        <div className="relative w-44 h-44">
          <Image src="/logo_transparent.png" alt="NextAPI" fill style={{ objectFit: "contain" }} priority />
        </div>

        <div className="space-y-4 max-w-3xl">
          <p className="text-xs font-semibold uppercase tracking-widest text-zinc-400">Full-Stack Framework Boilerplate</p>
          <p className="text-base leading-relaxed text-zinc-500 dark:text-zinc-400">
            NextAPI is an opinionated full-stack boilerplate combining a FastAPI backend and Next.js frontend.
            It ships with JWT authentication, AES-256-CBC payload encryption, three-tier RBAC, dual database support (SQLite or MongoDB),
            API key management, rate limiting, and a fully containerised Docker Compose setup.
            It is a starting point - the architecture and patterns are in place, you extend from here.
          </p>
        </div>

        <div className="flex items-center gap-3">
          <Link
            href="/register"
            className="rounded border border-blue-600 bg-blue-600 px-8 py-2.5 text-sm font-semibold text-white transition hover:bg-blue-700"
          >
            Get Started
          </Link>
          <Link
            href="/login"
            className="rounded border border-zinc-300 dark:border-zinc-700 px-8 py-2.5 text-sm font-semibold text-zinc-700 dark:text-zinc-300 transition hover:bg-zinc-100 dark:hover:bg-zinc-900"
          >
            Sign In
          </Link>
        </div>
      </section>

      <div className="mx-auto max-w-5xl border-t border-zinc-200 dark:border-zinc-800" />

      <section className="mx-auto max-w-5xl px-6 py-20">
        <p className="mb-10 text-xs font-semibold uppercase tracking-widest text-zinc-400">What is included</p>
        <div className="grid gap-px border border-zinc-200 dark:border-zinc-800 sm:grid-cols-2 lg:grid-cols-3">
          {features.map((f) => (
            <div
              key={f.title}
              className="bg-white dark:bg-zinc-950 p-8 space-y-3 hover:bg-zinc-50 dark:hover:bg-zinc-900 transition"
            >
              <span className="inline-block rounded-sm bg-zinc-100 dark:bg-zinc-800 px-2 py-0.5 text-xs font-mono text-zinc-500 dark:text-zinc-400">
                {f.label}
              </span>
              <h3 className="font-semibold text-zinc-900 dark:text-zinc-100">{f.title}</h3>
              <p className="text-sm leading-relaxed text-zinc-500 dark:text-zinc-400">{f.description}</p>
            </div>
          ))}
        </div>
      </section>

      <footer className="border-t border-zinc-200 dark:border-zinc-800 py-8 text-center text-xs text-zinc-400 tracking-wide">
        NextAPI - open boilerplate for developers
      </footer>
    </div>
  )
}