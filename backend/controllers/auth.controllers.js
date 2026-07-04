import genToken from "../config/token.js"
import User from "../models/user.model.js"
import bcrypt from "bcryptjs"

export const signUp = async (req, res) => {
    try {
        const { username, email, password } = req.body // yha pe frontend se data aayega
        if (!username || !email || !password) {
            return res.status(400).json({ message: "All fields are required" })
        }

        // yha pe ham duplicates ko dekhange emails and username ko backend se check krenge
        const checkUserByUsername = await User.findOne({ username })
        if (checkUserByUsername) {
            return res.status(400).json({ message: "Username already exists" })
        }
        const checkUserByEmail = await User.findOne({ email })
        if (checkUserByEmail) {
            return res.status(400).json({ message: "Email already exists" })
        }
        // password kliy e codition check krenge
        if (password.length < 6) {
            return res.status(400).json({ message: "Password must be at least 6 characters" })
        }
        const hasedPassword = await bcrypt.hash(password, 10);

        const user = await User.create({
            username,
            email,
            password: hasedPassword
        })

        const token = await genToken(user._id)
        res.cookie("token", token, {
            httpOnly: true,
            maxAge: 7 * 24 * 60 * 60 * 1000,
            sameSite: "None",
            secure: true,
        })
        return res.status(201).json(user)


    } catch (error) {
        return res.status(500).json({ message: `signup error ${error.message}` })
    }
}

















export const login = async (req, res) => {
    try {
        const { email, password } = req.body // yha pe frontend se data aayega
        if (!email || !password) {
            return res.status(400).json({
                message: "All fields are required"
            });
        }

        // yha pe ham duplicates ko dekhange emails and username ko backend se check krenge

        const user = await User.findOne({ email })
        if (!user) {
            return res.status(400).json({ message: "user doesn't exists" })
        }

        const isMatch = await bcrypt.compare(password, user.password)
        if (!isMatch) {
            return res.status(400).json({ message: "Invalid Password" })
        }


        const token = await genToken(user._id)
        res.cookie("token", token, {
            httpOnly: true,
            maxAge: 7 * 24 * 60 * 60 * 1000,
            sameSite: "lax",
            secure: false,
        })
        return res.status(201).json(user)


    } catch (error) {
        return res.status(500).json({ message: `login error ${error.message}` })

    }
}







export const logout = async (req, res) => {
    try {
        res.clearCookie("token")
        return res.status(200).json({ message: "Logout successfully" })
    } catch (error) {
        return res.status(500).json({ message: `Logout error ${error.message}` })
    }
}

