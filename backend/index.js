require("dotenv").config();

const express = require("express");
const cors = require("cors");

const authRoutes = require("./src/routes/auth.routes");

const app = express();

/* -------------------- MIDDLEWARE -------------------- */
app.use(cors());
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

app.use((req, res, next) => {
  console.log(`[DEBUG] Request: ${req.method} ${req.url}`);
  next();
});

/* -------------------- ROUTES -------------------- */
app.use("/api/external", require("./src/external/geoapify.routes"));

app.use("/api/trips", require("./src/routes/trip.routes"));
app.use("/api/places", require("./src/routes/place.routes"));
app.use("/api/stops", require("./src/routes/stop.routes"));

app.use("/uploads", express.static("uploads"));

app.use("/api/users", require("./src/routes/user.routes"));
app.use("/api/activities", require("./src/routes/activity.routes"));

app.use("/api/auth", authRoutes);

app.get("/", (req, res) => {
  res.status(200).json({ message: "Authentication API is running 🚀" });
});

/* -------------------- SERVER -------------------- */
const PORT = process.env.PORT || 5000;

app.listen(PORT, () => {
  console.log(`✅ Server running on http://localhost:${PORT}`);
});
