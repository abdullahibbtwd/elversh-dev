import "./globals.css";
import AppProviders from "./AppProviders";
import React from "react";

export const metadata = {
  title: "Elversh Dev",
  description: "Portfolio and chat app by Elversh.",
  keywords: ["portfolio", "chat", "elversh", "developer"],
  icons: {
    icon: "/favicon.ico",
  },
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {

  return (
    <html lang="en">
      <head>
        <title>{metadata.title}</title>
        <meta name="description" content={metadata.description} />
        <meta name="keywords" content={metadata.keywords.join(", ")} />
        <link rel="icon" href={metadata.icons.icon} />
      </head>
      <body>
        <AppProviders>
          <div className="w-full overflow-x-hidden flex-col">
         
            {children}
          </div>
        </AppProviders>
      </body>
    </html>
  );
}
