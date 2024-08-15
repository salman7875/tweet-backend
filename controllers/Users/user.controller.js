const User = require("../../models/user");

const getCurrentUser = async (req, res) => {
  try {
    const currentUser = await User.findById(req.user.id);
    if (!currentUser) {
      res.status(404).json({
        success: false,
        message: "No user found",
      });
    }

    res.status(200).json({ success: true, user: currentUser });
  } catch (err) {
    res.status(500).json({
      success: false,
      message: err,
    });
  }
};

const editProfile = async (req, res) => {
  try {
    const user = await User.findByIdAndUpdate(req.user.id, req.body, {
      new: true,
    });
    if (!user) {
      return res
        .status(404)
        .json({ success: false, message: "No user found!" });
    }
    res
      .status(200)
      .json({ success: true, message: "User Updated", user: user });
  } catch (err) {
    res.status(500).json({ success: false, message: err.message });
  }
};

module.exports = { getCurrentUser, editProfile };
