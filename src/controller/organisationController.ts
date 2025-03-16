import { db } from "../apps/organisation";
import { organisation } from "../../drizzle/schema";
import { Request, Response } from "express";
import { eq, or } from "drizzle-orm";



export const getAllOrganisations = async (req: Request, res: Response) => {
    try {
        const allOrganisations = await (await db)
            .select({
                id: organisation.id,
                name: organisation.name,
                email: organisation.email,
                phone: organisation.phone,
                website: organisation.website,
                logoUrl: organisation.logoUrl,
                createdAt: organisation.createdAt,
                updatedAt: organisation.updatedAt
            })
            .from(organisation);
        return res.status(200).json(allOrganisations);
    } catch (error) {
        console.log(error);
        return res.status(500).json({ error: "Internal server error" });
    }
}


export const createOrganisation = async (req: Request, res: Response) => {
    try {
        const { name, email, phone, website, logoUrl, password } = req.body;

        if(!name || !email || !phone || !website || !logoUrl){
            return res.status(400).json({ error: "All fields are required" });
        }

        const existingOrganisation = await (await db).select().from(organisation).where(or(eq(organisation.email, email), eq(organisation.name, name)));
        if(existingOrganisation.length > 0){
            return res.status(400).json({ error: "Organisation already exists" });
        }

        const newOrganisation = await (await db).insert(organisation).values({ name, email, phone, website, logoUrl, password }).returning({
            id: organisation.id,
            name: organisation.name,
            email: organisation.email,
            phone: organisation.phone,
            website: organisation.website,
            logoUrl: organisation.logoUrl,
            createdAt: organisation.createdAt,
        })
        return res.status(201).json(newOrganisation);
    } catch (error) {
        console.log(error);
        return res.status(500).json({ error: "Internal server error" });
    }
}


export const updateOrganisationWithId = async (req: Request, res: Response) => {
    try {
        const { id } = req.params;
        const { name, email, phone, website, logoUrl, isActive } = req.body;

        if(!id){
            return res.status(400).json({ error: "Id is required" });
        }
        else if(!name || !email || !phone || !website || !logoUrl ){
            return res.status(400).json({ error: "All fields are required" });
        }

        const existingOrganisation = await (await db).select().from(organisation).where(eq(organisation.id, id));
        if(existingOrganisation.length === 0){
            return res.status(404).json({ error: "Organisation not found" });
        }

            await (await db).update(organisation).set({
                name: name,
                email: email,
                phone: phone,
                website: website,
                logoUrl: logoUrl,
                isActive: isActive ? true : false,
            }).where(eq(organisation.id, id)).returning({
                id: organisation.id,
                name: organisation.name,
                email: organisation.email,
                phone: organisation.phone,
                website: organisation.website,
                logoUrl: organisation.logoUrl,
                isActive: organisation.isActive,
                createdAt: organisation.createdAt,
                updatedAt: organisation.updatedAt,
            });
            return res.status(200).json(existingOrganisation);
        }
     
     catch (error) {
        return res.status(500).json({ error: "Internal server error" });
    }
}


export const deleteOrganisationWithId = async (req: Request, res: Response) => {
    try {
        const { id } = req.params;
        if(!id){    
            return res.status(400).json({ error: "Id is required" });
        }

        const existingOrganisation = await (await db).select().from(organisation).where(eq(organisation.id, id));
        console.log(`existingOrganisation: ${JSON.stringify(existingOrganisation,null,2)}`);
        if(existingOrganisation.length === 0){
            return res.status(404).json({ error: "Organisation not found" });
        }
        if(existingOrganisation[0].isActive){
            await (await db).update(organisation).set({
                isActive: false,
            }).where(eq(organisation.id, id));
            return res.status(200).json({ message: "Organisation deleted successfully" });
        }
        else{
            return res.status(400).json({ error: "Organisation is not active" });
        }
    } catch (error) {
        return res.status(500).json({ error: "Internal server error" });
    }
}
