import express from "express";
import cookieParser from "cookie-parser";
import cors from "cors";

import "./utils/loadEnvironment.mjs";
import usersRoutes from "./routes/users.mjs";
import { getCSRFToken, verifyCSRFToken } from "./middlewares/csrfToken.mjs";

const PORT = process.env.PORT || 2000;
const app = express();

app.use(cors());
app.use(cookieParser(process.env.COOKIE_SIGNATURE_SECRET));
app.use(express.json());
app.get("/csrfToken", getCSRFToken);
app.use(verifyCSRFToken);
app.use("/users", usersRoutes);
app.use((err, req, res, next) => {
  if (res.headersSent) {
    return next(err);
  }
  res.status(err.code || 500).json({ message: err.message || "Unknown Error" });
});

app.listen(PORT, () => {
  console.log(`Server is running on port: ${PORT}`);
});
