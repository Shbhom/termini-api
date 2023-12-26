import express from "express"
import "dotenv/config"
import router from "./routes"
import { customErrorHandler } from "./utils"
import { rateLimiter } from "./ratelimiter"

const port = process.env.PORT || 5500
const app = express()

app.use(express.json())
app.use(express.urlencoded({ extended: false }))

app.use(rateLimiter)
app.use("/api", router)
app.use(customErrorHandler)

app.listen(port, async () => {
    console.log(`app is listening to port ${port}`)
})