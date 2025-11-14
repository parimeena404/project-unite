import express from "express";
import cors from "cors";
import bodyParser from "body-parser";
import issuesRouter from "./routes/issues";
import matchRouter from "./routes/match";
import impactRouter from "./routes/impact";
import swaggerUi from "swagger-ui-express";
import swaggerJsdoc from "swagger-jsdoc";

const app = express();
const port = process.env.PORT || 4000;

app.use(cors());
app.use(bodyParser.json());

const swaggerSpec = swaggerJsdoc({
  definition: {
    openapi: "3.0.0",
    info: { title: "Project UNITE API", version: "0.1.0" },
  },
  apis: ["./src/routes/*.ts"],
});

app.use("/api-docs", swaggerUi.serve, swaggerUi.setup(swaggerSpec));

app.use("/api/issues", issuesRouter);
app.use("/api/match", matchRouter);
app.use("/api/impact", impactRouter);

app.get("/", (req, res) => res.json({ ok: true, message: "Project UNITE API" }));

app.listen(port, () => {
  console.log(`API running on http://localhost:${port}`);
});
