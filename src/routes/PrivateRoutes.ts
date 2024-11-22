import { Request } from "express";

const privateRoutes = [
	{
		path: "/api/users/change-password",
		auth: true,
		rateLimit: {
			windowMs: 10 * 1000,
			limit: 3,
		},
		proxy: {
			target: "http://localhost:8800",
			changeOrigin: true,
			pathRewrite: { "^/": "/api/v1/users/change-password" },
		},
		roles: ["ADMIN", "USER"],
	},
	{
		path: "/api/users/:username",
		auth: true,
		rateLimit: {
			windowMs: 10 * 1000,
			limit: 5,
		},
		proxy: {
			target: "http://localhost:8800",
			changeOrigin: true,
			pathRewrite: (path: string, req: Request) => {
				const match = req.baseUrl.match(/^\/api\/users\/([^/]+)/); // Extract username from original URL

				if (match && match[1]) {
					const username = match[1];
					return `/api/v1/users/${username}/details`; // Rewrite path
				}

				throw new Error("Username is missing in the request path");
			},
		},
		roles: ["ADMIN", "USER"],
	},
	{
		path: "/api/admin/dashboard",
		auth: true,
		rateLimit: {
			windowMs: 10 * 1000,
			limit: 10,
		},
		proxy: {
			target: "http://localhost:8800",
			changeOrigin: true,
			pathRewrite: {
				"^/": "/api/v1/admin/dashboard",
			},
		},
		roles: ["ADMIN"],
	},
];

export default privateRoutes;
