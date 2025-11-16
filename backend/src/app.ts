import { env } from "./config/env"
import express from "express"
import cors, { CorsOptions } from "cors"
import helmet from "helmet"
import cookieParser from "cookie-parser"
import { ApiError } from "./utils/ApiError"

const app = express()

const allowsOrigins = [env.CLIENT_URL, "http://localhost:5173"]

const corsOptions: CorsOptions = {
  origin: (origin, callback) => {
    if (!origin || allowsOrigins.includes(origin)) {
      callback(null, true)
    } else {
      callback(new ApiError(400, "Not allowed by CORS"))
    }
  },
  credentials: true,
  methods: ["GET", "POST", "PUT", "PATCH", "DELETE", "OPTIONS"],
  allowedHeaders: ["Content-Type", "Authorization"],
}

// Global MW
app.use(helmet())
app.use(cors(corsOptions))
app.use(express.json({ limit: "12kb" }));
app.use(express.urlencoded({ extended: true, limit: "12kb" }));
app.use(cookieParser());

// import routes
import healthcheckRouter from "./api/healthcheck"
import authRoute from "./api/user/user.route"
import tweetRouter from "./api/user/user.route"
import subscriptionRouter from "./api/user/user.route"
import videoRouter from "./api/user/user.route"
import commentRouter from "./api/user/user.route"
import likeRouter from "./api/user/user.route"
import playlistRouter from "./api/user/user.route"
import dashboardRouter from "./api/user/user.route"

//routes declaration
app.use("/api/v1/healthcheck", healthcheckRouter)
app.use("/api/v1/users", authRoute)
app.use("/api/v1/tweets", tweetRouter)
app.use("/api/v1/subscriptions", subscriptionRouter)
app.use("/api/v1/videos", videoRouter)
app.use("/api/v1/comments", commentRouter)
app.use("/api/v1/likes", likeRouter)
app.use("/api/v1/playlist", playlistRouter)
app.use("/api/v1/dashboard", dashboardRouter)

export { app }