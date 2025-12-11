import Header from "./_components/Header";

export default function MainLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <div className="h-screen overflow-y-auto bg-background text-foreground">
      <Header />
      {children}
    </div>
  );
}
