import express from "express";
import cookieParser from "cookie-parser";
import cors from "cors";

import "./utils/loadEnvironment.mjs";
import usersRoutes from "./routes/users.mjs";
import { getCSRFToken, verifyCSRFToken } from "./middlewares/csrfToken.mjs";
import { verifySession, deleteSession } from "./middlewares/session.mjs";
import { handleHTTPError } from "./middlewares/customErrorHandler.mjs";

const PORT = process.env.PORT || 2000;
const app = express();

app.use(cors());
app.use(cookieParser(process.env.COOKIE_SIGNATURE_SECRET));
app.use(express.json());
app.get("/csrfToken", getCSRFToken);
app.post("*", verifyCSRFToken);
app.delete("/session", deleteSession, getCSRFToken); // refreshes CSRFToken
app.use("/users", usersRoutes);
app.use(verifySession);
app.use(handleHTTPError);

app.listen(PORT, () => {
  console.log(`Server is running on port: ${PORT}`);
});
