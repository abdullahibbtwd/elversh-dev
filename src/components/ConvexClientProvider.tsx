"use client";

import { ConvexProvider, ConvexReactClient } from "convex/react";
import { ReactNode, useState, useEffect } from "react";

export function ConvexClientProvider({ children }: { children: ReactNode }) {
  const [convex, setConvex] = useState<ConvexReactClient | null>(null);

  useEffect(() => {
    if (typeof window !== 'undefined' && process.env.NEXT_PUBLIC_CONVEX_URL) {
      const client = new ConvexReactClient(process.env.NEXT_PUBLIC_CONVEX_URL);
      setConvex(client);
    }
  }, []);

  if (!convex) {
    return <div>Loading...</div>;
  }

  return <ConvexProvider client={convex}>{children}</ConvexProvider>;
}