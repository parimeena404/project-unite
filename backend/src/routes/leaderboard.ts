import { Router } from "express";
import { getLeaderboard, getLeaderboardStats } from "../services/impactService";

const router = Router();

/**
 * @openapi
 * /api/leaderboard:
 *   get:
 *     summary: Get leaderboard with top users
 *     parameters:
 *       - in: query
 *         name: limit
 *         schema:
 *           type: integer
 *           default: 10
 *         description: Number of users to return
 *     responses:
 *       200:
 *         description: Leaderboard data
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 leaderboard:
 *                   type: array
 *                   items:
 *                     type: object
 *                     properties:
 *                       userId:
 *                         type: string
 *                       userName:
 *                         type: string
 *                       totalPoints:
 *                         type: number
 *                       submissionCount:
 *                         type: number
 *                       badges:
 *                         type: array
 *                         items:
 *                           type: string
 *                       rank:
 *                         type: number
 *                 stats:
 *                   type: object
 */
router.get("/", (req, res) => {
  try {
    const limit = parseInt(req.query.limit as string) || 10;
    const leaderboard = getLeaderboard(limit);
    const stats = getLeaderboardStats();

    res.json({
      success: true,
      leaderboard,
      stats,
      timestamp: new Date().toISOString(),
    });
  } catch (error) {
    console.error("Error in /api/leaderboard:", error);
    res.status(500).json({
      error: "Failed to get leaderboard",
      message: error instanceof Error ? error.message : "Unknown error",
    });
  }
});

/**
 * @openapi
 * /api/leaderboard/stats:
 *   get:
 *     summary: Get leaderboard statistics
 *     responses:
 *       200:
 *         description: Leaderboard statistics
 */
router.get("/stats", (req, res) => {
  try {
    const stats = getLeaderboardStats();

    res.json({
      success: true,
      stats,
      timestamp: new Date().toISOString(),
    });
  } catch (error) {
    console.error("Error in /api/leaderboard/stats:", error);
    res.status(500).json({
      error: "Failed to get stats",
      message: error instanceof Error ? error.message : "Unknown error",
    });
  }
});

export default router;
