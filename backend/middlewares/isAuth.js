import jwt from "jsonwebtoken";

const isAuth = async (req, res, next) => {
  try {
    console.log("Cookies:", req.cookies);
    console.log("Token:", req.cookies.token);

    const token = req.cookies.token;

    if (!token) {
      return res.status(401).json({
        message: "You are not logged in",
      });
    }

    const verifytoken = jwt.verify(
      token,
      process.env.JWT_SECRET
    );

    console.log(verifytoken);

    req.userId = verifytoken.id; // <-- FIX

    next();
  } catch (error) {
    console.log("AUTH ERROR:", error);

    return res.status(500).json({
      message: error.message,
    });
  }
};

export default isAuth;