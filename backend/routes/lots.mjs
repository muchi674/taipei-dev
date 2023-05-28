import express from "express";

import { verifySession } from "../controllers/sessions.mjs";
import {
  createLot,
  readLots,
  updateLot,
  deleteLot,
} from "../controllers/lots.mjs";

const router = express.Router();

router.use(verifySession);
router.post("/", createLot);
router.get("/", readLots);
router.patch("/:lotId", updateLot);
router.delete("/:lotId", deleteLot);

export default router;
