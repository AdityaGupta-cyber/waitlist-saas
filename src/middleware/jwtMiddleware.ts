import { NextFunction, Request, Response } from "express";
import jwt from "jsonwebtoken";


export const jwtMiddleware = (req: Request, res: Response, next: NextFunction) => {
    const token = req.headers.authorization;
    if(!token){
        return res.status(401).json({ message: "Unauthorized" });
    }
    const cleanToken = token.split(" ")[1];
    const decoded = jwt.verify(cleanToken, process.env.JWT_SECRET as string || "secret");
    console.log(`token: ${token}`);
    console.log(`decoded: ${JSON.stringify(decoded, null, 2)}`);
  next();
}
