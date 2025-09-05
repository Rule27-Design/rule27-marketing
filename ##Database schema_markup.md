##Database schema_markup


```sql
create table public.article_analytics (
  id uuid not null default gen_random_uuid (),
  article_id uuid null,
  user_id uuid null,
  session_id text not null,
  time_on_page integer null,
  scroll_depth numeric(5, 2) null,
  clicked_links integer null default 0,
  liked boolean null default false,
  bookmarked boolean null default false,
  shared boolean null default false,
  share_platform text null,
  created_at timestamp with time zone null default now(),
  constraint article_analytics_pkey primary key (id),
  constraint article_analytics_article_id_fkey foreign KEY (article_id) references articles (id) on delete CASCADE,
  constraint article_analytics_user_id_fkey foreign KEY (user_id) references profiles (id)
) TABLESPACE pg_default;

create index IF not exists idx_article_analytics_article on public.article_analytics using btree (article_id) TABLESPACE pg_default;

create index IF not exists idx_article_analytics_session on public.article_analytics using btree (session_id) TABLESPACE pg_default;
```

```sql
create table public.articles (
  id uuid not null default gen_random_uuid (),
  title text not null,
  slug text not null,
  excerpt text null,
  content jsonb not null,
  featured_image text null,
  featured_image_alt text null,
  featured_video text null,
  author_id uuid not null,
  co_authors uuid[] null default '{}'::uuid[],
  category_id uuid null,
  tags text[] null default '{}'::text[],
  status text null default 'draft'::text,
  submitted_for_approval_at timestamp with time zone null,
  approved_by uuid null,
  approved_at timestamp with time zone null,
  published_at timestamp with time zone null,
  scheduled_at timestamp with time zone null,
  read_time integer null,
  is_featured boolean null default false,
  enable_comments boolean null default false,
  enable_reactions boolean null default true,
  view_count integer null default 0,
  unique_view_count integer null default 0,
  like_count integer null default 0,
  share_count integer null default 0,
  bookmark_count integer null default 0,
  average_read_depth numeric(5, 2) null,
  average_time_on_page integer null,
  meta_title text null,
  meta_description text null,
  meta_keywords text[] null,
  og_title text null,
  og_description text null,
  og_image text null,
  twitter_card text null default 'summary_large_image'::text,
  canonical_url text null,
  schema_markup jsonb null,
  internal_notes text null,
  created_at timestamp with time zone null default now(),
  updated_at timestamp with time zone null default now(),
  created_by uuid null,
  updated_by uuid null,
  constraint articles_pkey primary key (id),
  constraint articles_slug_key unique (slug),
  constraint articles_category_id_fkey foreign KEY (category_id) references categories (id),
  constraint articles_created_by_fkey foreign KEY (created_by) references profiles (id),
  constraint articles_updated_by_fkey foreign KEY (updated_by) references profiles (id),
  constraint articles_author_id_fkey foreign KEY (author_id) references profiles (id),
  constraint articles_approved_by_fkey foreign KEY (approved_by) references profiles (id),
  constraint articles_status_check check (
    (
      status = any (
        array[
          'draft'::text,
          'pending_approval'::text,
          'approved'::text,
          'published'::text,
          'archived'::text
        ]
      )
    )
  )
) TABLESPACE pg_default;

create index IF not exists idx_articles_slug on public.articles using btree (slug) TABLESPACE pg_default;

create index IF not exists idx_articles_status_published on public.articles using btree (status, published_at desc) TABLESPACE pg_default
where
  (status = 'published'::text);

create index IF not exists idx_articles_author on public.articles using btree (author_id) TABLESPACE pg_default;

create index IF not exists idx_articles_category on public.articles using btree (category_id) TABLESPACE pg_default;

create index IF not exists idx_articles_featured on public.articles using btree (is_featured) TABLESPACE pg_default
where
  (is_featured = true);

create index IF not exists idx_articles_search on public.articles using gin (
  to_tsvector(
    'english'::regconfig,
    (
      (
        (
          (title || ' '::text) || COALESCE(excerpt, ''::text)
        ) || ' '::text
      ) || COALESCE((content)::text, ''::text)
    )
  )
) TABLESPACE pg_default;

create index IF not exists idx_articles_tags on public.articles using gin (tags) TABLESPACE pg_default;

create trigger approve_article BEFORE
update on articles for EACH row
execute FUNCTION approve_content ();

create trigger update_articles_updated_at BEFORE
update on articles for EACH row
execute FUNCTION update_updated_at_column ();
```

```sql
create table public.awards (
  id uuid not null default gen_random_uuid (),
  title text not null,
  organization text not null,
  year text not null,
  category text not null,
  description text null,
  icon text null,
  color text null,
  sort_order integer null default 0,
  is_active boolean null default true,
  created_at timestamp with time zone null default now(),
  updated_at timestamp with time zone null default now(),
  constraint awards_pkey primary key (id)
) TABLESPACE pg_default;
```

```sql
create table public.capability_assessments (
  id uuid not null default gen_random_uuid (),
  user_id uuid null,
  session_id text null,
  answers jsonb not null,
  recommendations jsonb null,
  score integer null,
  readiness_level text null,
  priority_level text null,
  approach_type text null,
  completed boolean null default false,
  completion_time integer null,
  abandoned_at_step integer null,
  contacted boolean null default false,
  contact_date timestamp with time zone null,
  converted boolean null default false,
  conversion_value numeric(10, 2) null,
  created_at timestamp with time zone null default now(),
  completed_at timestamp with time zone null,
  constraint capability_assessments_pkey primary key (id),
  constraint capability_assessments_user_id_fkey foreign KEY (user_id) references profiles (id)
) TABLESPACE pg_default;
```

```sql
create table public.case_studies (
  id uuid not null default gen_random_uuid (),
  title text not null,
  slug text not null,
  client_name text not null,
  client_logo text null,
  client_website text null,
  industry text not null,
  service_type text not null,
  business_stage text null,
  hero_image text null,
  hero_video text null,
  gallery jsonb null default '[]'::jsonb,
  description text null,
  challenge text null,
  solution text null,
  implementation text null,
  project_duration text null,
  start_date date null,
  end_date date null,
  key_metrics jsonb null default '[]'::jsonb,
  detailed_results jsonb null default '[]'::jsonb,
  process_steps jsonb null default '[]'::jsonb,
  technologies_used text[] null default '{}'::text[],
  deliverables text[] null default '{}'::text[],
  team_members uuid[] null default '{}'::uuid[],
  project_lead uuid null,
  testimonial_id uuid null,
  status text null default 'draft'::text,
  approved_by uuid null,
  approved_at timestamp with time zone null,
  is_featured boolean null default false,
  is_confidential boolean null default false,
  is_active boolean null default true,
  sort_order integer null default 0,
  view_count integer null default 0,
  unique_view_count integer null default 0,
  conversion_count integer null default 0,
  average_time_on_page integer null,
  meta_title text null,
  meta_description text null,
  meta_keywords text[] null,
  og_title text null,
  og_description text null,
  og_image text null,
  schema_markup jsonb null,
  internal_notes text null,
  created_at timestamp with time zone null default now(),
  updated_at timestamp with time zone null default now(),
  created_by uuid null,
  updated_by uuid null,
  constraint case_studies_pkey primary key (id),
  constraint case_studies_slug_key unique (slug),
  constraint case_studies_project_lead_fkey foreign KEY (project_lead) references profiles (id),
  constraint case_studies_updated_by_fkey foreign KEY (updated_by) references profiles (id),
  constraint case_studies_created_by_fkey foreign KEY (created_by) references profiles (id),
  constraint case_studies_approved_by_fkey foreign KEY (approved_by) references profiles (id),
  constraint case_studies_testimonial_id_fkey foreign KEY (testimonial_id) references testimonials (id),
  constraint case_studies_status_check check (
    (
      status = any (
        array[
          'draft'::text,
          'pending_approval'::text,
          'approved'::text,
          'published'::text,
          'archived'::text
        ]
      )
    )
  )
) TABLESPACE pg_default;

create index IF not exists idx_case_studies_slug on public.case_studies using btree (slug) TABLESPACE pg_default;

create index IF not exists idx_case_studies_status on public.case_studies using btree (status) TABLESPACE pg_default;

create index IF not exists idx_case_studies_industry on public.case_studies using btree (industry) TABLESPACE pg_default;

create trigger update_case_studies_updated_at BEFORE
update on case_studies for EACH row
execute FUNCTION update_updated_at_column ();
```

```sql
create table public.categories (
  id uuid not null default gen_random_uuid (),
  name text not null,
  slug text not null,
  description text null,
  parent_id uuid null,
  type text not null,
  icon text null,
  color text null,
  sort_order integer null default 0,
  is_active boolean null default true,
  meta_title text null,
  meta_description text null,
  created_at timestamp with time zone null default now(),
  updated_at timestamp with time zone null default now(),
  constraint categories_pkey primary key (id),
  constraint categories_slug_key unique (slug),
  constraint categories_parent_id_fkey foreign KEY (parent_id) references categories (id)
) TABLESPACE pg_default;

create trigger update_categories_updated_at BEFORE
update on categories for EACH row
execute FUNCTION update_updated_at_column ();
```

```sql
create table public.certifications (
  id uuid not null default gen_random_uuid (),
  name text not null,
  provider text not null,
  category text null,
  icon text null,
  badge_url text null,
  verification_url text null,
  issued_date date null,
  expiry_date date null,
  profile_id uuid null,
  sort_order integer null default 0,
  is_active boolean null default true,
  created_at timestamp with time zone null default now(),
  updated_at timestamp with time zone null default now(),
  constraint certifications_pkey primary key (id),
  constraint certifications_profile_id_fkey foreign KEY (profile_id) references profiles (id)
) TABLESPACE pg_default;
```

```sql
create table public.company_milestones (
  id uuid not null default gen_random_uuid (),
  year text not null,
  title text not null,
  description text null,
  icon text null,
  color text null,
  sort_order integer null default 0,
  is_featured boolean null default false,
  created_at timestamp with time zone null default now(),
  updated_at timestamp with time zone null default now(),
  constraint company_milestones_pkey primary key (id)
) TABLESPACE pg_default;
```

```sql
create table public.contact_submissions (
  id uuid not null default gen_random_uuid (),
  name text not null,
  email text not null,
  company text null,
  company_size text null,
  phone text null,
  website text null,
  project_type text null,
  services_needed text[] null default '{}'::text[],
  budget_range text null,
  timeline text null,
  message text null,
  source_page text null,
  source_campaign text null,
  referrer text null,
  utm_source text null,
  utm_medium text null,
  utm_campaign text null,
  utm_term text null,
  utm_content text null,
  lead_score integer null,
  lead_temperature text null,
  lead_status text null default 'new'::text,
  assigned_to uuid null,
  first_contact_date timestamp with time zone null,
  last_contact_date timestamp with time zone null,
  next_follow_up timestamp with time zone null,
  email_sent boolean null default false,
  email_sent_at timestamp with time zone null,
  email_opened boolean null default false,
  email_opened_at timestamp with time zone null,
  notes text null,
  rejection_reason text null,
  won_value numeric(10, 2) null,
  created_at timestamp with time zone null default now(),
  updated_at timestamp with time zone null default now(),
  constraint contact_submissions_pkey primary key (id),
  constraint contact_submissions_assigned_to_fkey foreign KEY (assigned_to) references profiles (id),
  constraint contact_submissions_lead_temperature_check check (
    (
      lead_temperature = any (array['cold'::text, 'warm'::text, 'hot'::text])
    )
  )
) TABLESPACE pg_default;

create index IF not exists idx_contact_submissions_email on public.contact_submissions using btree (email) TABLESPACE pg_default;

create index IF not exists idx_contact_submissions_status on public.contact_submissions using btree (lead_status) TABLESPACE pg_default;

create index IF not exists idx_contact_submissions_created on public.contact_submissions using btree (created_at desc) TABLESPACE pg_default;

create trigger update_contact_submissions_updated_at BEFORE
update on contact_submissions for EACH row
execute FUNCTION update_updated_at_column ();
```

```sql
create table public.content_engagement (
  id uuid not null default gen_random_uuid (),
  user_id uuid null,
  content_type text not null,
  content_id uuid not null,
  action text not null,
  action_metadata jsonb null,
  session_id text null,
  source text null,
  created_at timestamp with time zone null default now(),
  constraint content_engagement_pkey primary key (id),
  constraint content_engagement_user_id_content_type_content_id_action_key unique (user_id, content_type, content_id, action),
  constraint content_engagement_user_id_fkey foreign KEY (user_id) references profiles (id)
) TABLESPACE pg_default;
```

```sql
create table public.core_values (
  id uuid not null default gen_random_uuid (),
  title text not null,
  description text null,
  icon text null,
  color text null,
  examples text[] null default '{}'::text[],
  sort_order integer null default 0,
  is_active boolean null default true,
  created_at timestamp with time zone null default now(),
  updated_at timestamp with time zone null default now(),
  constraint core_values_pkey primary key (id)
) TABLESPACE pg_default;
```

```sql
create table public.culture_media (
  id uuid not null default gen_random_uuid (),
  title text not null,
  description text null,
  details text null,
  category text null,
  type text null default 'image'::text,
  image_url text null,
  icon text null,
  color text null,
  sort_order integer null default 0,
  is_active boolean null default true,
  created_at timestamp with time zone null default now(),
  updated_at timestamp with time zone null default now(),
  constraint culture_media_pkey primary key (id)
) TABLESPACE pg_default;
```

```sql
create table public.departments (
  id uuid not null default gen_random_uuid (),
  name text not null,
  slug text not null,
  description text null,
  icon text null,
  color text null,
  sort_order integer null default 0,
  is_active boolean null default true,
  created_at timestamp with time zone null default now(),
  constraint departments_pkey primary key (id),
  constraint departments_name_key unique (name),
  constraint departments_slug_key unique (slug)
) TABLESPACE pg_default;
```

```sql
create table public.email_notifications (
  id uuid not null default gen_random_uuid (),
  recipient_email text not null,
  recipient_id uuid null,
  subject text not null,
  template text not null,
  data jsonb null,
  status text null default 'pending'::text,
  sent_at timestamp with time zone null,
  error_message text null,
  opened boolean null default false,
  opened_at timestamp with time zone null,
  clicked boolean null default false,
  clicked_at timestamp with time zone null,
  created_at timestamp with time zone null default now(),
  constraint email_notifications_pkey primary key (id),
  constraint email_notifications_recipient_id_fkey foreign KEY (recipient_id) references profiles (id),
  constraint email_notifications_status_check check (
    (
      status = any (
        array[
          'pending'::text,
          'sent'::text,
          'failed'::text,
          'cancelled'::text
        ]
      )
    )
  )
) TABLESPACE pg_default;

create index IF not exists idx_email_notifications_status on public.email_notifications using btree (status) TABLESPACE pg_default;

create index IF not exists idx_email_notifications_recipient on public.email_notifications using btree (recipient_id) TABLESPACE pg_default;
```

```sql
create table public.media (
  id uuid not null default gen_random_uuid (),
  file_name text not null,
  original_name text null,
  file_url text not null,
  file_path text not null,
  file_type text not null,
  mime_type text null,
  file_size bigint null,
  width integer null,
  height integer null,
  duration integer null,
  thumbnail_url text null,
  thumbnails jsonb null,
  alt_text text null,
  caption text null,
  description text null,
  tags text[] null default '{}'::text[],
  folder text null default '/'::text,
  is_public boolean null default true,
  usage_count integer null default 0,
  last_used_at timestamp with time zone null,
  uploaded_by uuid null,
  created_at timestamp with time zone null default now(),
  updated_at timestamp with time zone null default now(),
  constraint media_pkey primary key (id),
  constraint media_uploaded_by_fkey foreign KEY (uploaded_by) references profiles (id)
) TABLESPACE pg_default;

create trigger update_media_updated_at BEFORE
update on media for EACH row
execute FUNCTION update_updated_at_column ();
```

```sql
create table public.methodology_phases (
  id uuid not null default gen_random_uuid (),
  phase text not null,
  subtitle text null,
  phase_number integer not null,
  icon text null,
  color text null,
  duration text null,
  deliverables text[] null default '{}'::text[],
  collaboration text null,
  sort_order integer null default 0,
  is_active boolean null default true,
  created_at timestamp with time zone null default now(),
  updated_at timestamp with time zone null default now(),
  constraint methodology_phases_pkey primary key (id)
) TABLESPACE pg_default;
```

```sql
create table public.methodology_steps (
  id uuid not null default gen_random_uuid (),
  phase_id uuid null,
  title text not null,
  description text null,
  tools text[] null default '{}'::text[],
  sort_order integer null default 0,
  created_at timestamp with time zone null default now(),
  constraint methodology_steps_pkey primary key (id),
  constraint methodology_steps_phase_id_fkey foreign KEY (phase_id) references methodology_phases (id) on delete CASCADE
) TABLESPACE pg_default;
```

```sql
create table public.newsletter_subscribers (
  id uuid not null default gen_random_uuid (),
  email text not null,
  name text null,
  company text null,
  status text null default 'pending'::text,
  confirmation_token text null,
  confirmed_at timestamp with time zone null,
  unsubscribed_at timestamp with time zone null,
  frequency text null default 'weekly'::text,
  topics text[] null default '{}'::text[],
  source text null,
  source_page text null,
  utm_source text null,
  utm_medium text null,
  utm_campaign text null,
  emails_sent integer null default 0,
  emails_opened integer null default 0,
  emails_clicked integer null default 0,
  last_email_sent timestamp with time zone null,
  last_email_opened timestamp with time zone null,
  tags text[] null default '{}'::text[],
  lead_score integer null,
  customer_status text null,
  created_at timestamp with time zone null default now(),
  updated_at timestamp with time zone null default now(),
  constraint newsletter_subscribers_pkey primary key (id),
  constraint newsletter_subscribers_confirmation_token_key unique (confirmation_token),
  constraint newsletter_subscribers_email_key unique (email),
  constraint newsletter_subscribers_status_check check (
    (
      status = any (
        array[
          'pending'::text,
          'confirmed'::text,
          'unsubscribed'::text,
          'bounced'::text,
          'complained'::text
        ]
      )
    )
  )
) TABLESPACE pg_default;

create trigger update_newsletter_subscribers_updated_at BEFORE
update on newsletter_subscribers for EACH row
execute FUNCTION update_updated_at_column ();
```

```sql
create table public.notification_preferences (
  id uuid not null default gen_random_uuid (),
  user_id uuid null,
  new_leads boolean null default true,
  assessment_completions boolean null default true,
  content_approvals boolean null default false,
  weekly_analytics boolean null default true,
  created_at timestamp with time zone null default now(),
  updated_at timestamp with time zone null default now(),
  constraint notification_preferences_pkey primary key (id),
  constraint notification_preferences_user_id_key unique (user_id),
  constraint notification_preferences_user_id_fkey foreign KEY (user_id) references profiles (id)
) TABLESPACE pg_default;

create trigger update_notification_preferences_updated_at BEFORE
update on notification_preferences for EACH row
execute FUNCTION update_updated_at_column ();
```

```sql
create table public.office_perks (
  id uuid not null default gen_random_uuid (),
  icon text null,
  title text not null,
  description text null,
  sort_order integer null default 0,
  is_active boolean null default true,
  created_at timestamp with time zone null default now(),
  constraint office_perks_pkey primary key (id)
) TABLESPACE pg_default;
```

```sql
create table public.page_analytics (
  id uuid not null default gen_random_uuid (),
  page_path text not null,
  page_title text null,
  page_type text null,
  user_id uuid null,
  session_id text not null,
  utm_source text null,
  utm_medium text null,
  utm_campaign text null,
  utm_term text null,
  utm_content text null,
  referrer_url text null,
  referrer_domain text null,
  ip_address inet null,
  user_agent text null,
  browser text null,
  browser_version text null,
  os text null,
  device_type text null,
  screen_resolution text null,
  viewport_size text null,
  country text null,
  region text null,
  city text null,
  time_on_page integer null,
  scroll_depth numeric(5, 2) null,
  clicks integer null default 0,
  interactions jsonb null default '[]'::jsonb,
  bounce boolean null default false,
  exit_page boolean null default false,
  created_at timestamp with time zone null default now(),
  constraint page_analytics_pkey primary key (id),
  constraint page_analytics_user_id_fkey foreign KEY (user_id) references profiles (id)
) TABLESPACE pg_default;
```

```sql
create table public.partnerships (
  id uuid not null default gen_random_uuid (),
  slug text not null,
  name text not null,
  category text null,
  icon text null,
  color text null,
  description text null,
  services text[] null default '{}'::text[],
  certification_count integer null default 0,
  project_count integer null default 0,
  benefits text[] null default '{}'::text[],
  features jsonb null default '[]'::jsonb,
  is_active boolean null default true,
  is_featured boolean null default false,
  sort_order integer null default 0,
  created_at timestamp with time zone null default now(),
  updated_at timestamp with time zone null default now(),
  constraint partnerships_pkey primary key (id),
  constraint partnerships_slug_key unique (slug)
) TABLESPACE pg_default;

create trigger update_partnerships_updated_at BEFORE
update on partnerships for EACH row
execute FUNCTION update_updated_at_column ();
```

```sql
create table public.platform_certifications (
  id uuid not null default gen_random_uuid (),
  platform text not null,
  certification_name text not null,
  icon text null,
  color text null,
  category text null,
  sort_order integer null default 0,
  is_active boolean null default true,
  created_at timestamp with time zone null default now(),
  constraint platform_certifications_pkey primary key (id)
) TABLESPACE pg_default;
```

```sql
create table public.profiles (
  id uuid not null default gen_random_uuid (),
  email text not null,
  full_name text not null,
  display_name text null,
  avatar_url text null,
  bio text null,
  role text not null default 'standard'::text,
  is_public boolean null default false,
  is_active boolean null default true,
  department text[] null default '{}'::text[],
  expertise text[] null default '{}'::text[],
  job_title text null,
  linkedin_url text null,
  twitter_url text null,
  github_url text null,
  sort_order integer null default 0,
  created_at timestamp with time zone null default now(),
  updated_at timestamp with time zone null default now(),
  auth_user_id uuid null,
  constraint profiles_pkey primary key (id),
  constraint profiles_auth_user_id_key unique (auth_user_id),
  constraint profiles_email_key unique (email),
  constraint profiles_auth_user_id_fkey foreign KEY (auth_user_id) references auth.users (id) on delete CASCADE,
  constraint profiles_role_check check (
    (
      role = any (
        array[
          'admin'::text,
          'contributor'::text,
          'standard'::text
        ]
      )
    )
  )
) TABLESPACE pg_default;

create trigger update_profiles_updated_at BEFORE
update on profiles for EACH row
execute FUNCTION update_updated_at_column ();
```

```sql
create table public.resources (
  id uuid not null default gen_random_uuid (),
  title text not null,
  slug text not null,
  description text null,
  long_description text null,
  type text not null,
  category text not null,
  format text null,
  file_url text null,
  file_size text null,
  preview_image text null,
  preview_url text null,
  access_type text null default 'free'::text,
  price numeric(10, 2) null,
  currency text null default 'USD'::text,
  tags text[] null default '{}'::text[],
  prerequisites text[] null default '{}'::text[],
  learning_outcomes text[] null default '{}'::text[],
  is_featured boolean null default false,
  status text null default 'draft'::text,
  download_count integer null default 0,
  unique_download_count integer null default 0,
  view_count integer null default 0,
  rating numeric(3, 2) null,
  rating_count integer null default 0,
  meta_title text null,
  meta_description text null,
  og_image text null,
  created_at timestamp with time zone null default now(),
  updated_at timestamp with time zone null default now(),
  created_by uuid null,
  updated_by uuid null,
  constraint resources_pkey primary key (id),
  constraint resources_slug_key unique (slug),
  constraint resources_created_by_fkey foreign KEY (created_by) references profiles (id),
  constraint resources_updated_by_fkey foreign KEY (updated_by) references profiles (id),
  constraint resources_access_type_check check (
    (
      access_type = any (
        array['free'::text, 'premium'::text, 'gated'::text]
      )
    )
  ),
  constraint resources_status_check check (
    (
      status = any (
        array[
          'draft'::text,
          'published'::text,
          'archived'::text
        ]
      )
    )
  )
) TABLESPACE pg_default;

create trigger update_resources_updated_at BEFORE
update on resources for EACH row
execute FUNCTION update_updated_at_column ();
```

```sql
create table public.service_analytics (
  id uuid not null default gen_random_uuid (),
  service_id uuid null,
  user_id uuid null,
  session_id text not null,
  view_duration integer null,
  scroll_depth numeric(5, 2) null,
  clicked_cta boolean null default false,
  referrer_service_id uuid null,
  next_service_id uuid null,
  device_type text null,
  browser text null,
  country text null,
  created_at timestamp with time zone null default now(),
  constraint service_analytics_pkey primary key (id),
  constraint service_analytics_next_service_id_fkey foreign KEY (next_service_id) references services (id),
  constraint service_analytics_referrer_service_id_fkey foreign KEY (referrer_service_id) references services (id),
  constraint service_analytics_service_id_fkey foreign KEY (service_id) references services (id),
  constraint service_analytics_user_id_fkey foreign KEY (user_id) references profiles (id)
) TABLESPACE pg_default;

create index IF not exists idx_service_analytics_service on public.service_analytics using btree (service_id) TABLESPACE pg_default;

create index IF not exists idx_service_analytics_session on public.service_analytics using btree (session_id) TABLESPACE pg_default;

create index IF not exists idx_service_analytics_created on public.service_analytics using btree (created_at desc) TABLESPACE pg_default;
```

```sql
create table public.service_zones (
  id uuid not null default gen_random_uuid (),
  slug text not null,
  title text not null,
  icon text null,
  description text null,
  service_count integer null default 0,
  key_services text[] null default '{}'::text[],
  stats jsonb null default '{"projects": 0, "satisfaction": 0}'::jsonb,
  sort_order integer null default 0,
  is_active boolean null default true,
  created_at timestamp with time zone null default now(),
  updated_at timestamp with time zone null default now(),
  constraint service_zones_pkey primary key (id),
  constraint service_zones_slug_key unique (slug)
) TABLESPACE pg_default;

create index IF not exists idx_service_zones_slug on public.service_zones using btree (slug) TABLESPACE pg_default;

create trigger update_service_zones_updated_at BEFORE
update on service_zones for EACH row
execute FUNCTION update_updated_at_column ();
```

```sql
create table public.services (
  id uuid not null default gen_random_uuid (),
  slug text not null,
  title text not null,
  category text not null,
  zone_id uuid null,
  icon text null,
  description text null,
  full_description text null,
  features text[] null default '{}'::text[],
  technologies text[] null default '{}'::text[],
  process_steps jsonb null default '[]'::jsonb,
  expected_results jsonb null default '[]'::jsonb,
  pricing_tiers jsonb null default '[]'::jsonb,
  view_count integer null default 0,
  unique_view_count integer null default 0,
  inquiry_count integer null default 0,
  is_active boolean null default true,
  is_featured boolean null default false,
  meta_title text null,
  meta_description text null,
  created_at timestamp with time zone null default now(),
  updated_at timestamp with time zone null default now(),
  created_by uuid null,
  updated_by uuid null,
  constraint services_pkey primary key (id),
  constraint services_slug_key unique (slug),
  constraint services_created_by_fkey foreign KEY (created_by) references profiles (id),
  constraint services_updated_by_fkey foreign KEY (updated_by) references profiles (id),
  constraint services_zone_id_fkey foreign KEY (zone_id) references service_zones (id)
) TABLESPACE pg_default;

create index IF not exists idx_services_zone on public.services using btree (zone_id) TABLESPACE pg_default;

create index IF not exists idx_services_slug on public.services using btree (slug) TABLESPACE pg_default;

create index IF not exists idx_services_active on public.services using btree (is_active) TABLESPACE pg_default
where
  (is_active = true);

create index IF not exists idx_services_featured on public.services using btree (is_featured) TABLESPACE pg_default
where
  (is_featured = true);

create index IF not exists idx_services_search on public.services using gin (
  to_tsvector(
    'english'::regconfig,
    (
      (
        (
          (title || ' '::text) || COALESCE(description, ''::text)
        ) || ' '::text
      ) || COALESCE(full_description, ''::text)
    )
  )
) TABLESPACE pg_default;

create index IF not exists idx_services_features on public.services using gin (features) TABLESPACE pg_default;

create index IF not exists idx_services_technologies on public.services using gin (technologies) TABLESPACE pg_default;

create index IF not exists idx_services_zone_id on public.services using btree (zone_id) TABLESPACE pg_default;

create index IF not exists idx_services_category on public.services using btree (category) TABLESPACE pg_default;

create index IF not exists idx_services_is_active on public.services using btree (is_active) TABLESPACE pg_default;

create index IF not exists idx_services_is_featured on public.services using btree (is_featured) TABLESPACE pg_default;

create trigger update_services_updated_at BEFORE
update on services for EACH row
execute FUNCTION update_updated_at_column ();
```

```sql
create table public.tags (
  id uuid not null default gen_random_uuid (),
  name text not null,
  slug text not null,
  type text null,
  description text null,
  usage_count integer null default 0,
  is_active boolean null default true,
  created_at timestamp with time zone null default now(),
  constraint tags_pkey primary key (id),
  constraint tags_slug_key unique (slug)
) TABLESPACE pg_default;
```

```sql
create table public.testimonials (
  id uuid not null default gen_random_uuid (),
  client_name text not null,
  client_title text null,
  client_company text null,
  client_avatar text null,
  client_logo text null,
  quote text not null,
  long_quote text null,
  rating integer null,
  video_url text null,
  video_thumbnail text null,
  is_featured boolean null default false,
  display_locations text[] null default '{}'::text[],
  industry text null,
  service_type text null,
  project_value text null,
  sort_order integer null default 0,
  status text null default 'published'::text,
  created_at timestamp with time zone null default now(),
  updated_at timestamp with time zone null default now(),
  constraint testimonials_pkey primary key (id),
  constraint testimonials_rating_check check (
    (
      (rating >= 1)
      and (rating <= 5)
    )
  ),
  constraint testimonials_status_check check (
    (
      status = any (
        array[
          'draft'::text,
          'published'::text,
          'archived'::text
        ]
      )
    )
  )
) TABLESPACE pg_default;

create trigger update_testimonials_updated_at BEFORE
update on testimonials for EACH row
execute FUNCTION update_updated_at_column ();
```

```sql
create table public.tool_interactions (
  id uuid not null default gen_random_uuid (),
  user_id uuid null,
  session_id text not null,
  tool_name text not null,
  input_data jsonb not null,
  results jsonb not null,
  shared_url text null,
  is_shared boolean null default false,
  converted_to_contact boolean null default false,
  converted_to_signup boolean null default false,
  time_spent integer null,
  completion_rate numeric(5, 2) null,
  created_at timestamp with time zone null default now(),
  constraint tool_interactions_pkey primary key (id),
  constraint tool_interactions_shared_url_key unique (shared_url),
  constraint tool_interactions_user_id_fkey foreign KEY (user_id) references profiles (id)
) TABLESPACE pg_default;
```

```sql
create table public.user_journeys (
  id uuid not null default gen_random_uuid (),
  session_id text not null,
  user_id uuid null,
  journey_path jsonb null default '[]'::jsonb,
  total_duration integer null,
  conversion_event text null,
  conversion_value numeric(10, 2) null,
  utm_source text null,
  utm_medium text null,
  utm_campaign text null,
  created_at timestamp with time zone null default now(),
  updated_at timestamp with time zone null default now(),
  constraint user_journeys_pkey primary key (id),
  constraint user_journeys_user_id_fkey foreign KEY (user_id) references profiles (id)
) TABLESPACE pg_default;

create index IF not exists idx_user_journeys_session on public.user_journeys using btree (session_id) TABLESPACE pg_default;

create index IF not exists idx_user_journeys_user on public.user_journeys using btree (user_id) TABLESPACE pg_default;

create trigger update_user_journeys_updated_at BEFORE
update on user_journeys for EACH row
execute FUNCTION update_updated_at_column ();
```
