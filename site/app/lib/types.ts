// ---------------------------------------------------------------------------
// Core data models used across the marketing site
// Derived from Supabase table shapes + the transformation logic in the
// original React hooks (useHomePageData, useCaseStudies, useArticles,
// useServices) and the team pages.
// ---------------------------------------------------------------------------

// --- Case Studies ----------------------------------------------------------

export interface KeyMetric {
  label?: string;
  before?: string;
  after?: string;
  improvement?: string;
  type?: string;
  value?: number;
}

export interface ProcessStep {
  title?: string;
  description?: string;
  icon?: string;
}

export interface ResultNarrative {
  title?: string;
  description?: string;
  metric?: string;
}

export interface GalleryImage {
  url: string;
  alt?: string;
  caption?: string;
}

export interface CaseStudyTestimonial {
  name: string;
  position: string;
  quote: string;
  avatar: string;
  rating: number;
}

/** Transformed case study ready for components. */
export interface CaseStudy {
  id: string;
  title: string;
  slug: string;
  client: string;
  clientLogo: string | null;
  clientWebsite: string | null;
  industry: string;
  serviceType: string;
  businessStage: string;
  companySize: string;
  heroImage: string;
  description: string;
  challenge: string;
  solution: string;
  implementation: string;
  timeline: string;
  duration: string;
  featured: boolean;
  keyMetrics: KeyMetric[];
  detailedResults: ResultNarrative[];
  processSteps: ProcessStep[];
  technologiesUsed: string[];
  deliverables: string[];
  teamMembers: string[];
  projectLead: string | null;
  testimonial: CaseStudyTestimonial | null;
  gallery: string[];
  viewCount: number;
  conversionCount: number;
  created_at: string;
  project_start_date: string | null;
  project_end_date: string | null;
}

/** Lightweight shape used on the homepage hero. */
export interface CaseStudyCard {
  id: string;
  title: string;
  category: string;
  description: string;
  beforeMetric: string;
  afterMetric: string;
  improvement: string;
  image: string;
  videoPreview: string;
  tags: string[];
  timeline: string;
  industry: string;
  client: string;
  slug: string;
}

export interface CaseStudyFilters {
  industries: string[];
  serviceTypes: string[];
  businessStages: string[];
  companySizes: string[];
}

// --- Articles --------------------------------------------------------------

export interface Author {
  id?: string;
  name: string;
  role: string;
  avatar: string;
  bio?: string | null;
  slug: string | null;
}

export interface CoAuthor {
  id: string;
  name: string;
  role: string;
  bio?: string | null;
  avatar: string;
  slug: string | null;
}

export interface Article {
  id: string;
  title: string;
  slug: string;
  excerpt: string;
  content: string | null;
  contentText: string;
  contentHtml: string | null;
  rawContent: unknown;
  author: Author;
  coAuthors: CoAuthor[];
  category: string;
  topics: string[];
  featuredImage: string;
  featuredImageAlt: string | null;
  publishedDate: string;
  readTime: number;
  featured: boolean;
  views: number;
  likes: number;
  shares: number;
  bookmarks: number;
  galleryImages: (string | GalleryImage)[];
  metaTitle: string | null;
  metaDescription: string | null;
  ogImage: string | null;
  enableComments: boolean | null;
  enableReactions: boolean | null;
  coAuthorIds: string[];
}

export interface ArticleFilters {
  categories: string[];
  topics: string[];
  readTimes: string[];
}

// --- Categories ------------------------------------------------------------

export interface Category {
  id: string;
  name: string;
  slug: string;
  type: string;
  is_active: boolean;
  sort_order: number;
}

// --- Service Zones & Services -----------------------------------------------

export interface ServiceZoneStats {
  projects: number;
  satisfaction: number;
}

export interface ServiceZone {
  id: string;
  slug: string;
  title: string;
  subtitle?: string;
  description: string;
  icon: string;
  features: string[];
  stats: ServiceZoneStats;
  previewImage?: string;
  previewImageAlt?: string;
  color?: string;
  bgColor?: string;
  textColor?: string;
  serviceCount?: number;
  keyServices?: string[];
  // Conversion fields
  tagline?: string | null;
  heroImage?: string | null;
  totalClients?: number;
  avgSatisfaction?: number | null;
  featuredMetric?: { label: string; value: string } | null;
}

export interface PricingTier {
  name: string;
  price?: string;
  description?: string;
  features?: string[];
}

export interface SuccessMetric {
  id?: number;
  metric: string;
  value: string;
  description?: string;
}

export interface ServiceFAQ {
  id?: number;
  question: string;
  answer: string;
}

export interface ServiceTestimonial {
  id: string;
  clientName: string;
  clientTitle: string | null;
  clientCompany: string | null;
  clientAvatar: string | null;
  quote: string;
  rating: number;
  resultMetric: string | null;
  isFeatured: boolean;
}

export interface Service {
  id: string;
  slug: string;
  title: string;
  category: string;
  zone: string;
  icon: string;
  description: string;
  fullDescription: string | null;
  features: string[];
  technologies: string[];
  process: ProcessStep[];
  expectedResults: string[];
  pricingTiers: PricingTier[];
  viewCount: number;
  uniqueViewCount: number;
  inquiryCount: number;
  isFeatured?: boolean;
  metaTitle?: string | null;
  metaDescription?: string | null;
  // Conversion fields
  tagline?: string | null;
  heroImage?: string | null;
  showcaseImages?: string[];
  avgRoi?: string | null;
  avgTimeline?: string | null;
  clientsServed?: number;
  satisfactionRate?: number | null;
  successMetrics?: SuccessMetric[];
  guarantee?: string | null;
  availability?: string | null;
  turnaround?: string | null;
  relatedCaseStudyIds?: string[];
  faqs?: ServiceFAQ[];
  // Funnel fields
  beforeImage?: string | null;
  afterImage?: string | null;
  leadMagnetTitle?: string | null;
  leadMagnetDescription?: string | null;
  leadMagnetUrl?: string | null;
  roiFormula?: RoiFormula | null;
  conversionBreaks?: ConversionBreakData[];
  tooltipDefinitions?: Record<string, string>;
  // Populated at query time
  testimonials?: ServiceTestimonial[];
}

export interface RoiFormula {
  title?: string;
  inputs: string[];
  formula: string;
  example: {
    inputs: Record<string, string>;
    result: string;
    explanation?: string;
  };
}

export interface ConversionBreakData {
  position: string;
  text: string;
  cta: string;
  action: "calendly" | "scroll" | "link";
  href?: string;
}

// --- Team ------------------------------------------------------------------

export interface TeamMember {
  id: string;
  slug: string;
  full_name: string;
  display_name: string | null;
  job_title: string;
  department: string[];
  bio: string | null;
  avatar_url: string | null;
  expertise: string[];
  linkedin_url: string | null;
  twitter_url: string | null;
  github_url: string | null;
  is_active: boolean;
  is_public: boolean;
  sort_order: number;
}

// --- Testimonials ----------------------------------------------------------

export interface Testimonial {
  id: string;
  client_name: string;
  client_title: string;
  client_company: string | null;
  client_avatar: string | null;
  quote: string;
  rating: number;
  is_featured: boolean;
  status: string;
  sort_order: number;
}

// --- Awards ----------------------------------------------------------------

export interface Award {
  id: string;
  title: string;
  organization: string | null;
  year: number;
  description: string | null;
  image: string | null;
  url: string | null;
  is_active: boolean;
}

// --- Partnerships ----------------------------------------------------------

export interface Partnership {
  id: string;
  name: string;
  logo: string | null;
  url: string | null;
  description: string | null;
  tier: string | null;
  is_featured: boolean;
  is_active: boolean;
  sort_order: number;
}

// --- Homepage Stats --------------------------------------------------------

export interface HomePageStats {
  projects: string;
  satisfaction: string;
  growth: string;
  awards: string;
}

// --- Contact ---------------------------------------------------------------

export interface ContactSubmission {
  id?: string;
  name: string;
  email: string;
  phone?: string;
  company?: string;
  service_interest?: string;
  budget_range?: string;
  message: string;
  source?: string;
  created_at?: string;
}
