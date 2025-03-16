import { startServer } from '../server';
import { initializeDB } from '../model/libs/db';
import { waitlistRoutes } from '../routes/waitlistRoutes';
/*
----init DB-----
*/

export const db = initializeDB();
/*
----start server-----
*/

startServer(3000, waitlistRoutes, "/waitlist", "waitlist-service");