import express, { Application, NextFunction, Request, Response } from "express";
import bcrypt from "bcryptjs";
import jwt from "jsonwebtoken";

const app: Application = express();
const port = 8800;

// Middleware to parse JSON request body
app.use(express.json());

// In-memory store for users (just for testing)
const users: any = {
	admin: {
		username: "admin",
		password: bcrypt.hashSync("password", 10),
		roles: ["ADMIN"],
	},
};

// Secret key for JWT
const JWT_SECRET = "your_jwt_secret_key";

// Register API
app.post(
	"/api/v1/accounts/register",
	[],
	(req: Request, res: Response, next: NextFunction) => {
		(async () => {
			console.log(req.url);

			const { username, password } = req.body;

			// Check if user already exists
			if (users[username]) {
				res.status(400).json({
					statusCode: 400,
					data: null,
					message: "User already exists",
				});
			}

			// Hash the password before saving it
			const hashedPassword = await bcrypt.hash(password, 10);

			// Store user in in-memory object
			users[username] = { username, password: hashedPassword, roles: ["USER"] };

			res.status(201).json({ statusCode: 201, data: null, message: "Created" });
		})().catch(next); // Catch any unhandled promise rejection and pass it to next
	}
);

// Login API
app.post(
	"/api/v1/accounts/login",
	[],
	(req: Request, res: Response, next: NextFunction) => {
		(async () => {
			console.log(req.url);

			const { username, password } = req.body;

			// Check if user exists
			const user = users[username];
			if (!user) {
				return res
					.status(400)
					.json({ message: "Invalid username or password" });
			}

			// Compare the provided password with the stored hash
			const isPasswordValid = await bcrypt.compare(password, user.password);
			if (!isPasswordValid) {
				return res.status(400).json({
					statusCode: 400,
					data: null,
					message: "Invalid username or password",
				});
			}

			// Generate JWT token
			const token = jwt.sign({ username, roles: user.roles }, JWT_SECRET, {
				expiresIn: "1h",
			});

			res.json({ statusCode: 200, data: token, message: "OK" });
		})().catch(next);
	}
);

app.get(
	"/api/v1/users/:username/details",
	[],
	(req: Request, res: Response, next: NextFunction) => {
		(async () => {
			console.log(req.url);

			const { username } = req.params;

			return res
				.status(200)
				.json({ statusCode: 200, data: users[username], message: "OK" });
		})().catch(next);
	}
);

app.get(
	"/api/v1/admin/dashboard",
	[],
	(req: Request, res: Response, next: NextFunction) => {
		(async () => {
			console.log(req.url);

			return res
				.status(200)
				.json({ statusCode: 200, data: "Dashboard", message: "OK" });
		})().catch(next);
	}
);

// Start server
app.listen(port, () => {
	console.log(`Server running on http://localhost:${port}`);
});
