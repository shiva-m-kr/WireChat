import { v2 as cloudinary } from 'cloudinary';
import fs from 'fs';
const uploadOnCloudnery =async(fliePath)=>{
// Configuration
    cloudinary.config({ 
        cloud_name: process.env.CLOUD_NAME, 
        api_key: process.env.API_KEY, 
        api_secret: process.env.API_SECRET // Click 'View API Keys' above to copy your API secret
    });

    try{
        const uploadResult = await cloudinary.uploader.upload(fliePath);
        fs.unlinkSync(fliePath);
        return uploadResult.secure_url
    }catch(error){
        fs.unlinkSync(fliePath);
        console.log(error)
    }
}


export default uploadOnCloudnery