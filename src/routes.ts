import express, { NextFunction, Request, Response } from "express"
import { CustomError, getAnswer } from "./utils"
const router = express.Router()

router.get("/query", async (req: Request, res: Response, next: NextFunction) => {
    try {
        const { q } = req.query
        if (!q || q.length === 0) {
            throw new CustomError("no query string found", 400)
        }
        const result = await getAnswer(String(q))
        return res.status(200).json({
            message: "hi",
            result
        })
    } catch (err: any) {
        return next(err)
    }
})

export default router