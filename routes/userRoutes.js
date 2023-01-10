express = require("express");
const passport = require("passport");
const router = express.Router();
const jwt = require("jsonwebtoken");

/* ########## REGISTER FREE ACCOUNT WITH GOOGLE LOGIN ##########*/
router.get(
  "/auth/google",
  passport.authenticate("google", { scope: ["email", "profile"] })
);

/* ########## HANDLE AUTH GOOGLE CALLBACK ##########*/
router.get(
  "/auth/google/callback",
  passport.authenticate("google", {
    failureRedirect: "/",
    session: false,
  }),
  async (req, res) => {
    const payload = {
      email: req.user.email,
      id: req.user._id,
    };
    jwt.sign(
      payload,
      process.env.JWT_SECRET,
      { expiresIn: "30d" },
      (err, token) => {
        res.redirect(
          `${process.env.GOOGLE_AUTH_REDIRECT}/login-success?token=${token}`
        );
        res.json({ success: true });
      }
    );
  }
);

module.exports = router;
