import { geistMono, geistSans } from "@/config/font";
import type { Metadata } from "next";
import "./globals.css";

export const metadata: Metadata = {
  title: "Youtube",
  description: "Open source video sharing platform",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en"
      suppressHydrationWarning={true}
      data-lt-installed="true">
      <body
        className={`${geistSans.variable} ${geistMono.variable} antialiased`}
      >
        {children}
      </body>
    </html>
  );
}
