const authenticationRoutes = [
	{
		path: "/api/auth/login",
		auth: false,
		rateLimit: {
			windowMs: 15 * 60 * 1000,
			max: 5,
		},
		proxy: {
			target: "http://localhost:8800/api/v1/accounts/login",
			changeOrigin: true,
			pathRewrite: {
				"^/api/auth/login": "",
			} as { [key: string]: string },
		},
	},
	{
		path: "/api/auth/register",
		auth: false,
		rateLimit: {
			windowMs: 15 * 60 * 1000,
			max: 5,
		},
		proxy: {
			target: "http://localhost:8800/api/v1/accounts/register",
			changeOrigin: true,
			pathRewrite: {
				"^/api/auth/register": "",
			} as { [key: string]: string },
		},
	},
];

export default authenticationRoutes;
