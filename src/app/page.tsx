/**
 * Landing Page
 * 
 * Main entry point for PaperTalks marketing site.
 */

import { Container } from "@/components/ui/container";
import { Header } from "@/components/layout/header";
import { Footer } from "@/components/layout/Footer";
import { Hero } from "@/components/landing/Hero";
import { Features } from "@/components/landing/Features";
import { HowItWorks } from "@/components/landing/HowItWorks";
import { TeachingScore } from "@/components/landing/TeachingScore";
import { UseCases } from "@/components/landing/UseCases";
import { EarlyAccessForm } from "@/components/landing/EarlyAccessForm";

export default function Home() {
  return (
    <>
      <Header />
      <main>
        {/* Hero Section */}
        <Hero />

        {/* Core Features Section */}
        <Features />

        {/* How It Works Section */}
        <HowItWorks />

        {/* Teaching Credit Score Section */}
        <TeachingScore />

        {/* Trust & Use-Cases Section */}
        <UseCases />

        {/* Video Explainers placeholder */}
        {/* TODO: Replace with VideoGrid component when videos feature is ready */}
        <section id="explainers" className="py-24 border-t border-stone-200">
          <Container>
            <div className="text-center">
              <h2 className="font-serif text-3xl font-semibold tracking-tight text-stone-900 sm:text-4xl">
                Featured Explainers
              </h2>
              <p className="mt-4 text-stone-600">
                Coming soon — Video explainer gallery will be displayed here.
              </p>
            </div>
          </Container>
        </section>

        {/* Early Access CTA - Now connected to Supabase */}
        <EarlyAccessForm />
      </main>
      <Footer />
    </>
  );
}
