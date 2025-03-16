import { createPayment, deletePaymentWithId, getAllPayments, updatePaymentWithId } from "../controller/paymentController";
import { RouteControllers } from "../types/server";




export const paymentRoutes: RouteControllers[] = [
    {
        method: "get",
        routePattern: "",
        controller: getAllPayments
    },
    {
        method: "post",
        routePattern: "",
        controller: createPayment
    },
    {
        method: "put",
        routePattern: ":id",
        controller: updatePaymentWithId
    },
    {
        method: "delete",
        routePattern: ":id",
        controller: deletePaymentWithId
    }
]
