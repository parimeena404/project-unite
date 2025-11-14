import { getServerSession } from "next-auth/next";
import { authOptions } from "../api/auth/[...nextauth]/route";
import { redirect } from "next/navigation";
import LogoutButton from "../../components/LogoutButton";
import DashboardClient from "../../components/DashboardClient";
import Leaderboard from "../../components/Leaderboard";

export const dynamic = "force-dynamic";

export default async function DashboardPage() {
  const session = (await getServerSession(authOptions as any)) as any;

  if (!session) {
    // Redirect unauthenticated users to the login/home page
    redirect("/");
  }

  return (
    <main className="min-h-screen px-6 py-12">
      <div className="mx-auto max-w-7xl">
        <div className="flex items-center justify-between mb-8">
          <div>
            <h1 className="text-3xl font-bold">Dashboard</h1>
            <p className="mt-2 text-sm text-zinc-300">Welcome back, {session.user?.name ?? session.user?.email}</p>
          </div>
          <LogoutButton />
        </div>

        {/* Two-column layout */}
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          {/* Main content - Real-time issues */}
          <div className="lg:col-span-2">
            <DashboardClient />
          </div>

          {/* Sidebar - Leaderboard */}
          <div className="lg:col-span-1">
            <Leaderboard />
          </div>
        </div>
      </div>
    </main>
  );
}
