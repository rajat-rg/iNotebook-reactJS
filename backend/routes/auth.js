const express = require("express");
const router = express.Router();
const User = require("../models/User");
const { body, validationResult } = require("express-validator");

// /api/auth/createuser
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
    user = await User.create({
      name: req.body.name,
      email: req.body.email,
      password: req.body.password,
    })
      
    res.json(user)
  }
);

module.exports = router;
