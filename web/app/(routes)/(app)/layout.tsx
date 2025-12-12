import Header from "./_components/Header";
import Sidebar from "./_components/Sidebar";
import { Suspense } from "react";

export default function MainLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <div className="h-screen overflow-y-auto bg-background text-foreground">
      <Header />
      <div className="flex min-h-[calc(100vh-66px)] sm:min-h-[calc(100vh-82px)] bg-background text-foreground">
        <Sidebar />
        <Suspense fallback={""}>{children}</Suspense>
      </div>
    </div>
  );
}
