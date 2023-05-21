import express from "express";

import { verifySession, deleteSession } from "../controllers/sessions.mjs";
import { createCSRFToken } from "../middlewares/csrfToken.mjs";
//import { HttpError } from "../utils/httpError.mjs";

const router = express.Router();

router.post("/", verifySession, (req, res) => {
  res.json({ message: "Session is Valid" });
});
/*
router.delete(
  "/",
  (req, res, next) => {
    res.clearCookie("sessionId", {
      httpOnly: true,
      expires: new Date(),
      secure: true,
      signed: true,
      sameSite: "none",
    });

    next();
  },
  (req, res, next) => {
    next(new HttpError("I Suck", 500));
  }
);
*/
router.delete("/", deleteSession, createCSRFToken);

export default router;
