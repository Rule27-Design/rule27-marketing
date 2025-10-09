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

  // Portfolio data structure
  const portfolioItems = [
    {
      id: 1,
      title: "I've Been There",
      category: "video",
      categoryLabel: "VIDEO SERIES",
      description: "Short Film by Julian on the Radio",
      image: "/assets/jotr/been-there.jpg",
      link: "https://bit.ly/4eSHZgY",
      year: "2024"
    },
    {
      id: 2,
      title: "Demo 2024",
      category: "demo",
      categoryLabel: "DEMO",
      description: "Demo Reel 2024",
      image: "/assets/jotr/demo-2024.jpg",
      link: "https://soundcloud.com/julianontheradio/star-1015-seattle-2024-demo-afternoons",
      year: "2024"
    },
    {
      id: 3,
      title: "Fall 2023",
      category: "demo",
      categoryLabel: "DEMO",
      description: "Demo Reel Fall 2023",
      image: "/assets/jotr/fall-2023.jpg",
      link: "https://soundcloud.com/julianontheradio/star-1015-seattle-summerfall-demo-2023-afternoons",
      year: "2023"
    },
    {
      id: 4,
      title: "Spring 2022",
      category: "demo",
      categoryLabel: "DEMO",
      description: "Demo Reel Spring 2022",
      image: "/assets/jotr/spring-2022.jpg",
      link: "https://soundcloud.com/julianontheradio/star-1015-seattle-spring-demo-2022-afternoons",
      year: "2022"
    },
    {
      id: 5,
      title: "January 2020",
      category: "demo",
      categoryLabel: "DEMO",
      description: "Demo Reel 997 Now January 2020",
      image: "/assets/jotr/january-2020.jpg",
      link: "https://soundcloud.com/julianontheradio/julian-1st-quarter-2020-demo-997-now-fm",
      year: "2020"
    },
    {
      id: 6,
      title: "January 2020",
      category: "demo",
      categoryLabel: "DEMO",
      description: "Demo Reel Wild 949 January 2020",
      image: "/assets/jotr/january-2020-wild.jpg",
      link: "https://soundcloud.com/julianontheradio/julian-january-2020-demo-kyld-fm",
      year: "2020"
    },
    {
      id: 7,
      title: "March 2018",
      category: "demo",
      categoryLabel: "DEMO",
      description: "Demo Reel March 2018",
      image: "/assets/jotr/february-2019.jpg",
      link: "https://soundcloud.com/julianontheradio/kyld-wild-949-march-2018-afternoons-3-7p",
      year: "2018"
    },
    {
      id: 8,
      title: "Morning Show",
      category: "demo",
      categoryLabel: "DEMO",
      description: "B96 Chicago Morning Show",
      image: "/assets/jotr/b98-chicago-morning.jpg",
      link: "https://soundcloud.com/julianontheradio/b96-julian-morning-show-demo-1",
      year: "2019"
    },
    {
      id: 9,
      title: "Evening Show",
      category: "demo",
      categoryLabel: "DEMO",
      description: "B96 Chicago Evening Show",
      image: "/assets/jotr/b98-chicago-evening.jpg",
      link: "https://soundcloud.com/julianontheradio/b96-julian-night-show-demo-2",
      year: "2019"
    },
    {
      id: 10,
      title: "Less Than Zero",
      category: "video",
      categoryLabel: "VIDEO SERIES",
      description: "Weekly video podcast production",
      image: "/assets/jotr/lessthanzero.jpg",
      link: "https://www.youtube.com/lessthanzero",
      year: "2023"
    },
    {
      id: 11,
      title: "April 2021",
      category: "video",
      categoryLabel: "VIDEO SERIES",
      description: "DeDe in the morning at K-104 Dallas",
      image: "/assets/jotr/audition-reel.jpg",
      link: "https://www.youtube.com/watch?app=desktop&v=Bcdi-lrI7Dg&t=9s",
      year: "2021"
    },
    {
      id: 12,
      title: "Download Resume",
      category: "resume",
      categoryLabel: "RESUME",
      description: "Check out my experience",
      image: "/assets/jotr/resume.jpg",
      link: "/assets/jotr/resume.pdf",
      year: "2024"
    },
    {
      id: 13,
      title: "Instagram",
      category: "social",
      categoryLabel: "SOCIAL",
      description: "A snapshot of my life",
      image: "/assets/jotr/instagram.jpg",
      link: "https://www.instagram.com/julianontheradio/",
      year: "2024"
    },
    {
      id: 14,
      title: "Facebook",
      category: "social",
      categoryLabel: "SOCIAL",
      description: "Let's be friends",
      image: "/assets/jotr/facebook.jpg",
      link: "https://www.facebook.com/julianonradio/",
      year: "2024"
    },
    {
      id: 15,
      title: "TikTok",
      category: "social",
      categoryLabel: "SOCIAL",
      description: "Creative content and more",
      image: "/assets/jotr/tiktok.jpg",
      link: "https://www.tiktok.com/@julianontheradio",
      year: "2024"
    }
  ];

  // Category filter options
  const categories = [
    { value: 'all', label: 'All Work' },
    { value: 'demo', label: 'Demo Reels'},
    { value: 'video', label: 'Video Series' },
    { value: 'resume', label: 'Resume' },
    { value: 'social', label: 'Social Media' }
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
    if (link.startsWith('http') || link.endsWith('.pdf')) {
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
        <title>Journey of the Remarkable | Julian on the Radio</title>
        <meta name="description" content="Explore Julian's journey through radio, video, and digital media. From Washington DC to San Francisco, experience the creative work of Julian on the Radio." />
        <meta name="keywords" content="Julian on the Radio, radio personality, demo reels, Star 101.5, B96 Chicago, media personality" />
        <meta property="og:title" content="Journey of the Remarkable | Julian on the Radio" />
        <meta property="og:description" content="Explore Julian's creative journey through radio and digital media." />
        <meta property="og:type" content="website" />
        <meta property="og:url" content="https://www.rule27design.com/jotr" />
        <meta property="og:image" content="/assets/jotr/og-jotr.jpeg" />
        <link rel="canonical" href="https://www.rule27design.com/jotr" />
      </Helmet>

      <div className="min-h-screen bg-background">
        {/* Hero Section with Header Image */}
        <section className="relative">
          {/* Hero Header Image */}
          <div className="relative h-[40vh] sm:h-[50vh] lg:h-[80vh] overflow-hidden">
            <img 
              src="/assets/jotr/og-jotr.jpeg" 
              alt="Julian on the Radio"
              className="w-full h-full object-cover"
              onError={(e) => {
                e.target.style.display = 'none';
              }}
            />
            <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-black/40 to-transparent"></div>
            
            {/* Title Overlay */}
            <motion.div 
              className="absolute inset-0 flex items-center justify-center"
              initial={{ opacity: 0, scale: 0.9 }}
              animate={{ opacity: 1, scale: 1 }}
              transition={{ duration: 1 }}
            >
              <h1 className="font-heading-regular text-5xl sm:text-7xl lg:text-9xl tracking-wider uppercase text-center">
                <span className="text-white drop-shadow-2xl">Journey of the</span>
                <br />
                <span className="text-accent drop-shadow-2xl">Remarkable</span>
              </h1>
            </motion.div>
          </div>

          {/* Bio Section */}
          <div className="relative py-12 sm:py-16 lg:py-20 px-4 sm:px-6 lg:px-8 bg-gradient-to-b from-muted to-background">
            <div className="max-w-4xl mx-auto">
              <motion.div
                initial={{ opacity: 0, y: 30 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.8, delay: 0.3 }}
                className="space-y-6 text-center"
              >
                <p className="text-lg sm:text-xl text-text-secondary font-sans leading-relaxed">
                  Welcome to my little corner in the digital space! I'll keep this brief—I'd rather you get to know me organically through my work and social media. 
                </p>
                
                <p className="text-lg sm:text-xl text-text-secondary font-sans leading-relaxed">
                  Born and raised in Washington D.C, that's where I caught the radio bug and launched my career in the DMV. Since then, I've brought my voice to airwaves in Chicago, Phoenix, San Francisco, Seattle and most recently Las Vegas, where I co-hosted Mornings on heritage MIX 94.1.  In addition, I've hosted literally every daypart all in competitive situations.
                </p>
                
                <p className="text-lg sm:text-xl text-text-secondary font-sans leading-relaxed">
                  I've also tracked daily shows for multiple stations across the country which include, 103.5 KISS-FM Chicago, HOT 995 Washington DC, Z104.3 Baltimore, Portland's LIVE 95.5, Louisville's 99.7 DJX, and weekends at 99.7 NOW San Francisco.
                </p>
                
                <p className="text-lg sm:text-xl text-text-secondary font-sans leading-relaxed">
                  Beyond the mic, I'm a sneaker enthusiast, fashion collector, avid Rom-Com fan, and coffee connoisseur who believes the best conversations happen over good food. My passion? Creating content that makes people laugh while connecting, and sharing our differences. Because, if we're not experiencing each other's perspectives, are we really living?
                </p>

                <p className="text-lg sm:text-xl text-text-secondary font-sans leading-relaxed">
                  Currently, I'm open to meaningful opportunities across platforms whether that's radio, podcasting, on-screen hosting, or digital content creation. Let's connect and create something super dope together.
                </p>
              </motion.div>

              {/* Category Filter Pills */}
              <motion.div 
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.6, delay: 0.5 }}
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
                    <div className="relative aspect-[4/3] overflow-hidden bg-muted">
                      <img 
                        src={item.image} 
                        alt={item.title}
                        className="w-full h-full object-cover object-center transition-transform duration-700 group-hover:scale-110"
                        loading="lazy"
                        onError={(e) => {
                          e.target.src = '/assets/jotr/placeholder.jpg';
                          e.target.onerror = null;
                        }}
                      />
                      


                      {/* Category Badge */}
                      <div className="absolute top-4 left-4 z-20">
                        <span className="inline-block px-3 py-1 bg-accent/90 backdrop-blur-sm text-white text-xs font-heading-regular uppercase tracking-wider rounded-full">
                          {item.categoryLabel}
                        </span>
                      </div>

                      {/* Content Overlay */}
                      <div className={`
                        absolute inset-x-0 bottom-0 p-4 sm:p-6 text-white transform transition-all duration-500 z-30
                        ${hoveredCard === item.id ? 'translate-y-0' : 'translate-y-full'}
                      `}>
                        <h3 className="font-heading-regular text-xl sm:text-2xl mb-1 uppercase tracking-wider line-clamp-2">
                          {item.title}
                        </h3>
                        <p className="text-xs sm:text-sm text-gray-200 mb-3 font-sans line-clamp-2">
                          {item.description}
                        </p>

                        {/* View Project Link */}
                        <div className="inline-flex items-center text-accent font-heading-regular uppercase text-xs sm:text-sm tracking-wider">
                          <span>Check it out</span>
                          <Icon name="ArrowUpRight" size={14} className="ml-1" />
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
                  No Items Found
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
                Let's Connect
              </h2>
              <p className="text-lg text-text-secondary mb-8 font-sans">
                Ready to create something remarkable together? Let's start a conversation.
              </p>
              <a
                href="mailto:julianontheradio@gmail.com"
                className="group inline-flex items-center gap-2 bg-accent hover:bg-accent/90 text-white px-8 py-4 rounded-full font-heading-regular uppercase tracking-wider transition-all duration-300 transform hover:scale-105 hover:shadow-xl"
              >
                <span>Get In Touch</span>
                <Icon name="Mail" size={20} className="group-hover:translate-x-1 transition-transform" />
              </a>
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