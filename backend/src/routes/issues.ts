import { Router } from "express";
import db from "../db";

const router = Router();

/**
 * @openapi
 * /api/issues:
 *   get:
 *     summary: Get list of issues
 *     responses:
 *       200:
 *         description: OK
 */
router.get("/", (req, res) => {
  res.json({ ok: true, issues: db.getIssues() });
});

router.get("/:id", (req, res) => {
  const issue = db.getIssue(req.params.id);
  if (!issue) return res.status(404).json({ ok: false, error: "not found" });
  res.json({ ok: true, issue });
});

router.post("/", (req, res) => {
  const { title, description, tags } = req.body;
  const id = String(Date.now());
  const created = db.addIssue({ id, title, description, tags });
  res.status(201).json({ ok: true, issue: created });
});

export default router;
