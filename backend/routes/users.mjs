import express from "express";

import { signIn } from "../controllers/users.mjs";

const router = express.Router();

router.post("/", signIn);

export default router;
