import "../globals.css";
import { HeroHeader } from "@/components/landing/Navbar";
import Footer from "@/components/landing/Footer";

export default function LandingLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <div className="flex">
      <main className="w-full flex flex-col min-h-screen">
        <HeroHeader />
        <div className="px-4 flex-grow">{children}</div>
        <Footer />
      </main>
    </div>
  );
}
