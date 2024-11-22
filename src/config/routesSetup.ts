import { Application, Request, Response } from "express";
import { createProxyMiddleware } from "http-proxy-middleware";
import { rateLimit } from "express-rate-limit";

// Routes
import authenticationRoutes from "../routes/AuthenticationRoutes";
import privateRoutes from "../routes/PrivateRoutes";

// Middlewares
import AuthenticationMiddleware from "../middlewares/AuthenticationMiddleware";
import RoleMiddleware from "../middlewares/RoleMiddleware";

interface ExtendedRequest extends Request {
	username?: string;
}

export const setupAuthenticationRoutes = (app: Application) => {
	authenticationRoutes.forEach((route) => {
		app.use(route.path, createProxyMiddleware(route.proxy));
	});
};

export const setupPrivateRoutes = (app: Application) => {
	privateRoutes.forEach((route) => {
		app.use(
			route.path,
			createProxyMiddleware({
				...route.proxy,
				on: {
					proxyReq: (proxyReq, req: ExtendedRequest, res: Response) => {
						proxyReq.setHeader("x-roles", JSON.stringify(route.roles));
						proxyReq.setHeader("x-username", String(req.username));
					},
				},
			})
		);
	});
};

export const setupAuthenticationMiddleware = (app: Application) => {
	privateRoutes.forEach((route) => {
		let middleware = new AuthenticationMiddleware();

		if (route.auth) {
			app.use(route.path, middleware.TokenMiddleware());
		}
	});
};

export const setupRoleManagementMiddleware = (app: Application) => {
	privateRoutes.forEach((route) => {
		let middleware = new RoleMiddleware();

		if (route.auth) {
			app.use(route.path, middleware.RoleCheckerMiddleware(route.roles));
		}
	});
};

export const setupRateLimiter = (app: Application) => {
	authenticationRoutes.forEach((route) => {
		app.use(route.path, rateLimit(route.rateLimit));
	});
};
