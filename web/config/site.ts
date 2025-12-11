import { Metadata } from "next";

const TITLE = "YOUTUBE";
const DESCRIPTION =
  "Open source video sharing platform. Drop in replacement for Youtube 😂";

const PREVIEW_IMAGE_URL = "";
const ALT_TITLE = "YOUTUBE HOME PAGE";
const BASE_URL = "http://localhost:3000";

export const siteConfig: Metadata = {
  title: TITLE,
  description: DESCRIPTION,
  icons: {
    icon: "/favicon.ico",
  },
  applicationName: "Youtube",
  creator: "Ravi Raj",
  twitter: {
    creator: "@kirat_tw",
    title: TITLE,
    description: DESCRIPTION,
    card: "summary_large_image",
    images: [
      {
        url: PREVIEW_IMAGE_URL,
        width: 1200,
        height: 630,
        alt: ALT_TITLE,
      },
    ],
  },
  openGraph: {
    title: TITLE,
    description: DESCRIPTION,
    siteName: "Youtube",
    url: BASE_URL,
    locale: "en_US",
    type: "website",
    images: [
      {
        url: PREVIEW_IMAGE_URL,
        width: 1200,
        height: 630,
        alt: ALT_TITLE,
      },
    ],
  },
  category: "Technology",
  alternates: {
    canonical: BASE_URL,
  },
  keywords: [
    "Youtube Open source alternative",
    "Open source video sharing platform",
    "Ravi Raj Youtube Project",
  ],
  metadataBase: new URL(BASE_URL),
};
