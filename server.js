// Environment setup
require("dotenv").config();
// Importing the Express framework
const express = require("express");
const app = express();
const bodyParser = require("body-parser");
const cors = require("cors");
// Port configuration
const port = process.env.PORT || 5000;
// Importing routers
const apiRouter = require("./routes/apiRouter");
const webHookRouter = require("./routes/webHookRouter");

app.use(cors());
app.use(bodyParser.json());
// Health check route
app.get("/health", (req, res) => {
  res.send("Service is up and running");
});

// Setting up api routes
app.use("/api", apiRouter);
// Setting up webhook routes
app.use("/webhook", webHookRouter);
// 404 route handler
app.use((req, res, next) => {
  const error = new Error("path -->" + req.path + " Not found");
  error.status = 404;
  next(error);
});
// Error handler
app.use((error, req, res, next) => {
  console.log("An error occured", error);
  res.status(500).send("Something broke");
});
// App listen method
app.listen(port, () => console.log("App listening on port: " + port));
