import { z } from 'zod'

const envSchema = z.object({
  NODE_ENV: z
    .enum(['development', 'production', 'test'])
    .default('development'),
  VERCEL_URL: z.string().optional(),
  NEXT_PUBLIC_APP_URL: z.string().url().optional(),
  NOTION_TOKEN: z.string().optional(),
  NOTION_INVOICES_DB_ID: z.string().optional(),
  NOTION_ITEMS_DB_ID: z.string().optional(),
  ADMIN_PASSWORD_HASH: z.string().optional(),
})

export const env = envSchema.parse({
  NODE_ENV: process.env.NODE_ENV,
  VERCEL_URL: process.env.VERCEL_URL,
  NEXT_PUBLIC_APP_URL: process.env.NEXT_PUBLIC_APP_URL,
  NOTION_TOKEN: process.env.NOTION_TOKEN,
  NOTION_INVOICES_DB_ID: process.env.NOTION_INVOICES_DB_ID,
  NOTION_ITEMS_DB_ID: process.env.NOTION_ITEMS_DB_ID,
  ADMIN_PASSWORD_HASH: process.env.ADMIN_PASSWORD_HASH,
})

export type Env = z.infer<typeof envSchema>
