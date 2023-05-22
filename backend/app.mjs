import express from "express";
import cookieParser from "cookie-parser";
import cors from "cors";

import "./utils/loadEnvironment.mjs";
import usersRoutes from "./routes/users.mjs";
import sessionsRoutes from "./routes/sessions.mjs";
import { createCSRFToken, verifyCSRFToken } from "./middlewares/csrfToken.mjs";
import { handleHTTPError } from "./middlewares/customErrorHandler.mjs";

const PORT = process.env.PORT || 2000;
const app = express();

app.use(cors());
app.use(cookieParser(process.env.COOKIE_SIGNATURE_SECRET));
app.use(express.json());
app.post("/csrfToken", createCSRFToken);
app.post("*", verifyCSRFToken);
app.use("/users", usersRoutes);
app.use("/sessions", sessionsRoutes);
app.use(handleHTTPError);

app.listen(PORT, () => {
  console.log(`Server is running on port: ${PORT}`);
});
