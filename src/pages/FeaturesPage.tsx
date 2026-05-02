import { Navbar } from "@/components/layout/Navbar";
import { Features, Footer } from "./Index";

export function FeaturesPage() {
  return (
    <main className="min-h-screen bg-background flex flex-col">
      <Navbar showLogo isLanding />
      <div className="flex-1 pt-24 pb-16">
        <Features />
      </div>
      <Footer />
    </main>
  );
}
