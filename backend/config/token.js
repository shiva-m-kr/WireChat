import jwt from "jsonwebtoken"


const genToken = async(id)=>{
    try{
        const token = await jwt.sign({id},process.env.JWT_SECRET,{expiresIn:"1d"});
        return token

    }catch(error){ 
        console.log("error in generating token",error);
    }
}

export default genToken