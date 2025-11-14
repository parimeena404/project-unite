import { Router } from "express";

const router = Router();

/**
 * @openapi
 * /api/impact:
 *   get:
 *     summary: Return mock impact metrics
 *     responses:
 *       200:
 *         description: OK
 */
router.get("/", (req, res) => {
  res.json({
    ok: true,
    metrics: {
      projects: 128,
      volunteers: 3420,
      regions: 24,
    },
  });
});

export default router;
