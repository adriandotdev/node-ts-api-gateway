import { Application, Request, Response } from "express";
import { createProxyMiddleware } from "http-proxy-middleware";
import { rateLimit } from "express-rate-limit";

// Routes
import authenticationRoutes from "../routes/AuthenticationRoutes";
import privateRoutes from "../routes/PrivateRoutes";

// Middlewares
import AuthenticationMiddleware from "../middlewares/AuthenticationMiddleware";
import RoleMiddleware from "../middlewares/RoleMiddleware";
import Route from "../interfaces/IRoute";

/**
 * This interface extends the Request interface and add a username property to it.
 */
interface ExtendedRequest extends Request {
	username?: string;
}

/**
 * This function is responsible for setting up the authentication routes. */
export const setupAuthenticationRoutes = (app: Application) => {
	authenticationRoutes.forEach((route) => {
		app.use(route.path, createProxyMiddleware(route.proxy));
	});
};

/**
 * This function is responsible for setting up the private routes. */
export const setupPrivateRoutes = (app: Application) => {
	privateRoutes.forEach((route) => {
		app.use(
			route.path,
			createProxyMiddleware({
				...route.proxy,
				on: {
					/**
					 * This event is fired upon request, and this responsible to attach a new header to the upcoming request and attach the username, and roles of user.
					 */
					proxyReq: (proxyReq, req: ExtendedRequest, res: Response) => {
						proxyReq.setHeader("x-roles", JSON.stringify(route.roles));
						proxyReq.setHeader("x-username", String(req.username));
					},
				},
			})
		);
	});
};

/**
 * This function is responsible to setup an authentication middleware for all of the routes.
 * @param app
 */
export const setupAuthenticationMiddleware = (app: Application) => {
	privateRoutes.forEach((route) => {
		let middleware = new AuthenticationMiddleware();

		if (route.auth) {
			app.use(route.path, middleware.TokenMiddleware());
		}
	});
};

/**
 * This function is responsible to setup a role management middleware for all of the routes.
 */
export const setupRoleManagementMiddleware = (app: Application) => {
	privateRoutes.forEach((route) => {
		let middleware = new RoleMiddleware();

		if (route.auth) {
			app.use(route.path, middleware.RoleCheckerMiddleware(route.roles));
		}
	});
};

export const setupRateLimiter = (app: Application) => {
	setupRateLimit(app, authenticationRoutes);
	setupRateLimit(app, privateRoutes);
};

const setupRateLimit = (app: Application, routes: Route[]) => {
	routes.forEach((route: Route) => {
		app.use(route.path, rateLimit(route.rateLimit));
	});
};
