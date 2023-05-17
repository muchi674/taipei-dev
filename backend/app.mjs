import express from "express";
import cookieParser from "cookie-parser";
import cors from "cors";

import "./utils/loadEnvironment.mjs";
import usersRoutes from "./routes/users.mjs";

const PORT = process.env.PORT || 2000;
const app = express();

app.use(cors());
app.use(cookieParser(process.env.COOKIE_SIGNATURE_SECRET));
app.use(express.json());
app.use("/users", usersRoutes);

app.listen(PORT, () => {
  console.log(`Server is running on port: ${PORT}`);
});
