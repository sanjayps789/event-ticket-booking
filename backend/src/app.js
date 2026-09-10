import express from "express";
import cors from "cors";
import authRoutes from "./routes/auth.routes.js";
import eventRoutes from "./routes/event.routes.js";
const app = express();

app.use(cors());
app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use("/api/auth", authRoutes);
app.use("/api/events", eventRoutes);


app.get("/", (req, res) => {
    res.send("<h1>Server is running and waiting for API requests...</h1>");
});

app.use((req, res) => {
  res.status(404).json({ success: false, message: "Route not found" });
});

app.use((err, req, res, next) => {
  console.error(err.stack);
  res.status(err.statusCode || 500).json({
    success: false,
    message: err.message || "Server Error",
  });
});

export default app;