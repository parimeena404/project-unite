"use client";

import React, { useEffect, useState } from "react";

interface LeaderboardUser {
  userId: string;
  userName: string;
  totalPoints: number;
  submissionCount: number;
  badges: string[];
  rank: number;
}

interface LeaderboardStats {
  totalUsers: number;
  totalPoints: number;
  totalSubmissions: number;
  averagePoints: number;
  topUser: {
    name: string;
    points: number;
  } | null;
}

export default function Leaderboard() {
  const [leaderboard, setLeaderboard] = useState<LeaderboardUser[]>([]);
  const [stats, setStats] = useState<LeaderboardStats | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    fetchLeaderboard();
  }, []);

  const fetchLeaderboard = async () => {
    try {
      setLoading(true);
      setError(null);
      const response = await fetch(
        `${process.env.NEXT_PUBLIC_API_URL || "http://localhost:4000"}/api/leaderboard?limit=10`
      );

      if (!response.ok) {
        throw new Error("Failed to fetch leaderboard");
      }

      const data = await response.json();
      setLeaderboard(data.leaderboard || []);
      setStats(data.stats || null);
    } catch (err) {
      console.error("Error fetching leaderboard:", err);
      setError(err instanceof Error ? err.message : "Failed to load leaderboard");
    } finally {
      setLoading(false);
    }
  };

  const getRankColor = (rank: number) => {
    if (rank === 1) return "text-yellow-400";
    if (rank === 2) return "text-gray-300";
    if (rank === 3) return "text-amber-600";
    return "text-zinc-400";
  };

  const getRankIcon = (rank: number) => {
    if (rank === 1) return "🥇";
    if (rank === 2) return "🥈";
    if (rank === 3) return "🥉";
    return `#${rank}`;
  };

  const getProgressPercentage = (points: number) => {
    const maxPoints = leaderboard[0]?.totalPoints || 1000;
    return Math.min((points / maxPoints) * 100, 100);
  };

  if (loading) {
    return (
      <div className="rounded-lg bg-white/3 p-6">
        <h2 className="text-xl font-semibold mb-4">Leaderboard</h2>
        <div className="flex items-center justify-center py-12">
          <div className="text-zinc-400">Loading leaderboard...</div>
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="rounded-lg bg-white/3 p-6">
        <h2 className="text-xl font-semibold mb-4">Leaderboard</h2>
        <div className="flex items-center justify-center py-12">
          <div className="text-red-400">{error}</div>
        </div>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      {/* Stats Cards */}
      {stats && (
        <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
          <div className="rounded-lg bg-white/5 p-4 border border-white/10">
            <div className="text-sm text-zinc-400 mb-1">Total Users</div>
            <div className="text-2xl font-bold text-cyan-400">{stats.totalUsers}</div>
          </div>
          <div className="rounded-lg bg-white/5 p-4 border border-white/10">
            <div className="text-sm text-zinc-400 mb-1">Total Points</div>
            <div className="text-2xl font-bold text-green-400">{stats.totalPoints.toLocaleString()}</div>
          </div>
          <div className="rounded-lg bg-white/5 p-4 border border-white/10">
            <div className="text-sm text-zinc-400 mb-1">Total Submissions</div>
            <div className="text-2xl font-bold text-purple-400">{stats.totalSubmissions}</div>
          </div>
          <div className="rounded-lg bg-white/5 p-4 border border-white/10">
            <div className="text-sm text-zinc-400 mb-1">Average Points</div>
            <div className="text-2xl font-bold text-blue-400">{stats.averagePoints}</div>
          </div>
        </div>
      )}

      {/* Leaderboard */}
      <div className="rounded-lg bg-white/3 p-6">
        <div className="flex items-center justify-between mb-6">
          <h2 className="text-xl font-semibold">Top Contributors</h2>
          <button
            onClick={fetchLeaderboard}
            className="text-sm px-4 py-2 rounded-md bg-white/5 hover:bg-white/10 transition-colors"
          >
            🔄 Refresh
          </button>
        </div>

        {leaderboard.length === 0 ? (
          <div className="text-center py-12 text-zinc-400">No users on the leaderboard yet.</div>
        ) : (
          <div className="space-y-3">
            {leaderboard.map((user) => (
              <div
                key={user.userId}
                className={`p-4 rounded-lg border transition-all hover:bg-white/5 ${
                  user.rank <= 3
                    ? "bg-white/10 border-white/20"
                    : "bg-white/5 border-white/10"
                }`}
              >
                <div className="flex items-center gap-4">
                  {/* Rank */}
                  <div className={`text-2xl font-bold w-12 text-center ${getRankColor(user.rank)}`}>
                    {getRankIcon(user.rank)}
                  </div>

                  {/* User Info */}
                  <div className="flex-1 min-w-0">
                    <div className="flex items-center gap-2 mb-1">
                      <h3 className="font-semibold text-zinc-100 truncate">{user.userName}</h3>
                      {user.badges.length > 0 && (
                        <div className="flex gap-1">
                          {user.badges.slice(0, 3).map((badge, idx) => (
                            <span key={idx} className="text-sm" title={badge}>
                              {badge.split(" ")[0]}
                            </span>
                          ))}
                        </div>
                      )}
                    </div>

                    {/* Progress Bar */}
                    <div className="relative h-2 bg-zinc-800 rounded-full overflow-hidden mb-2">
                      <div
                        className={`absolute inset-y-0 left-0 rounded-full transition-all duration-500 ${
                          user.rank === 1
                            ? "bg-gradient-to-r from-yellow-500 to-yellow-300"
                            : user.rank === 2
                            ? "bg-gradient-to-r from-gray-400 to-gray-300"
                            : user.rank === 3
                            ? "bg-gradient-to-r from-amber-700 to-amber-500"
                            : "bg-gradient-to-r from-cyan-500 to-blue-500"
                        }`}
                        style={{ width: `${getProgressPercentage(user.totalPoints)}%` }}
                      />
                    </div>

                    {/* Stats */}
                    <div className="flex gap-4 text-sm text-zinc-400">
                      <span>
                        <span className="font-semibold text-cyan-400">{user.totalPoints}</span> points
                      </span>
                      <span>•</span>
                      <span>
                        <span className="font-semibold text-green-400">{user.submissionCount}</span> submissions
                      </span>
                    </div>

                    {/* Badges */}
                    {user.badges.length > 0 && (
                      <div className="flex flex-wrap gap-1 mt-2">
                        {user.badges.map((badge, idx) => (
                          <span
                            key={idx}
                            className="text-xs px-2 py-1 rounded-full bg-white/10 text-zinc-300"
                          >
                            {badge}
                          </span>
                        ))}
                      </div>
                    )}
                  </div>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}
