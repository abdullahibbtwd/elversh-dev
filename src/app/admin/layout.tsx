import React from "react";
import { auth } from "@clerk/nextjs/server";
import { redirect } from "next/navigation";
import Sidebar from "@/components/Admin/Sidebar";

export const dynamic = "force-dynamic";
export const revalidate = 0;

export default async function AdminLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const authData = await auth();

  const userId = authData.userId;
  const sessionClaims = authData.sessionClaims as {
    metadata?: { role?: string };
  };

  // 🔒 Block unauthenticated users
  if (!userId) {
    redirect("/");
  }

  // 🔐 Role-based protection (same logic as middleware)
  const role = (sessionClaims?.metadata as { role?: string })?.role;

  if (role !== "admin") {
    redirect("/");
  }

  return (
    <div className="flex h-screen bg-gray-100 dark:bg-gray-900">
      <Sidebar />
      <main className="flex-1 overflow-auto p-6">
        {children}
      </main>
    </div>
  );
}
