import Providers from "@/components/providers/provider";
import { siteConfig } from "@/config/site.config";
import type { Metadata } from "next";
import NextTopLoader from "nextjs-toploader";
import "./globals.css";

export const metadata: Metadata = {
  title: {
    default: siteConfig.name,
    template: `%s | ${siteConfig.name}`,
  },
  description: siteConfig.description,
  keywords: [
    "Campus Placement",
    "Employability Insights",
    "University Recruitment",
    "Corporate Access",
    "Centralized Data",
    "Job Market Analysis",
    "Government Policy",
    "Tech Education",
  ],
  authors: [
    {
      name: "SinghAstra",
      url: "https://github.com/SinghAstra",
    },
  ],
  creator: "SinghAstra",
  openGraph: {
    type: "website",
    locale: "en_US",
    url: siteConfig.url,
    title: siteConfig.name,
    description: siteConfig.description,
    siteName: siteConfig.name,
  },
  twitter: {
    card: "summary_large_image",
    title: siteConfig.name,
    description: siteConfig.description,
    images: [`${siteConfig.url}/images/og.jpg`],
    creator: "@SinghAstra",
  },
  icons: {
    icon: "/images/favicon.ico",
  },
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en">
      <body
        className={`bg-gradient min-h-screen flex flex-col text-foreground antialiased overflow-x-hidden`}
      >
        <Providers>
          <NextTopLoader color="hsl(var(--primary))" showSpinner={false} />
          {children}
        </Providers>
      </body>
    </html>
  );
}
