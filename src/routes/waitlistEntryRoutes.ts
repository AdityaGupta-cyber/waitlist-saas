

import { RouteControllers } from "../types/server";
import { getAllWaitlistEntries, createWaitlistEntry, updateWaitlistEntryUsingId, deleteWaitlistEntryUsingId } from '../controller/waitlistEntryController';





export const waitlistEntryRoutes: RouteControllers[] = [
    {
        method: "get",
        routePattern: "",
        controller: getAllWaitlistEntries
    },
    {
        method: "post",
        routePattern: "",
        controller: createWaitlistEntry
    },
    {
        method: "put",
        routePattern: ":id",
        controller: updateWaitlistEntryUsingId
    },
    {
        method: "delete",
        routePattern: ":id",
        controller: deleteWaitlistEntryUsingId
    }
]
