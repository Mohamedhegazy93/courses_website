import Redis from "ioredis"

export const redis = new Redis("rediss://default:AWfiAAIjcDEwNjg0YmIyY2ExMDQ0Y2FiYjdiYzBhMzRlMTcyYWFlMXAxMA@large-hound-26594.upstash.io:6379")

await redis.set('foo', 'bar');