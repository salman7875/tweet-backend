const jwt = require("jsonwebtoken");
const bcrypt = require("bcrypt");
const config = require("../../config/config");
const User = require("../../models/user");

const signup = async (req, res) => {
  try {
    const { username, email, password, avatar, name } = req.body;
    if (!username || !email || !password || !name) {
      return res.status(400).json({
        success: false,
        message: "All fields are mandatory!",
      });
    }
    let user = await User.findOne({ email });
    if (user) {
      return res.status(400).json({
        success: false,
        message: "User already exists!",
      });
    }
    const hashedPassword = await bcrypt.hash(password, 10);

    user = await User.create({
      username,
      email,
      password: hashedPassword,
      avatar,
      name,
    });
    const token = jwt.sign(
      {
        user: {
          id: user._id,
          username: user.username,
          username: user.username,
        },
      },
      config.JWT_SECRET,
      { expiresIn: "90d" }
    );
    res.status(201).json({
      success: true,
      user: user,
      token: token,
    });
  } catch (err) {
    res.status(500).json({
      success: false,
      message: err.message,
    });
  }
};

const login = async (req, res) => {
  try {
    const { username, password } = req.body;
    if (!username || !password) {
      return res.status(400).json({
        success: false,
        message: "All fields are mandatory!",
      });
    }

    let user = await User.findOne({ username });
    if (!user) {
      return res.status(400).json({
        success: false,
        message: "No user with this username!",
      });
    }

    if (user && (await bcrypt.compare(password, user.password))) {
      const token = jwt.sign(
        {
          user: {
            id: user._id,
            username: user.username,
            username: user.username,
          },
        },
        config.JWT_SECRET,
        { expiresIn: "90d" }
      );
      res.status(200).json({ success: true, user, token });
    } else {
      res.status(401);
      throw new Error("Email or password is not valid!");
    }
  } catch (err) {
    res.status(500).json({
      success: false,
      message: err.message,
    });
  }
};

module.exports = { signup, login };
