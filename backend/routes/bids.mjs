import express from "express";

import { verifySession } from "../controllers/sessions.mjs";
import { createBid } from "../controllers/bids.mjs";

const router = express.Router();

router.use(verifySession);
router.post("/", createBid);

export default router;
