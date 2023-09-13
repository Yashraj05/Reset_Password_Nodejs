
import express, { json } from "express";
const app = express();
import connection from "./db.js";
import cors from "cors";
import router from "./routes/index.route.js";
const port = 8080


connection();

app.use(cors());
app.use(json());

// API routes
app.use("/", router);

app.use((error, req, res, next) => {
  console.log(error)
  res.status(500).json({ error: error.message });
});

app.listen(port, () => {
  console.log("Listening to Port ", port);
});

export default app;
