import { db } from "../server";
import { Request, Response } from "express";
import { organisation } from "../../drizzle/schema";
import { registerSchema, loginSchema } from "../libs/validate/zod";
import { eq } from "drizzle-orm";
import jwt from "jsonwebtoken";
export const register = async (req: Request, res: Response) => {
    const { email, name, phone } = req.body;
    const validate = registerSchema.safeParse(req.body);
    if(!validate.success){
        return res.status(400).json({ error: validate.error.message });
    }
    try {

        const org = await (await db).select().from(organisation).where(eq(organisation.email, email));
        if(org.length > 0){
            return res.status(400).json({ error: "Organisation already exists" });
        }
        const newOrg = await (await db).insert(organisation).values({ email,  name, phone }).returning({
            id: organisation.id,
            email: organisation.email,
            name: organisation.name,
            phone: organisation.phone,
            createdAt: organisation.createdAt,
            updatedAt: organisation.updatedAt,
        });
        res.status(201).json(newOrg);
    } catch (error) {
        console.log(error);
        return res.status(500).json({ error: "Internal server error" });
    }
}

export const login = async (req: Request, res: Response) => {
    const { email } = req.body;
    const validate = loginSchema.safeParse(req.body);
    if(!validate.success){
        return res.status(400).json({ error: validate.error.message });
    }
    const org = await (await db).select().from(organisation).where(eq(organisation.email, email));

    if(!org){
        return res.status(404).json({ error: "Organisation not found" });
    }
    if(org.length === 0){
        return res.status(404).json({ error: "Organisation not found" });
    }
    const cleanedOrg = {...org[0], password: undefined};
    const jwtToken = jwt.sign({data: cleanedOrg}, process.env.JWT_SECRET as string || "secret", {expiresIn: "1d"});
    res.status(200).json({token: jwtToken});
}

export const sendMagicLink = async (req: Request, res: Response) => {
    const { email } = req.body;

    res.status(200).json({ message: "Magic link sent" });
}