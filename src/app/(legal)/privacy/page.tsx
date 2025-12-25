/**
 * Privacy Policy Page
 * 
 * TODO: Add actual privacy policy content
 * - Data collection practices
 * - GDPR compliance
 * - Cookie usage
 * - Third-party services
 */

import { Container } from "@/components/ui/container";
import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "Privacy Policy",
  description: "PaperTalks privacy policy and data handling practices.",
};

export default function PrivacyPage() {
  return (
    <Container>
      <div className="py-16 max-w-3xl">
        <h1 className="font-serif text-4xl font-semibold text-stone-900">
          Privacy Policy
        </h1>
        <p className="mt-4 text-stone-600">
          Last updated: {new Date().toLocaleDateString()}
        </p>
        
        <div className="mt-8 prose prose-stone">
          <p>
            Privacy policy content coming soon. This page will detail how PaperTalks 
            collects, uses, and protects your personal information.
          </p>
          {/* TODO: Add full privacy policy content */}
        </div>
      </div>
    </Container>
  );
}

