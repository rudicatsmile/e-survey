import { MetadataRoute } from 'next';
import { db } from '@/db';
import { hospitals } from '@/db/schema';
import { eq } from 'drizzle-orm';

export default async function sitemap(): Promise<MetadataRoute.Sitemap> {
  const baseUrl = process.env.NEXT_PUBLIC_APP_URL || 'http://localhost:3000';

  // Rute Statis
  const staticRoutes: MetadataRoute.Sitemap = [
    {
      url: baseUrl,
      lastModified: new Date(),
      changeFrequency: 'daily',
      priority: 1.0,
    },
    {
      url: `${baseUrl}/pilih-rs`,
      lastModified: new Date(),
      changeFrequency: 'daily',
      priority: 0.9,
    },
    {
      url: `${baseUrl}/faq`,
      lastModified: new Date(),
      changeFrequency: 'monthly',
      priority: 0.5,
    },
    {
      url: `${baseUrl}/privasi`,
      lastModified: new Date(),
      changeFrequency: 'monthly',
      priority: 0.3,
    },
    {
      url: `${baseUrl}/kontak`,
      lastModified: new Date(),
      changeFrequency: 'monthly',
      priority: 0.5,
    },
  ];

  // Rute Dinamis per Rumah Sakit
  try {
    const activeHospitals = await db
      .select({ code: hospitals.code, updatedAt: hospitals.updatedAt })
      .from(hospitals)
      .where(eq(hospitals.isActive, true));

    const hospitalRoutes: MetadataRoute.Sitemap = activeHospitals.flatMap((h) => [
      {
        url: `${baseUrl}/s/${h.code}`,
        lastModified: h.updatedAt,
        changeFrequency: 'weekly',
        priority: 0.8,
      },
      {
        url: `${baseUrl}/s/${h.code}/survey`,
        lastModified: h.updatedAt,
        changeFrequency: 'weekly',
        priority: 0.8,
      },
    ]);

    return [...staticRoutes, ...hospitalRoutes];
  } catch {
    return staticRoutes;
  }
}
