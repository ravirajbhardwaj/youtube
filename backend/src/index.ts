import { env } from "./config/env"
import { app } from "./app"
import { logger } from "./config/logger"

const PORT: number = env.PORT ?? 3000

app.listen(PORT, () => {
  logger.info(`SERVER IS RUNNING AT ${env.SERVER_URL}:${PORT}`)
})