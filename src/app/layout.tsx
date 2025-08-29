import "./globals.css";
import AppProviders from "./AppProviders";
import GlobalLoader from "../components/GlobalLoader";
import PerformanceMonitor from "../components/PerformanceMonitor";
import React from "react";
import { SpeedInsights } from '@vercel/speed-insights/next';
import { Analytics } from '@vercel/analytics/next';

export const metadata = {
  title: "Elversh Dev",
  description: "Showcasing the work of Elversh, a passionate full stack web developer specializing in building modern, scalable, and high-performance web applications with Next.js, React, Node.js, and the latest technologies. Explore projects, skills, and real-time chat—all crafted with a focus on user experience and robust engineering.",
  keywords: ["portfolio", "elversh", "developer", "full-stack", "web-developer", "nextjs", "react", "nodejs", "typescript", "javascript", "web-development"],
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
        
        {/* Preload critical resources */}
        <link rel="preload" href="/ev.png" as="image" />
        <link rel="preload" href="/opengraph-image.png" as="image" />
        <link rel="dns-prefetch" href="//adept-hawk-370.convex.cloud" />
        <link rel="dns-prefetch" href="//blissful-pigeon-291.convex.cloud" />
        
        {/* Service Worker Registration */}
        <script
          dangerouslySetInnerHTML={{
            __html: `
              if ('serviceWorker' in navigator) {
                window.addEventListener('load', function() {
                  navigator.serviceWorker.register('/sw.js')
                    .then(function(registration) {
                      console.log('SW registered: ', registration);
                    })
                    .catch(function(registrationError) {
                      console.log('SW registration failed: ', registrationError);
                    });
                });
              }
            `,
          }}
        />
        
        <script
          type="application/ld+json"
          dangerouslySetInnerHTML={{
            __html: JSON.stringify({
              "@context": "https://schema.org",
              "@type": "Person",
              "name": "Elversh Dev",
              "url": "https://elvershdev.com",
              "description": "Showcasing the work of Elversh, a passionate full stack web developer specializing in building modern, scalable, and high-performance web applications with Next.js, React, Node.js, and the latest technologies.",
              "sameAs": []
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
              <PerformanceMonitor />
            </div>
          </GlobalLoader>
        </AppProviders>
      </body>
    </html>
  );
}
