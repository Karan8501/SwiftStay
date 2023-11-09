const express = require("express");
const cookieParser = require("cookie-parser");
const path = require("path");
const errorHandler = require("./middlewares/errorHandler");
const { logger } = require("./middlewares/logger");

const app = express();
app.use(logger);

// config
require("dotenv").config();

// Routes import
const userRoute = require("./routes/userRoute");
const hotelRoute = require("./routes/hotelRoute");
const roomRoute = require("./routes/roomRoute");
const bookingRoute = require("./routes/bookingRoute");
const errorMiddleware = require("./middlewares/errorMiddleware");

app.use(express.json({ limit: "50mb" }));
app.use(express.urlencoded({ extended: true, limit: "50mb" }));
app.use(cookieParser());

// cors configuration
app.use(
  require("cors")({
    origin: process.env.FRONTEND_URL,
    optionsSuccessStatus: 200,
  })
);

app.use("/api/v1", userRoute);
app.use("/api/v1", hotelRoute);
app.use("/api/v1", roomRoute);
app.use("/api/v1", bookingRoute);

// Serve static files
app.use(express.static(path.join(__dirname, "./frontend/build")));

// Serve index.html
app.get("*", (req, res) => {
  res.sendFile(path.resolve(__dirname, "./frontend/build/index.html"), {
    headers: { "Content-Type": "text/html" },
  });
});

// error middleware
app.use(errorMiddleware);
app.use(errorHandler);

module.exports = app;
