Rule27 Design - Complete Supabase Backend Architecture & Schema Documentation
Table of Contents

Project Overview
Architecture Overview
Requirements & Decisions
Database Schema
Initial Setup Guide
API Architecture
Security Model
Performance Considerations
Migration Strategy
Future Scalability


Project Overview
Rule27 Design is transitioning from a consulting practice to a full software company leveraging AI agents for clients, with design/development services as add-ons. This backend architecture supports a content management system for the current marketing website while laying the foundation for future SaaS capabilities.
Tech Stack

Frontend: React (Vite) with Tailwind CSS
Backend: Supabase (PostgreSQL, Authentication, Storage, Realtime)
Deployment: TBD (Vercel/Netlify recommended for frontend)
Email: Resend (for transactional emails)
CDN: Supabase Storage with potential CloudFront/Cloudflare integration


Architecture Overview
mermaidgraph TB
    subgraph "Client Layer"
        A[React Frontend]
        B[Mobile App - Future]
    end
    
    subgraph "API Gateway"
        C[Supabase Auth]
        D[Supabase REST API]
        E[Supabase Realtime]
        F[Edge Functions]
    end
    
    subgraph "Data Layer"
        G[PostgreSQL Database]
        H[Storage Buckets]
        I[Redis Cache - Future]
    end
    
    subgraph "External Services"
        J[Resend Email]
        K[Analytics Services]
        L[AI Services - Future]
    end
    
    A --> C
    A --> D
    A --> E
    B --> C
    B --> D
    
    C --> G
    D --> G
    E --> G
    F --> G
    F --> H
    
    F --> J
    F --> K
    F --> L
Key Architecture Principles

API-First Design: All functionality exposed through REST APIs for future mobile/third-party integrations
Role-Based Access Control (RBAC): Three-tier permission system (Admin, Contributor, Standard)
Content Versioning: Draft → Pending → Published workflow
Real-time Updates: Live analytics and content updates using Supabase Realtime
Scalable Storage: Separate buckets for different content types with appropriate access policies
Performance Optimization: Strategic indexing and caching strategies
SEO-Optimized: Structured data and meta fields for all content types


Requirements & Decisions
User Management & Permissions
Question: Who will be managing content and what permission levels are needed?
Decision:

Three user roles: Admin, Contributor, Standard
Admins can publish directly and manage all content
Contributors can create content but require Admin approval (Draft → Pending → Published)
Standard users are clients/visitors with potential login access to view their projects

Media & File Storage
Question: How should media files be handled?
Decision:

Store media in Supabase Storage with separate buckets for different content types
Support both images and videos in rich text editors
Implement image optimization through Supabase Transform API
Public bucket for general media, private bucket for premium resources

Content Management
Question: What content features are needed?
Decision:

Single author with optional co-author support
Testimonials reusable across multiple pages
Content scheduling for future publication
Custom metrics per case study (not templated)
Flexible engagement duration (not fixed periods)
Optional team member attribution for projects

Analytics & Tracking
Question: What analytics capabilities are required?
Decision:

Track page views, user sessions, and engagement metrics
Store UTM parameters for marketing attribution
A/B testing capabilities for content variations
Tool usage tracking with conversion attribution
Performance metrics per author and per page
Only store detailed data for logged-in users

Resource Management
Question: How should downloadable resources be handled?
Decision:

Two tiers: Standard (free) and Premium (paid)
Track total download counts (not per-user initially)
Premium resources with pricing stored for future monetization
No current gating, but architecture supports it

Content Organization
Question: How should content be categorized?
Decision:

Hierarchical categories with parent/child relationships
Flat tag structure for flexible labeling
Content collections/series support
Custom fields for future flexibility

Team Structure
Question: How should team members be organized?
Decision:

Public/private profile toggle controlled by Admin
Multiple department assignment capability
Flexible expertise areas
Current departments: Leadership, Marketing, Development, Creative
Performance tracking per author


Database Schema
Complete Schema Setup Script
sql-- ============================================
-- RULE27 DESIGN - COMPLETE DATABASE SCHEMA
-- ============================================
-- Run this script in a fresh Supabase project
-- Order matters due to foreign key constraints

-- ============================================
-- 1. CORE USER & AUTHENTICATION TABLES
-- ============================================

-- User profiles extending Supabase auth.users
CREATE TABLE public.profiles (
  id UUID PRIMARY KEY REFERENCES auth.users(id) ON DELETE CASCADE,
  email TEXT UNIQUE NOT NULL,
  full_name TEXT NOT NULL,
  display_name TEXT,
  avatar_url TEXT,
  bio TEXT,
  role TEXT NOT NULL CHECK (role IN ('admin', 'contributor', 'standard')) DEFAULT 'standard',
  is_public BOOLEAN DEFAULT false,
  department TEXT[] DEFAULT '{}', -- Array for multiple departments
  expertise TEXT[] DEFAULT '{}', -- Array of expertise areas
  job_title TEXT,
  linkedin_url TEXT,
  twitter_url TEXT,
  github_url TEXT,
  sort_order INTEGER DEFAULT 0,
  is_active BOOLEAN DEFAULT true,
  created_at TIMESTAMPTZ DEFAULT NOW(),
  updated_at TIMESTAMPTZ DEFAULT NOW()
);

-- Departments lookup table
CREATE TABLE public.departments (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  name TEXT UNIQUE NOT NULL, -- Leadership, Marketing, Development, Creative
  slug TEXT UNIQUE NOT NULL,
  description TEXT,
  icon TEXT,
  color TEXT,
  sort_order INTEGER DEFAULT 0,
  is_active BOOLEAN DEFAULT true,
  created_at TIMESTAMPTZ DEFAULT NOW()
);

-- Expertise areas lookup table
CREATE TABLE public.expertise_areas (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  name TEXT UNIQUE NOT NULL,
  slug TEXT UNIQUE NOT NULL,
  department_id UUID REFERENCES departments(id),
  description TEXT,
  sort_order INTEGER DEFAULT 0,
  is_active BOOLEAN DEFAULT true,
  created_at TIMESTAMPTZ DEFAULT NOW()
);

-- ============================================
-- 2. CATEGORIZATION & ORGANIZATION
-- ============================================

-- Hierarchical categories for content organization
CREATE TABLE public.categories (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  name TEXT NOT NULL,
  slug TEXT UNIQUE NOT NULL,
  description TEXT,
  parent_id UUID REFERENCES categories(id),
  type TEXT NOT NULL, -- article, case_study, resource, etc.
  icon TEXT,
  color TEXT,
  sort_order INTEGER DEFAULT 0,
  is_active BOOLEAN DEFAULT true,
  meta_title TEXT,
  meta_description TEXT,
  created_at TIMESTAMPTZ DEFAULT NOW(),
  updated_at TIMESTAMPTZ DEFAULT NOW()
);

-- Tags (flat structure for flexible labeling)
CREATE TABLE public.tags (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  name TEXT NOT NULL,
  slug TEXT UNIQUE NOT NULL,
  type TEXT, -- Optional: to categorize tags
  description TEXT,
  usage_count INTEGER DEFAULT 0,
  is_active BOOLEAN DEFAULT true,
  created_at TIMESTAMPTZ DEFAULT NOW()
);

-- Content series/collections for grouping related content
CREATE TABLE public.content_collections (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  name TEXT NOT NULL,
  slug TEXT UNIQUE NOT NULL,
  description TEXT,
  type TEXT NOT NULL, -- article_series, case_study_campaign, resource_pack
  cover_image TEXT,
  featured BOOLEAN DEFAULT false,
  sort_order INTEGER DEFAULT 0,
  is_active BOOLEAN DEFAULT true,
  meta_title TEXT,
  meta_description TEXT,
  created_at TIMESTAMPTZ DEFAULT NOW(),
  updated_at TIMESTAMPTZ DEFAULT NOW()
);

-- ============================================
-- 3. TESTIMONIALS & SOCIAL PROOF
-- ============================================

-- Testimonials that can be reused across multiple pages
CREATE TABLE public.testimonials (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  client_name TEXT NOT NULL,
  client_title TEXT,
  client_company TEXT,
  client_avatar TEXT,
  client_logo TEXT,
  quote TEXT NOT NULL,
  long_quote TEXT, -- Extended version for case studies
  rating INTEGER CHECK (rating >= 1 AND rating <= 5),
  video_url TEXT,
  video_thumbnail TEXT,
  is_featured BOOLEAN DEFAULT false,
  display_locations TEXT[] DEFAULT '{}', -- Array of page locations
  industry TEXT,
  service_type TEXT,
  project_value TEXT, -- e.g., "$2.5M Revenue Impact"
  sort_order INTEGER DEFAULT 0,
  status TEXT CHECK (status IN ('draft', 'published', 'archived')) DEFAULT 'published',
  created_at TIMESTAMPTZ DEFAULT NOW(),
  updated_at TIMESTAMPTZ DEFAULT NOW()
);

-- ============================================
-- 4. CONTENT MANAGEMENT TABLES
-- ============================================

-- Articles/Blog posts with full CMS capabilities
CREATE TABLE public.articles (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  title TEXT NOT NULL,
  slug TEXT UNIQUE NOT NULL,
  excerpt TEXT,
  content JSONB NOT NULL, -- Rich text editor content (EditorJS/TipTap format)
  featured_image TEXT,
  featured_image_alt TEXT,
  featured_video TEXT,
  author_id UUID REFERENCES profiles(id) NOT NULL,
  co_authors UUID[] DEFAULT '{}', -- Array of profile IDs
  category_id UUID REFERENCES categories(id),
  tags TEXT[] DEFAULT '{}',
  status TEXT CHECK (status IN ('draft', 'pending', 'published', 'archived')) DEFAULT 'draft',
  published_at TIMESTAMPTZ,
  scheduled_at TIMESTAMPTZ,
  read_time INTEGER, -- in minutes
  is_featured BOOLEAN DEFAULT false,
  
  -- Content settings
  enable_comments BOOLEAN DEFAULT true,
  enable_reactions BOOLEAN DEFAULT true,
  
  -- SEO fields
  meta_title TEXT,
  meta_description TEXT,
  meta_keywords TEXT[],
  og_title TEXT,
  og_description TEXT,
  og_image TEXT,
  twitter_card TEXT DEFAULT 'summary_large_image',
  canonical_url TEXT,
  schema_markup JSONB,
  
  -- Analytics
  view_count INTEGER DEFAULT 0,
  unique_view_count INTEGER DEFAULT 0,
  like_count INTEGER DEFAULT 0,
  share_count INTEGER DEFAULT 0,
  comment_count INTEGER DEFAULT 0,
  average_read_depth DECIMAL(5,2), -- Percentage of article read
  
  -- Internal notes
  internal_notes TEXT,
  
  created_at TIMESTAMPTZ DEFAULT NOW(),
  updated_at TIMESTAMPTZ DEFAULT NOW(),
  created_by UUID REFERENCES profiles(id),
  updated_by UUID REFERENCES profiles(id)
);

-- Case Studies with flexible metrics
CREATE TABLE public.case_studies (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  title TEXT NOT NULL,
  slug TEXT UNIQUE NOT NULL,
  client_name TEXT NOT NULL,
  client_logo TEXT,
  client_website TEXT,
  industry TEXT NOT NULL,
  service_type TEXT NOT NULL,
  business_stage TEXT,
  hero_image TEXT,
  hero_video TEXT,
  gallery JSONB DEFAULT '[]', -- Array of {url, type, caption, alt}
  description TEXT,
  challenge TEXT,
  solution TEXT,
  implementation TEXT,
  
  -- Timeline (flexible duration)
  project_duration TEXT, -- e.g., "3 months", "6 weeks", "2 years"
  start_date DATE,
  end_date DATE,
  
  -- Results & Metrics (completely flexible JSON structure)
  key_metrics JSONB DEFAULT '[]', 
  -- Example: [{label: "Revenue Growth", value: 400, type: "percentage", description: "..."}]
  
  detailed_results JSONB DEFAULT '[]',
  process_steps JSONB DEFAULT '[]',
  technologies_used TEXT[] DEFAULT '{}',
  deliverables TEXT[] DEFAULT '{}',
  
  -- Team (optional)
  team_members UUID[] DEFAULT '{}', -- Array of profile IDs
  project_lead UUID REFERENCES profiles(id),
  
  -- Testimonial
  testimonial_id UUID REFERENCES testimonials(id),
  
  -- Status and visibility
  status TEXT CHECK (status IN ('draft', 'pending', 'published', 'archived')) DEFAULT 'draft',
  is_featured BOOLEAN DEFAULT false,
  is_confidential BOOLEAN DEFAULT false, -- For NDA projects
  sort_order INTEGER DEFAULT 0,
  
  -- SEO
  meta_title TEXT,
  meta_description TEXT,
  meta_keywords TEXT[],
  og_title TEXT,
  og_description TEXT,
  og_image TEXT,
  schema_markup JSONB,
  
  -- Analytics
  view_count INTEGER DEFAULT 0,
  conversion_count INTEGER DEFAULT 0, -- Tracked conversions from this case study
  
  -- Internal
  internal_notes TEXT,
  
  created_at TIMESTAMPTZ DEFAULT NOW(),
  updated_at TIMESTAMPTZ DEFAULT NOW(),
  created_by UUID REFERENCES profiles(id),
  updated_by UUID REFERENCES profiles(id)
);

-- Resources (Innovation Lab - downloadable content)
CREATE TABLE public.resources (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  title TEXT NOT NULL,
  slug TEXT UNIQUE NOT NULL,
  description TEXT,
  long_description TEXT,
  type TEXT NOT NULL, -- template, framework, tool, report, whitepaper, ebook
  category TEXT NOT NULL,
  format TEXT, -- PDF, Excel, Figma, Sketch, etc.
  file_url TEXT,
  file_size TEXT,
  preview_image TEXT,
  preview_url TEXT, -- For tools/demos
  
  -- Pricing
  access_type TEXT CHECK (access_type IN ('free', 'premium', 'gated')) DEFAULT 'free',
  price DECIMAL(10, 2),
  currency TEXT DEFAULT 'USD',
  
  -- Metadata
  tags TEXT[] DEFAULT '{}',
  prerequisites TEXT[] DEFAULT '{}', -- Required knowledge/tools
  learning_outcomes TEXT[] DEFAULT '{}',
  is_featured BOOLEAN DEFAULT false,
  status TEXT CHECK (status IN ('draft', 'published', 'archived')) DEFAULT 'draft',
  
  -- Analytics
  download_count INTEGER DEFAULT 0,
  unique_download_count INTEGER DEFAULT 0,
  view_count INTEGER DEFAULT 0,
  rating DECIMAL(3, 2), -- Average rating
  rating_count INTEGER DEFAULT 0,
  
  -- SEO
  meta_title TEXT,
  meta_description TEXT,
  og_image TEXT,
  
  created_at TIMESTAMPTZ DEFAULT NOW(),
  updated_at TIMESTAMPTZ DEFAULT NOW(),
  created_by UUID REFERENCES profiles(id),
  updated_by UUID REFERENCES profiles(id)
);

-- Junction table for content to collections
CREATE TABLE public.content_collection_items (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  collection_id UUID REFERENCES content_collections(id) ON DELETE CASCADE,
  content_type TEXT NOT NULL, -- article, case_study, resource
  content_id UUID NOT NULL, -- ID from respective table
  sort_order INTEGER DEFAULT 0,
  featured_in_collection BOOLEAN DEFAULT false,
  created_at TIMESTAMPTZ DEFAULT NOW(),
  UNIQUE(collection_id, content_type, content_id)
);

-- ============================================
-- 5. INTERACTIVE TOOLS & ANALYTICS
-- ============================================

-- Tool usage tracking for ROI Calculator, Brand Analyzer, etc.
CREATE TABLE public.tool_interactions (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id UUID REFERENCES profiles(id),
  session_id TEXT NOT NULL,
  tool_name TEXT NOT NULL, -- roi_calculator, brand_analyzer, design_generator, performance_audit
  input_data JSONB NOT NULL,
  results JSONB NOT NULL,
  shared_url TEXT UNIQUE,
  is_shared BOOLEAN DEFAULT false,
  converted_to_contact BOOLEAN DEFAULT false,
  converted_to_signup BOOLEAN DEFAULT false,
  time_spent INTEGER, -- seconds
  completion_rate DECIMAL(5,2), -- percentage
  created_at TIMESTAMPTZ DEFAULT NOW()
);

-- Tool presets/templates for common scenarios
CREATE TABLE public.tool_presets (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  tool_name TEXT NOT NULL,
  preset_name TEXT NOT NULL,
  description TEXT,
  icon TEXT,
  preset_data JSONB NOT NULL,
  category TEXT,
  is_default BOOLEAN DEFAULT false,
  is_premium BOOLEAN DEFAULT false,
  usage_count INTEGER DEFAULT 0,
  sort_order INTEGER DEFAULT 0,
  created_at TIMESTAMPTZ DEFAULT NOW(),
  updated_at TIMESTAMPTZ DEFAULT NOW()
);

-- Page analytics for comprehensive tracking
CREATE TABLE public.page_analytics (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  page_path TEXT NOT NULL,
  page_title TEXT,
  page_type TEXT, -- homepage, article, case_study, tool, etc.
  user_id UUID REFERENCES profiles(id),
  session_id TEXT NOT NULL,
  
  -- UTM parameters for marketing attribution
  utm_source TEXT,
  utm_medium TEXT,
  utm_campaign TEXT,
  utm_term TEXT,
  utm_content TEXT,
  
  -- Referrer info
  referrer_url TEXT,
  referrer_domain TEXT,
  
  -- User info
  ip_address INET,
  user_agent TEXT,
  browser TEXT,
  browser_version TEXT,
  os TEXT,
  device_type TEXT, -- desktop, mobile, tablet
  screen_resolution TEXT,
  viewport_size TEXT,
  country TEXT,
  region TEXT,
  city TEXT,
  
  -- Engagement metrics
  time_on_page INTEGER, -- seconds
  scroll_depth DECIMAL(5,2), -- percentage
  clicks INTEGER DEFAULT 0,
  interactions JSONB DEFAULT '[]', -- Array of interaction events
  bounce BOOLEAN DEFAULT false,
  exit_page BOOLEAN DEFAULT false,
  
  created_at TIMESTAMPTZ DEFAULT NOW()
);

-- Content engagement tracking for detailed metrics
CREATE TABLE public.content_engagement (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id UUID REFERENCES profiles(id),
  content_type TEXT NOT NULL, -- article, case_study, resource
  content_id UUID NOT NULL,
  action TEXT NOT NULL, -- view, like, share, download, comment, bookmark
  action_metadata JSONB, -- Additional data about the action
  session_id TEXT,
  source TEXT, -- Where the action originated
  created_at TIMESTAMPTZ DEFAULT NOW(),
  UNIQUE(user_id, content_type, content_id, action)
);

-- User sessions for tracking user journeys
CREATE TABLE public.user_sessions (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  session_id TEXT UNIQUE NOT NULL,
  user_id UUID REFERENCES profiles(id),
  start_time TIMESTAMPTZ DEFAULT NOW(),
  end_time TIMESTAMPTZ,
  duration INTEGER, -- seconds
  page_views INTEGER DEFAULT 0,
  events_count INTEGER DEFAULT 0,
  
  -- Entry and exit info
  entry_page TEXT,
  exit_page TEXT,
  
  -- Session metadata
  ip_address INET,
  user_agent TEXT,
  device_fingerprint TEXT,
  
  -- Conversion tracking
  converted BOOLEAN DEFAULT false,
  conversion_type TEXT, -- signup, contact, download, etc.
  conversion_value DECIMAL(10,2),
  
  created_at TIMESTAMPTZ DEFAULT NOW(),
  updated_at TIMESTAMPTZ DEFAULT NOW()
);

-- A/B testing framework
CREATE TABLE public.ab_tests (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  test_name TEXT NOT NULL,
  test_description TEXT,
  test_type TEXT NOT NULL, -- content, cta, layout, color, copy
  test_page TEXT, -- Which page/component
  variants JSONB NOT NULL, -- Array of variant configurations
  traffic_split JSONB, -- Percentage split between variants
  target_metric TEXT, -- conversion, engagement, clicks, etc.
  success_criteria TEXT,
  hypothesis TEXT,
  
  -- Test status
  status TEXT CHECK (status IN ('draft', 'running', 'paused', 'completed', 'archived')) DEFAULT 'draft',
  start_date TIMESTAMPTZ,
  end_date TIMESTAMPTZ,
  
  -- Results
  winning_variant TEXT,
  confidence_level DECIMAL(5,2),
  results JSONB,
  conclusion TEXT,
  
  created_at TIMESTAMPTZ DEFAULT NOW(),
  updated_at TIMESTAMPTZ DEFAULT NOW(),
  created_by UUID REFERENCES profiles(id)
);

-- A/B test participation tracking
CREATE TABLE public.ab_test_participants (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  test_id UUID REFERENCES ab_tests(id) ON DELETE CASCADE,
  user_id UUID REFERENCES profiles(id),
  session_id TEXT,
  variant TEXT NOT NULL,
  enrolled_at TIMESTAMPTZ DEFAULT NOW(),
  
  -- Conversion tracking
  converted BOOLEAN DEFAULT false,
  converted_at TIMESTAMPTZ,
  conversion_value DECIMAL(10,2),
  
  -- Engagement metrics
  interactions INTEGER DEFAULT 0,
  time_spent INTEGER, -- seconds
  
  created_at TIMESTAMPTZ DEFAULT NOW(),
  UNIQUE(test_id, session_id)
);

-- ============================================
-- 6. CONTACT & LEAD MANAGEMENT
-- ============================================

-- Contact form submissions with lead scoring
CREATE TABLE public.contact_submissions (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  
  -- Contact info
  name TEXT NOT NULL,
  email TEXT NOT NULL,
  company TEXT,
  company_size TEXT,
  phone TEXT,
  website TEXT,
  
  -- Project details
  project_type TEXT,
  services_needed TEXT[] DEFAULT '{}',
  budget_range TEXT,
  timeline TEXT,
  message TEXT,
  
  -- Source tracking
  source_page TEXT,
  source_campaign TEXT,
  referrer TEXT,
  utm_source TEXT,
  utm_medium TEXT,
  utm_campaign TEXT,
  utm_term TEXT,
  utm_content TEXT,
  
  -- Lead scoring and qualification
  lead_score INTEGER,
  lead_temperature TEXT CHECK (lead_temperature IN ('cold', 'warm', 'hot')),
  lead_status TEXT DEFAULT 'new', 
  -- new, contacted, qualified, proposal_sent, negotiating, won, lost
  
  -- Assignment and follow-up
  assigned_to UUID REFERENCES profiles(id),
  first_contact_date TIMESTAMPTZ,
  last_contact_date TIMESTAMPTZ,
  next_follow_up TIMESTAMPTZ,
  
  -- Email tracking
  email_sent BOOLEAN DEFAULT false,
  email_sent_at TIMESTAMPTZ,
  email_opened BOOLEAN DEFAULT false,
  email_opened_at TIMESTAMPTZ,
  
  -- Notes and outcomes
  notes TEXT,
  rejection_reason TEXT,
  won_value DECIMAL(10,2),
  
  created_at TIMESTAMPTZ DEFAULT NOW(),
  updated_at TIMESTAMPTZ DEFAULT NOW()
);

-- Newsletter subscriptions with segmentation
CREATE TABLE public.newsletter_subscribers (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  email TEXT UNIQUE NOT NULL,
  name TEXT,
  company TEXT,
  
  -- Subscription status
  status TEXT CHECK (status IN ('pending', 'confirmed', 'unsubscribed', 'bounced', 'complained')) DEFAULT 'pending',
  confirmation_token TEXT UNIQUE,
  confirmed_at TIMESTAMPTZ,
  unsubscribed_at TIMESTAMPTZ,
  
  -- Subscription preferences
  frequency TEXT DEFAULT 'weekly', -- daily, weekly, monthly
  topics TEXT[] DEFAULT '{}', -- design, development, marketing, case_studies
  
  -- Source and attribution
  source TEXT,
  source_page TEXT,
  utm_source TEXT,
  utm_medium TEXT,
  utm_campaign TEXT,
  
  -- Engagement
  emails_sent INTEGER DEFAULT 0,
  emails_opened INTEGER DEFAULT 0,
  emails_clicked INTEGER DEFAULT 0,
  last_email_sent TIMESTAMPTZ,
  last_email_opened TIMESTAMPTZ,
  
  -- Segmentation
  tags TEXT[] DEFAULT '{}',
  lead_score INTEGER,
  customer_status TEXT, -- prospect, customer, past_customer
  
  created_at TIMESTAMPTZ DEFAULT NOW(),
  updated_at TIMESTAMPTZ DEFAULT NOW()
);

-- ============================================
-- 7. MEDIA & FILE MANAGEMENT
-- ============================================

-- Media library for all uploaded files
CREATE TABLE public.media (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  file_name TEXT NOT NULL,
  original_name TEXT,
  file_url TEXT NOT NULL,
  file_path TEXT NOT NULL, -- Path in storage bucket
  file_type TEXT NOT NULL, -- image, video, document, audio
  mime_type TEXT,
  file_size BIGINT, -- bytes
  
  -- Image/Video specific
  width INTEGER,
  height INTEGER,
  duration INTEGER, -- for videos/audio in seconds
  thumbnail_url TEXT,
  thumbnails JSONB, -- Multiple sizes {small, medium, large}
  
  -- Metadata
  alt_text TEXT,
  caption TEXT,
  description TEXT,
  tags TEXT[] DEFAULT '{}',
  
  -- Organization
  folder TEXT DEFAULT '/',
  is_public BOOLEAN DEFAULT true,
  
  -- Usage tracking
  usage_count INTEGER DEFAULT 0,
  last_used_at TIMESTAMPTZ,
  
  -- Upload info
  uploaded_by UUID REFERENCES profiles(id),
  created_at TIMESTAMPTZ DEFAULT NOW(),
  updated_at TIMESTAMPTZ DEFAULT NOW()
);

-- Media usage tracking (which content uses which media)
CREATE TABLE public.media_usage (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  media_id UUID REFERENCES media(id) ON DELETE CASCADE,
  content_type TEXT NOT NULL,
  content_id UUID NOT NULL,
  field_name TEXT, -- Which field uses this media
  created_at TIMESTAMPTZ DEFAULT NOW()
);

-- ============================================
-- 8. FUNCTIONS & TRIGGERS
-- ============================================

-- Auto-update updated_at timestamp
CREATE OR REPLACE FUNCTION update_updated_at_column()
RETURNS TRIGGER AS $$
BEGIN
  NEW.updated_at = NOW();
  RETURN NEW;
END;
$$ LANGUAGE plpgsql;

-- Apply updated_at trigger to all relevant tables
DO $$ 
DECLARE
  t text;
BEGIN
  FOR t IN 
    SELECT table_name 
    FROM information_schema.columns 
    WHERE column_name = 'updated_at' 
    AND table_schema = 'public'
  LOOP
    EXECUTE format('CREATE TRIGGER update_%I_updated_at BEFORE UPDATE ON %I 
                    FOR EACH ROW EXECUTE FUNCTION update_updated_at_column()', t, t);
  END LOOP;
END $$;

-- Auto-generate slugs from titles
CREATE OR REPLACE FUNCTION generate_slug(title TEXT)
RETURNS TEXT AS $$
DECLARE
  slug TEXT;
BEGIN
  -- Convert to lowercase, replace spaces and special chars with hyphens
  slug := lower(title);
  slug := regexp_replace(slug, '[^a-z0-9\s-]', '', 'g');
  slug := regexp_replace(slug, '\s+', '-', 'g');
  slug := regexp_replace(slug, '-+', '-', 'g');
  slug := trim(both '-' from slug);
  RETURN slug;
END;
$$ LANGUAGE plpgsql;

-- Ensure unique slug
CREATE OR REPLACE FUNCTION ensure_unique_slug()
RETURNS TRIGGER AS $$
DECLARE
  base_slug TEXT;
  final_slug TEXT;
  counter INTEGER := 1;
BEGIN
  IF NEW.slug IS NULL OR NEW.slug = '' THEN
    base_slug := generate_slug(NEW.title);
  ELSE
    base_slug := NEW.slug;
  END IF;
  
  final_slug := base_slug;
  
  -- Check for existing slugs and append number if necessary
  WHILE EXISTS (
    SELECT 1 FROM articles WHERE slug = final_slug AND id != COALESCE(NEW.id, '00000000-0000-0000-0000-000000000000'::uuid)
    UNION
    SELECT 1 FROM case_studies WHERE slug = final_slug AND id != COALESCE(NEW.id, '00000000-0000-0000-0000-000000000000'::uuid)
    UNION
    SELECT 1 FROM resources WHERE slug = final_slug AND id != COALESCE(NEW.id, '00000000-0000-0000-0000-000000000000'::uuid)
  ) LOOP
    final_slug := base_slug || '-' || counter;
    counter := counter + 1;
  END LOOP;
  
  NEW.slug := final_slug;
  RETURN NEW;
END;
$$ LANGUAGE plpgsql;

-- Apply slug generation to content tables
CREATE TRIGGER ensure_unique_article_slug BEFORE INSERT OR UPDATE ON articles
  FOR EACH ROW EXECUTE FUNCTION ensure_unique_slug();

CREATE TRIGGER ensure_unique_case_study_slug BEFORE INSERT OR UPDATE ON case_studies
  FOR EACH ROW EXECUTE FUNCTION ensure_unique_slug();

CREATE TRIGGER ensure_unique_resource_slug BEFORE INSERT OR UPDATE ON resources
  FOR EACH ROW EXECUTE FUNCTION ensure_unique_slug();

-- Calculate read time for articles
CREATE OR REPLACE FUNCTION calculate_read_time()
RETURNS TRIGGER AS $$
DECLARE
  word_count INTEGER;
  reading_speed INTEGER := 200; -- words per minute
BEGIN
  -- Extract text from JSON content and count words
  word_count := array_length(
    string_to_array(
      regexp_replace(NEW.content::text, '<[^>]*>', '', 'g'), -- Remove HTML tags
      ' '
    ), 
    1
  );
  
  NEW.read_time := GREATEST(1, CEIL(word_count::decimal / reading_speed));
  RETURN NEW;
END;
$$ LANGUAGE plpgsql;

CREATE TRIGGER calculate_article_read_time BEFORE INSERT OR UPDATE ON articles
  FOR EACH ROW EXECUTE FUNCTION calculate_read_time();

-- Increment view counts with unique tracking
CREATE OR REPLACE FUNCTION increment_view_count(
  p_content_type TEXT,
  p_content_id UUID,
  p_user_id UUID DEFAULT NULL,
  p_session_id TEXT DEFAULT NULL
)
RETURNS VOID AS $$
BEGIN
  -- Check if this is a unique view
  IF NOT EXISTS (
    SELECT 1 FROM content_engagement 
    WHERE content_type = p_content_type 
    AND content_id = p_content_id 
    AND action = 'view'
    AND (
      (p_user_id IS NOT NULL AND user_id = p_user_id) OR
      (p_session_id IS NOT NULL AND session_id = p_session_id)
    )
    AND created_at > NOW() - INTERVAL '24 hours'
  ) THEN
    -- Update view counts
    IF p_content_type = 'article' THEN
      UPDATE articles 
      SET view_count = view_count + 1,
          unique_view_count = unique_view_count + 1
      WHERE id = p_content_id;
    ELSIF p_content_type = 'case_study' THEN
      UPDATE case_studies 
      SET view_count = view_count + 1
      WHERE id = p_content_id;
    ELSIF p_content_type = 'resource' THEN
      UPDATE resources 
      SET view_count = view_count + 1
      WHERE id = p_content_id;
    END IF;
    
    -- Record engagement
    INSERT INTO content_engagement (user_id, content_type, content_id, action, session_id)
    VALUES (p_user_id, p_content_type, p_content_id, 'view', p_session_id)
    ON CONFLICT (user_id, content_type, content_id, action) 
    DO NOTHING;
  END IF;
END;
$$ LANGUAGE plpgsql;

-- Handle content publishing workflow
CREATE OR REPLACE FUNCTION handle_content_publishing()
RETURNS TRIGGER AS $$
BEGIN
  -- Auto-publish if admin
  IF NEW.status = 'pending' AND EXISTS (
    SELECT 1 FROM profiles 
    WHERE id = NEW.created_by 
    AND role = 'admin'
  ) THEN
    NEW.status := 'published';
    NEW.published_at := NOW();
  END IF;
  
  -- Set published_at when status changes to published
  IF NEW.status = 'published' AND OLD.status != 'published' THEN
    NEW.published_at := NOW();
  END IF;
  
  -- Handle scheduled publishing
  IF NEW.scheduled_at IS NOT NULL AND NEW.scheduled_at <= NOW() AND NEW.status = 'draft' THEN
    NEW.status := 'published';
    NEW.published_at := NEW.scheduled_at;
  END IF;
  
  RETURN NEW;
END;
$$ LANGUAGE plpgsql;

CREATE TRIGGER handle_article_publishing BEFORE UPDATE ON articles
  FOR EACH ROW EXECUTE FUNCTION handle_content_publishing();

CREATE TRIGGER handle_case_study_publishing BEFORE UPDATE ON case_studies
  FOR EACH ROW EXECUTE FUNCTION handle_content_publishing();

-- ============================================
-- 9. ROW LEVEL SECURITY (RLS) POLICIES
-- ============================================

-- Enable RLS on all tables
ALTER TABLE profiles ENABLE ROW LEVEL SECURITY;
ALTER TABLE articles ENABLE ROW LEVEL SECURITY;
ALTER TABLE case_studies ENABLE ROW LEVEL SECURITY;
ALTER TABLE resources ENABLE ROW LEVEL SECURITY;
ALTER TABLE testimonials ENABLE ROW LEVEL SECURITY;
ALTER TABLE contact_submissions ENABLE ROW LEVEL SECURITY;
ALTER TABLE page_analytics ENABLE ROW LEVEL SECURITY;
ALTER TABLE content_engagement ENABLE ROW LEVEL SECURITY;
ALTER TABLE tool_interactions ENABLE ROW LEVEL SECURITY;
ALTER TABLE categories ENABLE ROW LEVEL SECURITY;
ALTER TABLE tags ENABLE ROW LEVEL SECURITY;
ALTER TABLE media ENABLE ROW LEVEL SECURITY;

-- PROFILES POLICIES
CREATE POLICY "Public profiles are viewable by everyone" ON profiles
  FOR SELECT USING (is_public = true);

CREATE POLICY "Users can view own profile" ON profiles
  FOR SELECT USING (auth.uid() = id);

CREATE POLICY "Users can update own profile" ON profiles
  FOR UPDATE USING (auth.uid() = id);

CREATE POLICY "Admins can view all profiles" ON profiles
  FOR SELECT USING (
    EXISTS (
      SELECT 1 FROM profiles 
      WHERE profiles.id = auth.uid() 
      AND profiles.role = 'admin'
    )
  );

-- ARTICLES POLICIES
CREATE POLICY "Published articles are public" ON articles
  FOR SELECT USING (status = 'published');

CREATE POLICY "Authors can view own articles" ON articles
  FOR SELECT USING (
    auth.uid() = author_id OR 
    auth.uid() = ANY(co_authors)
  );

CREATE POLICY "Contributors can create articles" ON articles
  FOR INSERT WITH CHECK (
    EXISTS (
      SELECT 1 FROM profiles 
      WHERE profiles.id = auth.uid() 
      AND profiles.role IN ('admin', 'contributor')
    )
  );

CREATE POLICY "Authors can update own drafts" ON articles
  FOR UPDATE USING (
    auth.uid() = author_id AND 
    status IN ('draft', 'pending')
  );

CREATE POLICY "Admins can manage all articles" ON articles
  FOR ALL USING (
    EXISTS (
      SELECT 1 FROM profiles 
      WHERE profiles.id = auth.uid() 
      AND profiles.role = 'admin'
    )
  );

-- CASE STUDIES POLICIES
CREATE POLICY "Published case studies are public" ON case_studies
  FOR SELECT USING (status = 'published' AND NOT is_confidential);

CREATE POLICY "Team members can view their case studies" ON case_studies
  FOR SELECT USING (
    auth.uid() = ANY(team_members) OR
    auth.uid() = project_lead
  );

CREATE POLICY "Admins and contributors can manage case studies" ON case_studies
  FOR ALL USING (
    EXISTS (
      SELECT 1 FROM profiles 
      WHERE profiles.id = auth.uid() 
      AND profiles.role IN ('admin', 'contributor')
    )
  );

-- RESOURCES POLICIES
CREATE POLICY "Published free resources are public" ON resources
  FOR SELECT USING (status = 'published' AND access_type = 'free');

CREATE POLICY "Authenticated users can view premium resources" ON resources
  FOR SELECT USING (
    status = 'published' AND 
    access_type = 'premium' AND
    auth.uid() IS NOT NULL
  );

CREATE POLICY "Admins and contributors can manage resources" ON resources
  FOR ALL USING (
    EXISTS (
      SELECT 1 FROM profiles 
      WHERE profiles.id = auth.uid() 
      AND profiles.role IN ('admin', 'contributor')
    )
  );

-- TESTIMONIALS POLICIES
CREATE POLICY "Published testimonials are public" ON testimonials
  FOR SELECT USING (status = 'published');

CREATE POLICY "Admins can manage testimonials" ON testimonials
  FOR ALL USING (
    EXISTS (
      SELECT 1 FROM profiles 
      WHERE profiles.id = auth.uid() 
      AND profiles.role = 'admin'
    )
  );

-- CONTACT SUBMISSIONS POLICIES
CREATE POLICY "Anyone can submit contact form" ON contact_submissions
  FOR INSERT WITH CHECK (true);

CREATE POLICY "Admins can view and manage submissions" ON contact_submissions
  FOR ALL USING (
    EXISTS (
      SELECT 1 FROM profiles 
      WHERE profiles.id = auth.uid() 
      AND profiles.role = 'admin'
    )
  );

CREATE POLICY "Assigned users can view their leads" ON contact_submissions
  FOR SELECT USING (auth.uid() = assigned_to);

-- ANALYTICS POLICIES
CREATE POLICY "Anyone can insert page analytics" ON page_analytics
  FOR INSERT WITH CHECK (true);

CREATE POLICY "Users can view own analytics" ON page_analytics
  FOR SELECT USING (auth.uid() = user_id);

CREATE POLICY "Admins can view all analytics" ON page_analytics
  FOR SELECT USING (
    EXISTS (
      SELECT 1 FROM profiles 
      WHERE profiles.id = auth.uid() 
      AND profiles.role = 'admin'
    )
  );

-- TOOL INTERACTIONS POLICIES
CREATE POLICY "Anyone can save tool interactions" ON tool_interactions
  FOR INSERT WITH CHECK (true);

CREATE POLICY "Users can view own tool usage" ON tool_interactions
  FOR SELECT USING (auth.uid() = user_id);

CREATE POLICY "Admins can view all tool usage" ON tool_interactions
  FOR SELECT USING (
    EXISTS (
      SELECT 1 FROM profiles 
      WHERE profiles.id = auth.uid() 
      AND profiles.role = 'admin'
    )
  );

-- CATEGORIES & TAGS POLICIES
CREATE POLICY "Categories are public" ON categories
  FOR SELECT USING (is_active = true);

CREATE POLICY "Tags are public" ON tags
  FOR SELECT USING (is_active = true);

CREATE POLICY "Admins can manage categories and tags" ON categories
  FOR ALL USING (
    EXISTS (
      SELECT 1 FROM profiles 
      WHERE profiles.id = auth.uid() 
      AND profiles.role = 'admin'
    )
  );

CREATE POLICY "Admins can manage tags" ON tags
  FOR ALL USING (
    EXISTS (
      SELECT 1 FROM profiles 
      WHERE profiles.id = auth.uid() 
      AND profiles.role = 'admin'
    )
  );

-- MEDIA POLICIES
CREATE POLICY "Public media is viewable by everyone" ON media
  FOR SELECT USING (is_public = true);

CREATE POLICY "Users can view own uploads" ON media
  FOR SELECT USING (auth.uid() = uploaded_by);

CREATE POLICY "Contributors can upload media" ON media
  FOR INSERT WITH CHECK (
    EXISTS (
      SELECT 1 FROM profiles 
      WHERE profiles.id = auth.uid() 
      AND profiles.role IN ('admin', 'contributor')
    )
  );

CREATE POLICY "Users can manage own uploads" ON media
  FOR UPDATE USING (auth.uid() = uploaded_by);

CREATE POLICY "Admins can manage all media" ON media
  FOR ALL USING (
    EXISTS (
      SELECT 1 FROM profiles 
      WHERE profiles.id = auth.uid() 
      AND profiles.role = 'admin'
    )
  );

-- ============================================
-- 10. INDEXES FOR PERFORMANCE
-- ============================================

-- Content indexes
CREATE INDEX idx_articles_slug ON articles(slug);
CREATE INDEX idx_articles_status_published ON articles(status, published_at DESC) WHERE status = 'published';
CREATE INDEX idx_articles_author ON articles(author_id);
CREATE INDEX idx_articles_category ON articles(category_id);
CREATE INDEX idx_articles_featured ON articles(is_featured) WHERE is_featured = true;
CREATE INDEX idx_articles_scheduled ON articles(scheduled_at) WHERE scheduled_at IS NOT NULL;

CREATE INDEX idx_case_studies_slug ON case_studies(slug);
CREATE INDEX idx_case_studies_status ON case_studies(status);
CREATE INDEX idx_case_studies_featured ON case_studies(is_featured) WHERE is_featured = true;
CREATE INDEX idx_case_studies_industry ON case_studies(industry);
CREATE INDEX idx_case_studies_service ON case_studies(service_type);

CREATE INDEX idx_resources_slug ON resources(slug);
CREATE INDEX idx_resources_type ON resources(type);
CREATE INDEX idx_resources_access ON resources(access_type);
CREATE INDEX idx_resources_status ON resources(status);

CREATE INDEX idx_testimonials_status ON testimonials(status);
CREATE INDEX idx_testimonials_featured ON testimonials(is_featured) WHERE is_featured = true;

-- Analytics indexes
CREATE INDEX idx_page_analytics_page ON page_analytics(page_path);
CREATE INDEX idx_page_analytics_session ON page_analytics(session_id);
CREATE INDEX idx_page_analytics_user ON page_analytics(user_id);
CREATE INDEX idx_page_analytics_created ON page_analytics(created_at DESC);

CREATE INDEX idx_content_engagement_user ON content_engagement(user_id);
CREATE INDEX idx_content_engagement_content ON content_engagement(content_type, content_id);
CREATE INDEX idx_content_engagement_action ON content_engagement(action);
CREATE INDEX idx_content_engagement_created ON content_engagement(created_at DESC);

CREATE INDEX idx_user_sessions_session ON user_sessions(session_id);
CREATE INDEX idx_user_sessions_user ON user_sessions(user_id);
CREATE INDEX idx_user_sessions_created ON user_sessions(created_at DESC);

CREATE INDEX idx_tool_interactions_user ON tool_interactions(user_id);
CREATE INDEX idx_tool_interactions_tool ON tool_interactions(tool_name);
CREATE INDEX idx_tool_interactions_converted ON tool_interactions(converted_to_contact, converted_to_signup);

-- Lead management indexes
CREATE INDEX idx_contact_submissions_email ON contact_submissions(email);
CREATE INDEX idx_contact_submissions_status ON contact_submissions(lead_status);
CREATE INDEX idx_contact_submissions_assigned ON contact_submissions(assigned_to);
CREATE INDEX idx_contact_submissions_created ON contact_submissions(created_at DESC);

CREATE INDEX idx_newsletter_email ON newsletter_subscribers(email);
CREATE INDEX idx_newsletter_status ON newsletter_subscribers(status);

-- Media indexes
CREATE INDEX idx_media_type ON media(file_type);
CREATE INDEX idx_media_folder ON media(folder);
CREATE INDEX idx_media_uploaded_by ON media(uploaded_by);

-- Full-text search indexes
CREATE INDEX idx_articles_search ON articles 
  USING gin(to_tsvector('english', 
    title || ' ' || 
    COALESCE(excerpt, '') || ' ' || 
    COALESCE(content::text, '')
  ));

CREATE INDEX idx_case_studies_search ON case_studies 
  USING gin(to_tsvector('english', 
    title || ' ' || 
    client_name || ' ' || 
    COALESCE(description, '') || ' ' ||
    COALESCE(challenge, '') || ' ' ||
    COALESCE(solution, '')
  ));

CREATE INDEX idx_resources_search ON resources 
  USING gin(to_tsvector('english', 
    title || ' ' || 
    COALESCE(description, '') || ' ' ||
    COALESCE(long_description, '')
  ));

-- Array indexes for better performance
CREATE INDEX idx_articles_tags ON articles USING gin(tags);
CREATE INDEX idx_articles_coauthors ON articles USING gin(co_authors);
CREATE INDEX idx_case_studies_team ON case_studies USING gin(team_members);
CREATE INDEX idx_case_studies_tech ON case_studies USING gin(technologies_used);
CREATE INDEX idx_testimonials_locations ON testimonials USING gin(display_locations);
CREATE INDEX idx_profiles_departments ON profiles USING gin(department);
CREATE INDEX idx_profiles_expertise ON profiles USING gin(expertise);

-- ============================================
-- 11. INITIAL DATA SEEDING
-- ============================================

-- Insert default departments
INSERT INTO departments (name, slug, description, sort_order) VALUES
  ('Leadership', 'leadership', 'Executive team and strategic leaders', 1),
  ('Marketing', 'marketing', 'Marketing and growth team', 2),
  ('Development', 'development', 'Engineering and technical team', 3),
  ('Creative', 'creative', 'Design and creative team', 4);

-- Insert default expertise areas
INSERT INTO expertise_areas (name, slug, department_id) 
SELECT 
  expertise.name,
  generate_slug(expertise.name),
  d.id
FROM (VALUES
  ('Business Strategy', 'Leadership'),
  ('Digital Transformation', 'Leadership'),
  ('Innovation Leadership', 'Leadership'),
  ('Creative Strategy', 'Creative'),
  ('UX/UI Design', 'Creative'),
  ('Brand Design', 'Creative'),
  ('Marketing Strategy', 'Marketing'),
  ('Brand Development', 'Marketing'),
  ('Campaign Management', 'Marketing'),
  ('Cloud Architecture', 'Development'),
  ('DevOps Strategy', 'Development'),
  ('Technical Innovation', 'Development')
) AS expertise(name, dept_name)
JOIN departments d ON d.name = expertise.dept_name;

-- Insert default categories
INSERT INTO categories (name, slug, type, description, sort_order) VALUES
  ('Design', 'design', 'article', 'Articles about design and creativity', 1),
  ('Development', 'development', 'article', 'Technical and development articles', 2),
  ('Marketing', 'marketing', 'article', 'Marketing and growth articles', 3),
  ('Strategy', 'strategy', 'article', 'Business and strategy articles', 4),
  ('Technology', 'technology', 'case_study', 'Technology industry case studies', 1),
  ('Healthcare', 'healthcare', 'case_study', 'Healthcare industry case studies', 2),
  ('Financial Services', 'financial-services', 'case_study', 'Financial services case studies', 3),
  ('E-commerce', 'e-commerce', 'case_study', 'E-commerce case studies', 4),
  ('Templates', 'templates', 'resource', 'Downloadable templates', 1),
  ('Frameworks', 'frameworks', 'resource', 'Strategic frameworks', 2),
  ('Tools', 'tools', 'resource', 'Digital tools and calculators', 3),
  ('Reports', 'reports', 'resource', 'Industry reports and whitepapers', 4);

-- ============================================
-- 12. STORAGE BUCKETS CONFIGURATION
-- ============================================

-- Note: Run these in Supabase Dashboard SQL Editor after tables are created

-- Create storage buckets
INSERT INTO storage.buckets (id, name, public, file_size_limit, allowed_mime_types) 
VALUES 
  ('media', 'media', true, 52428800, ARRAY['image/jpeg', 'image/png', 'image/gif', 'image/webp', 'video/mp4', 'video/webm']),
  ('resources', 'resources', false, 104857600, ARRAY['application/pdf', 'application/zip', 'application/vnd.ms-excel', 'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet']),
  ('avatars', 'avatars', true, 5242880, ARRAY['image/jpeg', 'image/png', 'image/webp']);

-- Storage policies for media bucket
CREATE POLICY "Public can view media" ON storage.objects 
  FOR SELECT USING (bucket_id = 'media');

CREATE POLICY "Authenticated users can upload media" ON storage.objects 
  FOR INSERT WITH CHECK (
    bucket_id = 'media' AND
    auth.role() = 'authenticated'
  );

CREATE POLICY "Users can update own media" ON storage.objects 
  FOR UPDATE USING (
    bucket_id = 'media' AND
    auth.uid()::text = (storage.foldername(name))[1]
  );

CREATE POLICY "Admins can delete media" ON storage.objects 
  FOR DELETE USING (
    bucket_id = 'media' AND
    EXISTS (
      SELECT 1 FROM profiles 
      WHERE profiles.id = auth.uid() 
      AND profiles.role = 'admin'
    )
  );

-- Storage policies for resources bucket
CREATE POLICY "Authenticated can view resources" ON storage.objects 
  FOR SELECT USING (
    bucket_id = 'resources' AND
    auth.role() = 'authenticated'
  );

CREATE POLICY "Contributors can upload resources" ON storage.objects 
  FOR INSERT WITH CHECK (
    bucket_id = 'resources' AND
    EXISTS (
      SELECT 1 FROM profiles 
      WHERE profiles.id = auth.uid() 
      AND profiles.role IN ('admin', 'contributor')
    )
  );

-- Storage policies for avatars bucket
CREATE POLICY "Public can view avatars" ON storage.objects 
  FOR SELECT USING (bucket_id = 'avatars');

CREATE POLICY "Users can upload own avatar" ON storage.objects 
  FOR INSERT WITH CHECK (
    bucket_id = 'avatars' AND
    auth.uid()::text = (storage.foldername(name))[1]
  );

CREATE POLICY "Users can update own avatar" ON storage.objects 
  FOR UPDATE USING (
    bucket_id = 'avatars' AND
    auth.uid()::text = (storage.foldername(name))[1]
  );

CREATE POLICY "Users can delete own avatar" ON storage.objects 
  FOR DELETE USING (
    bucket_id = 'avatars' AND
    auth.uid()::text = (storage.foldername(name))[1]
  );

Initial Setup Guide
Step 1: Database Setup

Create a new Supabase project at app.supabase.com
Run the complete schema in SQL Editor (in order):

Copy the entire schema from Section 4 above
Execute in Supabase SQL Editor
Verify all tables are created


Configure Authentication:

sql-- Enable email authentication
-- Go to Authentication > Providers > Email

-- Set up custom claims for roles
CREATE OR REPLACE FUNCTION public.handle_new_user()
RETURNS trigger AS $$
BEGIN
  INSERT INTO public.profiles (id, email, full_name, role)
  VALUES (
    new.id,
    new.email,
    COALESCE(new.raw_user_meta_data->>'full_name', split_part(new.email, '@', 1)),
    COALESCE(new.raw_user_meta_data->>'role', 'standard')
  );
  RETURN new;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

CREATE TRIGGER on_auth_user_created
  AFTER INSERT ON auth.users
  FOR EACH ROW EXECUTE FUNCTION public.handle_new_user();
Step 2: Create Admin User
sql-- After creating your first user through Supabase Auth
-- Promote them to admin
UPDATE profiles 
SET role = 'admin' 
WHERE email = 'your-email@example.com';
Step 3: Environment Variables
Create .env.local in your React project:
envVITE_SUPABASE_URL=your-project-url
VITE_SUPABASE_ANON_KEY=your-anon-key
VITE_SUPABASE_SERVICE_KEY=your-service-key # Only for server-side operations
Step 4: Install Supabase Client
bashnpm install @supabase/supabase-js
Step 5: Initialize Supabase Client
javascript// src/lib/supabase.js
import { createClient } from '@supabase/supabase-js'

const supabaseUrl = import.meta.env.VITE_SUPABASE_URL
const supabaseAnonKey = import.meta.env.VITE_SUPABASE_ANON_KEY

export const supabase = createClient(supabaseUrl, supabaseAnonKey)

API Architecture
RESTful Endpoints Structure
javascript// Content APIs
GET    /api/articles          // List published articles
GET    /api/articles/:slug    // Get single article
POST   /api/articles          // Create article (auth required)
PUT    /api/articles/:id      // Update article (auth required)
DELETE /api/articles/:id      // Delete article (admin only)

GET    /api/case-studies      // List published case studies
GET    /api/case-studies/:slug // Get single case study

GET    /api/resources         // List available resources
GET    /api/resources/:slug   // Get resource details
POST   /api/resources/:id/download // Track download

// Analytics APIs
POST   /api/analytics/page-view    // Track page view
POST   /api/analytics/engagement   // Track engagement
GET    /api/analytics/dashboard    // Admin dashboard data

// Contact APIs
POST   /api/contact             // Submit contact form
GET    /api/contact/submissions  // List submissions (admin)
PUT    /api/contact/:id         // Update lead status (admin)

// Tool APIs
POST   /api/tools/:tool-name/calculate  // Run tool calculation
POST   /api/tools/:tool-name/save       // Save results
GET    /api/tools/:tool-name/presets    // Get presets
Real-time Subscriptions
javascript// Subscribe to content updates
supabase
  .channel('articles')
  .on('postgres_changes', 
    { event: 'INSERT', schema: 'public', table: 'articles' },
    handleNewArticle
  )
  .subscribe()

// Subscribe to analytics
supabase
  .channel('analytics')
  .on('postgres_changes',
    { event: '*', schema: 'public', table: 'page_analytics' },
    handleAnalyticsUpdate
  )
  .subscribe()

Security Model
Authentication Flow
mermaidsequenceDiagram
    participant User
    participant Frontend
    participant Supabase Auth
    participant Database
    
    User->>Frontend: Login Request
    Frontend->>Supabase Auth: Authenticate
    Supabase Auth->>Database: Create Session
    Database->>Supabase Auth: Session Token
    Supabase Auth->>Frontend: JWT Token
    Frontend->>User: Logged In
    
    User->>Frontend: Request Content
    Frontend->>Database: API Call with JWT
    Database->>Database: Check RLS Policies
    Database->>Frontend: Filtered Data
    Frontend->>User: Display Content
Role-Based Permissions Matrix
ActionStandardContributorAdminView published content✅✅✅View drafts❌Own only✅Create content❌✅✅Edit content❌Own drafts✅Publish directly❌❌✅Delete content❌❌✅View analytics❌Limited✅Manage users❌❌✅Access tools✅✅✅Download resourcesFree only✅✅

Performance Considerations
Caching Strategy

Edge Caching: Use Supabase CDN for static assets
Query Caching: Implement React Query for API response caching
Image Optimization: Use Supabase Transform API for on-the-fly resizing
Database Indexes: Strategic indexes on frequently queried columns

Query Optimization Examples
sql-- Optimized article listing with author info
CREATE OR REPLACE VIEW public.articles_with_author AS
SELECT 
  a.*,
  p.full_name as author_name,
  p.avatar_url as author_avatar,
  p.job_title as author_title,
  c.name as category_name,
  c.slug as category_slug
FROM articles a
JOIN profiles p ON a.author_id = p.id
LEFT JOIN categories c ON a.category_id = c.id
WHERE a.status = 'published';

-- Materialized view for analytics dashboard
CREATE MATERIALIZED VIEW public.analytics_summary AS
SELECT 
  DATE(created_at) as date,
  COUNT(DISTINCT session_id) as unique_sessions,
  COUNT(*) as page_views,
  AVG(time_on_page) as avg_time_on_page,
  COUNT(DISTINCT user_id) as logged_in_users
FROM page_analytics
GROUP BY DATE(created_at);

-- Refresh daily
CREATE OR REPLACE FUNCTION refresh_analytics_summary()
RETURNS void AS $$
BEGIN
  REFRESH MATERIALIZED VIEW CONCURRENTLY analytics_summary;
END;
$$ LANGUAGE plpgsql;

Migration Strategy
Phase 1: Initial Setup (Week 1)

Set up Supabase project
Run database schema
Create admin user
Configure authentication

Phase 2: Content Migration (Week 2)

Export hardcoded content to JSON
Create migration scripts
Import into Supabase
Verify data integrity

Phase 3: Frontend Integration (Weeks 3-4)

Install Supabase client
Replace hardcoded data with API calls
Implement authentication UI
Add content management interface

Phase 4: Testing & Optimization (Week 5)

Performance testing
Security audit
SEO verification
User acceptance testing

Phase 5: Launch (Week 6)

Deploy to production
Monitor analytics
Gather feedback
Iterate and improve


Future Scalability
Planned Enhancements

AI Integration

Content generation assistance
Automated tagging and categorization
Predictive lead scoring
Chatbot for initial client interaction


Advanced Analytics

Heat mapping
Conversion funnel analysis
Cohort analysis
Revenue attribution


Multi-tenancy for SaaS

Organization/workspace structure
Team collaboration features
White-label capabilities
Usage-based billing


Enhanced Workflow

Visual workflow builder
Automated approval chains
Content calendar
Social media integration


Performance Improvements

Redis caching layer
GraphQL API option
Webhook system
Background job processing



Database Schema Extensions (Future)
sql-- Organizations for multi-tenancy
CREATE TABLE public.organizations (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  name TEXT NOT NULL,
  slug TEXT UNIQUE NOT NULL,
  plan TEXT DEFAULT 'free',
  -- ... additional fields
);

-- AI content generation logs
CREATE TABLE public.ai_generations (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  prompt TEXT NOT NULL,
  response JSONB,
  model TEXT,
  tokens_used INTEGER,
  -- ... additional fields
);

-- Workflow automation
CREATE TABLE public.workflows (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  name TEXT NOT NULL,
  trigger_type TEXT,
  conditions JSONB,
  actions JSONB,
  -- ... additional fields
);

Monitoring & Maintenance
Key Metrics to Track

Performance Metrics

Page load times
API response times
Database query performance
Storage usage


Business Metrics

Content engagement rates
Lead conversion rates
Tool usage statistics
Resource download patterns


System Health

Error rates
Authentication failures
Storage quotas
API rate limits



Backup Strategy
sql-- Automated daily backups are handled by Supabase
-- Additional backup for critical data

CREATE OR REPLACE FUNCTION backup_critical_data()
RETURNS TABLE(
  backup_date TIMESTAMPTZ,
  articles_count BIGINT,
  case_studies_count BIGINT,
  contacts_count BIGINT
) AS $$
BEGIN
  RETURN QUERY
  SELECT 
    NOW() as backup_date,
    (SELECT COUNT(*) FROM articles WHERE status = 'published'),
    (SELECT COUNT(*) FROM case_studies WHERE status = 'published'),
    (SELECT COUNT(*) FROM contact_submissions);
END;
$$ LANGUAGE plpgsql;

Support & Documentation
Useful Supabase Commands
sql-- Check table sizes
SELECT 
  schemaname,
  tablename,
  pg_size_pretty(pg_total_relation_size(schemaname||'.'||tablename)) AS size
FROM pg_tables
WHERE schemaname = 'public'
ORDER BY pg_total_relation_size(schemaname||'.'||tablename) DESC;

-- Monitor active connections
SELECT count(*) FROM pg_stat_activity;

-- View slow queries
SELECT 
  query,
  calls,
  mean_exec_time,
  total_exec_time
FROM pg_stat_statements
ORDER BY mean_exec_time DESC
LIMIT 10;
Troubleshooting Guide
IssueSolutionRLS blocking accessCheck user role and policy conditionsSlow queriesAdd appropriate indexesStorage errorsCheck bucket policies and MIME typesAuth issuesVerify JWT token and user session

Conclusion
This comprehensive backend architecture provides Rule27 Design with:

Scalable Foundation: Ready for growth from marketing site to SaaS platform
Flexible Content Management: Supports all current content types with room for expansion
Robust Security: Role-based access control with row-level security
Performance Optimized: Strategic indexing and caching capabilities
Analytics Ready: Comprehensive tracking for data-driven decisions
Future-Proof: Extensible schema supporting AI integration and multi-tenancy

The architecture balances current needs with future scalability, ensuring Rule27 Design can evolve from a consulting practice to a full software company without major infrastructure changes.RetryClaude can make mistakes. Please double-check responses.Research Opus 4.1