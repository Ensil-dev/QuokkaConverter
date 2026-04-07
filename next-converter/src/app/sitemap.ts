import { MetadataRoute } from 'next'

const BASE_URL = 'https://quokkaconverter.vercel.app'

const pages = [
  { path: '', priority: 1, changeFrequency: 'weekly' as const },
  { path: '/convert/media', priority: 0.9, changeFrequency: 'weekly' as const },
  { path: '/convert/gif', priority: 0.8, changeFrequency: 'weekly' as const },
  { path: '/convert/pdf', priority: 0.8, changeFrequency: 'weekly' as const },
]

export default function sitemap(): MetadataRoute.Sitemap {
  return pages.map((page) => ({
    url: `${BASE_URL}${page.path}`,
    lastModified: new Date(),
    changeFrequency: page.changeFrequency,
    priority: page.priority,
    alternates: {
      languages: {
        ko: `${BASE_URL}/ko${page.path}`,
        en: `${BASE_URL}/en${page.path}`,
      },
    },
  }))
}
