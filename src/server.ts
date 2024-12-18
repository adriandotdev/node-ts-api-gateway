import dotenv from "dotenv";

dotenv.config();

import express, { Application } from "express";
import morgan from "morgan";

import {
	setupAuthenticationMiddleware,
	setupAuthenticationRoutes,
	setupPrivateRoutes,
	setupRateLimiter,
	setupRoleManagementMiddleware,
} from "./config/routesSetup";

const app: Application = express();

app.use(morgan("combined"));

setupRateLimiter(app);
setupAuthenticationMiddleware(app);
setupRoleManagementMiddleware(app);
setupAuthenticationRoutes(app);
setupPrivateRoutes(app);

app.listen(process.env.PORT, () => {
	console.log("Server is running on port " + process.env.PORT);
});
