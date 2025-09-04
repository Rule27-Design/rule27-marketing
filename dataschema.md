# Rule27 Design Complete Database Schema Documentation

## 📋 Table of Contents
- [Overview](#overview)
- [Architecture](#architecture)
- [Database Tables](#database-tables)
- [Views](#views)
- [Storage Buckets](#storage-buckets)
- [Row Level Security (RLS)](#row-level-security-rls)
- [Functions & Triggers](#functions--triggers)
- [Custom Types & Enums](#custom-types--enums)
- [Indexes](#indexes)
- [Edge Functions](#edge-functions)
- [Usage Examples](#usage-examples)
- [Environment Variables](#environment-variables)
- [Best Practices](#best-practices)
- [Database Maintenance](#database-maintenance)
- [Migration Strategy](#migration-strategy)
- [Support & Resources](#support--resources)

---

## Overview

Rule27 Design is transitioning from a **consulting practice to a full software company** leveraging AI agents for clients, with design/development services as add-ons. Built on PostgreSQL via Supabase, the platform provides:

- **Service Management**: Capability universe with 4 service zones and tiered pricing
- **Content Management**: Articles, case studies, and resources with approval workflows  
- **User Journey Tracking**: Complete path analysis across services and content
- **Capability Assessments**: Interactive assessment system with recommendations
- **Partnership Management**: Technology partnerships with certifications
- **Notification System**: Automated email notifications for key events
- **Media Management**: Integrated storage with CDN for images and videos
- **Analytics & Tracking**: Comprehensive engagement and conversion metrics
- **Lead Management**: Contact forms with scoring and follow-up tracking
- **Real-time Updates**: WebSocket subscriptions for live content updates

## Architecture

```
┌─────────────────┐       ┌─────────────────┐       ┌─────────────────┐
│   React App     │──────▶│    Supabase     │──────▶│     Resend      │
│   (Netlify)     │       │   (Backend)     │       │    (Email)      │
└─────────────────┘       └─────────────────┘       └─────────────────┘
        │                         │                         │
        │                         ├── Auth (JWT)            │
        │                         ├── Database (PostgreSQL)│
        │                         ├── Storage (CDN)        │
        │                         ├── Real-time (WebSocket)│
        │                         └── Edge Functions       │
        └───────────────────────────────────────────────────┘
```

### Core Business Flow
```
Services ──┬──▶ Capability Universe ──▶ Assessments
           │                                │
           └──── Content ◀──────────────────┘
                    │
                Journeys ──▶ Analytics & Notifications
```

### Service Zone Architecture
```
Creative Studio ────┬──▶ Services ──▶ Pricing Tiers (Basic/Pro/Enterprise)
Marketing Command ──┤         │              │
Development Lab ────┤    Case Studies    Analytics
Executive Advisory ─┘         │              │
                        Partnerships ◀───────┘
```

---

## Database Tables

### 1. **profiles** (UPDATED)
Primary user/team member table with optional authentication.

```sql
CREATE TABLE public.profiles (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  auth_user_id UUID UNIQUE REFERENCES auth.users(id) ON DELETE CASCADE, -- NEW: Optional auth connection
  email TEXT UNIQUE NOT NULL,
  full_name TEXT NOT NULL,
  display_name TEXT,
  avatar_url TEXT,
  bio TEXT,
  role TEXT NOT NULL CHECK (role IN ('admin', 'contributor', 'standard')) DEFAULT 'standard',
  is_public BOOLEAN DEFAULT false,
  is_active BOOLEAN DEFAULT true,
  department TEXT[] DEFAULT '{}',
  expertise TEXT[] DEFAULT '{}',
  job_title TEXT,
  linkedin_url TEXT,
  twitter_url TEXT,
  github_url TEXT,
  sort_order INTEGER DEFAULT 0,
  created_at TIMESTAMPTZ DEFAULT NOW(),
  updated_at TIMESTAMPTZ DEFAULT NOW()
);
```

**Key Changes:**
- `id` is now auto-generated UUID (not tied to auth.users)
- `auth_user_id` is NEW - optional link to auth.users for login capability
- Profiles can exist without authentication (display-only team members)
- Admins can create profiles for team members who don't need login

**Profile Types:**
- **With auth_user_id**: Can log in, manage content based on role
- **Without auth_user_id**: Display only, shown on public team page

### 2. **service_zones**
Four capability zones for service organization.

```sql
CREATE TABLE public.service_zones (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  slug TEXT UNIQUE NOT NULL,
  title TEXT NOT NULL,
  icon TEXT,
  description TEXT,
  service_count INTEGER DEFAULT 0,
  key_services TEXT[] DEFAULT '{}',
  stats JSONB DEFAULT '{"projects": 0, "satisfaction": 0}',
  sort_order INTEGER DEFAULT 0,
  is_active BOOLEAN DEFAULT true,
  created_at TIMESTAMPTZ DEFAULT NOW(),
  updated_at TIMESTAMPTZ DEFAULT NOW()
);
```

**Purpose:** Groups services into Creative Studio, Marketing Command, Development Lab, and Executive Advisory zones.

### 3. **services**
Comprehensive service offerings with tiered pricing.

```sql
CREATE TABLE public.services (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  slug TEXT UNIQUE NOT NULL,
  title TEXT NOT NULL,
  category TEXT NOT NULL,
  zone_id UUID REFERENCES service_zones(id),
  icon TEXT,
  description TEXT,
  full_description TEXT,
  features TEXT[] DEFAULT '{}',
  technologies TEXT[] DEFAULT '{}',
  
  -- Process and results
  process_steps JSONB DEFAULT '[]',
  expected_results JSONB DEFAULT '[]',
  
  -- Three-tier pricing
  pricing_tiers JSONB DEFAULT '[]',
  -- Format: [{"name": "Basic", "price": "$2,500", "billing": "Per month", "features": [...]}]
  
  -- Analytics
  view_count INTEGER DEFAULT 0,
  unique_view_count INTEGER DEFAULT 0,
  inquiry_count INTEGER DEFAULT 0,
  
  -- Status
  is_active BOOLEAN DEFAULT true,
  is_featured BOOLEAN DEFAULT false,
  
  -- SEO
  meta_title TEXT,
  meta_description TEXT,
  
  created_at TIMESTAMPTZ DEFAULT NOW(),
  updated_at TIMESTAMPTZ DEFAULT NOW(),
  created_by UUID REFERENCES profiles(id),
  updated_by UUID REFERENCES profiles(id)
);
```

### 4. **articles**
Blog content with approval workflow.

```sql
CREATE TABLE public.categories (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  name TEXT NOT NULL,
  slug TEXT UNIQUE NOT NULL,
  description TEXT,
  parent_id UUID REFERENCES categories(id),
  type TEXT NOT NULL,
  icon TEXT,
  color TEXT,
  sort_order INTEGER DEFAULT 0,
  is_active BOOLEAN DEFAULT true,
  meta_title TEXT,
  meta_description TEXT,
  created_at TIMESTAMPTZ DEFAULT NOW(),
  updated_at TIMESTAMPTZ DEFAULT NOW()
);

CREATE TABLE public.testimonials (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  client_name TEXT NOT NULL,
  client_title TEXT,
  client_company TEXT,
  client_avatar TEXT,
  client_logo TEXT,
  quote TEXT NOT NULL,
  long_quote TEXT,
  rating INTEGER CHECK (rating >= 1 AND rating <= 5),
  video_url TEXT,
  video_thumbnail TEXT,
  is_featured BOOLEAN DEFAULT false,
  display_locations TEXT[] DEFAULT '{}',
  industry TEXT,
  service_type TEXT,
  project_value TEXT,
  sort_order INTEGER DEFAULT 0,
  status TEXT CHECK (status IN ('draft', 'published', 'archived')) DEFAULT 'published',
  created_at TIMESTAMPTZ DEFAULT NOW(),
  updated_at TIMESTAMPTZ DEFAULT NOW()
);

CREATE TABLE public.articles (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  title TEXT NOT NULL,
  slug TEXT UNIQUE NOT NULL,
  excerpt TEXT,
  content JSONB NOT NULL, -- Rich text editor content
  featured_image TEXT,
  featured_image_alt TEXT,
  featured_video TEXT,
  author_id UUID REFERENCES profiles(id) NOT NULL,
  co_authors UUID[] DEFAULT '{}',
  category_id UUID REFERENCES categories(id),
  tags TEXT[] DEFAULT '{}',
  
  -- Approval workflow
  status TEXT CHECK (status IN ('draft', 'pending_approval', 'approved', 'published', 'archived')) DEFAULT 'draft',
  submitted_for_approval_at TIMESTAMPTZ,
  approved_by UUID REFERENCES profiles(id),
  approved_at TIMESTAMPTZ,
  published_at TIMESTAMPTZ,
  scheduled_at TIMESTAMPTZ,
  
  -- Engagement metrics
  read_time INTEGER,
  is_featured BOOLEAN DEFAULT false,
  enable_comments BOOLEAN DEFAULT false,
  enable_reactions BOOLEAN DEFAULT true,
  
  -- Analytics
  view_count INTEGER DEFAULT 0,
  unique_view_count INTEGER DEFAULT 0,
  like_count INTEGER DEFAULT 0,
  share_count INTEGER DEFAULT 0,
  bookmark_count INTEGER DEFAULT 0,
  average_read_depth DECIMAL(5,2),
  average_time_on_page INTEGER,
  
  -- SEO
  meta_title TEXT,
  meta_description TEXT,
  meta_keywords TEXT[],
  og_title TEXT,
  og_description TEXT,
  og_image TEXT,
  twitter_card TEXT DEFAULT 'summary_large_image',
  canonical_url TEXT,
  schema_markup JSONB,
  
  internal_notes TEXT,
  created_at TIMESTAMPTZ DEFAULT NOW(),
  updated_at TIMESTAMPTZ DEFAULT NOW(),
  created_by UUID REFERENCES profiles(id),
  updated_by UUID REFERENCES profiles(id)
);
```

### 5. **case_studies**
Client success stories with flexible metrics.

```sql
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
  gallery JSONB DEFAULT '[]',
  description TEXT,
  challenge TEXT,
  solution TEXT,
  implementation TEXT,
  
  -- Timeline
  project_duration TEXT,
  start_date DATE,
  end_date DATE,
  
  -- Flexible metrics
  key_metrics JSONB DEFAULT '[]',
  detailed_results JSONB DEFAULT '[]',
  process_steps JSONB DEFAULT '[]',
  technologies_used TEXT[] DEFAULT '{}',
  deliverables TEXT[] DEFAULT '{}',
  
  -- Team
  team_members UUID[] DEFAULT '{}',
  project_lead UUID REFERENCES profiles(id),
  testimonial_id UUID REFERENCES testimonials(id),
  
  -- Status
  status TEXT CHECK (status IN ('draft', 'pending_approval', 'approved', 'published', 'archived')) DEFAULT 'draft',
  approved_by UUID REFERENCES profiles(id),
  approved_at TIMESTAMPTZ,
  is_featured BOOLEAN DEFAULT false,
  is_confidential BOOLEAN DEFAULT false,
  is_active BOOLEAN DEFAULT true,
  sort_order INTEGER DEFAULT 0,
  
  -- Analytics
  view_count INTEGER DEFAULT 0,
  unique_view_count INTEGER DEFAULT 0,
  conversion_count INTEGER DEFAULT 0,
  average_time_on_page INTEGER,
  
  -- SEO
  meta_title TEXT,
  meta_description TEXT,
  meta_keywords TEXT[],
  og_title TEXT,
  og_description TEXT,
  og_image TEXT,
  schema_markup JSONB,
  
  internal_notes TEXT,
  created_at TIMESTAMPTZ DEFAULT NOW(),
  updated_at TIMESTAMPTZ DEFAULT NOW(),
  created_by UUID REFERENCES profiles(id),
  updated_by UUID REFERENCES profiles(id)
);
```

### 6. **partnerships**
Technology and service partnerships.

```sql
CREATE TABLE public.partnerships (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  slug TEXT UNIQUE NOT NULL,
  name TEXT NOT NULL,
  category TEXT,
  icon TEXT,
  color TEXT,
  description TEXT,
  services TEXT[] DEFAULT '{}',
  certification_count INTEGER DEFAULT 0,
  project_count INTEGER DEFAULT 0,
  benefits TEXT[] DEFAULT '{}',
  features JSONB DEFAULT '[]',
  is_active BOOLEAN DEFAULT true,
  is_featured BOOLEAN DEFAULT false,
  sort_order INTEGER DEFAULT 0,
  created_at TIMESTAMPTZ DEFAULT NOW(),
  updated_at TIMESTAMPTZ DEFAULT NOW()
);
```

### 7. **capability_assessments**
Interactive assessment results and recommendations.

```sql
CREATE TABLE public.capability_assessments (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id UUID REFERENCES profiles(id),
  session_id TEXT,
  answers JSONB NOT NULL,
  recommendations JSONB,
  score INTEGER,
  readiness_level TEXT,
  priority_level TEXT,
  approach_type TEXT,
  completed BOOLEAN DEFAULT false,
  completion_time INTEGER,
  abandoned_at_step INTEGER,
  
  -- Follow-up tracking
  contacted BOOLEAN DEFAULT false,
  contact_date TIMESTAMPTZ,
  converted BOOLEAN DEFAULT false,
  conversion_value DECIMAL(10,2),
  
  created_at TIMESTAMPTZ DEFAULT NOW(),
  completed_at TIMESTAMPTZ
);
```

### 8. **user_journeys**
Complete user path tracking across platform.

```sql
CREATE TABLE public.user_journeys (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  session_id TEXT NOT NULL,
  user_id UUID REFERENCES profiles(id),
  journey_path JSONB DEFAULT '[]', -- Array of {type, id, timestamp}
  total_duration INTEGER,
  conversion_event TEXT,
  conversion_value DECIMAL(10,2),
  utm_source TEXT,
  utm_medium TEXT,
  utm_campaign TEXT,
  created_at TIMESTAMPTZ DEFAULT NOW(),
  updated_at TIMESTAMPTZ DEFAULT NOW()
);
```

### 9. **email_notifications**
Email notification queue and tracking.

```sql
CREATE TABLE public.email_notifications (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  recipient_email TEXT NOT NULL,
  recipient_id UUID REFERENCES profiles(id),
  subject TEXT NOT NULL,
  template TEXT NOT NULL, -- new_lead, assessment_complete, content_approved
  data JSONB,
  status TEXT CHECK (status IN ('pending', 'sent', 'failed', 'cancelled')) DEFAULT 'pending',
  sent_at TIMESTAMPTZ,
  error_message TEXT,
  opened BOOLEAN DEFAULT false,
  opened_at TIMESTAMPTZ,
  clicked BOOLEAN DEFAULT false,
  clicked_at TIMESTAMPTZ,
  created_at TIMESTAMPTZ DEFAULT NOW()
);
```

### 10. **contact_submissions**
Lead management with scoring.

```sql
CREATE TABLE public.contact_submissions (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  name TEXT NOT NULL,
  email TEXT NOT NULL,
  company TEXT,
  company_size TEXT,
  phone TEXT,
  website TEXT,
  project_type TEXT,
  services_needed TEXT[] DEFAULT '{}',
  budget_range TEXT,
  timeline TEXT,
  message TEXT,
  
  -- Attribution
  source_page TEXT,
  source_campaign TEXT,
  referrer TEXT,
  utm_source TEXT,
  utm_medium TEXT,
  utm_campaign TEXT,
  utm_term TEXT,
  utm_content TEXT,
  
  -- Scoring
  lead_score INTEGER,
  lead_temperature TEXT CHECK (lead_temperature IN ('cold', 'warm', 'hot')),
  lead_status TEXT DEFAULT 'new',
  
  -- Assignment
  assigned_to UUID REFERENCES profiles(id),
  first_contact_date TIMESTAMPTZ,
  last_contact_date TIMESTAMPTZ,
  next_follow_up TIMESTAMPTZ,
  
  -- Tracking
  email_sent BOOLEAN DEFAULT false,
  email_sent_at TIMESTAMPTZ,
  email_opened BOOLEAN DEFAULT false,
  email_opened_at TIMESTAMPTZ,
  
  notes TEXT,
  rejection_reason TEXT,
  won_value DECIMAL(10,2),
  
  created_at TIMESTAMPTZ DEFAULT NOW(),
  updated_at TIMESTAMPTZ DEFAULT NOW()
);
```

### Additional Core Tables

```sql
-- Tags table
CREATE TABLE public.tags (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  name TEXT NOT NULL,
  slug TEXT UNIQUE NOT NULL,
  type TEXT,
  description TEXT,
  usage_count INTEGER DEFAULT 0,
  is_active BOOLEAN DEFAULT true,
  created_at TIMESTAMPTZ DEFAULT NOW()
);

-- Resources table
CREATE TABLE public.resources (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  title TEXT NOT NULL,
  slug TEXT UNIQUE NOT NULL,
  description TEXT,
  long_description TEXT,
  type TEXT NOT NULL,
  category TEXT NOT NULL,
  format TEXT,
  file_url TEXT,
  file_size TEXT,
  preview_image TEXT,
  preview_url TEXT,
  access_type TEXT CHECK (access_type IN ('free', 'premium', 'gated')) DEFAULT 'free',
  price DECIMAL(10, 2),
  currency TEXT DEFAULT 'USD',
  tags TEXT[] DEFAULT '{}',
  prerequisites TEXT[] DEFAULT '{}',
  learning_outcomes TEXT[] DEFAULT '{}',
  is_featured BOOLEAN DEFAULT false,
  status TEXT CHECK (status IN ('draft', 'published', 'archived')) DEFAULT 'draft',
  download_count INTEGER DEFAULT 0,
  unique_download_count INTEGER DEFAULT 0,
  view_count INTEGER DEFAULT 0,
  rating DECIMAL(3, 2),
  rating_count INTEGER DEFAULT 0,
  meta_title TEXT,
  meta_description TEXT,
  og_image TEXT,
  created_at TIMESTAMPTZ DEFAULT NOW(),
  updated_at TIMESTAMPTZ DEFAULT NOW(),
  created_by UUID REFERENCES profiles(id),
  updated_by UUID REFERENCES profiles(id)
);

-- Media table
CREATE TABLE public.media (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  file_name TEXT NOT NULL,
  original_name TEXT,
  file_url TEXT NOT NULL,
  file_path TEXT NOT NULL,
  file_type TEXT NOT NULL,
  mime_type TEXT,
  file_size BIGINT,
  width INTEGER,
  height INTEGER,
  duration INTEGER,
  thumbnail_url TEXT,
  thumbnails JSONB,
  alt_text TEXT,
  caption TEXT,
  description TEXT,
  tags TEXT[] DEFAULT '{}',
  folder TEXT DEFAULT '/',
  is_public BOOLEAN DEFAULT true,
  usage_count INTEGER DEFAULT 0,
  last_used_at TIMESTAMPTZ,
  uploaded_by UUID REFERENCES profiles(id),
  created_at TIMESTAMPTZ DEFAULT NOW(),
  updated_at TIMESTAMPTZ DEFAULT NOW()
);

-- Service analytics
CREATE TABLE public.service_analytics (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  service_id UUID REFERENCES services(id),
  user_id UUID REFERENCES profiles(id),
  session_id TEXT NOT NULL,
  view_duration INTEGER,
  scroll_depth DECIMAL(5,2),
  clicked_cta BOOLEAN DEFAULT false,
  referrer_service_id UUID REFERENCES services(id),
  next_service_id UUID REFERENCES services(id),
  device_type TEXT,
  browser TEXT,
  country TEXT,
  created_at TIMESTAMPTZ DEFAULT NOW()
);

-- Article analytics
CREATE TABLE public.article_analytics (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  article_id UUID REFERENCES articles(id) ON DELETE CASCADE,
  user_id UUID REFERENCES profiles(id),
  session_id TEXT NOT NULL,
  time_on_page INTEGER,
  scroll_depth DECIMAL(5,2),
  clicked_links INTEGER DEFAULT 0,
  liked BOOLEAN DEFAULT false,
  bookmarked BOOLEAN DEFAULT false,
  shared BOOLEAN DEFAULT false,
  share_platform TEXT,
  created_at TIMESTAMPTZ DEFAULT NOW()
);

-- Page analytics
CREATE TABLE public.page_analytics (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  page_path TEXT NOT NULL,
  page_title TEXT,
  page_type TEXT,
  user_id UUID REFERENCES profiles(id),
  session_id TEXT NOT NULL,
  utm_source TEXT,
  utm_medium TEXT,
  utm_campaign TEXT,
  utm_term TEXT,
  utm_content TEXT,
  referrer_url TEXT,
  referrer_domain TEXT,
  ip_address INET,
  user_agent TEXT,
  browser TEXT,
  browser_version TEXT,
  os TEXT,
  device_type TEXT,
  screen_resolution TEXT,
  viewport_size TEXT,
  country TEXT,
  region TEXT,
  city TEXT,
  time_on_page INTEGER,
  scroll_depth DECIMAL(5,2),
  clicks INTEGER DEFAULT 0,
  interactions JSONB DEFAULT '[]',
  bounce BOOLEAN DEFAULT false,
  exit_page BOOLEAN DEFAULT false,
  created_at TIMESTAMPTZ DEFAULT NOW()
);

-- Content engagement
CREATE TABLE public.content_engagement (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id UUID REFERENCES profiles(id),
  content_type TEXT NOT NULL,
  content_id UUID NOT NULL,
  action TEXT NOT NULL,
  action_metadata JSONB,
  session_id TEXT,
  source TEXT,
  created_at TIMESTAMPTZ DEFAULT NOW(),
  UNIQUE(user_id, content_type, content_id, action)
);

-- Tool interactions
CREATE TABLE public.tool_interactions (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id UUID REFERENCES profiles(id),
  session_id TEXT NOT NULL,
  tool_name TEXT NOT NULL,
  input_data JSONB NOT NULL,
  results JSONB NOT NULL,
  shared_url TEXT UNIQUE,
  is_shared BOOLEAN DEFAULT false,
  converted_to_contact BOOLEAN DEFAULT false,
  converted_to_signup BOOLEAN DEFAULT false,
  time_spent INTEGER,
  completion_rate DECIMAL(5,2),
  created_at TIMESTAMPTZ DEFAULT NOW()
);

-- Departments
CREATE TABLE public.departments (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  name TEXT UNIQUE NOT NULL,
  slug TEXT UNIQUE NOT NULL,
  description TEXT,
  icon TEXT,
  color TEXT,
  sort_order INTEGER DEFAULT 0,
  is_active BOOLEAN DEFAULT true,
  created_at TIMESTAMPTZ DEFAULT NOW()
);

-- Newsletter subscribers
CREATE TABLE public.newsletter_subscribers (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  email TEXT UNIQUE NOT NULL,
  name TEXT,
  company TEXT,
  status TEXT CHECK (status IN ('pending', 'confirmed', 'unsubscribed', 'bounced', 'complained')) DEFAULT 'pending',
  confirmation_token TEXT UNIQUE,
  confirmed_at TIMESTAMPTZ,
  unsubscribed_at TIMESTAMPTZ,
  frequency TEXT DEFAULT 'weekly',
  topics TEXT[] DEFAULT '{}',
  source TEXT,
  source_page TEXT,
  utm_source TEXT,
  utm_medium TEXT,
  utm_campaign TEXT,
  emails_sent INTEGER DEFAULT 0,
  emails_opened INTEGER DEFAULT 0,
  emails_clicked INTEGER DEFAULT 0,
  last_email_sent TIMESTAMPTZ,
  last_email_opened TIMESTAMPTZ,
  tags TEXT[] DEFAULT '{}',
  lead_score INTEGER,
  customer_status TEXT,
  created_at TIMESTAMPTZ DEFAULT NOW(),
  updated_at TIMESTAMPTZ DEFAULT NOW()
);

-- Notification preferences
CREATE TABLE public.notification_preferences (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id UUID REFERENCES profiles(id) UNIQUE,
  new_leads BOOLEAN DEFAULT true,
  assessment_completions BOOLEAN DEFAULT true,
  content_approvals BOOLEAN DEFAULT false,
  weekly_analytics BOOLEAN DEFAULT true,
  created_at TIMESTAMPTZ DEFAULT NOW(),
  updated_at TIMESTAMPTZ DEFAULT NOW()
);
```
---

## Views

### user_profiles View (NEW)
Shows only profiles that have authentication (can log in).

```sql
CREATE OR REPLACE VIEW public.user_profiles AS
SELECT 
  p.*,
  au.email as auth_email,
  au.last_sign_in_at,
  au.created_at as user_created_at
FROM profiles p
LEFT JOIN auth.users au ON p.auth_user_id = au.id
WHERE p.auth_user_id IS NOT NULL;
```

**Purpose:** Easy querying of profiles with login capability for admin interfaces.

### team_members_display View (NEW)
Public team members for website display.

```sql
CREATE OR REPLACE VIEW public.team_members_display AS
SELECT 
  id,
  full_name,
  display_name,
  avatar_url,
  bio,
  job_title,
  department,
  expertise,
  linkedin_url,
  twitter_url,
  github_url,
  sort_order
FROM profiles
WHERE is_public = true 
  AND is_active = true
ORDER BY sort_order, full_name;
```

**Purpose:** Optimized view for public team page, excludes sensitive data.

### Analytics Summary View
Materialized view for dashboard performance.

```sql
CREATE MATERIALIZED VIEW public.analytics_summary AS
SELECT 
  DATE(created_at) as date,
  COUNT(DISTINCT session_id) as unique_sessions,
  COUNT(*) as page_views,
  AVG(time_on_page) as avg_time_on_page,
  COUNT(DISTINCT user_id) as logged_in_users
FROM page_analytics
GROUP BY DATE(created_at);

-- Refresh function
CREATE OR REPLACE FUNCTION refresh_analytics_summary()
RETURNS void AS $$
BEGIN
  REFRESH MATERIALIZED VIEW CONCURRENTLY analytics_summary;
END;
$$ LANGUAGE plpgsql;
```

### Articles with Author View
Optimized view for article listings.

```sql
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
```

---

## Storage Buckets

### media Bucket
General media storage for content.

```sql
INSERT INTO storage.buckets (id, name, public, file_size_limit, allowed_mime_types) 
VALUES ('media', 'media', true, 52428800, 
  ARRAY['image/jpeg', 'image/png', 'image/gif', 'image/webp', 'video/mp4', 'video/webm']);
```

### resources Bucket  
Private storage for premium resources.

```sql
INSERT INTO storage.buckets (id, name, public, file_size_limit, allowed_mime_types) 
VALUES ('resources', 'resources', false, 104857600, 
  ARRAY['application/pdf', 'application/zip', 'application/vnd.ms-excel']);
```

### avatars Bucket
Profile images and team photos.

```sql
INSERT INTO storage.buckets (id, name, public, file_size_limit, allowed_mime_types) 
VALUES ('avatars', 'avatars', true, 5242880, 
  ARRAY['image/jpeg', 'image/png', 'image/webp']);
```

**Storage Structure:**
```
avatars/
├── profiles/
│   └── {user_id}-{timestamp}.{ext}
media/
├── articles/
│   └── {article_id}/
├── case-studies/
│   └── {case_study_id}/
└── services/
    └── {service_id}/
resources/
├── templates/
├── frameworks/
└── tools/
```

**Storage Policies:**
```sql
-- Public can view media
CREATE POLICY "Public can view media" ON storage.objects 
  FOR SELECT USING (bucket_id = 'media');

-- Authenticated users can upload media
CREATE POLICY "Authenticated users can upload media" ON storage.objects 
  FOR INSERT WITH CHECK (
    bucket_id = 'media' AND
    auth.role() = 'authenticated'
  );

-- Users can manage own avatars
CREATE POLICY "Users can manage own avatar" ON storage.objects 
  FOR ALL USING (
    bucket_id = 'avatars' AND
    auth.uid()::text = (storage.foldername(name))[1]
  );
```

---

## Row Level Security (RLS)

### profiles table (UPDATED)
```sql
-- Public profiles are viewable
CREATE POLICY "Public profiles are viewable by everyone" ON profiles
  FOR SELECT USING (is_public = true);

-- Users can view their own profile
CREATE POLICY "Users can view own profile" ON profiles
  FOR SELECT USING (auth.uid() = auth_user_id);

-- Users can update their own profile
CREATE POLICY "Users can update own profile" ON profiles
  FOR UPDATE USING (auth.uid() = auth_user_id);

-- Admins can manage all profiles
CREATE POLICY "Admins can manage all profiles" ON profiles
  FOR ALL USING (
    EXISTS (
      SELECT 1 FROM profiles 
      WHERE profiles.auth_user_id = auth.uid() 
      AND profiles.role = 'admin'
    )
  );

-- Contributors can view and create profiles
CREATE POLICY "Contributors can view and create profiles" ON profiles
  FOR SELECT USING (
    EXISTS (
      SELECT 1 FROM profiles 
      WHERE profiles.auth_user_id = auth.uid() 
      AND profiles.role IN ('admin', 'contributor')
    )
  );

CREATE POLICY "Contributors can create profiles" ON profiles
  FOR INSERT WITH CHECK (
    EXISTS (
      SELECT 1 FROM profiles 
      WHERE profiles.auth_user_id = auth.uid() 
      AND profiles.role IN ('admin', 'contributor')
    )
  );
```

**Key RLS Changes:**
- Policies now check `auth_user_id` instead of `id`
- Admins can create/edit/delete any profile
- Contributors can create profiles and view all
- Public can only see profiles marked as `is_public = true`

### services table
```sql
-- Public can view active services
CREATE POLICY "Public can view active services" ON services
  FOR SELECT USING (is_active = true);

-- Admins can manage services
CREATE POLICY "Admins can manage services" ON services
  FOR ALL USING (
    EXISTS (
      SELECT 1 FROM profiles 
      WHERE profiles.auth_user_id = auth.uid() 
      AND profiles.role = 'admin'
    )
  );
```

### articles table
```sql
-- Published articles are public
CREATE POLICY "Published articles are public" ON articles
  FOR SELECT USING (status = 'published');

-- Authors can view own articles
CREATE POLICY "Authors can view own articles" ON articles
  FOR SELECT USING (
    auth.uid() = (SELECT auth_user_id FROM profiles WHERE id = author_id) OR 
    auth.uid() = ANY(SELECT auth_user_id FROM profiles WHERE id = ANY(co_authors))
  );

-- Contributors can create articles
CREATE POLICY "Contributors can create articles" ON articles
  FOR INSERT WITH CHECK (
    EXISTS (
      SELECT 1 FROM profiles 
      WHERE profiles.auth_user_id = auth.uid() 
      AND profiles.role IN ('admin', 'contributor')
    )
  );

-- Authors can update own drafts
CREATE POLICY "Authors can update own drafts" ON articles
  FOR UPDATE USING (
    auth.uid() = (SELECT auth_user_id FROM profiles WHERE id = author_id) AND 
    status IN ('draft', 'pending_approval')
  );
```

### capability_assessments table
```sql
-- Anyone can create assessments
CREATE POLICY "Anyone can create assessments" ON capability_assessments
  FOR INSERT WITH CHECK (true);

-- Users can view own assessments
CREATE POLICY "Users can view own assessments" ON capability_assessments
  FOR SELECT USING (auth.uid() = (SELECT auth_user_id FROM profiles WHERE id = user_id));

-- Admins can view all assessments
CREATE POLICY "Admins can view all assessments" ON capability_assessments
  FOR SELECT USING (
    EXISTS (
      SELECT 1 FROM profiles 
      WHERE profiles.auth_user_id = auth.uid() 
      AND profiles.role = 'admin'
    )
  );
```

### Additional RLS Policies
```sql
-- Enable RLS on all new tables
ALTER TABLE categories ENABLE ROW LEVEL SECURITY;
ALTER TABLE tags ENABLE ROW LEVEL SECURITY;
ALTER TABLE testimonials ENABLE ROW LEVEL SECURITY;
ALTER TABLE resources ENABLE ROW LEVEL SECURITY;
ALTER TABLE media ENABLE ROW LEVEL SECURITY;
ALTER TABLE service_analytics ENABLE ROW LEVEL SECURITY;
ALTER TABLE article_analytics ENABLE ROW LEVEL SECURITY;
ALTER TABLE page_analytics ENABLE ROW LEVEL SECURITY;
ALTER TABLE content_engagement ENABLE ROW LEVEL SECURITY;
ALTER TABLE tool_interactions ENABLE ROW LEVEL SECURITY;
ALTER TABLE departments ENABLE ROW LEVEL SECURITY;
ALTER TABLE newsletter_subscribers ENABLE ROW LEVEL SECURITY;
ALTER TABLE notification_preferences ENABLE ROW LEVEL SECURITY;

-- CATEGORIES POLICIES
CREATE POLICY "Categories are public" ON categories
  FOR SELECT USING (is_active = true);

CREATE POLICY "Admins can manage categories" ON categories
  FOR ALL USING (
    EXISTS (
      SELECT 1 FROM profiles 
      WHERE profiles.auth_user_id = auth.uid() 
      AND profiles.role = 'admin'
    )
  );

-- TAGS POLICIES
CREATE POLICY "Tags are public" ON tags
  FOR SELECT USING (is_active = true);

CREATE POLICY "Admins can manage tags" ON tags
  FOR ALL USING (
    EXISTS (
      SELECT 1 FROM profiles 
      WHERE profiles.auth_user_id = auth.uid() 
      AND profiles.role = 'admin'
    )
  );

-- TESTIMONIALS POLICIES
CREATE POLICY "Published testimonials are public" ON testimonials
  FOR SELECT USING (status = 'published');

CREATE POLICY "Admins can manage testimonials" ON testimonials
  FOR ALL USING (
    EXISTS (
      SELECT 1 FROM profiles 
      WHERE profiles.auth_user_id = auth.uid() 
      AND profiles.role = 'admin'
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
      WHERE profiles.auth_user_id = auth.uid() 
      AND profiles.role IN ('admin', 'contributor')
    )
  );

-- MEDIA POLICIES
CREATE POLICY "Public media is viewable by everyone" ON media
  FOR SELECT USING (is_public = true);

CREATE POLICY "Users can view own uploads" ON media
  FOR SELECT USING (auth.uid() = (SELECT auth_user_id FROM profiles WHERE id = uploaded_by));

CREATE POLICY "Contributors can upload media" ON media
  FOR INSERT WITH CHECK (
    EXISTS (
      SELECT 1 FROM profiles 
      WHERE profiles.auth_user_id = auth.uid() 
      AND profiles.role IN ('admin', 'contributor')
    )
  );

CREATE POLICY "Users can manage own uploads" ON media
  FOR UPDATE USING (auth.uid() = (SELECT auth_user_id FROM profiles WHERE id = uploaded_by));

CREATE POLICY "Admins can manage all media" ON media
  FOR ALL USING (
    EXISTS (
      SELECT 1 FROM profiles 
      WHERE profiles.auth_user_id = auth.uid() 
      AND profiles.role = 'admin'
    )
  );

-- SERVICE ANALYTICS POLICIES
CREATE POLICY "Anyone can insert service analytics" ON service_analytics
  FOR INSERT WITH CHECK (true);

CREATE POLICY "Admins can view all service analytics" ON service_analytics
  FOR SELECT USING (
    EXISTS (
      SELECT 1 FROM profiles 
      WHERE profiles.auth_user_id = auth.uid() 
      AND profiles.role = 'admin'
    )
  );

-- ARTICLE ANALYTICS POLICIES
CREATE POLICY "Anyone can insert article analytics" ON article_analytics
  FOR INSERT WITH CHECK (true);

CREATE POLICY "Admins can view all article analytics" ON article_analytics
  FOR SELECT USING (
    EXISTS (
      SELECT 1 FROM profiles 
      WHERE profiles.auth_user_id = auth.uid() 
      AND profiles.role = 'admin'
    )
  );

-- PAGE ANALYTICS POLICIES
CREATE POLICY "Anyone can insert page analytics" ON page_analytics
  FOR INSERT WITH CHECK (true);

CREATE POLICY "Users can view own analytics" ON page_analytics
  FOR SELECT USING (auth.uid() = (SELECT auth_user_id FROM profiles WHERE id = user_id));

CREATE POLICY "Admins can view all analytics" ON page_analytics
  FOR SELECT USING (
    EXISTS (
      SELECT 1 FROM profiles 
      WHERE profiles.auth_user_id = auth.uid() 
      AND profiles.role = 'admin'
    )
  );

-- CONTENT ENGAGEMENT POLICIES
CREATE POLICY "Anyone can track engagement" ON content_engagement
  FOR INSERT WITH CHECK (true);

CREATE POLICY "Users can view own engagement" ON content_engagement
  FOR SELECT USING (auth.uid() = (SELECT auth_user_id FROM profiles WHERE id = user_id));

CREATE POLICY "Admins can view all engagement" ON content_engagement
  FOR SELECT USING (
    EXISTS (
      SELECT 1 FROM profiles 
      WHERE profiles.auth_user_id = auth.uid() 
      AND profiles.role = 'admin'
    )
  );

-- TOOL INTERACTIONS POLICIES
CREATE POLICY "Anyone can save tool interactions" ON tool_interactions
  FOR INSERT WITH CHECK (true);

CREATE POLICY "Users can view own tool usage" ON tool_interactions
  FOR SELECT USING (auth.uid() = (SELECT auth_user_id FROM profiles WHERE id = user_id));

CREATE POLICY "Admins can view all tool usage" ON tool_interactions
  FOR SELECT USING (
    EXISTS (
      SELECT 1 FROM profiles 
      WHERE profiles.auth_user_id = auth.uid() 
      AND profiles.role = 'admin'
    )
  );

-- DEPARTMENTS POLICIES  
CREATE POLICY "Departments are public" ON departments
  FOR SELECT USING (is_active = true);

CREATE POLICY "Admins can manage departments" ON departments
  FOR ALL USING (
    EXISTS (
      SELECT 1 FROM profiles 
      WHERE profiles.auth_user_id = auth.uid() 
      AND profiles.role = 'admin'
    )
  );

-- NEWSLETTER SUBSCRIBERS POLICIES
CREATE POLICY "Anyone can subscribe" ON newsletter_subscribers
  FOR INSERT WITH CHECK (true);

CREATE POLICY "Users can view own subscription" ON newsletter_subscribers
  FOR SELECT USING (email = (SELECT email FROM profiles WHERE auth_user_id = auth.uid()));

CREATE POLICY "Users can update own subscription" ON newsletter_subscribers
  FOR UPDATE USING (email = (SELECT email FROM profiles WHERE auth_user_id = auth.uid()));

CREATE POLICY "Admins can manage all subscriptions" ON newsletter_subscribers
  FOR ALL USING (
    EXISTS (
      SELECT 1 FROM profiles 
      WHERE profiles.auth_user_id = auth.uid() 
      AND profiles.role = 'admin'
    )
  );

-- NOTIFICATION PREFERENCES POLICIES
CREATE POLICY "Users can view own preferences" ON notification_preferences
  FOR SELECT USING (auth.uid() = (SELECT auth_user_id FROM profiles WHERE id = user_id));

CREATE POLICY "Users can update own preferences" ON notification_preferences
  FOR ALL USING (auth.uid() = (SELECT auth_user_id FROM profiles WHERE id = user_id));

CREATE POLICY "Admins can view all preferences" ON notification_preferences
  FOR SELECT USING (
    EXISTS (
      SELECT 1 FROM profiles 
      WHERE profiles.auth_user_id = auth.uid() 
      AND profiles.role = 'admin'
    )
  );
```
---

## Functions & Triggers

### 1. Auto-create profile on signup (UPDATED)
```sql
CREATE OR REPLACE FUNCTION public.handle_new_user()
RETURNS trigger AS $$
BEGIN
  INSERT INTO public.profiles (
    auth_user_id, -- Changed from id to auth_user_id
    email, 
    full_name, 
    role
  )
  VALUES (
    new.id,
    new.email,
    COALESCE(new.raw_user_meta_data->>'full_name', split_part(new.email, '@', 1)),
    COALESCE(new.raw_user_meta_data->>'role', 'standard')
  )
  ON CONFLICT (email) DO UPDATE
  SET 
    auth_user_id = new.id,
    updated_at = NOW();
  RETURN new;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

CREATE TRIGGER on_auth_user_created
  AFTER INSERT ON auth.users
  FOR EACH ROW EXECUTE FUNCTION public.handle_new_user();
```

### 2. Create team member function (NEW)
Helper function for admin interface to create profiles.

```sql
CREATE OR REPLACE FUNCTION create_team_member(
  p_email TEXT,
  p_full_name TEXT,
  p_job_title TEXT,
  p_bio TEXT DEFAULT NULL,
  p_avatar_url TEXT DEFAULT NULL,
  p_is_public BOOLEAN DEFAULT true
)
RETURNS UUID AS $$
DECLARE
  new_id UUID;
BEGIN
  INSERT INTO public.profiles (
    email,
    full_name,
    job_title,
    bio,
    avatar_url,
    is_public,
    is_active,
    role
  ) VALUES (
    p_email,
    p_full_name,
    p_job_title,
    p_bio,
    p_avatar_url,
    p_is_public,
    true,
    'standard'
  )
  RETURNING id INTO new_id;
  
  RETURN new_id;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;
```

### 3. Track service views with journey
```sql
CREATE OR REPLACE FUNCTION track_service_view(
  p_service_id UUID,
  p_session_id TEXT,
  p_user_id UUID DEFAULT NULL,
  p_referrer_service_id UUID DEFAULT NULL
)
RETURNS VOID AS $$
BEGIN
  -- Update service view counts
  UPDATE services 
  SET view_count = view_count + 1,
      unique_view_count = CASE 
        WHEN NOT EXISTS (
          SELECT 1 FROM service_analytics 
          WHERE service_id = p_service_id 
          AND session_id = p_session_id
        ) THEN unique_view_count + 1
        ELSE unique_view_count
      END
  WHERE id = p_service_id;
  
  -- Record analytics
  INSERT INTO service_analytics (
    service_id, user_id, session_id, referrer_service_id
  ) VALUES (
    p_service_id, p_user_id, p_session_id, p_referrer_service_id
  );
  
  -- Update user journey
  INSERT INTO user_journeys (session_id, user_id, journey_path)
  VALUES (
    p_session_id, 
    p_user_id,
    jsonb_build_array(jsonb_build_object(
      'type', 'service',
      'id', p_service_id,
      'timestamp', NOW()
    ))
  )
  ON CONFLICT (session_id) DO UPDATE
  SET journey_path = user_journeys.journey_path || jsonb_build_object(
    'type', 'service',
    'id', p_service_id,
    'timestamp', NOW()
  ),
  updated_at = NOW();
END;
$$ LANGUAGE plpgsql;
```

### 4. Content approval with notifications
```sql
CREATE OR REPLACE FUNCTION approve_content()
RETURNS TRIGGER AS $$
BEGIN
  IF NEW.status = 'approved' AND OLD.status = 'pending_approval' THEN
    NEW.approved_at = NOW();
    
    -- Create notification
    INSERT INTO email_notifications (
      recipient_email,
      recipient_id,
      subject,
      template,
      data
    )
    SELECT 
      p.email,
      p.id,
      'Your content has been approved',
      'content_approved',
      jsonb_build_object(
        'content_type', TG_TABLE_NAME,
        'content_title', NEW.title,
        'approved_by', NEW.approved_by
      )
    FROM profiles p
    WHERE p.id = NEW.author_id
    AND EXISTS (
      SELECT 1 FROM notification_preferences np
      WHERE np.user_id = p.id
      AND np.content_approvals = true
    );
  END IF;
  
  RETURN NEW;
END;
$$ LANGUAGE plpgsql;

CREATE TRIGGER approve_article BEFORE UPDATE ON articles
  FOR EACH ROW EXECUTE FUNCTION approve_content();
```

### 5. Track article views
```sql
CREATE OR REPLACE FUNCTION track_article_view(
  p_article_id UUID,
  p_session_id TEXT,
  p_user_id UUID DEFAULT NULL
)
RETURNS VOID AS $$
BEGIN
  -- Update article view counts
  UPDATE articles 
  SET view_count = view_count + 1,
      unique_view_count = CASE 
        WHEN NOT EXISTS (
          SELECT 1 FROM article_analytics 
          WHERE article_id = p_article_id 
          AND session_id = p_session_id
        ) THEN unique_view_count + 1
        ELSE unique_view_count
      END
  WHERE id = p_article_id;
  
  -- Record analytics
  INSERT INTO article_analytics (
    article_id, user_id, session_id
  ) VALUES (
    p_article_id, p_user_id, p_session_id
  )
  ON CONFLICT DO NOTHING;
  
  -- Update user journey
  INSERT INTO user_journeys (session_id, user_id, journey_path)
  VALUES (
    p_session_id, 
    p_user_id,
    jsonb_build_array(jsonb_build_object(
      'type', 'article',
      'id', p_article_id,
      'timestamp', NOW()
    ))
  )
  ON CONFLICT (session_id) DO UPDATE
  SET journey_path = user_journeys.journey_path || jsonb_build_object(
    'type', 'article',
    'id', p_article_id,
    'timestamp', NOW()
  ),
  updated_at = NOW();
END;
$$ LANGUAGE plpgsql;
```

### 6. Update timestamp trigger
```sql
CREATE OR REPLACE FUNCTION update_updated_at_column()
RETURNS TRIGGER AS $$
BEGIN
  NEW.updated_at = NOW();
  RETURN NEW;
END;
$$ LANGUAGE plpgsql;

-- Apply to all TABLES (not views) with updated_at
DO $$ 
DECLARE
  t text;
BEGIN
  FOR t IN 
    SELECT c.table_name 
    FROM information_schema.columns c
    JOIN information_schema.tables t ON c.table_name = t.table_name
    WHERE c.column_name = 'updated_at' 
    AND c.table_schema = 'public'
    AND t.table_schema = 'public'
    AND t.table_type = 'BASE TABLE'
  LOOP
    EXECUTE format('CREATE TRIGGER update_%I_updated_at BEFORE UPDATE ON %I 
                    FOR EACH ROW EXECUTE FUNCTION update_updated_at_column()', t, t);
  END LOOP;
END $$;
```

### 7. Auto-generate slugs
```sql
CREATE OR REPLACE FUNCTION generate_slug(title TEXT)
RETURNS TEXT AS $$
DECLARE
  slug TEXT;
BEGIN
  slug := lower(title);
  slug := regexp_replace(slug, '[^a-z0-9\s-]', '', 'g');
  slug := regexp_replace(slug, '\s+', '-', 'g');
  slug := regexp_replace(slug, '-+', '-', 'g');
  slug := trim(both '-' from slug);
  RETURN slug;
END;
$$ LANGUAGE plpgsql;

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
```

---

## Custom Types & Enums

```sql
-- Activity types for tracking
CREATE TYPE activity_type AS ENUM (
  'profile_view',
  'service_view',
  'article_view',
  'assessment_complete',
  'contact_submitted',
  'resource_downloaded'
);

-- Lead temperature
CREATE TYPE lead_temperature_type AS ENUM (
  'cold',
  'warm', 
  'hot'
);

-- Content status
CREATE TYPE content_status AS ENUM (
  'draft',
  'pending_approval',
  'approved',
  'published',
  'archived'
);
```

**Type Constraints Used:**
- `role`: 'admin' | 'contributor' | 'standard'
- `status` (content): 'draft' | 'pending_approval' | 'approved' | 'published' | 'archived'
- `readiness_level`: 'high' | 'medium' | 'low'
- `priority_level`: 'urgent' | 'standard' | 'planning'
- `notification_status`: 'pending' | 'sent' | 'failed' | 'cancelled'
- `lead_status`: 'new' | 'contacted' | 'qualified' | 'won' | 'lost'

---

## Indexes

### Performance Indexes
```sql
-- Service indexes
CREATE INDEX idx_services_zone ON services(zone_id);
CREATE INDEX idx_services_slug ON services(slug);
CREATE INDEX idx_services_active ON services(is_active) WHERE is_active = true;
CREATE INDEX idx_services_featured ON services(is_featured) WHERE is_featured = true;

-- Analytics indexes
CREATE INDEX idx_service_analytics_service ON service_analytics(service_id);
CREATE INDEX idx_service_analytics_session ON service_analytics(session_id);
CREATE INDEX idx_service_analytics_created ON service_analytics(created_at DESC);

CREATE INDEX idx_article_analytics_article ON article_analytics(article_id);
CREATE INDEX idx_article_analytics_session ON article_analytics(session_id);

CREATE INDEX idx_user_journeys_session ON user_journeys(session_id);
CREATE INDEX idx_user_journeys_user ON user_journeys(user_id);

-- Content indexes
CREATE INDEX idx_articles_slug ON articles(slug);
CREATE INDEX idx_articles_status_published ON articles(status, published_at DESC) WHERE status = 'published';
CREATE INDEX idx_articles_author ON articles(author_id);
CREATE INDEX idx_articles_category ON articles(category_id);
CREATE INDEX idx_articles_featured ON articles(is_featured) WHERE is_featured = true;

CREATE INDEX idx_case_studies_slug ON case_studies(slug);
CREATE INDEX idx_case_studies_status ON case_studies(status);
CREATE INDEX idx_case_studies_industry ON case_studies(industry);

-- Lead management indexes  
CREATE INDEX idx_contact_submissions_email ON contact_submissions(email);
CREATE INDEX idx_contact_submissions_status ON contact_submissions(lead_status);
CREATE INDEX idx_contact_submissions_created ON contact_submissions(created_at DESC);

-- Notification indexes
CREATE INDEX idx_email_notifications_status ON email_notifications(status);
CREATE INDEX idx_email_notifications_recipient ON email_notifications(recipient_id);

-- Full-text search indexes
CREATE INDEX idx_articles_search ON articles 
  USING gin(to_tsvector('english', 
    title || ' ' || 
    COALESCE(excerpt, '') || ' ' || 
    COALESCE(content::text, '')
  ));

CREATE INDEX idx_services_search ON services
  USING gin(to_tsvector('english',
    title || ' ' ||
    COALESCE(description, '') || ' ' ||
    COALESCE(full_description, '')
  ));

-- Array indexes
CREATE INDEX idx_articles_tags ON articles USING gin(tags);
CREATE INDEX idx_services_features ON services USING gin(features);
CREATE INDEX idx_services_technologies ON services USING gin(technologies);
```

---

## Edge Functions

### send-notification-email
Sends email notifications for various events.

**Location:** `supabase/functions/send-notification-email/index.ts`  
**Triggers:** New leads, content approval, assessment completion  
**Required Secrets:** `RESEND_API_KEY`

```typescript
import { serve } from "https://deno.land/std@0.168.0/http/server.ts"
import { createClient } from 'https://esm.sh/@supabase/supabase-js@2'

serve(async (req) => {
  const { notification_id } = await req.json()
  
  const supabase = createClient(
    Deno.env.get('SUPABASE_URL'),
    Deno.env.get('SUPABASE_SERVICE_ROLE_KEY')
  )
  
  // Fetch notification details
  const { data: notification } = await supabase
    .from('email_notifications')
    .select('*')
    .eq('id', notification_id)
    .single()
  
  // Send via Resend
  const res = await fetch('https://api.resend.com/emails', {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
      'Authorization': `Bearer ${Deno.env.get('RESEND_API_KEY')}`
    },
    body: JSON.stringify({
      from: 'Rule27 Design <noreply@rule27design.com>',
      to: notification.recipient_email,
      subject: notification.subject,
      html: generateTemplate(notification.template, notification.data)
    })
  })
  
  // Update notification status
  await supabase
    .from('email_notifications')
    .update({ 
      status: res.ok ? 'sent' : 'failed',
      sent_at: new Date().toISOString()
    })
    .eq('id', notification_id)
  
  return new Response(JSON.stringify({ success: res.ok }), {
    headers: { "Content-Type": "application/json" },
  })
})
```

---

## Usage Examples

### Authentication & Profiles (UPDATED)
```javascript
// Sign up new user (creates auth user AND profile)
const { data, error } = await supabase.auth.signUp({
  email: 'contributor@example.com',
  password: 'password',
  options: {
    data: {
      full_name: 'John Contributor',
      role: 'contributor'
    }
  }
});

// Create display-only team member (NO auth user)
const { data, error } = await supabase
  .from('profiles')
  .insert({
    email: 'designer@rule27design.com',
    full_name: 'Jane Designer',
    job_title: 'Senior Designer',
    bio: 'Creative expert...',
    is_public: true,
    is_active: true,
    role: 'standard' // No special permissions needed
  });

// Get all public team members for website
const { data: teamMembers } = await supabase
  .from('team_members_display')
  .select('*');

// Get only profiles that can log in (for admin panel)
const { data: users } = await supabase
  .from('user_profiles')
  .select('*');

// Check if current user is admin
const { data: profile } = await supabase
  .from('profiles')
  .select('role')
  .eq('auth_user_id', user.id)
  .single();

const isAdmin = profile?.role === 'admin';
```

### Admin Management (NEW)
```javascript
// Admin creates a new team member
const createTeamMember = async (memberData) => {
  const { data: profile, error } = await supabase
    .rpc('create_team_member', {
      p_email: memberData.email,
      p_full_name: memberData.fullName,
      p_job_title: memberData.jobTitle,
      p_bio: memberData.bio,
      p_avatar_url: memberData.avatarUrl,
      p_is_public: true
    });
  
  return { profile, error };
};

// Admin updates any profile
const updateProfile = async (profileId, updates) => {
  const { data, error } = await supabase
    .from('profiles')
    .update(updates)
    .eq('id', profileId);
  
  return { data, error };
};

// Check if profile has login capability
const canLogin = (profile) => {
  return profile.auth_user_id !== null;
};
```

### Service Management
```javascript
// Track service view with journey
await supabase.rpc('track_service_view', {
  p_service_id: serviceId,
  p_session_id: sessionId,
  p_referrer_service_id: referrerServiceId,
  p_user_id: user?.id
});

// Get services with analytics
const { data: services } = await supabase
  .from('services')
  .select(`
    *,
    zone:service_zones(title, icon),
    case_studies:service_case_studies(
      case_study:case_studies(title, client_name, key_metrics)
    )
  `)
  .eq('is_active', true)
  .order('view_count', { ascending: false });
```

### Content Publishing
```javascript
// Submit article for approval
const { data, error } = await supabase
  .from('articles')
  .update({ 
    status: 'pending_approval',
    submitted_for_approval_at: new Date().toISOString()
  })
  .eq('id', articleId);

// Approve content (admin only)
const { data, error } = await supabase
  .from('articles')
  .update({ 
    status: 'approved',
    approved_by: user.id
  })
  .eq('id', articleId);
```

### Capability Assessment
```javascript
// Submit assessment
const { data: assessment } = await supabase
  .from('capability_assessments')
  .insert({
    answers: assessmentAnswers,
    session_id: sessionId,
    user_id: user?.id
  })
  .select()
  .single();

// Generate recommendations
const recommendations = generateRecommendations(assessmentAnswers);
await supabase
  .from('capability_assessments')
  .update({
    recommendations,
    score: calculateScore(assessmentAnswers),
    readiness_level: determineReadiness(score),
    completed: true,
    completed_at: new Date().toISOString()
  })
  .eq('id', assessment.id);
```

### User Journey Tracking
```javascript
// Track journey path
const updateJourney = async (type, id) => {
  await supabase
    .from('user_journeys')
    .upsert({
      session_id: sessionId,
      user_id: user?.id,
      journey_path: supabase.sql`
        COALESCE(journey_path, '[]'::jsonb) || 
        ${JSON.stringify([{ type, id, timestamp: new Date() }])}::jsonb
      `
    }, {
      onConflict: 'session_id'
    });
};
```

### Real-time Subscriptions
```javascript
// Listen for new leads
const leadSubscription = supabase
  .channel('new-leads')
  .on('postgres_changes', 
    { 
      event: 'INSERT', 
      schema: 'public', 
      table: 'contact_submissions'
    },
    (payload) => {
      console.log('New lead received!', payload.new);
      updateDashboard(payload.new);
    }
  )
  .subscribe();

// Listen for content updates
const contentSubscription = supabase
  .channel('content-updates')
  .on('postgres_changes',
    {
      event: 'UPDATE',
      schema: 'public',
      table: 'articles',
      filter: 'status=eq.published'
    },
    (payload) => {
      console.log('Article published!', payload.new);
    }
  )
  .subscribe();
```

### Analytics Queries
```javascript
// Get service analytics summary
const { data: analytics } = await supabase.rpc('generate_analytics_summary', {
  p_start_date: startDate,
  p_end_date: endDate
});

// Top performing content
const { data: topContent } = await supabase
  .from('articles')
  .select('title, slug, view_count, average_time_on_page')
  .order('view_count', { ascending: false })
  .limit(10);

// Conversion funnel
const { data: funnel } = await supabase
  .from('user_journeys')
  .select('conversion_event, count')
  .gte('created_at', lastMonth)
  .order('count', { ascending: false });
```

---

## Environment Variables

```bash
# Frontend (Public)
VITE_GOOGLE_ANALYTICS_ID=G-C90891VVQ1
VITE_HOTJAR_ID=6510564

# Any other frontend config
VITE_APP_URL=https://www.rule27design.com

# Supabase (Service role - NEVER expose to frontend)
SUPABASE_URL=https://[project-id].supabase.co
SUPABASE_SERVICE_ROLE_KEY=[service-key]

# Email Service
RESEND_API_KEY=[resend-key]

# Future payment processing
STRIPE_SECRET_KEY=[stripe-secret-key]
STRIPE_WEBHOOK_SECRET=[webhook-secret]
```

---

## Best Practices

### Security
1. **Always use RLS** - Never disable Row Level Security in production
2. **Validate inputs** - Use database constraints and application validation
3. **API keys** - Never expose service role key to frontend
4. **Content approval** - Enforce workflow for contributors
5. **Rate limiting** - Implement via Edge Functions for public APIs

### Performance
1. **Use indexes** - Add indexes for frequently queried columns
2. **Optimize queries** - Use `select()` with specific columns
3. **Batch operations** - Use `upsert()` for bulk operations  
4. **Materialized views** - For complex analytics queries
5. **Connection pooling** - Handled automatically by Supabase

### Data Management
1. **Use transactions** - For multi-table operations
2. **Audit trails** - Track all content changes
3. **Soft deletes** - Archive instead of delete for important data
4. **Regular backups** - Enable Point-in-Time Recovery
5. **Data validation** - Use triggers for business rules

### Content Strategy
1. **SEO optimization** - Always populate meta fields
2. **Image optimization** - Resize and compress before upload
3. **Content versioning** - Track all edits and approvals
4. **Scheduled publishing** - Use scheduled_at for planned releases
5. **Analytics tracking** - Monitor engagement metrics

---

## Database Maintenance

### Regular Tasks
- **Daily**: Monitor notification queue, Check failed emails
- **Weekly**: Review slow queries, Update analytics summary
- **Monthly**: Clean old analytics data, Archive completed assessments
- **Quarterly**: Review indexes, Optimize query performance

### Monitoring Queries
```sql
-- Check table sizes
SELECT 
  tablename,
  pg_size_pretty(pg_total_relation_size(schemaname||'.'||tablename)) as size
FROM pg_tables 
WHERE schemaname = 'public'
ORDER BY pg_total_relation_size(schemaname||'.'||tablename) DESC;

-- Find slow queries
SELECT 
  query,
  mean_exec_time,
  calls
FROM pg_stat_statements
ORDER BY mean_exec_time DESC
LIMIT 10;

-- Service performance
SELECT 
  s.title,
  s.view_count,
  s.unique_view_count,
  s.inquiry_count,
  ROUND(s.inquiry_count::decimal / NULLIF(s.view_count, 0) * 100, 2) as conversion_rate
FROM services s
ORDER BY view_count DESC;

-- Content engagement
SELECT 
  a.title,
  a.view_count,
  a.average_read_depth,
  a.average_time_on_page,
  ROUND(a.like_count::decimal / NULLIF(a.view_count, 0) * 100, 2) as engagement_rate
FROM articles a
WHERE a.status = 'published'
ORDER BY engagement_rate DESC;
```

### Cleanup Functions
```sql
-- Clean old analytics data
CREATE OR REPLACE FUNCTION cleanup_old_analytics()
RETURNS INTEGER AS $$
DECLARE
  deleted_count INTEGER;
BEGIN
  DELETE FROM service_analytics WHERE created_at < NOW() - INTERVAL '90 days';
  GET DIAGNOSTICS deleted_count = ROW_COUNT;
  
  DELETE FROM article_analytics WHERE created_at < NOW() - INTERVAL '90 days';
  DELETE FROM page_analytics WHERE created_at < NOW() - INTERVAL '90 days';
  
  RETURN deleted_count;
END;
$$ LANGUAGE plpgsql;

-- Archive old assessments
CREATE OR REPLACE FUNCTION archive_old_assessments()
RETURNS void AS $$
BEGIN
  UPDATE capability_assessments
  SET archived = true
  WHERE completed_at < NOW() - INTERVAL '180 days'
  AND archived = false;
END;
$$ LANGUAGE plpgsql;
```

---

## Migration Strategy

### Phase 1: Database Setup (Week 1)
- ✅ Run complete schema in Supabase
- ✅ Set up authentication and roles
- ✅ Configure storage buckets
- ✅ Test RLS policies
- ✅ Create initial admin user

### Phase 2: Data Migration (Week 1-2)
- 📝 Migrate 140 articles to database
- 📝 Import team profiles (both auth and display-only)
- 📝 Load 31 services with pricing
- 📝 Import partnership data
- 📝 Set up categories and tags

### Phase 3: API Development (Week 2-3)
- 🔧 Service CRUD endpoints
- 🔧 Article management APIs
- 🔧 Analytics tracking endpoints
- 🔧 Assessment APIs
- 🔧 Notification endpoints

### Phase 4: Frontend Integration (Week 3-4)
- 🎨 Connect Articles Hub
- 🎨 Integrate Capability Universe
- 🎨 Implement assessment flow
- 🎨 Add analytics tracking
- 🎨 Connect team profiles (both types)

### Phase 5: Admin Interface (Week 4-5)
- 👤 Content management dashboard
- 👤 Team member management (auth vs display-only)
- 👤 Approval workflow UI
- 👤 Analytics dashboard
- 👤 Service management

### Phase 6: Testing & Launch (Week 5-6)
- ✔️ Performance testing
- ✔️ Security audit
- ✔️ SEO verification
- ✔️ User acceptance testing
- 🚀 Production deployment

---

## Profile Migration Path (NEW)

### Data Flow
```
Display-Only Team Members:
Admin Interface → profiles table → team_members_display view → Public Website

Login-Enabled Users:
Sign Up → auth.users → trigger → profiles (with auth_user_id) → Can access admin
```

### Profile Management Best Practices
1. **Display-only profiles**: Create directly via admin interface
2. **Login users**: Always create through auth.signUp
3. **Role assignment**: Only admins should update role field
4. **Public display**: Use `is_public` flag for team page visibility
5. **Deactivation**: Set `is_active = false` instead of deleting

### Profile Fields by Access Level

| Field | Public View | Auth User View | Admin View |
|-------|------------|----------------|------------|
| id | ✅ | ✅ | ✅ |
| auth_user_id | ❌ | Own only | ✅ |
| email | ❌ | ✅ | ✅ |
| full_name | ✅ | ✅ | ✅ |
| display_name | ✅ | ✅ | ✅ |
| avatar_url | ✅ | ✅ | ✅ |
| bio | ✅ | ✅ | ✅ |
| role | ❌ | Own only | ✅ |
| job_title | ✅ | ✅ | ✅ |
| department | ✅ | ✅ | ✅ |
| expertise | ✅ | ✅ | ✅ |
| social_links | ✅ | ✅ | ✅ |
| is_public | ❌ | ❌ | ✅ |
| is_active | ❌ | ❌ | ✅ |
| timestamps | ❌ | ❌ | ✅ |

### Role Capabilities

| Capability | Standard | Contributor | Admin |
|-----------|----------|-------------|--------|
| View public profiles | ✅ | ✅ | ✅ |
| View own profile | ✅ | ✅ | ✅ |
| Edit own profile | ✅ | ✅ | ✅ |
| View all profiles | ❌ | ✅ | ✅ |
| Create profiles | ❌ | ✅ | ✅ |
| Edit any profile | ❌ | ❌ | ✅ |
| Delete profiles | ❌ | ❌ | ✅ |
| Change roles | ❌ | ❌ | ✅ |

---

## Migration Benefits

### Before (Traditional Setup)
- 🔐 Manual JWT management
- 🌍 Complex caching layers
- 📊 Limited analytics
- 🔄 No real-time updates
- 📁 Separate file storage
- 💰 Multiple service costs

### After (Supabase)
- ⚡ Sub-second response times
- 🔑 Automatic JWT handling
- 🚀 Direct database queries
- 📡 Real-time subscriptions
- 🖼️ Integrated storage with CDN
- 📈 Auto-scaling infrastructure
- 💎 Single platform solution

---

## Support & Resources

- **Supabase Documentation**: https://supabase.com/docs
- **PostgreSQL Documentation**: https://www.postgresql.org/docs/
- **React Integration**: https://supabase.com/docs/guides/getting-started/quickstarts/reactjs
- **Community Discord**: https://discord.supabase.com/
- **Status Page**: https://status.supabase.com/

---

*Last Updated: January 2025*  
*Version: 3.0 - Complete Enhanced Architecture with Updated Profiles*  
*Platform: Supabase + React + Tailwind CSS*