import "./globals.css";
import AppProviders from "./AppProviders";
import GlobalLoader from "../components/GlobalLoader";
import React from "react";
import { SpeedInsights } from '@vercel/speed-insights/next';
import { Analytics } from '@vercel/analytics/next';

export const metadata = {
  title: "Elversh Dev",
  description: "Showcasing the work of Elversh, a passionate full stack web developer specializing in building modern, scalable, and high-performance web applications with Next.js, React, Node.js, and the latest technologies. Explore projects, skills, and real-time chat—all crafted with a focus on user experience and robust engineering.",
  keywords: ["portfolio", "elversh", "developer","full-stack","web-developer","nextjs","react","nodejs","tailwindcss","typescript","javascript","html","css","sql","mongodb","express","api","chat","real-time","responsive","user-experience","robust","engineering","web-development","web-apps","web-design","web-application","web-application-development","web-application-design","web-application-development","web-application-design","web-application-development","web-application-design"],
  icons: {
    icon: "/favicon.ico",
  },
  twitter: {
    card: "summary_large_image",
  }

};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {

  return (
    <html lang="en">
      <head>
        <meta charSet="utf-8" />
        <meta name="viewport" content="width=device-width, initial-scale=1" />
        <title>{metadata.title}</title>
        <meta name="description" content={metadata.description} />
        <meta name="keywords" content={metadata.keywords.join(", ")} />
        <link rel="icon" href={metadata.icons.icon} />
        <meta property="og:title" content={metadata.title} />
        <meta property="og:description" content={metadata.description} />
        <meta property="og:image" content="/opengraph-image.png" />
        <meta property="og:type" content="website" />
        <meta property="og:url" content="https://elversh-dev.vercel.app/" />
        <meta name="twitter:card" content="summary_large_image" />
        <meta name="twitter:image" content="/opengraph-image.png" />
        <meta name="google-site-verification" content="3nuDCGxo22EY8Xi0BCH2ayENBVqVcJVBP_y8sooXtA4" />
        <script
          type="application/ld+json"
          dangerouslySetInnerHTML={{
            __html: JSON.stringify({
              "@context": "https://schema.org",
              "@type": "Person",
              "name": "Elversh Dev",
              "url": "https://elvershdev.com",
              "description": "Showcasing the work of Elversh, a passionate full stack web developer specializing in building modern, scalable, and high-performance web applications with Next.js, React, Node.js, and the latest technologies.",
              "sameAs": [
                // Add your social links here if you have them
              ]
            }),
          }}
        />
      </head>
      <body>
        <AppProviders>
          <GlobalLoader>
            <div className="w-full overflow-x-hidden flex-col">
              {children}
              <SpeedInsights />
              <Analytics/>
            </div>
          </GlobalLoader>
        </AppProviders>
      </body>
    </html>
  );
}
