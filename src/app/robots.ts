import type { MetadataRoute } from "next";

const BASE_URL = "https://kaalupi.vercel.app";

export default function robots(): MetadataRoute.Robots {
  return {
    rules: [
      {
        userAgent: "*",
        allow: "/",
        disallow: [
          "/api/",
          "/dashboard/",
          "/access/",
          "/checkout/",
          "/onboarding/",
          "/profile/",
          "/payment/",
        ],
      },
    ],
    sitemap: `${BASE_URL}/sitemap.xml`,
    host: BASE_URL,
  };
}
