import { NextFunction, Request, Response } from "express";
import { Redis } from "@upstash/redis"
import { Ratelimit } from "@upstash/ratelimit"
import "dotenv/config"
import { CustomError } from "./utils";

const redisUrl = process.env.RED_URL as string
const redisToken = process.env.RED_TOKEN as string

const redis = new Redis({
    url: redisUrl,
    token: redisToken
})

const ratelimit = new Ratelimit({
    redis: redis,
    limiter: Ratelimit.slidingWindow(1, "10 s")
})

export const rateLimiter = async (req: Request, res: Response, next: NextFunction) => {
    // const ip1 = req.headers['x-forwarded-for']
    const ip = req.socket.remoteAddress?.startsWith("::ffff:") ? req.socket.remoteAddress.slice(7) : req.socket.remoteAddress as string
    const { success, reset } = await ratelimit.limit(ip)
    if (success) {
        return next()
    } else {
        return next(new CustomError("too many requests", 429))
    }
}