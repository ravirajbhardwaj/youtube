"use client"

import Header from "@/components/Header";
import Sidebar from "@/components/Sidebar";


export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <div className="h-screen overflow-y-auto bg-background text-foreground" >
      <Header />
      <div className="h-screen overflow-y-auto">
        <div className="flex min-h-[calc(100vh-66px)] sm:min-h-[calc(100vh-82px)]">
          <Sidebar />
          {children}
        </div>
      </div>
    </div>
  );
}
