import { register, login, sendMagicLink } from "../controller/authController";
import { RouteControllers } from "../types/server";





export const authRoutes: RouteControllers[] = [
    {
        method: "post",
        routePattern: "register",
        controller: register
    },
    {
        method: "post",
        routePattern: "login",
        controller: login
    }
]