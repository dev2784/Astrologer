import type { MetadataRoute } from "next";

export const revalidate = 3600;

const BASE_URL = "https://hatkeshwarjyotish.com";

export default async function sitemap(): Promise<MetadataRoute.Sitemap> {
  const staticPages: MetadataRoute.Sitemap = [
    {
      url: BASE_URL,
      changeFrequency: "weekly",
      priority: 1,
    },
    {
      url: `${BASE_URL}/pujas`,
      changeFrequency: "weekly",
      priority: 0.9,
    },
    {
      url: `${BASE_URL}/panchang`,
      changeFrequency: "daily",
      priority: 0.8,
    },
    {
      url: `${BASE_URL}/muhurat`,
      changeFrequency: "weekly",
      priority: 0.8,
    },
    {
      url: `${BASE_URL}/services`,
      changeFrequency: "monthly",
      priority: 0.8,
    },
    {
      url: `${BASE_URL}/gallery`,
      changeFrequency: "monthly",
      priority: 0.5,
    },
    {
      url: `${BASE_URL}/contact`,
      changeFrequency: "monthly",
      priority: 0.5,
    },
  ];

  try {
    const apiUrl =
      process.env.NEXT_PUBLIC_API_BASE_URL ||
      "https://vedik-app.onrender.com";

    const response = await fetch(
      `${apiUrl}/pujas?skip=0&take=1000`,
      {
        next: { revalidate: 3600 },
      }
    );

    if (!response.ok) {
      return staticPages;
    }

    const data = await response.json();

    const pujaPages: MetadataRoute.Sitemap = (data.pujas || [])
      .filter((puja: { slug?: string }) => Boolean(puja.slug))
      .map((puja: { slug: string }) => ({
        url: `${BASE_URL}/pujas/${puja.slug}`,
        changeFrequency: "weekly" as const,
        priority: 0.9,
      }));

    return [...staticPages, ...pujaPages];
  } catch {
    return staticPages;
  }
}