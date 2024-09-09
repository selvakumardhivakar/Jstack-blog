import { db } from "@/db"
import { Redis } from "@upstash/redis/cloudflare"
import { env } from "hono/adapter"
import { cacheExtension } from "./__internals/db/cache-extension"
import { j } from "./__internals/j"

/**
 * Middleware for providing a built-in cache with your Prisma database
 *
 * You can remove this if you don't like it, but caching can massively speed up your database queries.
 */

const extendedDatabaseMiddleware = j.middleware(async ({ c, next }) => {
  const variables = env(c)

  const redis = new Redis({
    token: variables.REDIS_TOKEN,
    url: variables.REDIS_URL,
  })

  const extendedDb = db.$extends(cacheExtension({ redis }))

  // Whatever you put inside of `next` is accessible to all following middlewares
  return await next({ db: extendedDb })
})

/**
 * Public (unauthenticated) procedures
 *
 * This is the base piece you use to build new queries and mutations on your API.
 */
export const baseProcedure = j.procedure
export const publicProcedure = baseProcedure.use(extendedDatabaseMiddleware)
