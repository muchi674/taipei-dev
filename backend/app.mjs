import express from "express";
import cors from "cors";

import "./utils/loadEnvironment.mjs";
import usersRoutes from "./routes/users.mjs";

const PORT = process.env.PORT || 2000;
const app = express();

app.use(cors());
app.use(express.json());
app.use("/users", usersRoutes);

app.listen(PORT, () => {
  console.log(`Server is running on port: ${PORT}`);
});
