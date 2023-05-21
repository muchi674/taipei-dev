import express from "express";

import { verifySession, deleteSession } from "../controllers/sessions.mjs";
import { createCSRFToken } from "../middlewares/csrfToken.mjs";

const router = express.Router();

router.post("/", verifySession, (req, res) => {
  res.json({ message: "Session is Valid" });
});
router.delete("/", deleteSession, createCSRFToken);

export default router;
