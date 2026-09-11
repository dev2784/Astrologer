import type { Metadata } from "next";
import type { ReactNode } from "react";

const BASE_URL = "https://hatkeshwarjyotish.com";

const API_URL =
  process.env.NEXT_PUBLIC_API_BASE_URL ||
  "https://vedik-app.onrender.com";

type Puja = {
  titleEn: string;
  titleHi?: string;
  about?: string;
  imageUrl?: string;
  placeOfPuja?: string;
};

function cleanText(value?: string) {
  return (value || "")
    .replace(/<[^>]*>/g, " ")
    .replace(/\s+/g, " ")
    .trim();
}

function readableSlug(slug: string) {
  return slug
    .split("-")
    .map((word) => word.charAt(0).toUpperCase() + word.slice(1))
    .join(" ");
}

export async function generateMetadata({
  params,
}: {
  params: Promise<{ slug: string }>;
}): Promise<Metadata> {
  const { slug } = await params;
  const cleanSlug = slug.toLowerCase();

  const canonical = `/pujas/${cleanSlug}`;

  try {
    const response = await fetch(
      `${API_URL}/pujas/slug/${encodeURIComponent(cleanSlug)}`,
      {
        next: {
          revalidate: 3600,
        },
      }
    );

    if (!response.ok) {
      throw new Error("Puja not found");
    }

    const data = await response.json();
    const puja: Puja | undefined = data.puja;

    if (!puja) {
      throw new Error("Puja not found");
    }

    const title = `${puja.titleEn} in Ujjain`;

    const about = cleanText(puja.about);

    const description = (
      about ||
      `Book ${puja.titleEn} in Ujjain. Authentic Vedic puja and anushthan services with Hatkeshwar Jyotish.`
    ).slice(0, 155);

    return {
      title,

      description,

      alternates: {
        canonical,
      },

      openGraph: {
        title: `${puja.titleEn} in Ujjain | Hatkeshwar Jyotish`,
        description,
        url: `${BASE_URL}${canonical}`,
        siteName: "Hatkeshwar Jyotish",
        type: "website",
        images: puja.imageUrl
          ? [
              {
                url: puja.imageUrl,
                alt: `${puja.titleEn} in Ujjain`,
              },
            ]
          : undefined,
      },

      twitter: {
        card: "summary_large_image",
        title: `${puja.titleEn} in Ujjain | Hatkeshwar Jyotish`,
        description,
        images: puja.imageUrl ? [puja.imageUrl] : undefined,
      },
    };
  } catch {
    const name = readableSlug(cleanSlug);

    return {
      title: `${name} in Ujjain`,
      description: `Book ${name} in Ujjain with Hatkeshwar Jyotish. Authentic Vedic puja and anushthan services.`,
      alternates: {
        canonical,
      },
    };
  }
}

export default function PujaLayout({
  children,
}: {
  children: ReactNode;
}) {
  return children;
}