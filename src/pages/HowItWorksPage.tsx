import { Navbar } from "@/components/layout/Navbar";
import { HowItWorks, Footer } from "./Index";

export function HowItWorksPage() {
  return (
    <main className="min-h-screen bg-background flex flex-col">
      <Navbar showLogo isLanding />
      <div className="flex-1 pt-24 pb-16">
        <HowItWorks />
      </div>
      <Footer />
    </main>
  );
}
