import { RouteControllers } from "../types/server";
import { waitlistController, addToWaitlist, updateWaitlistUsingId, deleteWaitlistUsingId } from '../controller/waitlistController';





export const waitlistRoutes: RouteControllers[] = [
    {
        method: "get",
        routePattern: "",
        controller: waitlistController
    },
    {
        method: "post",
        routePattern: "",
        controller: addToWaitlist
    },
    {
        method:"put",
        routePattern:":id",
        controller: updateWaitlistUsingId
    },
    {
        method:"delete",
        routePattern:":id",
        controller: deleteWaitlistUsingId
    }
]
