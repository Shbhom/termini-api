import { GoogleGenerativeAI } from "@google/generative-ai";
import "dotenv/config"
import { NextFunction, Request, Response } from "express";
const genKey = process.env.GEN_KEY as string

const genAI = new GoogleGenerativeAI(genKey)

const model = genAI.getGenerativeModel({
    model: "gemini-pro",
})

export const getAnswer = async (query: string): Promise<string> => {
    const result = await model.generateContent(query)
    const response = result.response
    return response.text()
}

export class CustomError extends Error {
    statusCode: number
    constructor(msg: string, statusCode: number) {
        super(msg)
        this.statusCode = statusCode
    }
}

export function customErrorHandler(err: CustomError, _: Request, res: Response, next: NextFunction) {
    err.statusCode = err.statusCode || 500
    err.message = err.message || "Internal Server Error"
    return res.status(err.statusCode).json({
        err: err.message
    })
}