import { Request, Response, NextFunction } from "express";
import jwt from "jsonwebtoken";

interface ExtendedRequest extends Request {
	username?: string;
	roles?: string[];
}

interface JwtPayload {
	username: string;
	roles: string[];
	iat: number;
	exp: number;
}

class AuthenticationMiddleware {
	public TokenMiddleware() {
		return (req: ExtendedRequest, res: Response, next: NextFunction) => {
			(async () => {
				try {
					const auth = req.headers.authorization;

					if (!auth) {
						return res.status(401).json({
							statusCode: 401,
							data: null,
							message: "No token provided",
						});
					}

					let type = auth.split(" ")[0];
					let token = auth.split(" ")[1];

					if (type !== "Bearer")
						return res.status(401).json({
							statusCode: 401,
							data: null,
							message: "Invalid token type",
						});

					if (!token)
						return res.status(401).json({
							statusCode: 401,
							data: null,
							message: "No token provided",
						});

					const JWT_SECRET = "your_jwt_secret_key";

					jwt.verify(token, JWT_SECRET, (err, decode) => {
						if (err) {
							return res.status(401).json({
								statusCode: 401,
								data: null,
								message: "Invalid token",
							});
						}

						const payload = decode as JwtPayload;

						req.username = payload.username;
						req.roles = payload.roles;
					});

					next();
				} catch (err) {
					next(err);
				}
			})().catch(next);
		};
	}
}

export default AuthenticationMiddleware;
