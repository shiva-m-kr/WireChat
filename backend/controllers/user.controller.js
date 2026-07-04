import uploadOnCloudnery from "../config/cloudnery.js";
import User from "../models/user.model.js";
export const getCurrentUser = async (req, res) => {
    try{
        let userId = req.userId;
        const user = await User.findById(userId).select("-password");
        if(!user){
            return res.status(400).json({message:"User not found"});
        }
        return res.status(200).json(user);
        
    }catch(error){
        return res.status(500).json({message:`getCurrentUser error ${error.message}`})
    }
}

export const editProfile = async (req, res) => {
    try {

        const { name } = req.body;

        const updateData = {
            name
        };

        if (req.file) {
            updateData.image = await uploadOnCloudnery(req.file.path);
        }

        const user = await User.findByIdAndUpdate(
            req.userId,
            updateData,
            {
                new: true
            }
        );

        if (!user) {
            return res.status(400).json({
                message: "User not found"
            });
        }

        return res.status(200).json(user);

    } catch (error) {

        return res.status(500).json({
            message: `Profile error ${error.message}`
        });

    }
};





// to get other users 
export const getOtherUsers = async (req, res) => {
    try{
        let users = await User.find({
            _id:{
                $ne:req.userId
            }
        }).select("-password");
        return res.status(200).json(users)
    }catch(error){
        return res.status(500).json({message:`getOtherUsers error ${error.message}`})
    }
}