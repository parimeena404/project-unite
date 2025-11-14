import express from "express";
import { summarizeIssue, matchPartners } from "../services/aiService";

const router = express.Router();

/**
 * @swagger
 * /api/ai/summarize:
 *   post:
 *     summary: Summarize an issue using AI
 *     tags: [AI]
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             required:
 *               - title
 *               - category
 *               - severity
 *             properties:
 *               id:
 *                 type: string
 *               title:
 *                 type: string
 *               description:
 *                 type: string
 *               category:
 *                 type: string
 *               severity:
 *                 type: number
 *     responses:
 *       200:
 *         description: Issue summary generated
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 summary:
 *                   type: string
 *       400:
 *         description: Invalid request data
 *       500:
 *         description: Server error
 */
router.post("/summarize", async (req, res) => {
  try {
    const { id, title, description, category, severity, location, timestamp } = req.body;

    // Validate required fields
    if (!title || !category || severity === undefined) {
      return res.status(400).json({
        error: "Missing required fields: title, category, and severity are required",
      });
    }

    const issue = {
      id: id || Math.random().toString(36).substring(7),
      title,
      description,
      category,
      severity,
      location,
      timestamp: timestamp || new Date().toISOString(),
    };

    const summary = await summarizeIssue(issue);

    res.json({
      summary,
      issue: {
        id: issue.id,
        title: issue.title,
        category: issue.category,
      },
    });
  } catch (error) {
    console.error("Error in /api/ai/summarize:", error);
    res.status(500).json({
      error: "Failed to generate summary",
      message: error instanceof Error ? error.message : "Unknown error",
    });
  }
});

/**
 * @swagger
 * /api/ai/match:
 *   post:
 *     summary: Match partners/volunteers for an issue
 *     tags: [AI]
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             required:
 *               - user
 *               - issue
 *             properties:
 *               user:
 *                 type: object
 *                 properties:
 *                   id:
 *                     type: string
 *                   name:
 *                     type: string
 *                   email:
 *                     type: string
 *                   skills:
 *                     type: array
 *                     items:
 *                       type: string
 *                   interests:
 *                     type: array
 *                     items:
 *                       type: string
 *               issue:
 *                 type: object
 *                 properties:
 *                   id:
 *                     type: string
 *                   title:
 *                     type: string
 *                   category:
 *                     type: string
 *                   severity:
 *                     type: number
 *     responses:
 *       200:
 *         description: Partner matches found
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 partners:
 *                   type: array
 *                   items:
 *                     type: object
 *                     properties:
 *                       id:
 *                         type: string
 *                       name:
 *                         type: string
 *                       matchScore:
 *                         type: number
 *                       reason:
 *                         type: string
 *                       skills:
 *                         type: array
 *                         items:
 *                           type: string
 *       400:
 *         description: Invalid request data
 *       500:
 *         description: Server error
 */
router.post("/match", async (req, res) => {
  try {
    const { user, issue } = req.body;

    // Validate required fields
    if (!user || !user.id || !user.name) {
      return res.status(400).json({
        error: "Missing required user fields: id and name are required",
      });
    }

    if (!issue || !issue.title || !issue.category) {
      return res.status(400).json({
        error: "Missing required issue fields: title and category are required",
      });
    }

    const partners = await matchPartners(user, issue);

    res.json({
      partners,
      count: partners.length,
      issue: {
        id: issue.id,
        title: issue.title,
      },
    });
  } catch (error) {
    console.error("Error in /api/ai/match:", error);
    res.status(500).json({
      error: "Failed to match partners",
      message: error instanceof Error ? error.message : "Unknown error",
    });
  }
});

/**
 * @swagger
 * /api/ai/mentor:
 *   post:
 *     summary: Get AI-generated guidance steps for a goal
 *     tags: [AI]
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             required:
 *               - goal
 *             properties:
 *               goal:
 *                 type: string
 *     responses:
 *       200:
 *         description: Guidance steps generated
 *       400:
 *         description: Invalid request data
 *       500:
 *         description: Server error
 */
router.post("/mentor", async (req, res) => {
  try {
    const { goal } = req.body;

    if (!goal || typeof goal !== "string" || goal.trim().length === 0) {
      return res.status(400).json({
        error: "Missing or invalid 'goal' field. Please provide your goal as a non-empty string.",
      });
    }

    // Generate guidance using AI service (with fallback to mock data)
    const guidance = await generateGuidance(goal);

    res.json({
      success: true,
      goal,
      guidance,
      timestamp: new Date().toISOString(),
    });
  } catch (error) {
    console.error("Error in /api/ai/mentor:", error);
    res.status(500).json({
      error: "Failed to generate guidance",
      message: error instanceof Error ? error.message : "Unknown error",
    });
  }
});

/**
 * Generate AI guidance for a user's goal
 */
async function generateGuidance(goal: string): Promise<string> {
  // Try using OpenAI if available
  const openai = process.env.OPENAI_API_KEY ? await import("openai").then(m => new m.default({ apiKey: process.env.OPENAI_API_KEY })) : null;

  if (openai) {
    try {
      const completion = await openai.chat.completions.create({
        model: "gpt-3.5-turbo",
        messages: [
          {
            role: "system",
            content: "You are an expert mentor for social impact and community organizing. Provide clear, actionable step-by-step guidance to help users achieve their goals. Format your response as a numbered list with specific, practical steps.",
          },
          {
            role: "user",
            content: `I want to: ${goal}\n\nPlease provide 5-7 specific, actionable steps to help me achieve this goal.`,
          },
        ],
        max_tokens: 500,
        temperature: 0.7,
      });

      return completion.choices[0]?.message?.content || generateMockGuidance(goal);
    } catch (error) {
      console.error("OpenAI API error:", error);
    }
  }

  // Fallback to mock guidance
  return generateMockGuidance(goal);
}

/**
 * Generate mock guidance when AI is not available
 */
function generateMockGuidance(goal: string): string {
  const steps = [
    `✅ **Step 1: Define Your Vision**
Break down your goal into specific, measurable outcomes. What does success look like?`,

    `✅ **Step 2: Research & Learn**
Gather information about similar initiatives. What worked for others? What challenges did they face?`,

    `✅ **Step 3: Build Your Network**
Connect with people who share your passion. Join relevant communities and find potential collaborators.`,

    `✅ **Step 4: Create an Action Plan**
Develop a timeline with milestones. Start with quick wins to build momentum.`,

    `✅ **Step 5: Secure Resources**
Identify what you need (funding, tools, skills) and create a strategy to obtain them.`,

    `✅ **Step 6: Take Action & Iterate**
Start small, test your approach, gather feedback, and refine your strategy.`,

    `✅ **Step 7: Measure Impact & Share**
Track your progress, celebrate wins, and share your story to inspire others.`,
  ];

  return `Great goal! Here's your personalized action plan:\n\n${steps.join("\n\n")}\n\n💡 **Remember:** Start with one step at a time. Consistency is more important than perfection. You've got this! 🚀`;
}

export default router;
