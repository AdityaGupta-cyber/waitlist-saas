import { db } from "../apps/payment";
import { organisation, payment } from "../../drizzle/schema";
import { eq } from "drizzle-orm";
import { Request, Response } from "express";
import { getRedisClient } from "../utils/cache/redis";


export const createPayment = async (req: Request, res: Response) => {
    const { organisationId, amount, paymentMethod, paymentStatus, paymentDate } = req.body;

    if (!organisationId || !amount || !paymentMethod || !paymentStatus || !paymentDate) {
        if(paymentDate) {
        //check if the payment date is a valid date
        if(isNaN(new Date(paymentDate).getTime())) {
            return res.status(400).json({ message: "Invalid payment date" });
        }
        }
        return res.status(400).json({ message: "All fields are required" });
    }
    try {
        const createPayment = await (await db).insert(payment).values({ 
            organisationId,
            amount,
            paymentMethod,
            paymentStatus,
            paymentDate: new Date(paymentDate)
         }).returning();
        return res.status(200).json({ message: "Payment created successfully", data: createPayment });
    } catch (error) {
        console.log(error);
        return res.status(500).json({ message: "Internal server error", error });
    }

}

export const getAllPayments = async (req: Request, res: Response) => {
    
    const { org:organisationId } = req.query;
    console.log(`organisationId: ${organisationId}`);
    if(!organisationId) {
        return res.status(400).json({ message: "Organisation ID is required" });
    }
    const checkOrganisation = await (await db).select().from(organisation).where(eq(organisation.id, organisationId as string));
    if(checkOrganisation.length === 0) {
        return res.status(400).json({ message: "Organisation not found" });
    }
    console.log(`checkOrganisation: ${JSON.stringify(checkOrganisation, null, 2)}`);
    try {
        const payments = await (await db).select().from(payment).where(eq(payment.organisationId, organisationId as string));
        return res.status(200).json(payments);
    } catch (error) {
        console.log(error);
        return res.status(500).json({ message: "Internal server error", error });
    }
}

export const updatePaymentWithId = async (req: Request, res: Response) => {
    const { id } = req.params;
    const { amount, paymentMethod, paymentStatus, paymentDate } = req.body;
    const payments = await (await db).update(payment).set({ amount, paymentMethod, paymentStatus, paymentDate }).where(eq(payment.id, id)).returning();
    return res.status(200).json(payments);
}

export const deletePaymentWithId = async (req: Request, res: Response) => {
    const { id } = req.params;
    const deletedPayment = await (await db).delete(payment).where(eq(payment.id, id));
    return res.status(200).json(deletedPayment);
}






