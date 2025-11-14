interface ImpactSubmission {
  userId: string;
  userName: string;
  issueId: string;
  issueTitle: string;
  severity: number; // 1-5
  category: string;
  description?: string;
  timestamp: string;
}

interface UserImpact {
  userId: string;
  userName: string;
  totalPoints: number;
  submissionCount: number;
  badges: string[];
  rank?: number;
  recentSubmissions: ImpactSubmission[];
}

// In-memory storage (replace with database in production)
const userImpacts = new Map<string, UserImpact>();

/**
 * Calculate points based on issue severity
 * Severity 1 = 10 points, Severity 5 = 50 points
 */
function calculatePoints(severity: number): number {
  const basePoints = 10;
  return basePoints * severity;
}

/**
 * Determine badges based on total points and submission count
 */
function determineBadges(totalPoints: number, submissionCount: number): string[] {
  const badges: string[] = [];

  // Points-based badges
  if (totalPoints >= 1000) badges.push("🏆 Champion");
  else if (totalPoints >= 500) badges.push("⭐ Expert");
  else if (totalPoints >= 200) badges.push("💎 Contributor");
  else if (totalPoints >= 50) badges.push("🌟 Rising Star");

  // Submission count badges
  if (submissionCount >= 100) badges.push("📈 Century Club");
  else if (submissionCount >= 50) badges.push("🎯 Half Century");
  else if (submissionCount >= 20) badges.push("🔥 Active");
  else if (submissionCount >= 5) badges.push("✨ Engaged");

  // Category-specific badges (can be extended)
  if (submissionCount >= 1) badges.push("🚀 Impact Maker");

  return badges;
}

/**
 * Submit an impact and award points
 */
export function submitImpact(submission: Omit<ImpactSubmission, "timestamp">): {
  points: number;
  totalPoints: number;
  newBadges: string[];
  userImpact: UserImpact;
} {
  const timestamp = new Date().toISOString();
  const points = calculatePoints(submission.severity);

  // Get or create user impact record
  let userImpact = userImpacts.get(submission.userId);
  const previousBadges = userImpact?.badges || [];

  if (!userImpact) {
    userImpact = {
      userId: submission.userId,
      userName: submission.userName,
      totalPoints: 0,
      submissionCount: 0,
      badges: [],
      recentSubmissions: [],
    };
  }

  // Update user impact
  userImpact.totalPoints += points;
  userImpact.submissionCount += 1;
  userImpact.badges = determineBadges(userImpact.totalPoints, userImpact.submissionCount);

  // Add to recent submissions (keep last 10)
  userImpact.recentSubmissions.unshift({
    ...submission,
    timestamp,
  });
  if (userImpact.recentSubmissions.length > 10) {
    userImpact.recentSubmissions = userImpact.recentSubmissions.slice(0, 10);
  }

  userImpacts.set(submission.userId, userImpact);

  // Determine newly earned badges
  const newBadges = userImpact.badges.filter((badge) => !previousBadges.includes(badge));

  return {
    points,
    totalPoints: userImpact.totalPoints,
    newBadges,
    userImpact,
  };
}

/**
 * Get leaderboard with rankings
 */
export function getLeaderboard(limit: number = 10): UserImpact[] {
  const allUsers = Array.from(userImpacts.values());

  // Sort by total points (descending)
  allUsers.sort((a, b) => b.totalPoints - a.totalPoints);

  // Assign ranks
  allUsers.forEach((user, index) => {
    user.rank = index + 1;
  });

  return allUsers.slice(0, limit);
}

/**
 * Get user impact by userId
 */
export function getUserImpact(userId: string): UserImpact | null {
  const userImpact = userImpacts.get(userId);
  if (!userImpact) return null;

  // Calculate rank
  const allUsers = Array.from(userImpacts.values());
  allUsers.sort((a, b) => b.totalPoints - a.totalPoints);
  const rank = allUsers.findIndex((u) => u.userId === userId) + 1;
  userImpact.rank = rank;

  return userImpact;
}

/**
 * Get leaderboard statistics
 */
export function getLeaderboardStats() {
  const allUsers = Array.from(userImpacts.values());
  const totalUsers = allUsers.length;
  const totalPoints = allUsers.reduce((sum, user) => sum + user.totalPoints, 0);
  const totalSubmissions = allUsers.reduce((sum, user) => sum + user.submissionCount, 0);
  const topUser = allUsers.sort((a, b) => b.totalPoints - a.totalPoints)[0];

  return {
    totalUsers,
    totalPoints,
    totalSubmissions,
    averagePoints: totalUsers > 0 ? Math.round(totalPoints / totalUsers) : 0,
    topUser: topUser
      ? {
          name: topUser.userName,
          points: topUser.totalPoints,
        }
      : null,
  };
}

/**
 * Initialize with mock data for testing
 */
export function initializeMockData() {
  const mockUsers = [
    { userId: "user-1", userName: "Alice Chen", points: 450, submissions: 15 },
    { userId: "user-2", userName: "Bob Smith", points: 380, submissions: 12 },
    { userId: "user-3", userName: "Carol Davis", points: 320, submissions: 10 },
    { userId: "user-4", userName: "David Kim", points: 280, submissions: 9 },
    { userId: "user-5", userName: "Eve Wilson", points: 220, submissions: 7 },
    { userId: "user-6", userName: "Frank Brown", points: 180, submissions: 6 },
    { userId: "user-7", userName: "Grace Lee", points: 140, submissions: 5 },
    { userId: "user-8", userName: "Henry Zhang", points: 90, submissions: 3 },
    { userId: "user-9", userName: "Ivy Martinez", points: 60, submissions: 2 },
    { userId: "user-10", userName: "Jack Taylor", points: 30, submissions: 1 },
  ];

  mockUsers.forEach((mock) => {
    const userImpact: UserImpact = {
      userId: mock.userId,
      userName: mock.userName,
      totalPoints: mock.points,
      submissionCount: mock.submissions,
      badges: determineBadges(mock.points, mock.submissions),
      recentSubmissions: [],
    };
    userImpacts.set(mock.userId, userImpact);
  });
}

// Initialize mock data on startup
initializeMockData();
