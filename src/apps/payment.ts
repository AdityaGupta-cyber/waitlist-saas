import { startServer } from '../server';
import { initializeDB } from '../model/libs/db';
import { paymentRoutes } from '../routes/paymentRoutes';
/*
----init DB-----
*/

export const db = initializeDB();
/*
----start server-----
*/

startServer(3000, paymentRoutes, "/payment", "payment-service");