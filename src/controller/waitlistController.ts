import { Request, Response } from "express";
import { db } from "../apps/waitlist";
import { waitlist } from "../../drizzle/schema";
import { isValidEmail } from "../utils/index";
import { eq } from "drizzle-orm";



export const waitlistController = async(req: Request, res: Response) => {
    try {
        const allModelsForWaitlist = await (await db).select().from(waitlist);
        return res.status(200).json(allModelsForWaitlist);
    } catch (error) {
        console.log(error);
        return res.status(500).json({ error: "Internal server error" });
    }
}




export const addToWaitlist = async(req: Request, res: Response) => {
    const { name, organisationId, slug, allowReferrals, referralBonusPosition, isActive } = req.body;
    /*
    * verify if the email is valid and if it is already in the waitlist
    */
    if (!name || !organisationId || !slug  || !referralBonusPosition ) {
        console.log(`
            name: ${name},
            organisationId: ${organisationId},
            slug: ${slug},
            allowReferrals: ${allowReferrals},
            referralBonusPosition: ${referralBonusPosition},
            isActive: ${isActive}
            `)
        return res.status(400).json({ error: "Invalid request body" });
    }

    const existingWaitList = await (await db).select().from(waitlist).where(eq(waitlist.name, name));
    if (existingWaitList.length > 0) {
        return res.status(400).json({ error: "Project for the waitlist with the same name already exists!" });
    }
    const newWaitlist = await (await db).insert(waitlist).values({ 
        name: name,
        organisationId: organisationId,
        slug: slug,
        allowReferrals: allowReferrals,
        currentSignUps: 0,
        maxSignUps: 100,
        referralBonusPosition: referralBonusPosition,
        isActive: isActive,
     }).returning();
    return res.status(200).json(newWaitlist);
}


export const updateWaitlistUsingId = async(req: Request, res: Response) => {
    const { id } = req.params;
    const { name, organisationId, slug, allowReferrals, referralBonusPosition, isActive } = req.body;
    if (!id) {
        return res.status(400).json({ error: "Id is required" });
    }
    else if (!name || !organisationId || !slug  || !referralBonusPosition ) {
        return res.status(400).json({ error: "Invalid request body" });
    }
 try {
    const updatedWaitlist = await (await db).update(waitlist).set({
        name: name,
        organisationId: organisationId,
        slug: slug,
        allowReferrals: allowReferrals,
        referralBonusPosition: referralBonusPosition,
        isActive: isActive,
    }).where(eq(waitlist.id, id)).returning();
    return res.status(200).json(updatedWaitlist);
 } catch (error) {
    console.log(error);
    return res.status(500).json({ error: "Internal server error" });

 }
}


export const deleteWaitlistUsingId = async(req: Request, res: Response) => {
    const { id } = req.params;
    console.log(id);
    if (!id) {
        return res.status(400).json({ error: "Id is required" });
    }
    try {
        const ifWaitlistExists = await (await db).select().from(waitlist).where(eq(waitlist.id, id));
        if (ifWaitlistExists.length === 0) {
            return res.status(404).json({ error: "Waitlist not found" });
        }
        console.log(`ifWaitlistExists: ${JSON.stringify(ifWaitlistExists,null,2)}`);
      if(ifWaitlistExists[0].isActive === true){
        await (await db).update(waitlist).set({
            isActive: false,
        }).where(eq(waitlist.id, id));
        return res.status(200).json({ message: "Waitlist deleted successfully" });
      }
      else{
        return res.status(400).json({ error: "Waitlist is not active" });
      }
      
    } catch (error) {
        console.log(error);
        return res.status(500).json({ error: "Internal server error" });
    }
}

