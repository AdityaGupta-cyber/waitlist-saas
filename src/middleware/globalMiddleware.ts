import { NextFunction, Request, Response } from "express";

// const rateLimit = new Map<string, number>();

export const globalMiddleware = (req: Request, res: Response, next: NextFunction) => {
    console.log("Global Middleware called--------- checking the request for all routes  ------ authentication and authorization will be done here\n the request is rate limited here");
    //check if the request is rate limited for a particular ip address
    console.log(`URL: ${req.url}`);
    next();
}


