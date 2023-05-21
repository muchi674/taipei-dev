import express from "express";

import { verifyGoogleIdToken } from "../middlewares/googleIdToken.mjs";
import { createUser } from "../controllers/users.mjs";
import { createSession } from "../controllers/sessions.mjs";

const router = express.Router();

router.post("/", verifyGoogleIdToken, createUser, createSession);

export default router;
