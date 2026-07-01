import { Header } from "@/components/header"
import Image from "next/image"
import Link from "next/link"
import {
  KeyRound,
  Server,
  Database,
  ShieldCheck,
  KeySquare,
  Container,
  ArrowRight,
} from "lucide-react"

const features = [
  {
    icon: KeyRound,
    title: "JWT Authentication",
    description: "Credentials-based auth via NextAuth v5. Login and registration payloads are AES-256-CBC encrypted client-side before transmission. The backend decrypts, validates, and returns a signed JWT containing the user id, username, and role.",
    label: "NextAuth v5 / python-jose",
  },
  {
    icon: Server,
    title: "FastAPI Backend",
    description: "Async Python API built on FastAPI with Pydantic v2 validation, SQLAlchemy 2.0 session management, and structured route registration. Includes auth, health, user, and API client management endpoints.",
    label: "FastAPI / SQLAlchemy / Pydantic",
  },
  {
    icon: Database,
    title: "Dual Database Support",
    description: "Ships with SQLite out of the box — zero config, file-backed, persistent via Docker volume. Switch to MongoDB by setting DATABASE_TYPE=mongo. Both backends implement the same interface.",
    label: "SQLite / MongoDB (Motor)",
  },
  {
    icon: ShieldCheck,
    title: "Role-Based Access Control",
    description: "Three roles: admin, user, and guest. The role is embedded in the JWT and enforced at the backend route level and frontend route/component level independently.",
    label: "3-tier RBAC / Stateless",
  },
  {
    icon: KeySquare,
    title: "API Key Authentication",
    description: "Beyond user sessions, the backend supports machine-to-machine auth via X-API-Key and X-API-Secret headers. API clients are stored with a bcrypt-hashed secret and a configurable rate limit.",
    label: "API Key / Secret / bcrypt",
  },
  {
    icon: Container,
    title: "Docker Compose Stack",
    description: "Frontend, backend, and an optional nginx reverse proxy with SSL are all defined in docker-compose.yml. Configure your .env and run docker compose up for the full stack.",
    label: "Docker / nginx / SSL optional",
  },
]

export default function Landing() {
  return (
    <div className="min-h-screen bg-white text-zinc-900 dark:bg-zinc-950 dark:text-zinc-100">
      <Header />

      {/* Hero */}
      <section className="relative overflow-hidden">
        <div className="pointer-events-none absolute inset-0 [background:radial-gradient(circle_at_50%_-10%,var(--color-indigo-100),transparent_55%)] dark:[background:radial-gradient(circle_at_50%_-10%,color-mix(in_oklch,var(--color-indigo-950)_60%,transparent),transparent_55%)]" />
        <div className="pointer-events-none absolute inset-0 bg-[linear-gradient(to_right,#80808012_1px,transparent_1px),linear-gradient(to_bottom,#80808012_1px,transparent_1px)] bg-size-[32px_32px] mask-[radial-gradient(ellipse_60%_50%_at_50%_0%,black,transparent)]" />

        <div className="relative mx-auto flex max-w-5xl flex-col items-center gap-8 px-6 py-28 text-center">
          <div className="relative h-20 w-20">
            <Image src="/logo_transparent.png" alt="NextAPI" fill style={{ objectFit: "contain" }} priority />
          </div>

          <div className="inline-flex items-center gap-2 rounded-full border border-zinc-200 bg-white/80 px-3 py-1 text-xs font-medium text-zinc-600 backdrop-blur-sm dark:border-zinc-800 dark:bg-zinc-900/80 dark:text-zinc-400">
            <span className="flex h-1.5 w-1.5 rounded-full bg-emerald-500" />
            Full-stack framework boilerplate
          </div>

          <h1 className="max-w-2xl text-4xl font-bold tracking-tight text-balance sm:text-5xl">
            Ship a secure full-stack app without rebuilding auth from scratch.
          </h1>

          <p className="max-w-2xl text-base leading-relaxed text-zinc-500 dark:text-zinc-400">
            NextAPI pairs a FastAPI backend with a Next.js frontend — JWT authentication, AES-256-CBC payload
            encryption, three-tier RBAC, dual database support, API key management, rate limiting, and a fully
            containerised Docker Compose setup. The architecture is in place; you extend from here.
          </p>

          <div className="flex flex-wrap items-center justify-center gap-3 pt-2">
            <Link
              href="/register"
              className="group inline-flex items-center gap-1.5 rounded-lg bg-zinc-900 px-6 py-2.5 text-sm font-semibold text-white shadow-sm transition hover:bg-zinc-800 dark:bg-white dark:text-zinc-900 dark:hover:bg-zinc-200"
            >
              Get Started
              <ArrowRight className="h-3.5 w-3.5 transition-transform group-hover:translate-x-0.5" />
            </Link>
            <Link
              href="/login"
              className="rounded-lg border border-zinc-200 px-6 py-2.5 text-sm font-semibold text-zinc-700 transition hover:bg-zinc-50 dark:border-zinc-800 dark:text-zinc-300 dark:hover:bg-zinc-900"
            >
              Sign In
            </Link>
          </div>
        </div>
      </section>

      {/* Features */}
      <section className="mx-auto max-w-5xl px-6 py-20">
        <div className="mb-12 text-center">
          <p className="text-xs font-semibold uppercase tracking-widest text-zinc-400">What&apos;s included</p>
          <h2 className="mt-2 text-2xl font-bold tracking-tight">Everything wired up, nothing locked in</h2>
        </div>

        <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
          {features.map((f) => (
            <div
              key={f.title}
              className="group rounded-xl border border-zinc-200 bg-white p-6 transition hover:border-zinc-300 hover:shadow-sm dark:border-zinc-800 dark:bg-zinc-900/40 dark:hover:border-zinc-700"
            >
              <div className="mb-4 flex h-10 w-10 items-center justify-center rounded-lg bg-zinc-100 text-zinc-700 transition group-hover:bg-zinc-900 group-hover:text-white dark:bg-zinc-800 dark:text-zinc-300 dark:group-hover:bg-white dark:group-hover:text-zinc-900">
                <f.icon className="h-5 w-5" />
              </div>
              <h3 className="font-semibold text-zinc-900 dark:text-zinc-100">{f.title}</h3>
              <p className="mt-2 text-sm leading-relaxed text-zinc-500 dark:text-zinc-400">{f.description}</p>
              <span className="mt-4 inline-block rounded-md bg-zinc-50 px-2 py-0.5 font-mono text-xs text-zinc-500 dark:bg-zinc-800/60 dark:text-zinc-400">
                {f.label}
              </span>
            </div>
          ))}
        </div>
      </section>

      <footer className="border-t border-zinc-200 py-8 text-center text-xs tracking-wide text-zinc-400 dark:border-zinc-800">
        NextAPI — open boilerplate for developers
      </footer>
    </div>
  )
}
