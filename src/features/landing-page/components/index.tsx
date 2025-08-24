import { Button } from "@/components/ui/button";
import { DollarSign } from "lucide-react";
import { CtaSection } from "./cta-section";
import { FeatureSection } from "./feature-section";
import { HeroSection } from "./hero-section";

export function LandingPage() {
  return (
    <div className="min-h-screen bg-background">
      <header className="border-b">
        <div className="container mx-auto px-4 py-4 flex items-center justify-between">
          <div className="flex items-center space-x-2">
            <DollarSign className="h-8 w-8 text-primary" />
            <h1 className="text-2xl font-bold">Finance App</h1>
          </div>
          <div className="flex items-center space-x-4">
            <Button variant="ghost" asChild>
              <a href="/auth/login">Sign In</a>
            </Button>
            <Button asChild>
              <a href="/auth/login">Get Started</a>
            </Button>
          </div>
        </div>
      </header>
      <HeroSection />
      <FeatureSection />
      <CtaSection />
      <footer className="border-t py-8 px-4">
        <div className="container mx-auto text-center text-muted-foreground">
          <p>&copy; 2024 Finance App. All rights reserved.</p>
        </div>
      </footer>
    </div>
  );
}
