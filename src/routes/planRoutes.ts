import { RouteControllers } from "../types/server";
import { getAllPlans, createPlan, updatePlan, deletePlan } from "../controller/planController";






export const planRoutes: RouteControllers[] = [
    {
        method: "get",
        routePattern: "",
        controller: getAllPlans
    },
    {
        method: "post",
        routePattern: "",
        controller: createPlan
    },
    {
        method: "put",
        routePattern: ":id",
        controller: updatePlan
    },
    {
        method: "delete",
        routePattern: ":id",
        controller: deletePlan
    }
]
