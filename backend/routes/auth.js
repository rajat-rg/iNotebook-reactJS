const express = require("express");
const router = express.Router();
const User = require("../models/User");
const { body, validationResult } = require("express-validator");
const bcrypt = require("bcryptjs");
const jwt = require("jsonwebtoken");
const JWT_SECURE = "RamLalaHumAyengeMandirWahiBanayenge";
const fetchuser = require("../middleware/fetchuser")
// /api/auth/createuser
// create user without log in
router.post(
  "/createuser",
  [
    body("name", "Invalid name").isLength({ min: 5 }),
    body("email", "Invalid email").isEmail(),
    body("password", "Password must be atleast 5 chars").isLength({ min: 5 }),
  ],
  async (req, res) => {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      return res.status(400).json({ errors: errors.array() });
    }

    let user = await User.findOne({ email: req.body.email });
    if (user) {
      return res
        .status(400)
        .json({ error: "User with this email already exists" });
    }
    const salt = await bcrypt.genSalt(10);
    const secPass = await bcrypt.hash(req.body.password, salt);
    user = await User.create({
      name: req.body.name,
      email: req.body.email,
      password: secPass,
    });
    const data = {
      user: { id: user.id },
    };
    authtoken = jwt.sign(data, JWT_SECURE);
    res.json({ authtoken });
  }
);

// login endpoint with email and password
// /api/auth/login
router.post(
  "/login",
  [
    body("email", "Invalid email").isEmail(),
    body("password", "Password must not be empty").exists(),
  ],
  async (req, res) => {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      return res.status(400).json({ errors: "Login with correct credentials" });
    }

    const { email, password } = req.body;
    try {
      const user = await User.findOne({ email: email });
      if (!user) {
        return res
          .status(400)
          .json({ errors: "Login with correct credentials" });
      }
      const passwordComp = await bcrypt.compare(password, user.password);
      if (!passwordComp) {
        return res
          .status(400)
          .json({ errors: "Login with correct credentials" });
      }
      const data = {
        user: { id: user.id },
      };
      authtoken = jwt.sign(data, JWT_SECURE);
      res.json({ authtoken });
    } catch (error) {
      console.log(error);
      // console.log(process.env.JWT_SECURE);

      return res.status(400).json({ errors: "Internal server error occured" });
    }
  }
);

// /api/auth/fetchuser
// Fetch user details required log in
router.post("/fetchuser",fetchuser, async (req, res) => {
  try {
    const userId = req.user.id;
    const user = await User.findById(userId).select("-password");
    res.send(user);
  } catch (error) {
    console.log(error);
    // console.log(process.env.JWT_SECURE);
    return res.status(400).json({ errors: "Internal server error occured" });
  }
});
module.exports = router;
