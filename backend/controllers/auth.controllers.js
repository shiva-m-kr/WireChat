import genToken from "../config/token.js";
import User from "../models/user.model.js";
import bcrypt from "bcryptjs";

export const signUp = async (req, res) => {
    try {
        const { username, email, password } = req.body;

        // Validate input
        if (!username || !email || !password) {
            return res.status(400).json({
                message: "All fields are required"
            });
        }

        // Check username duplication
        const checkUserByUsername = await User.findOne({ username });

        if (checkUserByUsername) {
            return res.status(400).json({
                message: "Username already exists"
            });
        }

        // Check email duplication
        const checkUserByEmail = await User.findOne({ email });

        if (checkUserByEmail) {
            return res.status(400).json({
                message: "Email already exists"
            });
        }

        // Password validation
        if (password.length < 6) {
            return res.status(400).json({
                message: "Password must be at least 6 characters"
            });
        }

        // Hash password
        const hashedPassword = await bcrypt.hash(password, 10);

        // Create user
        const user = await User.create({
            username,
            email,
            password: hashedPassword
        });

        // Generate token
        const token = await genToken(user._id);

        // Set cookie
        res.cookie("token", token, {
            httpOnly: true,
            maxAge: 7 * 24 * 60 * 60 * 1000,
            sameSite: "none",
            secure: true,
        });

        return res.status(201).json(user);

    } catch (error) {
        return res.status(500).json({
            message: `Signup error: ${error.message}`
        });
    }
};

export const login = async (req, res) => {
    try {
        const { email, password } = req.body;

        // Validate input
        if (!email || !password) {
            return res.status(400).json({
                message: "All fields are required"
            });
        }

        // Find user
        const user = await User.findOne({ email });

        if (!user) {
            return res.status(400).json({
                message: "User doesn't exist"
            });
        }

        // Verify password
        const isMatch = await bcrypt.compare(
            password,
            user.password
        );

        if (!isMatch) {
            return res.status(400).json({
                message: "Invalid password"
            });
        }

        // Generate token
        const token = await genToken(user._id);

        // Set cookie
        res.cookie("token", token, {
            httpOnly: true,
            maxAge: 7 * 24 * 60 * 60 * 1000,
            sameSite: "none",
            secure: true,
        });

        return res.status(200).json(user);

    } catch (error) {
        return res.status(500).json({
            message: `Login error: ${error.message}`
        });
    }
};

export const logout = async (req, res) => {
    try {
        res.clearCookie("token");

        return res.status(200).json({
            message: "Logout successful"
        });

    } catch (error) {
        return res.status(500).json({
            message: `Logout error: ${error.message}`
        });
    }
};