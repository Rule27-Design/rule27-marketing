# Rule27 Design Database Schema Documentation

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
┌─────────────────┐        ┌─────────────────┐       ┌─────────────────┐
│   React App     │──────> |    Supabase     │──────>|     Resend      │
│   (Netlify)     │        │   (Backend)     │       │    (Email)      │
└─────────────────┘        └─────────────────┘       └─────────────────┘
        │                         │                         │
        │                         ├── Auth (JWT)            │
        │                         ├── Database (PostgreSQL) │
        │                         ├── Storage (CDN)         │
        │                         ├── Real-time (WebSocket) │
        │                         └── Edge Functions        │
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

### 1. **profiles**
Primary user table extending Supabase Auth.

```sql
CREATE TABLE public.profiles (
  id UUID PRIMARY KEY REFERENCES auth.users(id) ON DELETE CASCADE,
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

**Key Features:**
- Links to Supabase Auth via `auth.users(id)`
- Three-tier role system for permissions
- Auto-created via trigger on user signup
- Array fields for multiple departments/expertise

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

- **categories** - Hierarchical content organization
- **tags** - Flexible content labeling
- **testimonials** - Reusable client testimonials
- **resources** - Downloadable content (templates, frameworks, tools)
- **media** - Media library for all uploaded files
- **service_analytics** - Service view tracking with journey
- **article_analytics** - Article engagement metrics
- **page_analytics** - Comprehensive page tracking
- **content_engagement** - Detailed engagement actions
- **tool_interactions** - Interactive tool usage tracking
- **departments** - Team organization structure
- **newsletter_subscribers** - Email list management
- **notification_preferences** - User notification settings

---

## Views

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

### profiles table
```sql
-- Public profiles are viewable
CREATE POLICY "Public profiles are viewable by everyone" ON profiles
  FOR SELECT USING (is_public = true);

-- Users can view own profile
CREATE POLICY "Users can view own profile" ON profiles
  FOR SELECT USING (auth.uid() = id);

-- Users can update own profile
CREATE POLICY "Users can update own profile" ON profiles
  FOR UPDATE USING (auth.uid() = id);

-- Admins can view all profiles
CREATE POLICY "Admins can view all profiles" ON profiles
  FOR SELECT USING (
    EXISTS (
      SELECT 1 FROM profiles 
      WHERE profiles.id = auth.uid() 
      AND profiles.role = 'admin'
    )
  );
```

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
      WHERE profiles.id = auth.uid() 
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
    auth.uid() = author_id OR 
    auth.uid() = ANY(co_authors)
  );

-- Contributors can create articles
CREATE POLICY "Contributors can create articles" ON articles
  FOR INSERT WITH CHECK (
    EXISTS (
      SELECT 1 FROM profiles 
      WHERE profiles.id = auth.uid() 
      AND profiles.role IN ('admin', 'contributor')
    )
  );

-- Authors can update own drafts
CREATE POLICY "Authors can update own drafts" ON articles
  FOR UPDATE USING (
    auth.uid() = author_id AND 
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
  FOR SELECT USING (auth.uid() = user_id);

-- Admins can view all assessments
CREATE POLICY "Admins can view all assessments" ON capability_assessments
  FOR SELECT USING (
    EXISTS (
      SELECT 1 FROM profiles 
      WHERE profiles.id = auth.uid() 
      AND profiles.role = 'admin'
    )
  );
```

---

## Functions & Triggers

### 1. Auto-create profile on signup
```sql
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
```

### 2. Track service views with journey
```sql
CREATE OR REPLACE FUNCTION track_service_view(
  p_service_id UUID,
  p_user_id UUID DEFAULT NULL,
  p_session_id TEXT,
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

### 3. Content approval with notifications
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

### 4. Update timestamp trigger
```sql
CREATE OR REPLACE FUNCTION update_updated_at_column()
RETURNS TRIGGER AS $$
BEGIN
  NEW.updated_at = NOW();
  RETURN NEW;
END;
$$ LANGUAGE plpgsql;

-- Apply to all tables with updated_at
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
```

### 5. Auto-generate slugs
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

### Authentication
```javascript
// Sign up with role
const { data, error } = await supabase.auth.signUp({
  email: 'user@example.com',
  password: 'password',
  options: {
    data: {
      full_name: 'John Doe',
      role: 'contributor'
    }
  }
});

// Sign in
const { data, error } = await supabase.auth.signInWithPassword({
  email: 'user@example.com',
  password: 'password'
});

// Get current user
const { data: { user } } = await supabase.auth.getUser();
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

# Supabase Connection (Public keys - safe for frontend)
VITE_SUPABASE_URL=https://[project-id].supabase.co
VITE_SUPABASE_ANON_KEY=[anon-key]

# Analytics (Optional - frontend tracking)
VITE_GOOGLE_ANALYTICS_ID=[ga-id]
VITE_HOTJAR_ID=[hotjar-id]

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

### Phase 1: Database Setup
- Run complete schema in Supabase
- Set up authentication and roles
- Configure storage buckets
- Test RLS policies
- Create initial admin user

### Phase 2: Data Migration
- Migrate 140 articles to database
- Import team profiles
- Load 31 services with pricing
- Import partnership data
- Set up categories and tags

### Phase 3: API Development
- Service CRUD endpoints
- Article management APIs
- Analytics tracking endpoints
- Assessment APIs
- Notification endpoints

### Phase 4: Frontend Integration
- Connect Articles Hub
- Integrate Capability Universe
- Implement assessment flow
- Add analytics tracking
- Connect team profiles

### Phase 5: Admin Interface
- Content management dashboard
- Approval workflow UI
- Analytics dashboard
- Service management
- Team management

### Phase 6: Testing & Launch
- Performance testing
- Security audit
- SEO verification
- User acceptance testing
- Production deployment

---

## Migration Benefits

### Before (Traditional Setup)
- Manual JWT management
- Complex caching layers
- Limited analytics
- No real-time updates
- Separate file storage
- Multiple service costs

### After (Supabase)
- Sub-second response times
- Automatic JWT handling
- Direct database queries
- Real-time subscriptions
- Integrated storage with CDN
- Auto-scaling infrastructure
- Single platform solution

---

## Support & Resources

- **Supabase Documentation**: https://supabase.com/docs
- **PostgreSQL Documentation**: https://www.postgresql.org/docs/
- **React Integration**: https://supabase.com/docs/guides/getting-started/quickstarts/reactjs
- **Community Discord**: https://discord.supabase.com/
- **Status Page**: https://status.supabase.com/

---

*Last Updated: Septempber 2025*  
*Version: 2.0 - Complete Enhanced Architecture*  
*Platform: Supabase + React + Tailwind CSS*