import type { Metadata } from "next";
import { Source_Sans_3, Source_Serif_4 } from "next/font/google";
import "./globals.css";

// Primary sans-serif for body text - clean and readable
const sourceSans = Source_Sans_3({
  variable: "--font-source-sans",
  subsets: ["latin"],
  display: "swap",
});

// Serif for headings - academic and elegant
const sourceSerif = Source_Serif_4({
  variable: "--font-source-serif",
  subsets: ["latin"],
  display: "swap",
});

export const metadata: Metadata = {
  title: {
    default: "PaperTalks - Research Explained by Authors",
    template: "%s | PaperTalks",
  },
  description:
    "A platform where researchers share short explainer videos about their publications. Build your academic profile, showcase teaching skills, and make your research accessible.",
  keywords: [
    "research",
    "academic",
    "publications",
    "explainer videos",
    "researcher profiles",
    "teaching",
    "ORCID",
  ],
  authors: [{ name: "PaperTalks" }],
  openGraph: {
    type: "website",
    locale: "en_US",
    url: "https://papertalks.ai",
    siteName: "PaperTalks",
    title: "PaperTalks - Research Explained by Authors",
    description:
      "A platform where researchers share short explainer videos about their publications.",
  },
  twitter: {
    card: "summary_large_image",
    title: "PaperTalks - Research Explained by Authors",
    description:
      "A platform where researchers share short explainer videos about their publications.",
  },
  // TODO: Add actual favicon and OG images
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en" className={`${sourceSans.variable} ${sourceSerif.variable}`}>
      <body className="font-sans antialiased">
        {children}
      </body>
    </html>
  );
}
