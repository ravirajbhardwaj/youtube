import { serve } from 'bun'
import app from '@/app'
import { env } from '@/lib/env'

serve({
  port: env.PORT,
  fetch: app.fetch,
})
