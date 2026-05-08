const express = require("express");
const cors = require("cors");
const { notFound, errorHandler } = require("./Middleware/errorMiddleware");
const dotenv = require("dotenv");
const connectDB = require("./config/db");

dotenv.config();
connectDB();

const app = express();

// cors
app.use(cors({
  origin: [
    "http://localhost:5173",
    "https://safe-stride-ai.vercel.app"
  ],
  credentials: true,
}));

app.use(express.json());

// Import Routes
const authRoutes = require("./routes/authRoutes");
const runRoutes = require("./routes/runRoutes");
const analyticsRoute = require("./routes/analyticsRoute");

// Register Routes
app.use("/api/auth", authRoutes);
app.use("/api/runs", runRoutes);
app.use("/api/runs/bulk", runRoutes);
app.use("/api/analytics", analyticsRoute);


// Test Route
app.get("/", (req, res) => {
    res.send("SafeStride AI Backend Running");
});

const PORT = process.env.PORT || 5000;

// Error Middleware
app.use(notFound);
app.use(errorHandler);

app.listen(PORT, () => {
    console.log(`Server running on port ${PORT}`);
});