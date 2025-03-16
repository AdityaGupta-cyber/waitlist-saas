import { RouteControllers } from "../types/server";
    import { getAllUsers, createUser, updateUserUsingId, deleteUserUsingId } from '../controller/userController';





export const userRoutes: RouteControllers[] = [
    {
        method: "get",
        routePattern: "",
        controller: getAllUsers
    },
    {
        method: "post",
        routePattern: "",
        controller: createUser
    },
    {
        method:"put",
        routePattern:":id",
        controller: updateUserUsingId
    },
    {
        method:"delete",
        routePattern:":id",
        controller: deleteUserUsingId
    }
]
