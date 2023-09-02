import express from "express";

import { verifyGoogleIdToken } from "../middlewares/googleIdToken.mjs";
import { createCSRFToken } from "../middlewares/csrfToken.mjs";
import { getCognitoIdAndToken } from "../middlewares/cognito.mjs";
import { deleteCognitoIdentity } from "../middlewares/cognito.mjs";
import { createUser, deleteUser } from "../controllers/users.mjs";
import {
  createSession,
  verifySession,
  unsetSessionIdCookie,
} from "../controllers/sessions.mjs";

const router = express.Router();

router.post("/", verifyGoogleIdToken, createUser, createSession);
router.post("/cognito", verifySession, getCognitoIdAndToken);
router.delete(
  "/",
  verifySession,
  deleteCognitoIdentity,
  deleteUser,
  unsetSessionIdCookie,
  createCSRFToken
);

export default router;
