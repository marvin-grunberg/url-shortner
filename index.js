require("dotenv").config();
const express = require("express");
const bodyParser = require("body-parser");
const passport = require("passport");
const app = express();
const cors = require("cors");
const connectDB = require("./config/mongodb");

// CORS
app.use(
  cors({
    origin: process.env.ALLOW_CORS,
  })
);

// middleware
app.use(bodyParser.json({ limit: "50mb" }));
app.use(
  bodyParser.urlencoded({
    limit: "50mb",
    extended: true,
    parameterLimit: 50000,
  })
);

// passport config
app.use(passport.initialize());
require("./auth/passport")(passport);
require("./auth/googleLoginStrategy")(passport);

// routes
app.use(require("./routes/urlRoutes"));
app.use(require("./routes/userRoutes"));

// connect DB
connectDB();

// start server
app.listen(process.env.PORT, () => {
  console.log(`server running on port ${process.env.PORT}`);
});
