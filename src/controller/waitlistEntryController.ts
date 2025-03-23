import { db } from "../server";
import { user, waitlist, waitlistEntries } from "../../drizzle/schema";
import { Request, Response } from "express";
import { and, eq, or } from "drizzle-orm";


export const getAllWaitlistEntries  = async (req: Request, res: Response) => {
    const entries = await (await db).select().from(waitlistEntries)
    return res.status(200).json(entries)
}


export const createWaitlistEntry = async (req: Request, res: Response) => {
    const { userId, waitlistId, position, originalPosition, referredBy, status, statusUpdatedAt, joinedAt, isNotified, metadata } = req.body;

    //check if the waitlist and userId are already in the database and a waitlist entry for the user already exists
    if(!userId || !waitlistId || !position||!originalPosition||!referredBy||!status||!statusUpdatedAt||!joinedAt||!isNotified||!metadata){
        return res.status(400).json({error:"Missing Fields to create a waitlist entry!"})
    }
    try{
        const checkWaitlist = await (await db).select().from(waitlist).where(eq(waitlist.id, waitlistId));
        const checkUser = await (await db).select().from(user).where(eq(user.id, userId));

    if(!checkWaitlist || !checkUser){
        return res.status(404).json({ error: "Waitlist or user not found" });
    }
    // check if the waitlist entry for the same waitlist and user already exists
    const checkWaitlistEntry = await (await db).select().from(waitlistEntries).where(and(eq(waitlistEntries.userId, userId), eq(waitlistEntries.waitlistId, waitlistId)));
    if(checkWaitlistEntry.length > 0){
        console.log(`checkWaitlistEntry -> ${JSON.stringify(checkWaitlistEntry, null, 2)}`);
        return res.status(400).json({ error: "Waitlist entry already exists" });
    }

        const entry = await (await db).insert(waitlistEntries).values({ userId, waitlistId, position, originalPosition, referredBy, status, statusUpdatedAt, joinedAt, isNotified, metadata }).returning();
        return res.status(200).json(entry)
    }catch(error){
        console.log(`error -> ${JSON.stringify(error, null, 2)}`);
        return res.status(500).json({ error: error });
    }
}


export const updateWaitlistEntryUsingId = async (req: Request, res: Response) => {
    const { id } = req.params;
    const { userId, waitlistId, position, originalPosition, referredBy, status, statusUpdatedAt, joinedAt, isNotified, metadata } = req.body;


  try {
    const ifWaitlistEntry = await (await db).select().from(waitlistEntries).where(and(eq(waitlistEntries.waitlistId, waitlistId), eq(waitlistEntries.userId,userId)));


    if(ifWaitlistEntry){
    const entry = await (await db).update(waitlistEntries).set({ userId , waitlistId, position, originalPosition, referredBy, status, statusUpdatedAt, joinedAt, isNotified, metadata }).where(eq(waitlistEntries.id, id)).returning();
    return res.status(200).json(entry);
    }
    return res.status(400).json({message:`Cannot find wailisting entry for the user and the waitlisting!`});

  } catch (error) {
      return res.status(400).json({message:`Error updating the waitlist entry!`, error: error});
    
  }

    
}   


export const deleteWaitlistEntryUsingId = async (req: Request, res: Response) => {
    const { id } = req.params;
    const entry = await (await db).delete(waitlistEntries).where(eq(waitlistEntries.id, id));
    return res.status(200).json(entry);
}   






