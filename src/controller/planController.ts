import { plan } from "../../drizzle/schema";
import { db } from "../server";
import { Request, Response } from "express";
import { eq } from "drizzle-orm";








export const getAllPlans = async (req: Request, res: Response) => {
    const plans = await (await db).select().from(plan).where(eq(plan.isActive, true));
    return res.status(200).json(plans);
}


export const createPlan = async (req: Request, res: Response) => {
    const { name, description, price, duration, createdAt, updatedAt } = req.body;

    if (!name || !description || !price || !duration || !createdAt || !updatedAt) {
        return res.status(400).json({ error: "Missing fields to create a plan!" });
    }
    res.json({ message: "Plan created successfully!" });

}



export const updatePlan = async (req: Request, res: Response) => {
    const { id } = req.params;
    const { name, description, price, duration, createdAt, updatedAt } = req.body;

    if (!name || !description || !price || !duration || !createdAt || !updatedAt) {
        return res.status(400).json({ error: "Missing fields to update a plan!" });
    }
    res.json({ message: "Plan updated successfully!" });
}


export const deletePlan = async (req: Request, res: Response) => {
    const { id } = req.params;
    const deletedPlan = await (await db).delete(plan).where(eq(plan.id, id));
    return res.status(200).json({ message: "Plan deleted successfully!", deletedPlan });
}

