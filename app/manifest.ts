import type { MetadataRoute } from "next";

export default function manifest(): MetadataRoute.Manifest {
  return {
    name: "FLN Tracker – Pratham ASER",
    short_name: "FLN Tracker",
    description: "Field assessment tool for Foundational Literacy & Numeracy tracking",
    start_url: "/assessments/live",
    display: "standalone",
    background_color: "#f8fafc",
    theme_color: "#2563eb",
    orientation: "portrait",
    icons: [
      { src: "/icon-192.svg", sizes: "192x192", type: "image/svg+xml" },
      { src: "/icon-512.svg", sizes: "512x512", type: "image/svg+xml", purpose: "maskable any" },
    ],
  };
}
