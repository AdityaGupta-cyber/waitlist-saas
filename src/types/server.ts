import { NextFunction, Request, Response } from "express";

export type RouteControllers = {
    method: "get" | "post" | "put" | "delete"; 
    routePattern: string;
    controller: (req: Request, res: Response) => void;
    middleware?: ((req: Request, res: Response, next: NextFunction) => void)[];
};