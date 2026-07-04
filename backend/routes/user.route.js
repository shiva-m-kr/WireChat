import express from "express";
import isAuth from "../middlewares/isAuth.js"
import {editProfile, getCurrentUser} from "../controllers/user.controller.js"
import upload from "../middlewares/multer.js"
import { getOtherUsers } from "../controllers/user.controller.js";


const userRouter = express.Router();


userRouter.get("/current",isAuth,getCurrentUser)
userRouter.get("/others",isAuth,getOtherUsers)
userRouter.put("/profile",isAuth,upload.single("image"),editProfile)


export default userRouter