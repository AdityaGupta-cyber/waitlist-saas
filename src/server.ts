import express, { Request, Response } from "express";
import { RouteControllers } from "./types/server";
import { globalMiddleware } from "./middleware/globalMiddleware";
import { connectToRedis } from "./utils/cache/redis";
import 'dotenv/config';

// Import all routes
import { waitlistRoutes } from './routes/waitlistRoutes';
import { organisationRoutes } from './routes/organisationRoutes';
import { userRoutes } from './routes/userRoutes';
import { waitlistEntryRoutes } from './routes/waitlistEntryRoutes';
import { planRoutes } from './routes/planRoutes';
import { paymentRoutes } from './routes/paymentRoutes';
import { authRoutes } from './routes/authRoutes';
// Import DB initialization
import { initializeDB } from "./model/libs/db";

// Initialize DB once for all services
export const db = initializeDB();

// Define service configurations
const services = [
  { routes: authRoutes, prefix: "/auth", name: "auth-service"},
  { routes: waitlistRoutes, prefix: "/waitlist", name: "waitlist-service" },
  { routes: organisationRoutes, prefix: "/org", name: "organisation-service" },
  { routes: userRoutes, prefix: "/user", name: "user-service" },
  { routes: waitlistEntryRoutes, prefix: "/waitlist-entries", name: "waitlist-entries-service" },
  { routes: planRoutes, prefix: "/plan", name: "plan-service" },
  { routes: paymentRoutes, prefix: "/payment", name: "payment-service" }
];

export function startUnifiedServer(port: number = 8080) {
  /*
  ----- initialize express app -----
  */
  const app = express();

  /*
  ----- initialise redis ------
  */
  connectToRedis().then(() => {
    console.log("Redis connected");
  }).catch((err) => {
    console.log("Redis connection failed", err);
  });

  /*
  ---- middleware ----
  */
  app.use(express.json());
  app.use(express.urlencoded({ extended: true }));
  app.use(globalMiddleware);

  /*
  ---- register all service routes ----
  */
  services.forEach(service => {
    service.routes.forEach(({ method, routePattern, controller, middleware }) => {
      const fullPath = `${service.prefix}/${routePattern}`;
      if (middleware) {
        (app as any)[method](fullPath, middleware, controller);
      } else {
        (app as any)[method](fullPath, controller);
      }
      console.log(`Registered: ${fullPath} (${service.name})`);
    });

    // Add health check route for each service
    app.get(`${service.prefix}/ping`, (req: Request, res: Response) => {
      res.send(`Pong from the ${service.name}!`);
    });
  });

  // Global health check
  app.get('/ping', (req: Request, res: Response) => {
    res.send('All services are running!');
  });

  app.listen(port, () => {
    console.log(`Unified server listening on port ${port}`);
    services.forEach(service => {
      console.log(`- ${service.name} registered at ${service.prefix}`);
    });
  });
}
