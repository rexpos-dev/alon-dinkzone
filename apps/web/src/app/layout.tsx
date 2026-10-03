import type { Metadata } from "next";
import Link from "next/link";
import "./globals.css";
import CurrentUserBadge from "@/components/CurrentUserBadge";

export const metadata: Metadata = {
  title: "Pickleball Club Organizer Dashboard",
  description: "Organizer web dashboard for the pickleball club app.",
};

export default function RootLayout({ children }: LayoutProps<"/">) {
  return (
    <html lang="en" className="h-full antialiased">
      <body className="min-h-full flex flex-col font-sans">
        <header className="flex items-center justify-between border-b px-8 py-4">
          <Link href="/clubs" className="font-semibold">
            🏓 Organizer Dashboard
          </Link>
          <CurrentUserBadge />
        </header>
        <div className="flex-1">{children}</div>
      </body>
    </html>
  );
}
