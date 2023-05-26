import express from "express";

import { verifySession } from "../controllers/sessions.mjs";
import { createLot } from "../controllers/lots.mjs";

const router = express.Router();

router.post("/", verifySession, createLot);

export default router;
