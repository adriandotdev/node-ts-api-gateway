import { NextFunction, Request, Response } from "express";

interface ExtendedRequest extends Request {
	username?: string;
	roles?: string[];
}

class RoleMiddleware {
	public RoleCheckerMiddleware(rolesForRoute: string[]) {
		return (req: ExtendedRequest, res: Response, next: NextFunction) => {
			(async () => {
				const result = rolesForRoute.some((role) => req.roles?.includes(role));

				if (!result) {
					return res
						.status(403)
						.json({ statusCode: 403, data: null, message: "Forbidden" });
				}

				next();
			})().catch(next);
		};
	}
}

export default RoleMiddleware;
