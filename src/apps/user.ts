import { startServer } from '../server';
import { initializeDB } from '../model/libs/db';
import { userRoutes } from '../routes/userRoutes';
/*
----init DB-----
*/

export const db = initializeDB();
/*
----start server-----
*/

startServer(3000, userRoutes, "/user", "user-service");