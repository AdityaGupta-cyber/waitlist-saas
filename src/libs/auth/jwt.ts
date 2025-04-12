import jwt from "jsonwebtoken"

export const generateJWT = async (user:object) => {
 
       const signedToken =  jwt.sign(user,process.env.JWT_SECRET as string);
        return signedToken;

}