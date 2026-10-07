const bcrypt = require("bcryptjs");
const jwt = require("jsonwebtoken");
const User = require("../models/user.model");
const LoginHistory = require("../models/loginHistory.model");

const registerUser = async (req, res) => {
  try {
    const { fullName, email, mobileNumber, password } = req.body;

    // missing fileds check
    if (!fullName || !email || !mobileNumber || !password) {
      return res.status(400).json({
        success: false,
        message: "All fields are required",
      });
    }

    //check existing email

    const existingEmail = await User.findOne({ email });

    if (existingEmail) {
      return res.status(409).json({
        success: false,
        message: "Email already exist",
      });
    }

    // check mobileNumber exist
    const existingmobileNumber = await User.findOne({ mobileNumber });
    if (existingmobileNumber) {
      return res.status(409).json({
        success: false,
        message: "Mobile number already exist",
      });
    }

    // password hashing
    const hashedPassword = await bcrypt.hash(password, 10);

    //create user

    const user = await User.create({
      fullName,
      email,
      mobileNumber,
      password: hashedPassword,
    });

    //response
    res.status(201).json({
      success: true,
      message: "User registered Successfully",
      user: {
        id: user._id,
        fullName: user.fullName,
        email: user.email,
        mobileNumber: user.mobileNumber,
        role: user.role,
      },
    });
  } catch (error) {
    console.log("Register Error", error);
    res.status(500).json({
      success: false,
      message: "Server error",
    });
  }
};
const loginUser = async (req, res) => {
  try {
    const { email, password } = req.body;

    if (!email || !password) {
      return res.status(400).json({
        success: false,
        message: "Email and password are required",
      });
    }

    const user = await User.findOne({ email });

    if (!user) {
      return res.status(404).json({
        success: false,
        message: "User not found. Please register first",
      });
    }

    const isPasswordCorrect = await bcrypt.compare(password, user.password);

    if (!isPasswordCorrect) {
      return res.status(401).json({
        success: false,
        message: "Invalid email or password",
      });
    }

    const token = jwt.sign(
      {
        userId: user._id,
        role: user.role,
      },
      process.env.JWT_SECRET,
      {
        expiresIn: "7d",
      },
    );

    // SAVE LOGIN HISTORY
    await LoginHistory.create({
      user: user._id,
      loginTime: new Date(),
    });

    res.status(200).json({
      success: true,
      message: "Login successful",
      token,
      user: {
        id: user._id,
        fullName: user.fullName,
        email: user.email,
        mobileNumber: user.mobileNumber,
        role: user.role,
      },
    });
  } catch (error) {
    console.error("Login Error:", error);

    res.status(500).json({
      success: false,
      message: "Server error",
    });
  }
};

const getProfile = async (req, res) => {
  try {
    const user = await User.findById(req.user.userId).select("-password");

    if (!user) {
      return res.status(404).json({
        success: false,
        message: "User not found",
      });
    }

    res.status(200).json({
      success: true,
      user,
    });
  } catch (error) {
    console.error("Get Profile Error:", error);

    return res.status(500).json({
      success: false,
      message: "Server error",
    });
  }
};

const logoutUser = async (req, res) => {
  try {
    return res.status(200).json({
      success: true,
      message: "Logout successful",
    });
  } catch (error) {
    console.error("Logout Error:", error);

    return res.status(500).json({
      success: false,
      message: "Failed to logout",
      error: error.message,
    });
  }
};
module.exports = {
  registerUser,
  loginUser,
  getProfile,
  logoutUser,
};
