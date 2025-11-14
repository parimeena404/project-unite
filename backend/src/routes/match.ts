import { Router } from "express";

const router = Router();

/**
 * @openapi
 * /api/match:
 *   post:
 *     summary: Return mock matches for a user issue
 *     responses:
 *       200:
 *         description: OK
 */
router.post("/", (req, res) => {
  const { issueId } = req.body;
  // Mocked response
  res.json({
    ok: true,
    matches: [
      { id: "u1", name: "Community A", score: 0.92 },
      { id: "u2", name: "Organization B", score: 0.78 },
    ],
    issueId,
  });
});

export default router;
