import React, { useState, useEffect, useCallback, useMemo } from 'react';
import { motion } from 'framer-motion';
import { Helmet } from 'react-helmet';
import { useNavigate } from 'react-router-dom';
import Header from '../../components/ui/Header';
import Footer from '../../components/ui/Footer';
import Icon from '../../components/AppIcon';
import Button from '../../components/ui/Button';
import ServiceZoneCard from './components/ServiceZoneCard';
import CapabilityFilter from './components/CapabilityFilter';
import ServiceDetailModal from './components/ServiceDetailModal';
import InteractiveDemo from './components/InteractiveDemo';
import CapabilityAssessment from './components/CapabilityAssessment';

const CapabilityUniverse = () => {
  const navigate = useNavigate();
  const [activeZone, setActiveZone] = useState('creative-studio');
  const [selectedService, setSelectedService] = useState(null);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [activeCategory, setActiveCategory] = useState('all');
  const [searchTerm, setSearchTerm] = useState('');
  const [filteredServices, setFilteredServices] = useState([]);

  // Scroll to top on mount
  useEffect(() => {
    window.scrollTo(0, 0);
  }, []);

  // Complete detailed services data with all 30 services
  const detailedServices = useMemo(() => [
    // CREATIVE STUDIO SERVICES (5 services)
    {
      id: 'graphic-design',
      title: 'Graphic Design',
      category: 'Creative Studio',
      zone: 'creative-studio',
      icon: 'Palette',
      description: 'Stunning visual designs that communicate your brand message effectively',
      fullDescription: `Our graphic design service delivers exceptional visual communications that elevate your brand presence across all touchpoints. From print to digital, we create designs that captivate audiences and drive engagement.\n\nWe combine artistic creativity with strategic thinking to ensure every design element serves a purpose and reinforces your brand identity.`,
      features: [
        'Logo and brand identity design',
        'Marketing collateral design',
        'Print design and production',
        'Digital graphics and assets',
        'Packaging design',
        'Environmental graphics'
      ],
      technologies: ['Adobe Creative Suite', 'Figma', 'Sketch', 'Illustrator', 'Photoshop'],
      process: [
        { title: 'Design Brief', description: 'Understanding your vision and requirements', duration: '2-3 days' },
        { title: 'Concept Development', description: 'Creating initial design concepts', duration: '1 week' },
        { title: 'Design Refinement', description: 'Refining chosen concepts based on feedback', duration: '1 week' },
        { title: 'Final Delivery', description: 'Delivering production-ready files', duration: '2-3 days' }
      ],
      expectedResults: [
        { metric: '45%', description: 'Increase in brand recognition' },
        { metric: '30%', description: 'Improvement in engagement' },
        { metric: '50%', description: 'Enhanced visual consistency' }
      ],
      pricingTiers: [
        { name: 'Basic', price: '$2,500', billing: 'Per project', features: ['5 design concepts', '2 revisions', 'Digital files only'], popular: false },
        { name: 'Professional', price: '$5,000', billing: 'Per project', features: ['10 design concepts', '5 revisions', 'Print + digital files'], popular: true },
        { name: 'Enterprise', price: '$10,000+', billing: 'Per project', features: ['Unlimited concepts', 'Unlimited revisions', 'Full brand package'], popular: false }
      ]
    },
    {
      id: 'motion-graphics',
      title: 'Motion Graphics',
      category: 'Creative Studio',
      zone: 'creative-studio',
      icon: 'Video',
      description: 'Dynamic animated content that brings your brand to life',
      fullDescription: `Our motion graphics service creates engaging animated content that captures attention and communicates complex messages with clarity and impact.\n\nFrom explainer videos to social media animations, we deliver motion graphics that enhance your digital presence and drive engagement.`,
      features: [
        'Animated logos and intros',
        'Explainer videos',
        'Social media animations',
        'Infographic animations',
        'UI/UX animations',
        'Video effects and transitions'
      ],
      technologies: ['After Effects', 'Cinema 4D', 'Premiere Pro', 'Lottie', 'Blender'],
      process: [
        { title: 'Script & Storyboard', description: 'Planning the narrative and visual flow', duration: '1 week' },
        { title: 'Design & Animation', description: 'Creating and animating graphics', duration: '2-3 weeks' },
        { title: 'Sound Design', description: 'Adding audio and effects', duration: '3-5 days' },
        { title: 'Final Rendering', description: 'Producing final video files', duration: '2-3 days' }
      ],
      expectedResults: [
        { metric: '300%', description: 'Increase in engagement' },
        { metric: '85%', description: 'Message retention rate' },
        { metric: '200%', description: 'Social media shares' }
      ],
      pricingTiers: [
        { name: 'Basic', price: '$3,000', billing: 'Per video', features: ['30-second animation', '2 revisions', 'HD quality'], popular: false },
        { name: 'Professional', price: '$7,500', billing: 'Per video', features: ['60-second animation', '5 revisions', '4K quality'], popular: true },
        { name: 'Premium', price: '$15,000+', billing: 'Per video', features: ['2+ minute animation', 'Unlimited revisions', 'Cinema quality'], popular: false }
      ]
    },
    {
      id: 'videography',
      title: 'Videography',
      category: 'Creative Studio',
      zone: 'creative-studio',
      icon: 'Film',
      description: 'Professional video production that tells your brand story',
      fullDescription: `Our videography service delivers high-quality video content that captures your brand essence and connects with your audience on an emotional level.\n\nFrom corporate videos to product demonstrations, we handle every aspect of production to ensure your message is delivered with impact.`,
      features: [
        'Corporate video production',
        'Product demonstrations',
        'Event coverage',
        'Testimonial videos',
        'Documentary-style content',
        'Aerial videography'
      ],
      technologies: ['RED cameras', 'DaVinci Resolve', 'Adobe Premiere', 'Final Cut Pro', 'Drone technology'],
      process: [
        { title: 'Pre-production', description: 'Planning, scripting, and location scouting', duration: '1 week' },
        { title: 'Production', description: 'Filming and capturing footage', duration: '1-3 days' },
        { title: 'Post-production', description: 'Editing, color grading, and effects', duration: '1-2 weeks' },
        { title: 'Delivery', description: 'Final video in multiple formats', duration: '2-3 days' }
      ],
      expectedResults: [
        { metric: '400%', description: 'Increase in engagement' },
        { metric: '75%', description: 'Viewer retention rate' },
        { metric: '150%', description: 'Conversion improvement' }
      ],
      pricingTiers: [
        { name: 'Basic', price: '$5,000', billing: 'Per day', features: ['Half-day shoot', 'Basic editing', '1 location'], popular: false },
        { name: 'Professional', price: '$10,000', billing: 'Per day', features: ['Full-day shoot', 'Advanced editing', 'Multiple locations'], popular: true },
        { name: 'Premium', price: '$20,000+', billing: 'Per project', features: ['Multi-day shoot', 'Cinema production', 'Full crew'], popular: false }
      ]
    },
    {
      id: 'photography',
      title: 'Photography',
      category: 'Creative Studio',
      zone: 'creative-studio',
      icon: 'Camera',
      description: 'Professional photography that captures your brand essence',
      fullDescription: `Our photography service provides stunning visual assets that showcase your products, services, and brand personality with professional quality and artistic vision.\n\nFrom product shoots to corporate headshots, we deliver images that elevate your brand presence.`,
      features: [
        'Product photography',
        'Corporate headshots',
        'Event photography',
        'Architectural photography',
        'Lifestyle photography',
        'Photo retouching and editing'
      ],
      technologies: ['Canon/Nikon DSLRs', 'Lightroom', 'Photoshop', 'Capture One', 'Studio lighting'],
      process: [
        { title: 'Planning', description: 'Shot list and location planning', duration: '2-3 days' },
        { title: 'Photo Shoot', description: 'Professional photography session', duration: '1-2 days' },
        { title: 'Post-Processing', description: 'Editing and retouching', duration: '3-5 days' },
        { title: 'Delivery', description: 'High-resolution image files', duration: '1-2 days' }
      ],
      expectedResults: [
        { metric: '200%', description: 'Increase in engagement' },
        { metric: '40%', description: 'Improved conversion rates' },
        { metric: '90%', description: 'Brand consistency' }
      ],
      pricingTiers: [
        { name: 'Basic', price: '$1,500', billing: 'Per session', features: ['2-hour shoot', '20 edited images', 'Digital delivery'], popular: false },
        { name: 'Professional', price: '$3,500', billing: 'Per day', features: ['Full-day shoot', '50 edited images', 'Print rights included'], popular: true },
        { name: 'Premium', price: '$7,500+', billing: 'Per project', features: ['Multi-day shoot', 'Unlimited images', 'Full production'], popular: false }
      ]
    },
    {
      id: 'content-writing',
      title: 'Content Writing',
      category: 'Creative Studio',
      zone: 'creative-studio',
      icon: 'Edit',
      description: 'Compelling content that engages and converts your audience',
      fullDescription: `Our content writing service creates persuasive, SEO-optimized content that speaks directly to your target audience and drives meaningful engagement.\n\nFrom website copy to blog posts, we deliver content that informs, entertains, and converts.`,
      features: [
        'Website copywriting',
        'Blog posts and articles',
        'Email marketing content',
        'Social media content',
        'White papers and case studies',
        'SEO optimization'
      ],
      technologies: ['Grammarly', 'SEMrush', 'Yoast SEO', 'Hemingway Editor', 'Content management systems'],
      process: [
        { title: 'Research', description: 'Topic research and keyword analysis', duration: '2-3 days' },
        { title: 'Content Creation', description: 'Writing and initial draft', duration: '1 week' },
        { title: 'Editing & Optimization', description: 'Refining and SEO optimization', duration: '2-3 days' },
        { title: 'Final Delivery', description: 'Publishing-ready content', duration: '1 day' }
      ],
      expectedResults: [
        { metric: '150%', description: 'Increase in organic traffic' },
        { metric: '60%', description: 'Improved engagement' },
        { metric: '35%', description: 'Higher conversion rates' }
      ],
      pricingTiers: [
        { name: 'Basic', price: '$500', billing: 'Per piece', features: ['500-1000 words', '1 revision', 'Basic SEO'], popular: false },
        { name: 'Professional', price: '$1,500', billing: 'Per piece', features: ['1500-2500 words', '3 revisions', 'Advanced SEO'], popular: true },
        { name: 'Premium', price: '$3,000+', billing: 'Per piece', features: ['Long-form content', 'Unlimited revisions', 'Full optimization'], popular: false }
      ]
    },

    // DIGITAL MARKETING COMMAND SERVICES (8 services)
    {
      id: 'seo',
      title: 'SEO Services',
      category: 'Digital Marketing Command',
      zone: 'marketing-command',
      icon: 'Search',
      description: 'Comprehensive SEO strategies that improve your search rankings',
      fullDescription: `Our SEO service implements proven strategies to improve your website's visibility in search engines and drive qualified organic traffic to your business.\n\nWe combine technical optimization, content strategy, and link building to achieve sustainable ranking improvements.`,
      features: [
        'Technical SEO audit',
        'Keyword research and strategy',
        'On-page optimization',
        'Link building campaigns',
        'Content optimization',
        'Local SEO'
      ],
      technologies: ['Google Search Console', 'SEMrush', 'Ahrefs', 'Screaming Frog', 'Moz Pro'],
      process: [
        { title: 'SEO Audit', description: 'Comprehensive site analysis', duration: '1 week' },
        { title: 'Strategy Development', description: 'Creating optimization roadmap', duration: '3-5 days' },
        { title: 'Implementation', description: 'Executing SEO improvements', duration: 'Ongoing' },
        { title: 'Monitoring & Reporting', description: 'Tracking progress and adjusting', duration: 'Monthly' }
      ],
      expectedResults: [
        { metric: '200%', description: 'Increase in organic traffic' },
        { metric: '50%', description: 'Improvement in rankings' },
        { metric: '150%', description: 'More qualified leads' }
      ],
      pricingTiers: [
        { name: 'Starter', price: '$2,500', billing: 'Per month', features: ['10 keywords', 'Monthly reporting', 'Basic optimization'], popular: false },
        { name: 'Growth', price: '$5,000', billing: 'Per month', features: ['25 keywords', 'Bi-weekly reporting', 'Advanced optimization'], popular: true },
        { name: 'Enterprise', price: '$10,000+', billing: 'Per month', features: ['Unlimited keywords', 'Weekly reporting', 'Full SEO management'], popular: false }
      ]
    },
    {
      id: 'sem',
      title: 'SEM Services',
      category: 'Digital Marketing Command',
      zone: 'marketing-command',
      icon: 'DollarSign',
      description: 'Strategic paid search campaigns that drive immediate results',
      fullDescription: `Our SEM service creates and manages high-performing paid search campaigns that deliver immediate visibility and drive qualified traffic to your website.\n\nWe optimize every aspect of your campaigns to maximize ROI and minimize wasted spend.`,
      features: [
        'Google Ads management',
        'Bing Ads campaigns',
        'Shopping campaigns',
        'Display advertising',
        'Remarketing campaigns',
        'Ad copy optimization'
      ],
      technologies: ['Google Ads', 'Microsoft Ads', 'Google Analytics', 'Data Studio', 'Optmyzr'],
      process: [
        { title: 'Account Audit', description: 'Analyzing current performance', duration: '2-3 days' },
        { title: 'Campaign Setup', description: 'Creating optimized campaigns', duration: '1 week' },
        { title: 'Launch & Optimize', description: 'Running and refining campaigns', duration: 'Ongoing' },
        { title: 'Reporting', description: 'Performance analysis and insights', duration: 'Weekly' }
      ],
      expectedResults: [
        { metric: '300%', description: 'Return on ad spend' },
        { metric: '40%', description: 'Reduction in CPC' },
        { metric: '200%', description: 'Increase in conversions' }
      ],
      pricingTiers: [
        { name: 'Starter', price: '$1,500', billing: 'Per month', features: ['$5k ad spend', '2 campaigns', 'Monthly optimization'], popular: false },
        { name: 'Growth', price: '$3,000', billing: 'Per month', features: ['$15k ad spend', '5 campaigns', 'Weekly optimization'], popular: true },
        { name: 'Scale', price: '$5,000+', billing: 'Per month', features: ['Unlimited ad spend', 'Unlimited campaigns', 'Daily optimization'], popular: false }
      ]
    },
    {
      id: 'social-media-marketing',
      title: 'Social Media Marketing',
      category: 'Digital Marketing Command',
      zone: 'marketing-command',
      icon: 'Share2',
      description: 'Engaging social media strategies that build brand communities',
      fullDescription: `Our social media marketing service creates compelling content and manages strategic campaigns across all major social platforms to build engaged communities around your brand.\n\nWe combine organic content with paid advertising to maximize reach and engagement.`,
      features: [
        'Social media strategy',
        'Content creation and curation',
        'Community management',
        'Paid social advertising',
        'Influencer partnerships',
        'Social listening and monitoring'
      ],
      technologies: ['Hootsuite', 'Sprout Social', 'Facebook Business Manager', 'Later', 'Canva'],
      process: [
        { title: 'Strategy Development', description: 'Creating social media roadmap', duration: '1 week' },
        { title: 'Content Planning', description: 'Editorial calendar creation', duration: '3-5 days' },
        { title: 'Execution', description: 'Daily posting and engagement', duration: 'Ongoing' },
        { title: 'Analysis', description: 'Performance reporting and optimization', duration: 'Monthly' }
      ],
      expectedResults: [
        { metric: '500%', description: 'Increase in followers' },
        { metric: '300%', description: 'Engagement improvement' },
        { metric: '200%', description: 'Website traffic from social' }
      ],
      pricingTiers: [
        { name: 'Basic', price: '$2,000', billing: 'Per month', features: ['3 platforms', '15 posts/month', 'Basic engagement'], popular: false },
        { name: 'Professional', price: '$4,000', billing: 'Per month', features: ['5 platforms', '30 posts/month', 'Active management'], popular: true },
        { name: 'Enterprise', price: '$8,000+', billing: 'Per month', features: ['All platforms', 'Daily posting', 'Full management'], popular: false }
      ]
    },
    {
      id: 'marketing-management',
      title: 'Marketing Management',
      category: 'Digital Marketing Command',
      zone: 'marketing-command',
      icon: 'BarChart2',
      description: 'Comprehensive marketing leadership and strategic execution',
      fullDescription: `Our marketing management service provides end-to-end marketing leadership, from strategy development to execution, ensuring all marketing efforts align with business objectives.\n\nWe act as your complete marketing department, managing all aspects of your marketing operations.`,
      features: [
        'Marketing strategy development',
        'Campaign management',
        'Budget planning and allocation',
        'Team coordination',
        'Performance tracking',
        'Marketing automation'
      ],
      technologies: ['HubSpot', 'Marketo', 'Salesforce', 'Google Analytics', 'Tableau'],
      process: [
        { title: 'Assessment', description: 'Evaluating current marketing state', duration: '1 week' },
        { title: 'Strategy Creation', description: 'Developing comprehensive plan', duration: '2 weeks' },
        { title: 'Implementation', description: 'Executing marketing initiatives', duration: 'Ongoing' },
        { title: 'Optimization', description: 'Continuous improvement', duration: 'Ongoing' }
      ],
      expectedResults: [
        { metric: '45%', description: 'Marketing efficiency gain' },
        { metric: '35%', description: 'Cost reduction' },
        { metric: '250%', description: 'ROI improvement' }
      ],
      pricingTiers: [
        { name: 'Startup', price: '$5,000', billing: 'Per month', features: ['Part-time management', 'Basic strategy', '2 campaigns/month'], popular: false },
        { name: 'Growth', price: '$10,000', billing: 'Per month', features: ['Full-time management', 'Advanced strategy', '5 campaigns/month'], popular: true },
        { name: 'Enterprise', price: '$20,000+', billing: 'Per month', features: ['Dedicated team', 'Complete oversight', 'Unlimited campaigns'], popular: false }
      ]
    },
    {
      id: 'email-marketing',
      title: 'Email Marketing',
      category: 'Digital Marketing Command',
      zone: 'marketing-command',
      icon: 'Mail',
      description: 'Strategic email campaigns that nurture leads and drive conversions',
      fullDescription: `Our email marketing service creates targeted campaigns that nurture leads through the customer journey and drive conversions with personalized messaging.\n\nWe design, develop, and optimize email campaigns that deliver results.`,
      features: [
        'Email strategy development',
        'Template design and coding',
        'List segmentation',
        'Automation workflows',
        'A/B testing',
        'Performance analytics'
      ],
      technologies: ['Mailchimp', 'Klaviyo', 'SendGrid', 'Litmus', 'ActiveCampaign'],
      process: [
        { title: 'Strategy', description: 'Defining email marketing goals', duration: '3-5 days' },
        { title: 'Setup', description: 'Creating templates and workflows', duration: '1 week' },
        { title: 'Launch', description: 'Deploying campaigns', duration: 'Ongoing' },
        { title: 'Optimize', description: 'Testing and improving', duration: 'Continuous' }
      ],
      expectedResults: [
        { metric: '35%', description: 'Open rate average' },
        { metric: '25%', description: 'Click-through rate' },
        { metric: '400%', description: 'ROI on email marketing' }
      ],
      pricingTiers: [
        { name: 'Basic', price: '$1,500', billing: 'Per month', features: ['4 campaigns/month', 'Basic automation', 'Monthly reporting'], popular: false },
        { name: 'Professional', price: '$3,000', billing: 'Per month', features: ['8 campaigns/month', 'Advanced automation', 'Weekly reporting'], popular: true },
        { name: 'Enterprise', price: '$5,000+', billing: 'Per month', features: ['Unlimited campaigns', 'Complex automation', 'Real-time reporting'], popular: false }
      ]
    },
    {
      id: 'paid-advertising',
      title: 'Paid Advertising',
      category: 'Digital Marketing Command',
      zone: 'marketing-command',
      icon: 'TrendingUp',
      description: 'Multi-channel paid advertising campaigns that maximize ROI',
      fullDescription: `Our paid advertising service manages comprehensive advertising campaigns across all digital channels to maximize your return on investment.\n\nWe create, optimize, and scale campaigns that drive real business results.`,
      features: [
        'Multi-channel campaign management',
        'Creative development',
        'Audience targeting',
        'Budget optimization',
        'Conversion tracking',
        'Performance reporting'
      ],
      technologies: ['Google Ads', 'Facebook Ads', 'LinkedIn Ads', 'Twitter Ads', 'TikTok Ads'],
      process: [
        { title: 'Planning', description: 'Campaign strategy and budget allocation', duration: '1 week' },
        { title: 'Creative Development', description: 'Ad creation and testing', duration: '1 week' },
        { title: 'Launch', description: 'Campaign deployment', duration: '2-3 days' },
        { title: 'Optimization', description: 'Continuous improvement', duration: 'Daily' }
      ],
      expectedResults: [
        { metric: '250%', description: 'Average ROAS' },
        { metric: '40%', description: 'CPA reduction' },
        { metric: '180%', description: 'Conversion increase' }
      ],
      pricingTiers: [
        { name: 'Starter', price: '$2,500', billing: 'Per month', features: ['2 channels', '$10k ad spend', 'Weekly optimization'], popular: false },
        { name: 'Growth', price: '$5,000', billing: 'Per month', features: ['4 channels', '$25k ad spend', 'Daily optimization'], popular: true },
        { name: 'Scale', price: '$10,000+', billing: 'Per month', features: ['All channels', 'Unlimited spend', 'Real-time optimization'], popular: false }
      ]
    },
    {
      id: 'digital-marketing',
      title: 'Digital Marketing',
      category: 'Digital Marketing Command',
      zone: 'marketing-command',
      icon: 'Globe',
      description: 'Comprehensive digital marketing solutions for online growth',
      fullDescription: `Our digital marketing service provides a complete suite of online marketing solutions to establish and grow your digital presence.\n\nWe integrate multiple digital channels to create cohesive campaigns that drive measurable results.`,
      features: [
        'Digital strategy development',
        'Multi-channel campaigns',
        'Content marketing',
        'Marketing analytics',
        'Conversion optimization',
        'Digital brand management'
      ],
      technologies: ['Google Marketing Platform', 'Adobe Marketing Cloud', 'HubSpot', 'Semrush', 'Hotjar'],
      process: [
        { title: 'Digital Audit', description: 'Assessing current digital presence', duration: '1 week' },
        { title: 'Strategy Development', description: 'Creating integrated plan', duration: '1-2 weeks' },
        { title: 'Execution', description: 'Implementing campaigns', duration: 'Ongoing' },
        { title: 'Analysis', description: 'Measuring and optimizing', duration: 'Continuous' }
      ],
      expectedResults: [
        { metric: '300%', description: 'Digital presence growth' },
        { metric: '200%', description: 'Lead generation increase' },
        { metric: '150%', description: 'Conversion improvement' }
      ],
      pricingTiers: [
        { name: 'Essential', price: '$3,500', billing: 'Per month', features: ['Basic digital strategy', '3 channels', 'Monthly reporting'], popular: false },
        { name: 'Professional', price: '$7,500', billing: 'Per month', features: ['Advanced strategy', '5 channels', 'Weekly reporting'], popular: true },
        { name: 'Enterprise', price: '$15,000+', billing: 'Per month', features: ['Complete digital transformation', 'All channels', 'Real-time dashboards'], popular: false }
      ]
    },
    {
      id: 'ppc',
      title: 'PPC Management',
      category: 'Digital Marketing Command',
      zone: 'marketing-command',
      icon: 'MousePointer',
      description: 'Expert PPC campaign management for maximum ROI',
      fullDescription: `Our PPC management service creates and optimizes pay-per-click campaigns that deliver qualified traffic and conversions at the lowest possible cost.\n\nWe manage every aspect of your PPC campaigns to ensure maximum return on investment.`,
      features: [
        'Search advertising',
        'Display advertising',
        'Shopping campaigns',
        'Video advertising',
        'Remarketing',
        'Landing page optimization'
      ],
      technologies: ['Google Ads', 'Microsoft Ads', 'Amazon Ads', 'Facebook Ads', 'LinkedIn Ads'],
      process: [
        { title: 'Account Setup', description: 'Campaign structure and settings', duration: '3-5 days' },
        { title: 'Keyword Research', description: 'Finding profitable keywords', duration: '1 week' },
        { title: 'Campaign Launch', description: 'Going live with ads', duration: '2-3 days' },
        { title: 'Optimization', description: 'Continuous improvement', duration: 'Daily' }
      ],
      expectedResults: [
        { metric: '35%', description: 'CPC reduction' },
        { metric: '150%', description: 'CTR improvement' },
        { metric: '200%', description: 'Conversion increase' }
      ],
      pricingTiers: [
        { name: 'Basic', price: '$1,000', billing: 'Per month', features: ['1 platform', 'Up to $5k spend', 'Weekly updates'], popular: false },
        { name: 'Advanced', price: '$2,500', billing: 'Per month', features: ['3 platforms', 'Up to $15k spend', 'Daily monitoring'], popular: true },
        { name: 'Premium', price: '$5,000+', billing: 'Per month', features: ['All platforms', 'Unlimited spend', '24/7 management'], popular: false }
      ]
    },

    // DEVELOPMENT LAB SERVICES (11 services)
    {
      id: 'mobile-app-development',
      title: 'Mobile App Development',
      category: 'Development Lab',
      zone: 'development-lab',
      icon: 'Smartphone',
      description: 'Native and cross-platform mobile applications',
      fullDescription: `Our mobile app development service creates high-performance applications for iOS and Android that deliver exceptional user experiences.\n\nWe build apps that are fast, reliable, and designed to scale with your business growth.`,
      features: [
        'iOS app development',
        'Android app development',
        'Cross-platform development',
        'UI/UX design',
        'API integration',
        'App store optimization'
      ],
      technologies: ['React Native', 'Flutter', 'Swift', 'Kotlin', 'Firebase'],
      process: [
        { title: 'Discovery', description: 'Requirements gathering and planning', duration: '1-2 weeks' },
        { title: 'Design', description: 'UI/UX design and prototyping', duration: '2-3 weeks' },
        { title: 'Development', description: 'Building the application', duration: '8-12 weeks' },
        { title: 'Launch', description: 'App store submission and deployment', duration: '1 week' }
      ],
      expectedResults: [
        { metric: '4.5+', description: 'App store rating' },
        { metric: '90%', description: 'User retention rate' },
        { metric: '99.9%', description: 'Uptime reliability' }
      ],
      pricingTiers: [
        { name: 'MVP', price: '$25,000', billing: 'One-time', features: ['Basic features', '1 platform', '3 months support'], popular: false },
        { name: 'Standard', price: '$50,000', billing: 'One-time', features: ['Full features', '2 platforms', '6 months support'], popular: true },
        { name: 'Enterprise', price: '$100,000+', billing: 'One-time', features: ['Complex features', 'All platforms', '12 months support'], popular: false }
      ]
    },
    {
      id: 'crm-implementation',
      title: 'CRM Implementation',
      category: 'Development Lab',
      zone: 'development-lab',
      icon: 'Users',
      description: 'Custom CRM solutions to streamline your sales process',
      fullDescription: `Our CRM implementation service helps businesses optimize their customer relationship management with customized solutions that improve sales efficiency and customer satisfaction.\n\nWe implement, customize, and integrate CRM systems that align with your business processes.`,
      features: [
        'CRM selection and setup',
        'Custom configuration',
        'Data migration',
        'Workflow automation',
        'Integration with existing systems',
        'Training and support'
      ],
      technologies: ['Salesforce', 'HubSpot', 'Microsoft Dynamics', 'Zoho CRM', 'Pipedrive'],
      process: [
        { title: 'Assessment', description: 'Analyzing business requirements', duration: '1 week' },
        { title: 'Configuration', description: 'Setting up and customizing CRM', duration: '2-3 weeks' },
        { title: 'Migration', description: 'Data transfer and validation', duration: '1-2 weeks' },
        { title: 'Training', description: 'User training and documentation', duration: '1 week' }
      ],
      expectedResults: [
        { metric: '40%', description: 'Sales productivity increase' },
        { metric: '35%', description: 'Customer satisfaction improvement' },
        { metric: '50%', description: 'Data accuracy enhancement' }
      ],
      pricingTiers: [
        { name: 'Basic', price: '$10,000', billing: 'One-time', features: ['Standard setup', 'Basic customization', '1 month support'], popular: false },
        { name: 'Professional', price: '$25,000', billing: 'One-time', features: ['Advanced setup', 'Full customization', '3 months support'], popular: true },
        { name: 'Enterprise', price: '$50,000+', billing: 'One-time', features: ['Complex implementation', 'Complete integration', '6 months support'], popular: false }
      ]
    },
    {
      id: 'salesforce-consulting',
      title: 'Salesforce Consulting',
      category: 'Development Lab',
      zone: 'development-lab',
      icon: 'Cloud',
      description: 'Expert Salesforce consulting and development services',
      fullDescription: `Our Salesforce consulting service provides expert guidance and development to maximize your Salesforce investment and drive business growth.\n\nWe help you leverage the full power of Salesforce with custom solutions and optimizations.`,
      features: [
        'Salesforce implementation',
        'Custom development',
        'Lightning migration',
        'Integration services',
        'Admin support',
        'Performance optimization'
      ],
      technologies: ['Salesforce Platform', 'Apex', 'Lightning Web Components', 'Visualforce', 'MuleSoft'],
      process: [
        { title: 'Discovery', description: 'Understanding your Salesforce needs', duration: '1 week' },
        { title: 'Solution Design', description: 'Architecting the solution', duration: '1-2 weeks' },
        { title: 'Development', description: 'Building custom features', duration: '4-8 weeks' },
        { title: 'Deployment', description: 'Going live with support', duration: '1 week' }
      ],
      expectedResults: [
        { metric: '60%', description: 'Process automation' },
        { metric: '45%', description: 'Efficiency improvement' },
        { metric: '200%', description: 'ROI on Salesforce' }
      ],
      pricingTiers: [
        { name: 'Consulting', price: '$200/hr', billing: 'Hourly', features: ['Expert advice', 'Best practices', 'Solution design'], popular: false },
        { name: 'Implementation', price: '$30,000', billing: 'Per project', features: ['Full setup', 'Customization', '3 months support'], popular: true },
        { name: 'Managed Services', price: '$5,000', billing: 'Per month', features: ['Ongoing support', 'Continuous optimization', 'Admin services'], popular: false }
      ]
    },
    {
      id: 'hubspot-consulting',
      title: 'HubSpot Consulting',
      category: 'Development Lab',
      zone: 'development-lab',
      icon: 'Settings',
      description: 'HubSpot implementation and optimization expertise',
      fullDescription: `Our HubSpot consulting service helps businesses maximize their HubSpot investment with expert implementation, customization, and optimization.\n\nWe ensure your HubSpot instance is configured to drive marketing, sales, and service excellence.`,
      features: [
        'HubSpot onboarding',
        'Portal configuration',
        'Workflow automation',
        'Custom integrations',
        'Reporting setup',
        'Team training'
      ],
      technologies: ['HubSpot CRM', 'HubSpot CMS', 'HubSpot API', 'Zapier', 'Custom integrations'],
      process: [
        { title: 'Audit', description: 'Reviewing current setup and needs', duration: '3-5 days' },
        { title: 'Configuration', description: 'Setting up HubSpot portal', duration: '2 weeks' },
        { title: 'Automation', description: 'Building workflows and processes', duration: '1-2 weeks' },
        { title: 'Training', description: 'Educating your team', duration: '1 week' }
      ],
      expectedResults: [
        { metric: '50%', description: 'Marketing efficiency gain' },
        { metric: '35%', description: 'Sales cycle reduction' },
        { metric: '40%', description: 'Lead quality improvement' }
      ],
      pricingTiers: [
        { name: 'Starter', price: '$5,000', billing: 'One-time', features: ['Basic setup', 'Standard workflows', '1 month support'], popular: false },
        { name: 'Professional', price: '$15,000', billing: 'One-time', features: ['Advanced setup', 'Custom workflows', '3 months support'], popular: true },
        { name: 'Enterprise', price: '$30,000+', billing: 'One-time', features: ['Complete implementation', 'Complex automation', '6 months support'], popular: false }
      ]
    },
    {
      id: 'web-development',
      title: 'Web Development',
      category: 'Development Lab',
      zone: 'development-lab',
      icon: 'Code',
      description: 'Custom web development for modern businesses',
      fullDescription: `Our web development service creates high-performance websites and web applications that deliver exceptional user experiences and drive business results.\n\nWe use modern technologies and best practices to build scalable, secure web solutions.`,
      features: [
        'Frontend development',
        'Backend development',
        'Database design',
        'API development',
        'Performance optimization',
        'Security implementation'
      ],
      technologies: ['React', 'Node.js', 'Python', 'PHP', 'MySQL', 'MongoDB'],
      process: [
        { title: 'Planning', description: 'Technical requirements and architecture', duration: '1 week' },
        { title: 'Development', description: 'Building the application', duration: '6-10 weeks' },
        { title: 'Testing', description: 'Quality assurance and bug fixes', duration: '1-2 weeks' },
        { title: 'Deployment', description: 'Launch and monitoring', duration: '3-5 days' }
      ],
      expectedResults: [
        { metric: '2s', description: 'Page load time' },
        { metric: '99.9%', description: 'Uptime guarantee' },
        { metric: '100%', description: 'Mobile responsive' }
      ],
      pricingTiers: [
        { name: 'Basic', price: '$15,000', billing: 'One-time', features: ['5-10 pages', 'Basic functionality', '3 months support'], popular: false },
        { name: 'Professional', price: '$35,000', billing: 'One-time', features: ['Custom features', 'Advanced functionality', '6 months support'], popular: true },
        { name: 'Enterprise', price: '$75,000+', billing: 'One-time', features: ['Complex applications', 'Full customization', '12 months support'], popular: false }
      ]
    },
    {
      id: 'web-design',
      title: 'Web Design',
      category: 'Development Lab',
      zone: 'development-lab',
      icon: 'Layout',
      description: 'Beautiful, user-focused web design that converts',
      fullDescription: `Our web design service creates visually stunning, user-friendly websites that not only look great but also drive conversions and achieve business goals.\n\nWe combine aesthetic excellence with usability principles to deliver exceptional web experiences.`,
      features: [
        'UI/UX design',
        'Responsive design',
        'Wireframing and prototyping',
        'Design systems',
        'Interactive elements',
        'Accessibility compliance'
      ],
      technologies: ['Figma', 'Adobe XD', 'Sketch', 'InVision', 'Webflow'],
      process: [
        { title: 'Research', description: 'User research and competitor analysis', duration: '1 week' },
        { title: 'Wireframing', description: 'Creating site structure', duration: '1 week' },
        { title: 'Design', description: 'Visual design and prototyping', duration: '2-3 weeks' },
        { title: 'Handoff', description: 'Developer handoff and support', duration: '3-5 days' }
      ],
      expectedResults: [
        { metric: '40%', description: 'Conversion rate increase' },
        { metric: '60%', description: 'User engagement improvement' },
        { metric: '50%', description: 'Bounce rate reduction' }
      ],
      pricingTiers: [
        { name: 'Landing Page', price: '$3,000', billing: 'One-time', features: ['Single page', '2 revisions', 'Mobile responsive'], popular: false },
        { name: 'Business Site', price: '$10,000', billing: 'One-time', features: ['10-15 pages', '5 revisions', 'Full responsive'], popular: true },
        { name: 'Enterprise', price: '$25,000+', billing: 'One-time', features: ['Unlimited pages', 'Unlimited revisions', 'Design system'], popular: false }
      ]
    },
    {
      id: 'integrations-development',
      title: 'Integrations Development',
      category: 'Development Lab',
      zone: 'development-lab',
      icon: 'Link',
      description: 'Custom integrations to connect your business systems',
      fullDescription: `Our integrations development service creates seamless connections between your business applications, enabling data flow and process automation across your entire tech stack.\n\nWe build reliable, secure integrations that eliminate data silos and improve operational efficiency.`,
      features: [
        'API development',
        'Third-party integrations',
        'Data synchronization',
        'Webhook implementation',
        'Middleware development',
        'Real-time data transfer'
      ],
      technologies: ['REST APIs', 'GraphQL', 'Zapier', 'MuleSoft', 'Node.js', 'Python'],
      process: [
        { title: 'Analysis', description: 'Understanding integration requirements', duration: '3-5 days' },
        { title: 'Architecture', description: 'Designing integration solution', duration: '1 week' },
        { title: 'Development', description: 'Building the integration', duration: '2-4 weeks' },
        { title: 'Testing', description: 'Validation and deployment', duration: '1 week' }
      ],
      expectedResults: [
        { metric: '80%', description: 'Process automation' },
        { metric: '90%', description: 'Data accuracy improvement' },
        { metric: '60%', description: 'Time savings' }
      ],
      pricingTiers: [
        { name: 'Simple', price: '$5,000', billing: 'One-time', features: ['2 systems', 'Basic data sync', '1 month support'], popular: false },
        { name: 'Complex', price: '$15,000', billing: 'One-time', features: ['5 systems', 'Advanced sync', '3 months support'], popular: true },
        { name: 'Enterprise', price: '$30,000+', billing: 'One-time', features: ['Unlimited systems', 'Real-time sync', '6 months support'], popular: false }
      ]
    },
    {
      id: 'aws-development',
      title: 'AWS Development',
      category: 'Development Lab',
      zone: 'development-lab',
      icon: 'Cloud',
      description: 'Cloud solutions on Amazon Web Services platform',
      fullDescription: `Our AWS development service leverages Amazon's cloud platform to build scalable, secure, and cost-effective solutions for your business.\n\nWe architect and implement AWS solutions that provide reliability, performance, and flexibility.`,
      features: [
        'Cloud architecture design',
        'Serverless applications',
        'Container orchestration',
        'Database solutions',
        'DevOps implementation',
        'Security and compliance'
      ],
      technologies: ['AWS EC2', 'Lambda', 'S3', 'RDS', 'CloudFormation', 'EKS'],
      process: [
        { title: 'Assessment', description: 'Cloud readiness evaluation', duration: '1 week' },
        { title: 'Architecture', description: 'Designing AWS solution', duration: '1-2 weeks' },
        { title: 'Implementation', description: 'Building cloud infrastructure', duration: '4-6 weeks' },
        { title: 'Migration', description: 'Moving to AWS', duration: '2-3 weeks' }
      ],
      expectedResults: [
        { metric: '40%', description: 'Cost reduction' },
        { metric: '99.99%', description: 'Uptime SLA' },
        { metric: '300%', description: 'Scalability improvement' }
      ],
      pricingTiers: [
        { name: 'Starter', price: '$10,000', billing: 'One-time', features: ['Basic setup', 'Single region', '1 month support'], popular: false },
        { name: 'Business', price: '$25,000', billing: 'One-time', features: ['Multi-AZ setup', 'Auto-scaling', '3 months support'], popular: true },
        { name: 'Enterprise', price: '$50,000+', billing: 'One-time', features: ['Multi-region', 'Full redundancy', '6 months support'], popular: false }
      ]
    },
    {
      id: 'azure-development',
      title: 'Azure Development',
      category: 'Development Lab',
      zone: 'development-lab',
      icon: 'Cloud',
      description: 'Microsoft Azure cloud solutions and services',
      fullDescription: `Our Azure development service creates powerful cloud solutions on Microsoft's Azure platform, enabling digital transformation and business agility.\n\nWe help businesses leverage Azure's capabilities for improved performance and reduced costs.`,
      features: [
        'Azure architecture',
        'App Services deployment',
        'Azure Functions',
        'Cosmos DB implementation',
        'Azure DevOps',
        'Security configuration'
      ],
      technologies: ['Azure Portal', 'Azure Functions', 'Azure SQL', 'Cosmos DB', 'AKS', 'Azure DevOps'],
      process: [
        { title: 'Planning', description: 'Azure strategy development', duration: '1 week' },
        { title: 'Setup', description: 'Environment configuration', duration: '1-2 weeks' },
        { title: 'Development', description: 'Building Azure solutions', duration: '4-6 weeks' },
        { title: 'Optimization', description: 'Performance tuning', duration: '1 week' }
      ],
      expectedResults: [
        { metric: '35%', description: 'Infrastructure cost savings' },
        { metric: '50%', description: 'Deployment speed increase' },
        { metric: '99.95%', description: 'Service availability' }
      ],
      pricingTiers: [
        { name: 'Basic', price: '$10,000', billing: 'One-time', features: ['Standard setup', 'Basic services', '1 month support'], popular: false },
        { name: 'Professional', price: '$25,000', billing: 'One-time', features: ['Advanced setup', 'Multiple services', '3 months support'], popular: true },
        { name: 'Enterprise', price: '$50,000+', billing: 'One-time', features: ['Complex architecture', 'Full integration', '6 months support'], popular: false }
      ]
    },
    {
      id: 'wordpress-development',
      title: 'WordPress Development',
      category: 'Development Lab',
      zone: 'development-lab',
      icon: 'Globe',
      description: 'Custom WordPress solutions for content-driven websites',
      fullDescription: `Our WordPress development service creates powerful, customized WordPress websites that are easy to manage and optimized for performance.\n\nWe build WordPress solutions that go beyond templates to deliver unique, scalable websites.`,
      features: [
        'Custom theme development',
        'Plugin development',
        'WooCommerce setup',
        'Performance optimization',
        'Security hardening',
        'Multisite configuration'
      ],
      technologies: ['WordPress', 'PHP', 'MySQL', 'JavaScript', 'WooCommerce', 'Elementor'],
      process: [
        { title: 'Planning', description: 'Site architecture and features', duration: '3-5 days' },
        { title: 'Development', description: 'Building custom functionality', duration: '3-4 weeks' },
        { title: 'Content Migration', description: 'Moving existing content', duration: '1 week' },
        { title: 'Launch', description: 'Going live with support', duration: '2-3 days' }
      ],
      expectedResults: [
        { metric: '3s', description: 'Page load time' },
        { metric: '100%', description: 'Mobile responsive' },
        { metric: 'A+', description: 'Security grade' }
      ],
      pricingTiers: [
        { name: 'Basic', price: '$5,000', billing: 'One-time', features: ['Premium theme', 'Basic customization', '1 month support'], popular: false },
        { name: 'Custom', price: '$15,000', billing: 'One-time', features: ['Custom theme', 'Advanced features', '3 months support'], popular: true },
        { name: 'Enterprise', price: '$30,000+', billing: 'One-time', features: ['Full custom build', 'Complex functionality', '6 months support'], popular: false }
      ]
    },
    {
      id: 'custom-web-development',
      title: 'Custom Web Development',
      category: 'Development Lab',
      zone: 'development-lab',
      icon: 'Terminal',
      description: 'Bespoke web applications tailored to your needs',
      fullDescription: `Our custom web development service builds unique web applications from the ground up, tailored specifically to your business requirements and workflows.\n\nWe create custom solutions that can't be achieved with off-the-shelf software.`,
      features: [
        'Custom application development',
        'Business process automation',
        'Complex integrations',
        'Scalable architecture',
        'Advanced security',
        'Real-time features'
      ],
      technologies: ['React', 'Vue.js', 'Angular', 'Node.js', 'Django', 'Ruby on Rails'],
      process: [
        { title: 'Discovery', description: 'Deep dive into requirements', duration: '2 weeks' },
        { title: 'Architecture', description: 'System design and planning', duration: '1-2 weeks' },
        { title: 'Development', description: 'Agile development sprints', duration: '12-16 weeks' },
        { title: 'Deployment', description: 'Launch and stabilization', duration: '1-2 weeks' }
      ],
      expectedResults: [
        { metric: '100%', description: 'Custom functionality' },
        { metric: '70%', description: 'Process efficiency gain' },
        { metric: '5x', description: 'ROI within first year' }
      ],
      pricingTiers: [
        { name: 'MVP', price: '$30,000', billing: 'One-time', features: ['Core features', 'Basic UI', '3 months support'], popular: false },
        { name: 'Full Product', price: '$75,000', billing: 'One-time', features: ['Complete features', 'Polished UI', '6 months support'], popular: true },
        { name: 'Enterprise', price: '$150,000+', billing: 'One-time', features: ['Complex system', 'Premium support', '12 months maintenance'], popular: false }
      ]
    },

    // EXECUTIVE ADVISORY SERVICES (7 services)
    {
      id: 'business-consulting',
      title: 'Business Consulting',
      category: 'Executive Advisory',
      zone: 'executive-advisory',
      icon: 'Briefcase',
      description: 'Strategic business consulting for growth and transformation',
      fullDescription: `Our business consulting service provides expert guidance to help organizations navigate challenges, identify opportunities, and achieve sustainable growth.\n\nWe work closely with leadership teams to develop and implement strategies that drive real business results.`,
      features: [
        'Strategic planning',
        'Market analysis',
        'Operational improvement',
        'Change management',
        'Risk assessment',
        'Growth strategies'
      ],
      technologies: ['Business analytics tools', 'Financial modeling', 'Project management', 'CRM systems', 'Data visualization'],
      process: [
        { title: 'Assessment', description: 'Current state analysis', duration: '2 weeks' },
        { title: 'Strategy', description: 'Developing recommendations', duration: '2-3 weeks' },
        { title: 'Implementation', description: 'Executing initiatives', duration: '8-12 weeks' },
        { title: 'Monitoring', description: 'Tracking progress', duration: 'Ongoing' }
      ],
      expectedResults: [
        { metric: '30%', description: 'Revenue growth' },
        { metric: '25%', description: 'Operational efficiency' },
        { metric: '40%', description: 'Cost reduction' }
      ],
      pricingTiers: [
        { name: 'Advisory', price: '$10,000', billing: 'Per month', features: ['Monthly meetings', 'Strategic guidance', 'Email support'], popular: false },
        { name: 'Consulting', price: '$25,000', billing: 'Per month', features: ['Weekly engagement', 'Hands-on support', 'Implementation help'], popular: true },
        { name: 'Transformation', price: '$50,000+', billing: 'Per month', features: ['Daily involvement', 'Full transformation', 'Executive team'], popular: false }
      ]
    },
    {
      id: 'operation-disruption',
      title: 'Operation Disruption',
      category: 'Executive Advisory',
      zone: 'executive-advisory',
      icon: 'Zap',
      description: 'Revolutionary operational transformation strategies',
      fullDescription: `Our operation disruption service helps businesses radically transform their operations to achieve breakthrough performance and competitive advantage.\n\nWe challenge traditional approaches and implement innovative solutions that redefine how work gets done.`,
      features: [
        'Process reengineering',
        'Digital transformation',
        'Automation strategies',
        'Innovation frameworks',
        'Agile implementation',
        'Cultural transformation'
      ],
      technologies: ['Process mining tools', 'RPA platforms', 'AI/ML solutions', 'Cloud platforms', 'Analytics tools'],
      process: [
        { title: 'Disruption Audit', description: 'Identifying transformation opportunities', duration: '2-3 weeks' },
        { title: 'Innovation Design', description: 'Creating disruption strategy', duration: '3-4 weeks' },
        { title: 'Pilot Programs', description: 'Testing new approaches', duration: '4-6 weeks' },
        { title: 'Scale', description: 'Rolling out transformations', duration: '8-12 weeks' }
      ],
      expectedResults: [
        { metric: '50%', description: 'Process efficiency gain' },
        { metric: '60%', description: 'Time to market reduction' },
        { metric: '3x', description: 'Innovation velocity' }
      ],
      pricingTiers: [
        { name: 'Assessment', price: '$25,000', billing: 'One-time', features: ['Opportunity analysis', 'Roadmap creation', 'Quick wins'], popular: false },
        { name: 'Transformation', price: '$100,000', billing: 'Per quarter', features: ['Full disruption program', 'Change management', 'Implementation'], popular: true },
        { name: 'Revolution', price: '$250,000+', billing: 'Per quarter', features: ['Complete reinvention', 'Innovation lab', 'Ongoing support'], popular: false }
      ]
    },
    {
      id: 'fractional-cto',
      title: 'Fractional CTO',
      category: 'Executive Advisory',
      zone: 'executive-advisory',
      icon: 'Cpu',
      description: 'Technology leadership and strategic guidance',
      fullDescription: `Our fractional CTO service provides expert technology leadership to guide your technical strategy, team, and infrastructure decisions.\n\nWe help businesses make smart technology investments and build scalable technical capabilities.`,
      features: [
        'Technology strategy',
        'Architecture decisions',
        'Team leadership',
        'Vendor management',
        'Security oversight',
        'Innovation roadmap'
      ],
      technologies: ['Cloud platforms', 'DevOps tools', 'Security frameworks', 'Development platforms', 'Analytics tools'],
      process: [
        { title: 'Tech Audit', description: 'Assessing current technology', duration: '1-2 weeks' },
        { title: 'Strategy', description: 'Creating technology roadmap', duration: '2 weeks' },
        { title: 'Implementation', description: 'Leading tech initiatives', duration: 'Ongoing' },
        { title: 'Optimization', description: 'Continuous improvement', duration: 'Ongoing' }
      ],
      expectedResults: [
        { metric: '50%', description: 'Development efficiency' },
        { metric: '40%', description: 'Tech cost optimization' },
        { metric: '90%', description: 'System reliability' }
      ],
      pricingTiers: [
        { name: 'Advisor', price: '$7,500', billing: 'Per month', features: ['10 hours/month', 'Tech guidance', 'Architecture review'], popular: false },
        { name: 'Leader', price: '$20,000', billing: 'Per month', features: ['50 hours/month', 'Team leadership', 'Strategic planning'], popular: true },
        { name: 'Executive', price: '$40,000+', billing: 'Per month', features: ['Full-time equivalent', 'Complete oversight', 'Board reporting'], popular: false }
      ]
    },
    {
      id: 'fractional-coo',
      title: 'Fractional COO',
      category: 'Executive Advisory',
      zone: 'executive-advisory',
      icon: 'Activity',
      description: 'Operational excellence and process optimization',
      fullDescription: `Our fractional COO service provides experienced operational leadership to streamline processes, improve efficiency, and drive organizational performance.\n\nWe help businesses scale operations effectively while maintaining quality and controlling costs.`,
      features: [
        'Operations strategy',
        'Process optimization',
        'Supply chain management',
        'Quality control',
        'Performance metrics',
        'Organizational design'
      ],
      technologies: ['ERP systems', 'Process automation', 'Analytics platforms', 'Project management', 'Quality management'],
      process: [
        { title: 'Operations Audit', description: 'Evaluating current operations', duration: '2 weeks' },
        { title: 'Optimization Plan', description: 'Developing improvement strategy', duration: '2 weeks' },
        { title: 'Implementation', description: 'Executing operational changes', duration: 'Ongoing' },
        { title: 'Monitoring', description: 'Tracking performance', duration: 'Continuous' }
      ],
      expectedResults: [
        { metric: '35%', description: 'Operational efficiency' },
        { metric: '30%', description: 'Cost reduction' },
        { metric: '45%', description: 'Productivity increase' }
      ],
      pricingTiers: [
        { name: 'Consultant', price: '$8,000', billing: 'Per month', features: ['12 hours/month', 'Process review', 'Recommendations'], popular: false },
        { name: 'Director', price: '$22,000', billing: 'Per month', features: ['60 hours/month', 'Active management', 'Team leadership'], popular: true },
        { name: 'Executive', price: '$45,000+', billing: 'Per month', features: ['Full-time role', 'Complete operations', 'Strategic planning'], popular: false }
      ]
    },
    {
      id: 'fractional-cio',
      title: 'Fractional CIO',
      category: 'Executive Advisory',
      zone: 'executive-advisory',
      icon: 'Database',
      description: 'Information technology leadership and digital strategy',
      fullDescription: `Our fractional CIO service provides strategic IT leadership to align technology with business objectives and drive digital transformation.\n\nWe help organizations leverage technology as a competitive advantage while managing risk and optimizing IT investments.`,
      features: [
        'IT strategy development',
        'Digital transformation',
        'Cybersecurity oversight',
        'System integration',
        'Data governance',
        'IT budget management'
      ],
      technologies: ['Enterprise systems', 'Cloud infrastructure', 'Security platforms', 'Data analytics', 'Integration tools'],
      process: [
        { title: 'IT Assessment', description: 'Evaluating IT landscape', duration: '2 weeks' },
        { title: 'Strategy Development', description: 'Creating IT roadmap', duration: '3 weeks' },
        { title: 'Execution', description: 'Leading IT initiatives', duration: 'Ongoing' },
        { title: 'Governance', description: 'Ensuring compliance and security', duration: 'Continuous' }
      ],
      expectedResults: [
        { metric: '40%', description: 'IT cost optimization' },
        { metric: '60%', description: 'System integration' },
        { metric: '95%', description: 'Security posture' }
      ],
      pricingTiers: [
        { name: 'Advisory', price: '$9,000', billing: 'Per month', features: ['15 hours/month', 'IT strategy', 'Vendor guidance'], popular: false },
        { name: 'Leadership', price: '$25,000', billing: 'Per month', features: ['70 hours/month', 'IT management', 'Digital transformation'], popular: true },
        { name: 'Full Service', price: '$50,000+', billing: 'Per month', features: ['Full-time coverage', 'Complete IT oversight', 'Board engagement'], popular: false }
      ]
    },
    {
      id: 'fractional-cmo',
      title: 'Fractional CMO',
      category: 'Executive Advisory',
      zone: 'executive-advisory',
      icon: 'Target',
      description: 'Marketing leadership to drive growth and brand success',
      fullDescription: `Our fractional CMO service provides seasoned marketing leadership to develop and execute strategies that drive growth and build brand value.\n\nWe help businesses create marketing engines that consistently deliver results and competitive advantage.`,
      features: [
        'Marketing strategy',
        'Brand development',
        'Demand generation',
        'Marketing analytics',
        'Team leadership',
        'Budget optimization'
      ],
      technologies: ['Marketing automation', 'Analytics platforms', 'CRM systems', 'Content management', 'Ad platforms'],
      process: [
        { title: 'Marketing Audit', description: 'Assessing current marketing', duration: '1-2 weeks' },
        { title: 'Strategy Creation', description: 'Developing marketing plan', duration: '2-3 weeks' },
        { title: 'Execution', description: 'Leading marketing initiatives', duration: 'Ongoing' },
        { title: 'Optimization', description: 'Refining based on results', duration: 'Continuous' }
      ],
      expectedResults: [
        { metric: '200%', description: 'Lead generation increase' },
        { metric: '50%', description: 'Brand awareness growth' },
        { metric: '3x', description: 'Marketing ROI' }
      ],
      pricingTiers: [
        { name: 'Advisor', price: '$6,000', billing: 'Per month', features: ['10 hours/month', 'Strategy guidance', 'Campaign review'], popular: false },
        { name: 'Leader', price: '$18,000', billing: 'Per month', features: ['50 hours/month', 'Team leadership', 'Full strategy'], popular: true },
        { name: 'Executive', price: '$35,000+', billing: 'Per month', features: ['Full-time role', 'Complete marketing', 'Board reporting'], popular: false }
      ]
    },
    {
      id: 'fractional-cro',
      title: 'Fractional CRO',
      category: 'Executive Advisory',
      zone: 'executive-advisory',
      icon: 'TrendingUp',
      description: 'Revenue leadership to accelerate business growth',
      fullDescription: `Our fractional CRO service provides expert revenue leadership to optimize sales, marketing, and customer success operations for maximum growth.\n\nWe help businesses build predictable revenue engines and achieve aggressive growth targets.`,
      features: [
        'Revenue strategy',
        'Sales optimization',
        'Pipeline development',
        'Pricing strategy',
        'Customer retention',
        'Revenue operations'
      ],
      technologies: ['CRM platforms', 'Sales automation', 'Revenue intelligence', 'Analytics tools', 'Forecasting systems'],
      process: [
        { title: 'Revenue Audit', description: 'Analyzing revenue operations', duration: '2 weeks' },
        { title: 'Growth Strategy', description: 'Creating revenue roadmap', duration: '2-3 weeks' },
        { title: 'Implementation', description: 'Executing growth initiatives', duration: 'Ongoing' },
        { title: 'Scaling', description: 'Expanding successful programs', duration: 'Continuous' }
      ],
      expectedResults: [
        { metric: '150%', description: 'Revenue growth' },
        { metric: '40%', description: 'Sales efficiency' },
        { metric: '30%', description: 'Customer lifetime value' }
      ],
      pricingTiers: [
        { name: 'Growth Advisor', price: '$8,000', billing: 'Per month', features: ['12 hours/month', 'Revenue strategy', 'Sales coaching'], popular: false },
        { name: 'Revenue Leader', price: '$25,000', billing: 'Per month', features: ['60 hours/month', 'Full revenue ops', 'Team management'], popular: true },
        { name: 'Chief Revenue', price: '$50,000+', billing: 'Per month', features: ['Full-time equivalent', 'Complete revenue responsibility', 'Executive team'], popular: false }
      ]
    }
  ], []);

  // Memoize service zones with correct counts
  const serviceZones = useMemo(() => {
    const creativeCount = detailedServices.filter(s => s.category === 'Creative Studio').length;
    const marketingCount = detailedServices.filter(s => s.category === 'Digital Marketing Command').length;
    const developmentCount = detailedServices.filter(s => s.category === 'Development Lab').length;
    const advisoryCount = detailedServices.filter(s => s.category === 'Executive Advisory').length;

    return [
      {
        id: 'creative-studio',
        title: 'Creative Studio',
        icon: 'Palette',
        description: 'Transform your brand identity with cutting-edge creative solutions that captivate audiences and drive engagement across all touchpoints.',
        serviceCount: creativeCount,
        keyServices: ['Graphic Design', 'Motion Graphics', 'Videography', 'Photography', 'Content Writing'],
        stats: { projects: 150, satisfaction: 98 }
      },
      {
        id: 'marketing-command',
        title: 'Digital Marketing Command',
        icon: 'Target',
        description: 'Data-driven marketing strategies that deliver measurable results through performance optimization and strategic channel management.',
        serviceCount: marketingCount,
        keyServices: ['SEO', 'SEM', 'Social Media Marketing', 'Email Marketing', 'PPC'],
        stats: { projects: 200, satisfaction: 96 }
      },
      {
        id: 'development-lab',
        title: 'Development Lab',
        icon: 'Code',
        description: 'Custom technical solutions built with modern technologies to solve complex business challenges and enhance operational efficiency.',
        serviceCount: developmentCount,
        keyServices: ['Web Development', 'Mobile Apps', 'CRM Implementation', 'Cloud Solutions', 'Integrations'],
        stats: { projects: 120, satisfaction: 99 }
      },
      {
        id: 'executive-advisory',
        title: 'Executive Advisory',
        icon: 'Users',
        description: 'Strategic leadership and fractional executive services to guide business growth and navigate complex market challenges.',
        serviceCount: advisoryCount,
        keyServices: ['Business Consulting', 'Fractional CTO', 'Fractional CMO', 'Fractional COO', 'Operation Disruption'],
        stats: { projects: 80, satisfaction: 100 }
      }
    ];
  }, [detailedServices]);

  // Memoize filter categories with correct counts
  const filterCategories = useMemo(() => [
    { id: 'all', name: 'All Services', icon: 'Grid', count: detailedServices.length },
    { id: 'Creative Studio', name: 'Creative Studio', icon: 'Palette', count: detailedServices.filter(s => s.category === 'Creative Studio').length },
    { id: 'Digital Marketing Command', name: 'Marketing Command', icon: 'Target', count: detailedServices.filter(s => s.category === 'Digital Marketing Command').length },
    { id: 'Development Lab', name: 'Development Lab', icon: 'Code', count: detailedServices.filter(s => s.category === 'Development Lab').length },
    { id: 'Executive Advisory', name: 'Executive Advisory', icon: 'Users', count: detailedServices.filter(s => s.category === 'Executive Advisory').length }
  ], [detailedServices]);

  // Optimize filtering with useMemo
  useEffect(() => {
    let filtered = detailedServices;

    if (activeCategory !== 'all') {
      filtered = filtered.filter(service => service.category === activeCategory);
    }

    if (searchTerm) {
      const lowercaseSearch = searchTerm.toLowerCase();
      filtered = filtered.filter(service =>
        service.title?.toLowerCase().includes(lowercaseSearch) ||
        service.description?.toLowerCase().includes(lowercaseSearch) ||
        service.features?.some(feature => feature.toLowerCase().includes(lowercaseSearch))
      );
    }

    setFilteredServices(filtered);
  }, [activeCategory, searchTerm, detailedServices]);

  // Memoize handlers
  const handleZoneActivate = useCallback((zoneId) => {
    setActiveZone(zoneId);
  }, []);

  const handleZoneExplore = useCallback((zone) => {
    setActiveZone(zone.id);
    // Smooth scroll with fallback
    const element = document.getElementById('services-section');
    if (element) {
      element.scrollIntoView({ behavior: 'smooth', block: 'start' });
    }
  }, []);

  const handleServiceSelect = useCallback((service) => {
    setSelectedService(service);
    setIsModalOpen(true);
  }, []);

  const handleCategoryChange = useCallback((category) => {
    setActiveCategory(category);
  }, []);

  const handleSearchChange = useCallback((term) => {
    setSearchTerm(term);
  }, []);

  const closeModal = useCallback(() => {
    setIsModalOpen(false);
    setSelectedService(null);
  }, []);

  // Handler for quick actions
  const handleQuickAction = useCallback((action) => {
    // All quick actions go to consultation page for now
    navigate('/contact-consultation-portal');
  }, [navigate]);

  // Rest of the component remains the same as before...
  // (Hero, Service Zones, Interactive Demo, Services Grid, Assessment, CTA sections)

  return (
    <>
      <Helmet>
        <title>Capability Universe - Rule27 Design Digital Powerhouse</title>
        <meta name="description" content="Explore Rule27 Design's comprehensive service capabilities across Creative Studio, Digital Marketing Command, Development Lab, and Executive Advisory. Interactive demonstrations and personalized assessments." />
        <meta name="keywords" content="digital agency services, creative studio, marketing command, development lab, executive advisory, capability assessment" />
      </Helmet>
      
      <div className="min-h-screen bg-background">
        <Header />
        
        <main className="pt-16">
          {/* Hero Section */}
          <section className="py-12 md:py-16 lg:py-24 bg-gradient-to-br from-background via-muted/30 to-background">
            <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
              <div className="text-center space-y-6 md:space-y-8">
                <motion.div
                  initial={{ opacity: 0, y: 30 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ duration: 0.8 }}
                  className="space-y-4"
                >
                  <h1 className="text-3xl sm:text-4xl md:text-5xl lg:text-6xl font-bold text-primary">
                    Capability <span className="text-accent">Universe</span>
                  </h1>
                  <p className="text-lg md:text-xl text-text-secondary max-w-3xl mx-auto leading-relaxed px-4">
                    Four distinct experience zones showcase Rule27 Design's comprehensive service mastery through immersive, 
                    interactive presentations. Discover the perfect solution for your business transformation.
                  </p>
                </motion.div>

                <motion.div
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ duration: 0.8, delay: 0.2 }}
                  className="flex flex-col sm:flex-row gap-4 justify-center px-4"
                >
                  <Button
                    variant="default"
                    size="lg"
                    className="bg-accent hover:bg-accent/90 w-full sm:w-auto"
                    iconName="Zap"
                    iconPosition="left"
                    onClick={() => document.getElementById('zones-section')?.scrollIntoView({ behavior: 'smooth' })}
                  >
                    Explore Capabilities
                  </Button>
                  <Button
                    variant="outline"
                    size="lg"
                    className="border-accent text-accent hover:bg-accent hover:text-white w-full sm:w-auto"
                    iconName="Calculator"
                    iconPosition="left"
                    onClick={() => document.getElementById('assessment-section')?.scrollIntoView({ behavior: 'smooth' })}
                  >
                    Take Assessment
                  </Button>
                </motion.div>
              </div>
            </div>
          </section>

          {/* Service Zones Section */}
          <section id="zones-section" className="py-12 md:py-16 bg-muted/20">
            <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
              <div className="text-center mb-8 md:mb-12">
                <h2 className="text-2xl sm:text-3xl md:text-4xl font-bold text-primary mb-4">
                  Service Experience Zones
                </h2>
                <p className="text-base md:text-lg text-text-secondary max-w-2xl mx-auto px-4">
                  Each zone represents a core competency area with specialized expertise and proven methodologies
                </p>
              </div>

              <div className="grid md:grid-cols-2 gap-6 md:gap-8">
                {serviceZones.map((zone) => (
                  <ServiceZoneCard
                    key={zone.id}
                    zone={zone}
                    isActive={activeZone === zone.id}
                    onActivate={() => handleZoneActivate(zone.id)}
                    onExplore={handleZoneExplore}
                  />
                ))}
              </div>
            </div>
          </section>

          {/* Interactive Demo Section */}
          <section className="py-12 md:py-16 bg-background">
            <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
              <div className="text-center mb-8 md:mb-12">
                <h2 className="text-2xl sm:text-3xl md:text-4xl font-bold text-primary mb-4">
                  Interactive Demonstrations
                </h2>
                <p className="text-base md:text-lg text-text-secondary max-w-2xl mx-auto px-4">
                  Experience our capabilities through live, interactive demonstrations
                </p>
              </div>

              <InteractiveDemo activeZone={activeZone} />
            </div>
          </section>

          {/* Detailed Services Section */}
          <section id="services-section" className="py-12 md:py-16 bg-muted/20">
            <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
              <div className="text-center mb-8 md:mb-12">
                <h2 className="text-2xl sm:text-3xl md:text-4xl font-bold text-primary mb-4">
                  Detailed Service Catalog
                </h2>
                <p className="text-base md:text-lg text-text-secondary max-w-2xl mx-auto px-4">
                  Explore our comprehensive service offerings with detailed information and case studies
                </p>
              </div>

              <div className="grid lg:grid-cols-4 gap-6 md:gap-8">
                {/* Filter Sidebar - Pass the quick action handler */}
                <div className="lg:col-span-1">
                  <div className="sticky top-20">
                    <CapabilityFilter
                      categories={filterCategories}
                      activeCategory={activeCategory}
                      onCategoryChange={handleCategoryChange}
                      searchTerm={searchTerm}
                      onSearchChange={handleSearchChange}
                      onQuickAction={handleQuickAction}
                    />
                  </div>
                </div>

                {/* Services Grid */}
                <div className="lg:col-span-3">
                  <div className="grid sm:grid-cols-2 gap-4 md:gap-6">
                    {filteredServices.map((service) => (
                      <motion.div
                        key={service.id}
                        initial={{ opacity: 0, y: 20 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={{ duration: 0.5 }}
                        className="bg-card border border-border rounded-2xl p-4 md:p-6 hover:shadow-lg transition-all duration-300 cursor-pointer"
                        onClick={() => handleServiceSelect(service)}
                      >
                        <div className="flex items-start justify-between mb-4">
                          <div className="p-3 bg-accent/10 rounded-xl">
                            <Icon name={service.icon} size={24} className="text-accent" />
                          </div>
                          <span className="text-xs px-2 py-1 bg-muted text-text-secondary rounded-full">
                            {service.category}
                          </span>
                        </div>

                        <h3 className="text-lg md:text-xl font-bold text-primary mb-2">{service.title}</h3>
                        <p className="text-sm md:text-base text-text-secondary mb-4 line-clamp-2">{service.description}</p>

                        <div className="flex items-center justify-between">
                          <div className="flex flex-wrap gap-2">
                            {service.features?.slice(0, 2).map((feature, index) => (
                              <span
                                key={index}
                                className="text-xs px-2 py-1 bg-muted text-text-secondary rounded-full"
                              >
                                {feature.length > 20 ? feature.substring(0, 20) + '...' : feature}
                              </span>
                            ))}
                          </div>
                          <Icon name="ArrowRight" size={16} className="text-accent flex-shrink-0" />
                        </div>
                      </motion.div>
                    ))}
                  </div>

                  {filteredServices.length === 0 && (
                    <div className="text-center py-12">
                      <Icon name="Search" size={48} className="text-text-secondary mx-auto mb-4" />
                      <h3 className="text-xl font-semibold text-primary mb-2">No services found</h3>
                      <p className="text-text-secondary">Try adjusting your search or filter criteria</p>
                    </div>
                  )}
                </div>
              </div>
            </div>
          </section>

          {/* Capability Assessment Section */}
          <section id="assessment-section" className="py-12 md:py-16 bg-background">
            <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
              <div className="text-center mb-8 md:mb-12">
                <h2 className="text-2xl sm:text-3xl md:text-4xl font-bold text-primary mb-4">
                  Capability Assessment
                </h2>
                <p className="text-base md:text-lg text-text-secondary max-w-2xl mx-auto px-4">
                  Get personalized service recommendations based on your business needs and goals
                </p>
              </div>

              <CapabilityAssessment />
            </div>
          </section>

          {/* CTA Section */}
          <section className="py-12 md:py-16 bg-gradient-to-r from-primary to-accent text-white">
            <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
              <h2 className="text-2xl sm:text-3xl md:text-4xl font-bold mb-4">
                Ready to Transform Your Business?
              </h2>
              <p className="text-lg md:text-xl mb-8 opacity-90">
                Let's discuss how our capabilities can drive your success
              </p>
              <div className="flex flex-col sm:flex-row gap-4 justify-center">
                <Button
                  variant="secondary"
                  size="lg"
                  iconName="Calendar"
                  iconPosition="left"
                  className="bg-white text-primary hover:bg-white/90 w-full sm:w-auto"
                  onClick={() => navigate('/contact-consultation-portal')}
                >
                  Schedule Strategy Call
                </Button>
                <Button
                  variant="outline"
                  size="lg"
                  iconName="MessageCircle"
                  iconPosition="left"
                  className="border-white text-white hover:bg-white hover:text-primary w-full sm:w-auto"
                  onClick={() => navigate('/contact-consultation-portal')}
                >
                  Start Conversation
                </Button>
              </div>
            </div>
          </section>
        </main>

        <Footer />

        {/* Service Detail Modal */}
        <ServiceDetailModal
          service={selectedService}
          isOpen={isModalOpen}
          onClose={closeModal}
        />
      </div>
    </>
  );
};

export default CapabilityUniverse;