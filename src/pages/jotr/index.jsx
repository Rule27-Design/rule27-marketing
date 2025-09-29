// src/pages/jotr/index.jsx
import React, { useState, useEffect, useCallback } from 'react';
import { Helmet } from 'react-helmet';
import { motion, AnimatePresence } from 'framer-motion';
import { useNavigate } from 'react-router-dom';
import Footer from '../../components/ui/Footer';
import Icon from '../../components/AppIcon';

const JotrPage = () => {
  const navigate = useNavigate();
  const [hoveredCard, setHoveredCard] = useState(null);
  const [selectedCategory, setSelectedCategory] = useState('all');
  const [isLoaded, setIsLoaded] = useState(false);

  // Portfolio data structure - replace with your actual project data
  const portfolioItems = [
    {
      id: 1,
      title: "I've Been There",
      category: "video",
      categoryLabel: "VIDEO SERIES",
      description: "Short Film by Julian on the Radio",
      image: "/assets/jotr/been-there.jpg",
      link: "https://bit.ly/4eSHZgY",
      year: "2024",
      metrics: { growth: "320%", engagement: "5x" }
    },
    {
      id: 2,
      title: "Demo 2024",
      category: "demo",
      categoryLabel: "DEMO",
      description: "Demo Reel 2024",
      image: "/assets/jotr/demo-2024.jpg",
      link: "https://soundcloud.com/julianontheradio/star-1015-seattle-2024-demo-afternoons",
      year: "2024",
      metrics: { conversion: "45%", speed: "2.1s" }
    },
    {
      id: 3,
      title: "Fall 2023",
      category: "demo",
      categoryLabel: "DEMO",
      description: "Demo Reel Fall 2023",
      image: "/assets/jotr/fall-2023.jpg",
      link: "https://soundcloud.com/julianontheradio/star-1015-seattle-summerfall-demo-2023-afternoons",
      year: "2023",
      metrics: { reach: "2.5M", roi: "450%" }
    },
    {
      id: 4,
      title: "Spring 2022",
      category: "demo",
      categoryLabel: "DEMO",
      description: "Demo Reel Spring 2022",
      image: "/assets/jotr/spring-2022.jpg",
      link: "https://soundcloud.com/julianontheradio/star-1015-seattle-spring-demo-2022-afternoons",
      year: "2022",
      metrics: { sales: "280%", aov: "$125" }
    },
    {
      id: 5,
      title: "January 2020",
      category: "demo",
      categoryLabel: "DEMO",
      description: "Demo Reel 997 Now January 2020",
      image: "/assets/jotr/January-2020.jpg",
      link: "https://soundcloud.com/julianontheradio/julian-1st-quarter-2020-demo-997-now-fm",
      year: "2020",
      metrics: { downloads: "50K", rating: "4.8" }
    },
    {
      id: 6,
      title: "January 2020",
      category: "demo",
      categoryLabel: "DEMO",
      description: "Demo Reel Wild 949 January 2020",
      image: "/assets/jotr/January-2020-wild.jpg",
      link: "https://soundcloud.com/julianontheradio/julian-january-2020-demo-kyld-fm",
      year: "2020",
      metrics: { efficiency: "60%", revenue: "3x" }
    },
    {
      id: 7,
      title: "February 2019",
      category: "demo",
      categoryLabel: "DEMO",
      description: "Demo Reel February 2019",
      image: "/assets/jotr/February 2019.jpg",
      link: "https://soundcloud.com/julianontheradio/wild-949-demo-february-2019-3-7p",
      year: "2019",
      metrics: { views: "1.2M", shares: "25K" }
    },
    {
      id: 8,
      title: "Morning Show",
      category: "demo",
      categoryLabel: "DEMO",
      description: "B98 Chicago Morning Show",
      image: "/assets/jotr/b98-chicago-morning.jpg",
      link: "https://soundcloud.com/julianontheradio/b96-julian-morning-show-demo-1",
      year: "2019",
      metrics: { traffic: "400%", keywords: "#1" }
    },
    {
      id: 9,
      title: "Evening Show",
      category: "demo",
      categoryLabel: "DEMO",
      description: "Salesforce implementation and automation suite",
      image: "/assets/jotr/b98-chicago-evening.jpg",
      link: "https://soundcloud.com/julianontheradio/b96-julian-night-show-demo-2",
      year: "2019",
      metrics: { automation: "85%", leads: "3x" }
    },
    {
      id: 10,
      title: "Less Than 0",
      category: "video",
      categoryLabel: "VIDEO SERIES",
      description: "Weekly video podcast production and distribution",
      image: "/assets/jotr/lessthanzero.jpg",
      link: "https://www.youtube.com/lessthanzero",
      year: "2023",
      metrics: { episodes: "52", subscribers: "15K" }
    },
    {
      id: 11,
      title: "April 2021",
      category: "video",
      categoryLabel: "VIDEO SERIES",
      description: "DeDe in the morning at K-104 Dallas",
      image: "/assets/jotr/audition-reel.jpg",
      link: "https://www.youtube.com/watch?app=desktop&v=Bcdi-lrI7Dg&t=9s",
      year: "2023",
      metrics: { followers: "125K", engagement: "8.5%" }
    },
    {
      id: 12,
      title: "Download My Resume",
      category: "resume",
      categoryLabel: "Resume",
      description: "Check me out",
      image: "/assets/jotr/resume.jpg",
      link: "/assets/jotr/resume.pdf",
      year: "2023",
      metrics: { cpm: "$12", roas: "6.2x" }
    },
    {
      id: 13,
      title: "Hello Instagram",
      category: "social",
      categoryLabel: "social",
      description: "A Snapshot of my life",
      image: "/assets/jotr/instagram.jpg",
      link: "https://www.instagram.com/julianontheradio/",
      year: "2023",
      metrics: { viral: "3", reach: "5M" }
    },
    {
      id: 14,
      title: "Hello Facebook",
      category: "social",
      categoryLabel: "social",
      description: "Let's be friends",
      image: "/assets/jotr/facebook.jpg",
      link: "https://www.facebook.com/julianonradio/",
      year: "2023",
      metrics: { users: "10K", completion: "92%" }
    },
    {
      id: 15,
      title: "Hello TikTok",
      category: "social",
      categoryLabel: "social",
      description: "TikTok content creation and influencer",
      image: "/assets/jotr/tiktok.jpg",
      link: "https://www.tiktok.com/@julianontheradio?lang=en",
      year: "2023",
      metrics: { characters: "2K", licenses: "150" }
    }
  ];

  // Category filter options
  const categories = [
    { value: 'all', label: 'All Work' },
    { value: 'demo', label: 'Demo Reels'},
    { value: 'resume', label: 'Resume' },
    { value: 'video', label: 'Video Series' }
  ];

  // Filter portfolio items based on selected category
  const filteredItems = selectedCategory === 'all' 
    ? portfolioItems 
    : portfolioItems.filter(item => item.category === selectedCategory);

  useEffect(() => {
    setIsLoaded(true);
    window.scrollTo(0, 0);
    document.documentElement.style.scrollBehavior = 'smooth';
    
    return () => {
      document.documentElement.style.scrollBehavior = 'auto';
    };
  }, []);

  const handleCardClick = useCallback((link) => {
    if (link.startsWith('http')) {
      window.open(link, '_blank', 'noopener,noreferrer');
    } else {
      navigate(link);
    }
  }, [navigate]);

  // Animation variants
  const containerVariants = {
    hidden: { opacity: 0 },
    visible: {
      opacity: 1,
      transition: {
        staggerChildren: 0.08,
        delayChildren: 0.2
      }
    }
  };

  const cardVariants = {
    hidden: { 
      opacity: 0, 
      y: 40,
      scale: 0.95 
    },
    visible: {
      opacity: 1,
      y: 0,
      scale: 1,
      transition: {
        duration: 0.6,
        ease: [0.4, 0, 0.2, 1]
      }
    }
  };

  return (
    <>
      <Helmet>
        <title>Our Work | Rule27 Design - Journey of the Remarkable</title>
        <meta name="description" content="Explore Rule27 Design's portfolio of transformative digital projects. From brand identity to web development, see how we break conventional boundaries." />
        <meta name="keywords" content="portfolio, case studies, web design, brand identity, digital marketing, Rule27 Design work, creative agency portfolio" />
        <meta property="og:title" content="Our Work | Rule27 Design - Journey of the Remarkable" />
        <meta property="og:description" content="Explore my portfolio of transformative digitals." />
        <meta property="og:type" content="website" />
        <meta property="og:url" content="https://www.rule27design.com/jotr" />
        <meta property="og:image" content="/assets/jotr/og-jotr.jpeg" />
        <link rel="canonical" href="https://www.rule27design.com/jotr" />
      </Helmet>

      <div className="min-h-screen bg-background">
        {/* Hero Section */}
        <section className="relative py-16 sm:py-20 lg:py-24 px-4 sm:px-6 lg:px-8 bg-gradient-to-b from-muted to-background overflow-hidden">
          {/* Background Pattern */}
          <div className="absolute inset-0 opacity-5">
            <div className="absolute inset-0" style={{
              backgroundImage: `repeating-linear-gradient(45deg, transparent, transparent 35px, rgba(229, 62, 62, 0.1) 35px, rgba(229, 62, 62, 0.1) 70px)`
            }}></div>
          </div>

          <div className="max-w-7xl mx-auto text-center relative z-10">
            <motion.div
              initial={{ opacity: 0, y: 30 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.8 }}
            >
              <h1 className="font-heading-regular text-5xl sm:text-6xl lg:text-8xl mb-6 tracking-wider uppercase">
                <span className="inline-block bg-gradient-to-r from-primary via-accent to-primary bg-[length:200%_auto] animate-gradient-shift bg-clip-text text-transparent">
                  Journey of the Remarkable
                </span>
              </h1>
              <p className="text-lg sm:text-xl text-text-secondary max-w-3xl mx-auto font-sans">
                Thank you for coming by my little space here in the digital world. I'll keep it brief as I'd love for you to get to know me organically through my social media channels, and weekly podcast.
              </p>
              <p className="text-lg sm:text-xl text-text-secondary max-w-3xl mx-auto font-sans">
                I'm originally from Washington D.C., and I also went to high school and college there. The DMV is also where I got my start in radio. I've worked in Washington DC, Chicago, Phoenix and currently based in San Francisco. I'm a simple, quirky, creative, and empathetic guy in a nutshell. I'm a big sneaker & fashion collector, I love Rom-Coms, love coffee and of course all foods. I especially enjoy creating fun, relatable content that makes people laugh. I genuinely love getting to know people from all walks of life because I feel like if we're not experiencing each other's differences then how is that living?
              </p>
              <p className="text-lg sm:text-xl text-text-secondary max-w-3xl mx-auto font-sans">
                I just finished up hosting Afternoons for heritage STAR 101.5 in Seattle from 2021-2024. I also tracked daily radio shows for Portland's LIVE 95.5, Louisville's 99.7 DJX, and weekends at 99.7 NOW San Francisco. I am free and clear for meaningful conversations.
              </p>
              <p className="text-lg sm:text-xl text-text-secondary max-w-3xl mx-auto font-sans">
                I am always open to chat media opportunities on different platforms as a host, or on-screen personality. I'm a very avid consumer of social media and love creating content. Feel free to email or message me with any questions.
              </p>
            </motion.div>

            {/* Category Filter Pills */}
            <motion.div 
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6, delay: 0.3 }}
              className="mt-12 flex flex-wrap justify-center gap-3"
            >
              {categories.map((category) => (
                <button
                  key={category.value}
                  onClick={() => setSelectedCategory(category.value)}
                  className={`
                    px-4 py-2 rounded-full font-heading-regular uppercase text-sm tracking-wider
                    transition-all duration-300 transform hover:scale-105
                    ${selectedCategory === category.value 
                      ? 'bg-accent text-white shadow-lg' 
                      : 'bg-white text-primary hover:bg-accent hover:text-white border border-border'
                    }
                  `}
                >
                  {category.label}
                </button>
              ))}
            </motion.div>
          </div>
        </section>

        {/* Portfolio Grid */}
        <section className="py-12 sm:py-16 lg:py-20 px-4 sm:px-6 lg:px-8">
          <div className="max-w-7xl mx-auto">
            <AnimatePresence mode="wait">
              <motion.div 
                key={selectedCategory}
                variants={containerVariants}
                initial="hidden"
                animate="visible"
                exit="hidden"
                className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 sm:gap-8"
              >
                {filteredItems.map((item) => (
                  <motion.article
                    key={item.id}
                    variants={cardVariants}
                    layout
                    onMouseEnter={() => setHoveredCard(item.id)}
                    onMouseLeave={() => setHoveredCard(null)}
                    onClick={() => handleCardClick(item.link)}
                    className="group relative bg-white rounded-xl overflow-hidden cursor-pointer transform transition-all duration-500 hover:scale-[1.02] hover:shadow-2xl"
                  >
                    {/* Image Container */}
                    <div className="relative aspect-[4/5] overflow-hidden bg-muted">
                      <img 
                        src={item.image} 
                        alt={item.title}
                        className="w-full h-full object-cover transition-transform duration-700 group-hover:scale-110"
                        onError={(e) => {
                          e.target.src = '/assets/placeholder-portfolio.jpg';
                        }}
                      />
                      
                      {/* Overlay Gradient */}
                      <div className={`
                        absolute inset-0 bg-gradient-to-t from-black via-black/40 to-transparent 
                        transition-opacity duration-500
                        ${hoveredCard === item.id ? 'opacity-100' : 'opacity-0'}
                      `}></div>

                      {/* Category Badge */}
                      <div className="absolute top-4 left-4 z-20">
                        <span className="inline-block px-3 py-1 bg-accent/90 backdrop-blur-sm text-white text-xs font-heading-regular uppercase tracking-wider rounded-full">
                          {item.categoryLabel}
                        </span>
                      </div>

                      {/* Content Overlay */}
                      <div className={`
                        absolute inset-x-0 bottom-0 p-6 text-white transform transition-all duration-500
                        ${hoveredCard === item.id ? 'translate-y-0' : 'translate-y-full'}
                      `}>
                        <h3 className="font-heading-regular text-2xl sm:text-3xl mb-2 uppercase tracking-wider">
                          {item.title}
                        </h3>
                        <p className="text-sm sm:text-base text-gray-200 mb-4 font-sans">
                          {item.description}
                        </p>
                        
                        {/* Metrics */}
                        {item.metrics && (
                          <div className="flex flex-wrap gap-4 text-xs">
                            {Object.entries(item.metrics).map(([key, value]) => (
                              <div key={key} className="flex items-center gap-1">
                                <span className="text-gray-400 uppercase">{key}:</span>
                                <span className="text-white font-bold">{value}</span>
                              </div>
                            ))}
                          </div>
                        )}

                        {/* View Project Link */}
                        <div className="mt-4 inline-flex items-center text-accent font-heading-regular uppercase text-sm tracking-wider">
                          <span>Check it out</span>
                          <Icon name="ArrowUpRight" size={16} className="ml-1" />
                        </div>
                      </div>
                    </div>

                    {/* Year Badge */}
                    <div className="absolute top-4 right-4 z-20">
                      <span className="inline-block px-2 py-1 bg-white/90 backdrop-blur-sm text-primary text-xs font-mono rounded">
                        {item.year}
                      </span>
                    </div>
                  </motion.article>
                ))}
              </motion.div>
            </AnimatePresence>

            {/* No Results Message */}
            {filteredItems.length === 0 && (
              <motion.div 
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                className="text-center py-20"
              >
                <Icon name="Package" size={48} className="mx-auto mb-4 text-text-secondary" />
                <h3 className="font-heading-regular text-2xl text-primary mb-2 uppercase tracking-wider">
                  No Demos Found
                </h3>
                <p className="text-text-secondary font-sans">
                  Try selecting a different category or check back soon for updates.
                </p>
              </motion.div>
            )}
          </div>
        </section>

        {/* CTA Section */}
        <section className="py-16 sm:py-20 px-4 sm:px-6 lg:px-8 bg-gradient-to-b from-background to-muted">
          <div className="max-w-4xl mx-auto text-center">
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.6 }}
            >
              <h2 className="font-heading-regular text-3xl sm:text-4xl lg:text-5xl mb-6 uppercase tracking-wider">
                Ready to Start Your Journey?
              </h2>
              <p className="text-lg text-text-secondary mb-8 font-sans">
                Let's create something remarkable together. Your transformation begins with a conversation.
              </p>
              <button
                onClick={() => navigate('/contact')}
                className="group inline-flex items-center gap-2 bg-accent hover:bg-accent/90 text-white px-8 py-4 rounded-full font-heading-regular uppercase tracking-wider transition-all duration-300 transform hover:scale-105 hover:shadow-xl"
              >
                <span>Let's Chat</span>
                <Icon name="ArrowRight" size={20} className="group-hover:translate-x-1 transition-transform" />
              </button>
            </motion.div>
          </div>
        </section>

        {/* Footer */}
        <Footer />
      </div>
    </>
  );
};

export default JotrPage;