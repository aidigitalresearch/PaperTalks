/**
 * Terms of Service Page
 * 
 * TODO: Add actual terms of service content
 * - User responsibilities
 * - Content guidelines
 * - Intellectual property
 * - Liability limitations
 */

import { Container } from "@/components/ui/container";
import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "Terms of Service",
  description: "PaperTalks terms of service and user agreement.",
};

export default function TermsPage() {
  return (
    <Container>
      <div className="py-16 max-w-3xl">
        <h1 className="font-serif text-4xl font-semibold text-stone-900">
          Terms of Service
        </h1>
        <p className="mt-4 text-stone-600">
          Last updated: {new Date().toLocaleDateString()}
        </p>
        
        <div className="mt-8 prose prose-stone">
          <p>
            Terms of service content coming soon. This page will detail the terms 
            and conditions for using the PaperTalks platform.
          </p>
          {/* TODO: Add full terms of service content */}
        </div>
      </div>
    </Container>
  );
}

