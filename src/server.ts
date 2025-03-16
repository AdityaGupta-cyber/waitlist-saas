import express, { Request, Response } from "express";
import { RouteControllers } from "./types/server";
import { globalMiddleware } from "./middleware/globalMiddleware";
import { connectToRedis } from "./utils/cache/redis";
// import { initializeDB } from "./model/libs/db";

export function startServer(port: number, routes: RouteControllers[], routePrefix= "", mircroserviceName="Microservice") {

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
---- routes ----
*/
routes.forEach(({ method, routePattern, controller,middleware }) => {
    if(middleware) {
      (app as any)[method](`${routePrefix}/${routePattern}`, middleware, controller); 
    } else {
      (app as any)[method](`${routePrefix}/${routePattern}`, controller); 
    }
    console.log(`Registered: ${routePrefix}/${routePattern}`)
  });

  /*
  ----- health check route ------
  */
  app.get(`${routePrefix}/ping`, (req: Request, res: Response) => {
    res.send(`Pong from the ${mircroserviceName} microservice on port ${port}!`);
  });

  app.listen(port, () => {
    console.log(`${mircroserviceName} listening on port ${port}`);
  });
}
