express = require("express");
const passport = require("passport");
const router = express.Router();
const jwt = require("jsonwebtoken");

/* ########## REGISTER FREE ACCOUNT WITH GOOGLE LOGIN ##########*/
router.get(
  "/auth/google",
  passport.authenticate("google", { scope: ["email", "profile"] })
);

// the callback after google has authenticated the user
router.get(
  "/auth/google/callback",
  passport.authenticate("google", {
    failureRedirect: "/",
    session: false,
  }),
  async (req, res) => {
    const payload = {
      email: req.user.email,
    };
    jwt.sign(
      payload,
      process.env.JWT_SECRET,
      { expiresIn: "30d" },
      (err, token) => {
        // res.redirect(`http://localhost:3000/login-success/${token}`);
        console.log({ token });
        res.json({ success: true });
      }
    );
  }
);

module.exports = router;
