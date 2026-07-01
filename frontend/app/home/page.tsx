'use client'
import { useEffect, useLayoutEffect, useState } from "react";
import { useSession, signOut } from "next-auth/react";
import { useRouter } from "next/navigation";
import { GetAPIStatus, GetUserInfo, ToggleUserRole } from "../api/os";
import { API_HEALTH, USER_DETAILS } from "@/types/os";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader } from "@/components/ui/card";
import Image from "next/image";
import Link from "next/link";
import { Routes, ProtectedRoutes, hasAccess } from "@/config/routes";
import {
  Activity,
  ShieldCheck,
  UserCircle,
  KeyRound,
  ArrowUpRight,
  Lock,
  LogOut,
  RefreshCw,
  CheckCircle2,
  XCircle,
} from "lucide-react";

export default function Home() {
  const { data: session, status, update } = useSession();
  const router = useRouter();
  const [server_status, set_server_status]      = useState<API_HEALTH>({status: "checking..." })
  const [user_info    , set_user_info]          = useState<USER_DETAILS>({id: "", username :"guest", email: "", role: "", auth_type: ""})
  const [isToggling, setIsToggling] = useState(false);
  const userRole = session?.user?.role ?? 'guest'

 useLayoutEffect(() => {
    if (status === "unauthenticated") {
      router.push("/login");
    }
  }, [status, router]);

  useEffect(()=>{
    if (status !== "authenticated" || !session?.accessToken) return;

    const fetchStatus = async () => {
      const result = await GetAPIStatus(session.accessToken)
      set_server_status({ status: result?.status ?? "unavailable" })
    }


    fetchStatus()
  }, [status, session?.accessToken])

  if (status === "loading") {
    return (
      <div className="flex min-h-screen items-center justify-center bg-zinc-50 dark:bg-zinc-950">
        <div className="flex items-center gap-2 text-sm text-zinc-500">
          <RefreshCw className="h-4 w-4 animate-spin" />
          Loading...
        </div>
      </div>
    );
  }

  if (status === "unauthenticated") {
    return null;
  }

  const isHealthy = server_status.status === "ok" || server_status.status === "healthy";

  const handleToggleRole = async () => {
    setIsToggling(true);
    try {
      const result = await ToggleUserRole(session?.accessToken);
      if (result) {
        await update({
          role: result.user.role,
          accessToken: result.access_token,
        });
      } else {
        window.alert('Failed to toggle role');
      }
    } finally {
      setIsToggling(false);
    }
  };

  return (
    <div className="min-h-screen bg-zinc-50 dark:bg-zinc-950">
      {/* Top bar */}
      <header className="border-b border-zinc-200 bg-white dark:border-zinc-800 dark:bg-zinc-900">
        <div className="mx-auto flex h-16 max-w-5xl items-center justify-between px-6">
          <div className="relative h-15 w-24">
            <Image src="/logo_transparent.png" alt="NextAPI" fill className="object-contain object-left" priority />
          </div>
          <div className="flex items-center gap-3">
            <div className="flex items-center gap-2 rounded-full bg-zinc-100 py-1 pl-1 pr-3 dark:bg-zinc-800">
              <span className="flex h-6 w-6 items-center justify-center rounded-full bg-zinc-900 text-[11px] font-semibold text-white dark:bg-white dark:text-zinc-900">
                {(session?.user?.name ?? "?").slice(0, 1).toUpperCase()}
              </span>
              <span className="text-sm font-medium text-zinc-700 dark:text-zinc-300">{session?.user?.name}</span>
            </div>
            <Button
              onClick={() => signOut({ callbackUrl: "/login" })}
              variant="outline"
              size="sm"
              className="cursor-pointer gap-1.5"
            >
              <LogOut className="h-3.5 w-3.5" />
              Sign Out
            </Button>
          </div>
        </div>
      </header>

      <main className="mx-auto max-w-5xl px-6 py-10">
        <div className="mb-8">
          <h1 className="text-2xl font-bold tracking-tight text-zinc-900 dark:text-zinc-100">
            Welcome back, {session?.user?.name}
          </h1>
          <p className="mt-1 text-sm text-zinc-500 dark:text-zinc-400">
            Here&apos;s the current state of your session and the API.
          </p>
        </div>

        {/* Status cards */}
        <div className="grid gap-4 sm:grid-cols-3">
          <Card className="border-zinc-200 dark:border-zinc-800">
            <CardContent className="flex items-center gap-4 px-6">
              <span className={`flex h-10 w-10 shrink-0 items-center justify-center rounded-lg ${isHealthy ? "bg-emerald-100 text-emerald-700 dark:bg-emerald-900/40 dark:text-emerald-400" : "bg-amber-100 text-amber-700 dark:bg-amber-900/40 dark:text-amber-400"}`}>
                <Activity className="h-5 w-5" />
              </span>
              <div>
                <p className="text-xs font-medium uppercase tracking-wide text-zinc-400">Server Health</p>
                <p className="text-sm font-semibold text-zinc-900 dark:text-zinc-100">{server_status.status}</p>
              </div>
            </CardContent>
          </Card>

          <Card className="border-zinc-200 dark:border-zinc-800">
            <CardContent className="flex items-center gap-4 px-6">
              <span className="flex h-10 w-10 shrink-0 items-center justify-center rounded-lg bg-indigo-100 text-indigo-700 dark:bg-indigo-900/40 dark:text-indigo-400">
                <ShieldCheck className="h-5 w-5" />
              </span>
              <div>
                <p className="text-xs font-medium uppercase tracking-wide text-zinc-400">Role</p>
                <p className="text-sm font-semibold capitalize text-zinc-900 dark:text-zinc-100">{userRole}</p>
              </div>
            </CardContent>
          </Card>

          <Card className="border-zinc-200 dark:border-zinc-800">
            <CardContent className="flex items-center gap-4 px-6">
              <span className="flex h-10 w-10 shrink-0 items-center justify-center rounded-lg bg-zinc-100 text-zinc-700 dark:bg-zinc-800 dark:text-zinc-300">
                <UserCircle className="h-5 w-5" />
              </span>
              <div>
                <p className="text-xs font-medium uppercase tracking-wide text-zinc-400">User ID</p>
                <p className="truncate text-sm font-semibold text-zinc-900 dark:text-zinc-100" title={session?.user?.id}>
                  {session?.user?.id}
                </p>
              </div>
            </CardContent>
          </Card>
        </div>

        {/* RBAC test panel */}
        <Card className="mt-6 border-zinc-200 dark:border-zinc-800">
          <CardHeader className="px-6">
            <div className="flex items-center gap-2">
              <KeyRound className="h-4 w-4 text-zinc-400" />
              <h2 className="text-sm font-semibold text-zinc-900 dark:text-zinc-100">RBAC Test</h2>
            </div>
            <p className="text-xs text-zinc-500 dark:text-zinc-400">
              These buttons are gated by your current role — try toggling your role below.
            </p>
          </CardHeader>
          <CardContent className="flex flex-wrap gap-3 px-6">
            <Button
              variant="outline"
              className="cursor-pointer font-medium"
              disabled={!['admin'].includes(userRole)}
              onClick={()=>{
                window.alert(`${userRole} has clicked this button`)
              }}
            >
              Admin Button
            </Button>
            <Button
              variant="outline"
              className="cursor-pointer font-medium"
              disabled={!['guest','admin'].includes(userRole)}
              onClick={()=>{
                window.alert(`${userRole} has clicked this button`)
              }}
            >
              Guest Button
            </Button>
            <Button
              onClick={handleToggleRole}
              disabled={isToggling}
              variant="outline"
              className="cursor-pointer gap-1.5 font-medium"
            >
              <RefreshCw className={`h-3.5 w-3.5 ${isToggling ? "animate-spin" : ""}`} />
              Toggle Role (Current: {userRole})
            </Button>
          </CardContent>
        </Card>

        {/* Route access list */}
        <Card className="mt-6 border-zinc-200 dark:border-zinc-800">
          <CardHeader className="px-6">
            <div className="flex items-center gap-2">
              <Lock className="h-4 w-4 text-zinc-400" />
              <h2 className="text-sm font-semibold text-zinc-900 dark:text-zinc-100">Route Access</h2>
            </div>
            <p className="text-xs text-zinc-500 dark:text-zinc-400">
              Routes available based on your current role.
            </p>
          </CardHeader>
          <CardContent className="px-6">
            <div className="divide-y divide-zinc-100 dark:divide-zinc-800">
              {ProtectedRoutes.filter(route => route.path !== Routes.DASHBOARD).map((route) => {
                const canAccess = hasAccess(userRole, route.allowedRoles);
                return (
                  <div key={route.path} className="flex items-center justify-between py-3">
                    <div className="flex items-center gap-2.5">
                      {canAccess ? (
                        <CheckCircle2 className="h-4 w-4 shrink-0 text-emerald-600" />
                      ) : (
                        <XCircle className="h-4 w-4 shrink-0 text-zinc-300 dark:text-zinc-600" />
                      )}
                      <div>
                        {canAccess ? (
                          <Link
                            className="flex items-center gap-1 text-sm font-medium text-zinc-900 hover:text-indigo-600 dark:text-zinc-100 dark:hover:text-indigo-400"
                            href={route.path}
                          >
                            {route.label}
                            <ArrowUpRight className="h-3.5 w-3.5" />
                          </Link>
                        ) : (
                          <span className="text-sm font-medium text-zinc-400 dark:text-zinc-600">
                            {route.label}
                          </span>
                        )}
                        <p className="text-xs text-zinc-400">requires: {route.allowedRoles.join(', ')}</p>
                      </div>
                    </div>
                    <span className={`rounded-full px-2.5 py-1 text-xs font-medium ${canAccess ? 'bg-emerald-100 text-emerald-700 dark:bg-emerald-900/40 dark:text-emerald-400' : 'bg-zinc-100 text-zinc-500 dark:bg-zinc-800 dark:text-zinc-400'}`}>
                      {canAccess ? 'Access' : 'Denied'}
                    </span>
                  </div>
                );
              })}
            </div>
          </CardContent>
        </Card>

        {/* Raw session (debug) */}
        <details className="mt-6 rounded-lg border border-zinc-200 bg-white p-4 text-xs dark:border-zinc-800 dark:bg-zinc-900">
          <summary className="cursor-pointer font-medium text-zinc-500 dark:text-zinc-400">Raw session payload</summary>
          <pre className="mt-3 overflow-x-auto rounded bg-zinc-50 p-3 text-zinc-600 dark:bg-zinc-950 dark:text-zinc-400">
            {JSON.stringify(session?.user, null, 2)}
          </pre>
        </details>
      </main>
    </div>
  );
}
