/**
 * Landing Page Content Data
 * 
 * Centralized content for the landing page.
 * This makes it easy to update copy and enables future CMS integration.
 * 
 * TODO: Consider migrating to a headless CMS (Sanity, Contentful) for non-dev editing
 */

// ============================================
// HERO SECTION
// ============================================

export const heroContent = {
  headline: 'Where Researchers Become Teachers',
  subHeadline: 
    'Create video explainers for your papers. Build a verifiable teaching profile. ' +
    'Earn recognition for making knowledge accessible.',
  primaryCta: {
    label: 'Get Early Access',
    href: '#early-access',
  },
  secondaryCta: {
    label: 'Watch Demo',
    href: '#demo',
  },
  trustIndicators: [
    'For researchers at any stage',
    'Free to use',
    'ORCID integrated',
  ],
};

// ============================================
// FEATURES SECTION
// ============================================

export const featuresContent = {
  sectionTitle: 'Everything You Need to Share Your Research',
  sectionSubtitle: 
    'A complete platform designed specifically for researchers who want to make their work accessible and build recognition for their teaching impact.',
  features: [
    {
      id: 'profile',
      title: 'Researcher Profiles',
      description: 
        'Create a verified academic profile linked to your ORCID. Showcase your publications alongside video explainers.',
      iconName: 'UserProfile' as const,
      variant: 'default' as const,
    },
    {
      id: 'video',
      title: 'Video Explainers',
      description: 
        'Record or upload concise video explanations of your papers. Each video gets a citable VRI (Video Research Identifier).',
      iconName: 'Video' as const,
      variant: 'default' as const,
    },
    {
      id: 'score',
      title: 'Teaching Credit Score',
      description: 
        'Build a quantifiable teaching reputation based on clarity, engagement, and peer feedback. Recognized by institutions.',
      iconName: 'Chart' as const,
      variant: 'default' as const,
    },
    {
      id: 'identifier',
      title: 'Citable Videos',
      description: 
        'Every video gets a DOI-like identifier (VRI) that can be cited in papers, grants, and CVs.',
      iconName: 'Identifier' as const,
      variant: 'default' as const,
    },
    {
      id: 'institutions',
      title: 'Institutional Dashboard',
      description: 
        'Universities and funders can view aggregated teaching metrics for hiring, tenure, and grant decisions.',
      iconName: 'Building' as const,
      variant: 'default' as const,
    },
  ],
};

// ============================================
// HOW IT WORKS SECTION
// ============================================

export const howItWorksContent = {
  sectionTitle: 'Get Started in Minutes',
  sectionSubtitle: 
    'From signup to published video explainer in four simple steps.',
  steps: [
    {
      id: 'step-1',
      number: 1,
      title: 'Create Your Profile',
      description: 
        'Sign up with your ORCID or email. Import your publications automatically.',
      iconName: 'Profile' as const,
    },
    {
      id: 'step-2',
      number: 2,
      title: 'Add Your Papers',
      description: 
        'Import via DOI or add manually. Link each paper to build your portfolio.',
      iconName: 'Paper' as const,
    },
    {
      id: 'step-3',
      number: 3,
      title: 'Record Explainers',
      description: 
        'Use our in-browser recorder or upload a video. Keep it under 10 minutes.',
      iconName: 'Video' as const,
    },
    {
      id: 'step-4',
      number: 4,
      title: 'Earn Recognition',
      description: 
        'Your Teaching Credit Score grows as viewers engage with your content.',
      iconName: 'Award' as const,
    },
  ],
};

// ============================================
// TEACHING SCORE SECTION
// ============================================

export const teachingScoreContent = {
  sectionTitle: 'The Teaching Credit Score',
  sectionSubtitle: 
    'A new metric that captures your impact as an educator, not just a publisher.',
  
  comparison: {
    traditional: {
      title: 'Traditional Metrics',
      items: [
        'Publication count',
        'H-index / citations',
        'Journal impact factor',
        'Grant amounts',
      ],
    },
    teachingScore: {
      title: 'Teaching Credit Score',
      items: [
        'Video explanation quality',
        'Viewer engagement & completion',
        'Peer ratings from researchers',
        'Accessibility & inclusivity',
      ],
    },
  },
  
  benefits: [
    {
      title: 'For Researchers',
      description: 'Get credit for the teaching work you already do. Stand out in job applications.',
    },
    {
      title: 'For Institutions',
      description: 'Evaluate candidates holistically. Make informed hiring and tenure decisions.',
    },
    {
      title: 'For Students & Public',
      description: 'Find clear explanations from verified experts. Learn from the source.',
    },
  ],
  
  betaDisclaimer: 
    'Teaching Credit Score is currently in beta. The scoring algorithm will be refined based on community feedback.',
};

// ============================================
// USE CASES SECTION
// ============================================

export const useCasesContent = {
  sectionTitle: 'Trusted by Forward-Thinking Institutions',
  sectionSubtitle: 
    'Universities, funding agencies, and research organizations are already exploring teaching-aware evaluation.',
  
  useCases: [
    {
      id: 'hiring',
      title: 'Faculty Hiring',
      description: 
        'Evaluate candidates not just on publications, but on their ability to communicate research.',
      iconName: 'Briefcase' as const,
    },
    {
      id: 'tenure',
      title: 'Tenure & Promotion',
      description: 
        'Include teaching impact as a formal criterion alongside traditional metrics.',
      iconName: 'Graduate' as const,
    },
    {
      id: 'grants',
      title: 'Grant Evaluation',
      description: 
        'Funders can assess whether applicants effectively disseminate their work.',
      iconName: 'Award' as const,
    },
    {
      id: 'outreach',
      title: 'Public Engagement',
      description: 
        'Track and reward researchers who actively engage with broader audiences.',
      iconName: 'ChartBar' as const,
    },
  ],
  
  // Placeholder for future partner logos
  partners: [
    { name: 'Partner University 1', logoPlaceholder: true },
    { name: 'Partner Foundation 2', logoPlaceholder: true },
    { name: 'Research Institute 3', logoPlaceholder: true },
  ],
  
  testimonial: {
    quote: 
      'PaperTalks could transform how we evaluate researchers. Teaching matters, and now we can measure it.',
    author: 'Dr. Sarah Chen',
    title: 'Dean of Research',
    institution: 'Sample University',
  },
};

// ============================================
// EARLY ACCESS SECTION
// ============================================

export const earlyAccessContent = {
  sectionTitle: 'Join the Waitlist',
  sectionSubtitle: 
    'Be among the first researchers to build your teaching profile on PaperTalks.',
  inputPlaceholder: 'Enter your email',
  buttonLabel: 'Get Early Access',
  privacyNote: 'We respect your privacy. No spam, ever.',
};

// ============================================
// FOOTER
// ============================================

export const footerContent = {
  tagline: 'Bridging research and teaching impact for a more connected academia.',
  copyright: `© ${new Date().getFullYear()} PaperTalks. All rights reserved.`,
  navigation: {
    platform: {
      title: 'Platform',
      links: [
        { label: 'Features', href: '#features' },
        { label: 'How It Works', href: '#how-it-works' },
        { label: 'Teaching Score', href: '#teaching-score' },
        { label: 'For Institutions', href: '#institutions' },
      ],
    },
    company: {
      title: 'Company',
      links: [
        { label: 'About Us', href: '/about' },
        { label: 'Careers', href: '/careers' },
        { label: 'Contact', href: '/contact' },
      ],
    },
    legal: {
      title: 'Legal',
      links: [
        { label: 'Privacy Policy', href: '/privacy' },
        { label: 'Terms of Service', href: '/terms' },
        { label: 'Cookie Policy', href: '/cookies' },
      ],
    },
  },
};

