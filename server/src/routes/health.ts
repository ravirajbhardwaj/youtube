import { Hono } from 'hono'

export const healthCheck = new Hono()

healthCheck.get('/', c => {
  return c.json({
    statusCode: 200,
    message: 'Health check passed',
    data: null,
  })
})
