import { createOrganisation, deleteOrganisationWithId, getAllOrganisations, updateOrganisationWithId } from "../controller/organisationController";
import { RouteControllers } from "../types/server";




export const organisationRoutes: RouteControllers[] = [
    {
        method: "get",
        routePattern: "",
        controller: getAllOrganisations
    },
    {
        method: "post",
        routePattern: "",
        controller: createOrganisation
    },
    {
        method: "put",
        routePattern: ":id",
        controller: updateOrganisationWithId
    },
    {
        method: "delete",
        routePattern: ":id",
        controller: deleteOrganisationWithId
    }
]
