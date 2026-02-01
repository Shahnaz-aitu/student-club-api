const path = require("path");
const express = require("express");
const cookieParser = require("cookie-parser");
const methodOverride = require("method-override");

const connectDB = require("./config/db");
const { optionalAuth } = require("./middleware/auth");
const { notFound, errorHandler } = require("./middleware/errorHandler");

const authRoutes = require("./routes/authRoutes");
const userRoutes = require("./routes/userRoutes");
const clubRoutes = require("./routes/clubRoutes");

const app = express();
connectDB();

app.set("view engine", "ejs");
app.set("views", path.join(__dirname, "views"));

app.use("/public", express.static(path.join(__dirname, "public")));
app.use(express.urlencoded({ extended: false }));
app.use(express.json());
app.use(cookieParser());
app.use(methodOverride("_method"));


app.use(optionalAuth);

app.use("/", authRoutes);
app.use("/users", userRoutes);
app.use("/clubs", clubRoutes);

app.use(notFound);
app.use(errorHandler);

module.exports = app;
