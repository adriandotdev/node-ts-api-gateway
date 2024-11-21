import path from "path";
import dotenv from "dotenv";

dotenv.config();

import express, { Application } from "express";
import { createProxyMiddleware } from "http-proxy-middleware";
import authenticationRoutes from "./routes/AuthenticationRoutes";
import morgan from "morgan";
import privateRoutes from "./routes/PrivateRoutes";
import AuthenticationMiddleware from "./middlewares/AuthenticationMiddleware";
import RoleMiddleware from "./middlewares/RoleMiddleware";

const app: Application = express();

app.use(morgan("combined"));

privateRoutes.forEach((route) => {
	let middleware = new AuthenticationMiddleware();

	if (route.auth) {
		app.use(route.path, middleware.TokenMiddleware());
	}
});

privateRoutes.forEach((route) => {
	let middleware = new RoleMiddleware();

	if (route.auth) {
		app.use(route.path, middleware.RoleCheckerMiddleware(route.roles));
	}
});

authenticationRoutes.forEach((route) => {
	app.use(route.path, createProxyMiddleware(route.proxy));
});

privateRoutes.forEach((route) => {
	app.use(route.path, createProxyMiddleware(route.proxy));
});

app.listen(process.env.PORT, () => {
	console.log("Server is running on port " + process.env.PORT);
});
