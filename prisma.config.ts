import 'dotenv/config'
import { defineConfig, env } from 'prisma/config'

export default defineConfig({
  schema: 'prisma/schema.prisma',
  migrations: {
    path: 'prisma/migrations',
  },
  datasource: {
    // Use direct (unpooled) connection for CLI operations (migrations, introspection)
    // Runtime queries use pooled connection via adapter in src/lib/prisma.ts
    url: env('DATABASE_URL_UNPOOLED'),
  },
})
