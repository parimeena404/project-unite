import { Router } from "express";
import { submitImpact, getUserImpact, getLeaderboardStats } from "../services/impactService";

const router = Router();

/**
 * @openapi
 * /api/impact:
 *   get:
 *     summary: Return impact metrics and stats
 *     responses:
 *       200:
 *         description: OK
 */
router.get("/", (req, res) => {
  const stats = getLeaderboardStats();
  res.json({
    ok: true,
    metrics: {
      projects: 128,
      volunteers: 3420,
      regions: 24,
    },
    leaderboardStats: stats,
  });
});

/**
 * @openapi
 * /api/impact/submit:
 *   post:
 *     summary: Submit an impact and earn points
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             required:
 *               - userId
 *               - userName
 *               - issueId
 *               - issueTitle
 *               - severity
 *               - category
 *             properties:
 *               userId:
 *                 type: string
 *               userName:
 *                 type: string
 *               issueId:
 *                 type: string
 *               issueTitle:
 *                 type: string
 *               severity:
 *                 type: number
 *                 minimum: 1
 *                 maximum: 5
 *               category:
 *                 type: string
 *               description:
 *                 type: string
 *     responses:
 *       200:
 *         description: Impact submitted successfully
 *       400:
 *         description: Invalid request data
 */
router.post("/submit", (req, res) => {
  try {
    const { userId, userName, issueId, issueTitle, severity, category, description } = req.body;

    // Validate required fields
    if (!userId || !userName || !issueId || !issueTitle || severity === undefined || !category) {
      return res.status(400).json({
        error: "Missing required fields: userId, userName, issueId, issueTitle, severity, and category are required",
      });
    }

    // Validate severity range
    if (severity < 1 || severity > 5) {
      return res.status(400).json({
        error: "Severity must be between 1 and 5",
      });
    }

    const result = submitImpact({
      userId,
      userName,
      issueId,
      issueTitle,
      severity,
      category,
      description,
    });

    res.json({
      success: true,
      points: result.points,
      totalPoints: result.totalPoints,
      newBadges: result.newBadges,
      rank: result.userImpact.rank,
      message: result.newBadges.length > 0 ? "Congratulations! You earned new badges!" : "Impact submitted successfully",
    });
  } catch (error) {
    console.error("Error in /api/impact/submit:", error);
    res.status(500).json({
      error: "Failed to submit impact",
      message: error instanceof Error ? error.message : "Unknown error",
    });
  }
});

/**
 * @openapi
 * /api/impact/user/{userId}:
 *   get:
 *     summary: Get user impact data
 *     parameters:
 *       - in: path
 *         name: userId
 *         required: true
 *         schema:
 *           type: string
 *     responses:
 *       200:
 *         description: User impact data
 *       404:
 *         description: User not found
 */
router.get("/user/:userId", (req, res) => {
  try {
    const { userId } = req.params;
    const userImpact = getUserImpact(userId);

    if (!userImpact) {
      return res.status(404).json({
        error: "User not found",
      });
    }

    res.json({
      success: true,
      userImpact,
    });
  } catch (error) {
    console.error("Error in /api/impact/user/:userId:", error);
    res.status(500).json({
      error: "Failed to get user impact",
      message: error instanceof Error ? error.message : "Unknown error",
    });
  }
});

export default router;
