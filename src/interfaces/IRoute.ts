import { Request } from "express";

type RateLimit = {
	windowMs: number;
	limit: number;
};

type RewriteFunction = (path: string, req: Request) => string;

type Proxy = {
	target: string;
	changeOrigin: boolean;
	pathRewrite: { [key: string]: string } | RewriteFunction;
};

export default interface Route {
	path: string;
	auth: boolean;
	rateLimit: RateLimit;
	proxy: Proxy;
	roles: string[];
}
