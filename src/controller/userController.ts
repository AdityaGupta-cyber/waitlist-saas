import { Request, Response } from "express";
import { db } from "../server";
import { user } from "../../drizzle/schema";
import { isValidEmail } from "../utils/index";
import { and, eq, or } from "drizzle-orm";







export const getAllUsers = async (req: Request, res: Response) => {
    try {
        const allUsers = await (await db).select({
            id: user.id,
            name: user.name,
            email: user.email,
            phone: user.phone,
            organisationId: user.organisationId,
            createdAt: user.createdAt,
            updatedAt: user.updatedAt
        }).from(user).where(eq(user.organisationId, `orga_0fe76b9c-7dad-44f5-a76c-a7d753d711fe`));

        
        return res.status(200).json(allUsers);
    } catch (error) {
        console.log(error);
    }
}



export const createUser = async (req: Request, res: Response) => {
    try {
        const { name, email, phone, organisationId } = req.body;

        if(!name || !email || !phone || !organisationId){
            return res.status(400).json({ error: "All fields are required" });
        }
        
        const existingUser = await (await db).select().from(user).where(or(eq(user.email, email), eq(user.phone, phone)));
        if(existingUser.length > 0 && existingUser[0].organisationId === organisationId){
            return res.status(400).json({ error: "User already exists" });
        }

        const newUser = await (await db).insert(user).values({ name, email, phone, organisationId }).returning({
            id: user.id,
            name: user.name,
            email: user.email,
            phone: user.phone,
            organisationId: user.organisationId,
            createdAt: user.createdAt,
            updatedAt: user.updatedAt
        });
        return res.status(201).json(newUser);
    } catch (error) {
        console.log(error);
    }
}


export const updateUserUsingId = async (req: Request, res: Response) => {
    try {
        const { id } = req.params;
        console.log(`id: ${id}`);
        if(!id){
            return res.status(400).json({ error: "Id is required" });
        }
        const { name, email, phone, organisationId } = req.body;
        if(!name || !email || !phone || !organisationId){
            return res.status(400).json({ error: "All fields are required" });
        }
        
        const existingUser = await (await db).select().from(user).where(eq(user.id, id));
        if(existingUser.length === 0){
            return res.status(404).json({ error: "User not found" });
        }

        const updatedUser = await (await db).update(user).set({ name, email, phone, organisationId }).where(and(eq(user.id, id), eq(user.organisationId, `orga_0fe76b9c-7dad-44f5-a76c-a7d753d711fe`))).returning({
            id: user.id,
            name: user.name,
            email: user.email,
            phone: user.phone,
            organisationId: user.organisationId,
            createdAt: user.createdAt,
            updatedAt: user.updatedAt
        });
        return res.status(200).json(updatedUser);
    } catch (error) {
        console.log(error);
        res.status(500).json({error: `${JSON.stringify(error,null,2)}`});
    }
}


export const deleteUserUsingId = async (req: Request, res: Response) => {
    try {
        const { id } = req.params;
        if(!id){
            return res.status(400).json({ error: "Id is required" });
        }
        const existingUser = await (await db).select().from(user).where(eq(user.id, id));
        if(existingUser.length === 0){
            return res.status(404).json({ error: "User not found" });
        }

        return res.status(200).json({ message: "User deleted successfully ---- YET TO BE IMPLEMENTED" });
    } catch (error) {
        console.log(error);
        return res.status(500).json({error: `${JSON.stringify(error,null,2)}`});
    }
}



