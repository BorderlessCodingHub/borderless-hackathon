import type { MetadataRoute } from 'next'
import { fetchQuery } from 'convex/nextjs'
import { api } from '@/convex/_generated/api'

export const dynamic = 'force-dynamic'

const SITE_URL = 'https://hackathon.borderlesscoding.com'

export default async function sitemap(): Promise<MetadataRoute.Sitemap> {
  const now = new Date()
  const entries: MetadataRoute.Sitemap = [
    { url: SITE_URL, lastModified: now, changeFrequency: 'weekly', priority: 1 },
  ]

  try {
    const hackathons = await fetchQuery(api.hackathons.list, {})
    for (const h of hackathons) {
      entries.push(
        { url: `${SITE_URL}/${h.slug}`, lastModified: now, changeFrequency: 'daily', priority: 0.9 },
        { url: `${SITE_URL}/${h.slug}/times`, lastModified: now, changeFrequency: 'daily', priority: 0.8 },
        { url: `${SITE_URL}/${h.slug}/resultados`, lastModified: now, changeFrequency: 'daily', priority: 0.8 },
      )
    }
  } catch {
    // Convex unreachable — return base entry so crawlers still get a valid sitemap.
  }

  return entries
}
