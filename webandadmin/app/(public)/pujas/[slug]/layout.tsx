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

function getSeoLocation(place?: string) {
  const value = (place || "").trim();
  const lower = value.toLowerCase();

  if (lower.includes("ujjain")) {
    return {
      suffix: " in Ujjain",
      areaServed: {
        "@type": "City",
        name: "Ujjain",
      },
    };
  }

  if (
    lower.includes("india") ||
    lower.includes("all over") ||
    lower.includes("pan india")
  ) {
    return {
      suffix: " in India",
      areaServed: {
        "@type": "Country",
        name: "India",
      },
    };
  }

  if (value) {
    return {
      suffix: ` in ${value}`,
      areaServed: {
        "@type": "Place",
        name: value,
      },
    };
  }

  return {
    suffix: "",
    areaServed: undefined,
  };
}

async function getPuja(slug: string): Promise<Puja | null> {
  try {
    const response = await fetch(
      `${API_URL}/pujas/slug/${encodeURIComponent(slug)}`,
      {
        next: {
          revalidate: 3600,
        },
      }
    );

    if (!response.ok) return null;

    const data = await response.json();

    return data.puja || null;
  } catch {
    return null;
  }
}

export async function generateMetadata({
  params,
}: {
  params: Promise<{ slug: string }>;
}): Promise<Metadata> {
  const { slug } = await params;
  const cleanSlug = slug.toLowerCase();

  const canonical = `/pujas/${cleanSlug}`;

  const puja = await getPuja(cleanSlug);

  if (!puja) {
  const name = readableSlug(cleanSlug);

  return {
    title: name,
    description: `Book ${name} with Hatkeshwar Jyotish. Authentic Vedic puja and anushthan services.`,
    alternates: {
      canonical,
    },
  };
}

const { suffix } = getSeoLocation(puja.placeOfPuja);

const title = `${puja.titleEn}${suffix}`;

const about = cleanText(puja.about);

const description = (
  about ||
  `Book ${puja.titleEn}${suffix}. Authentic Vedic puja and anushthan services with Hatkeshwar Jyotish.`
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
              alt: `${puja.titleEn}${suffix}`,
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
}

export default async function PujaLayout({
  children,
  params,
}: {
  children: ReactNode;
  params: Promise<{ slug: string }>;
}) {
  const { slug } = await params;
  const cleanSlug = slug.toLowerCase();

  const puja = await getPuja(cleanSlug);

  if (!puja) {
    return children;
  }

  const { suffix, areaServed } = getSeoLocation(puja.placeOfPuja);

  const pageUrl = `${BASE_URL}/pujas/${cleanSlug}`;

  const description =
    cleanText(puja.about) ||
    `${puja.titleEn}${suffix} with Hatkeshwar Jyotish.`;

  const serviceSchema = {
    "@context": "https://schema.org",
    "@type": "Service",

    name: `${puja.titleEn}${suffix}`,

    description,

    url: pageUrl,

    ...(puja.imageUrl && {
      image: puja.imageUrl,
    }),

    provider: {
      "@type": "Organization",
      name: "Hatkeshwar Jyotish",
      url: BASE_URL,
    },

    ...(areaServed && {
      areaServed,
    }),

    serviceType: puja.titleEn,
  };

  const breadcrumbSchema = {
    "@context": "https://schema.org",
    "@type": "BreadcrumbList",

    itemListElement: [
      {
        "@type": "ListItem",
        position: 1,
        name: "Home",
        item: BASE_URL,
      },
      {
        "@type": "ListItem",
        position: 2,
        name: "Pujas",
        item: `${BASE_URL}/pujas`,
      },
      {
        "@type": "ListItem",
        position: 3,
        name: puja.titleEn,
        item: pageUrl,
      },
    ],
  };

  return (
    <>
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{
          __html: JSON.stringify(serviceSchema).replace(/</g, "\\u003c"),
        }}
      />

      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{
          __html: JSON.stringify(breadcrumbSchema).replace(/</g, "\\u003c"),
        }}
      />

      {children}
    </>
  );
}