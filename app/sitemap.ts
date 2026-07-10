import type { MetadataRoute } from 'next'
import { getAllPublicSlugs } from '@/lib/hackathon-data'

const SITE_URL = 'https://hackathon.borderlesscoding.com'

export default function sitemap(): MetadataRoute.Sitemap {
  const now = new Date()
  const entries: MetadataRoute.Sitemap = [
    { url: SITE_URL, lastModified: now, changeFrequency: 'weekly', priority: 1 },
    { url: `${SITE_URL}/2025/ranking-anual`, lastModified: now, changeFrequency: 'monthly', priority: 0.85 },
  ]

  for (const slug of getAllPublicSlugs()) {
    entries.push(
      { url: `${SITE_URL}/${slug}`, lastModified: now, changeFrequency: 'monthly', priority: 0.9 },
      { url: `${SITE_URL}/${slug}/times`, lastModified: now, changeFrequency: 'monthly', priority: 0.8 },
      { url: `${SITE_URL}/${slug}/resultados`, lastModified: now, changeFrequency: 'monthly', priority: 0.8 },
    )
  }

  return entries
}
