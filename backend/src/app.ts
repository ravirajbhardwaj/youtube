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

export { app }