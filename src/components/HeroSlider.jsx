import { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { useNavigate } from 'react-router-dom';
import { FaChevronLeft, FaChevronRight, FaHeart, FaCheckCircle } from 'react-icons/fa';
import { useAuth } from '../context/AuthContext';
// Import local images
import hero1 from '../assets/HeroSection/hero1.png';
import hero2 from '../assets/HeroSection/hero2.png';
import hero3 from '../assets/HeroSection/hero3.png';
import hero4 from '../assets/HeroSection/hero4.png';

const HeroSlider = () => {
  const navigate = useNavigate();
  const { isAuthenticated } = useAuth();
  const [currentSlide, setCurrentSlide] = useState(0);
  const [isPaused, setIsPaused] = useState(false);
  const [imageErrors, setImageErrors] = useState({});
  const [imagesLoaded, setImagesLoaded] = useState({});

  // Slider data with essential matrimonial themes
  const slides = [
    {
      id: 1,
      title: "South Tamil Nadu's trusted Christian matrimonial services",
      subtitle: "Safe and secure matchmaking",
      description: "Experience our secure platform with verified profiles, privacy protection, and dedicated customer support for your matrimonial journey",
      cta: "Explore Profiles",
      image: hero1,
      gradient: "from-emerald-900/80 via-teal-800/70 to-cyan-900/80"
    },
    {
      id: 2,
      title: "Find Your Life Partner",
      subtitle: "Connect with verified profiles",
      description: "Discover your perfect match through our verified matrimonial platform connecting hundreds of singles across India",
      cta: "Find Your Match",
      image: hero2,
      gradient: "from-rose-900/80 via-rose-800/70 to-amber-900/80"
    },
    {
      id: 3,
      title: "Beautiful Wedding Ceremonies",
      subtitle: "Traditional rituals and celebrations",
      description: "Experience the joy of Indian Christian wedding ceremonies with traditional rituals, vibrant decorations, and family celebrations",
      cta: "Start Your Journey",
      image: hero3,
      gradient: "from-pink-900/80 via-rose-800/70 to-red-900/80"
    },
    {
      id: 4,
      title: "Happy Married Couples",
      subtitle: "Success stories from our community",
      description: "Join 50+ of happy couples who found their perfect match through our platform and built lasting relationships",
      cta: "Join Now",
      image: hero4,
      gradient: "from-violet-900/80 via-purple-800/70 to-pink-900/80"
    }
    
  ];

  // Preload images for better performance
  useEffect(() => {
    slides.forEach((slide, index) => {
      const img = new Image();
      img.onload = () => {
        setImagesLoaded(prev => ({ ...prev, [index]: true }));
        console.log(`Image ${index + 1} loaded successfully:`, slide.image);
      };
      img.onerror = () => {
        setImageErrors(prev => ({ ...prev, [index]: true }));
        console.error(`Failed to load image ${index + 1}:`, slide.image);
      };
      img.src = slide.image;
    });
  }, []);

  // Auto slide change effect
  useEffect(() => {
    if (isPaused) return;
    
    const interval = setInterval(() => {
      setCurrentSlide((prev) => (prev + 1) % slides.length);
    }, 6000); // Change slide every 6 seconds

    return () => clearInterval(interval);
  }, [slides.length, isPaused]);

  // Pause on mobile devices for better UX
  useEffect(() => {
    const isMobile = window.innerWidth < 768;
    if (isMobile) {
      setIsPaused(true);
    }
  }, []);

  const nextSlide = () => {
    setCurrentSlide((prev) => (prev + 1) % slides.length);
  };

  const prevSlide = () => {
    setCurrentSlide((prev) => (prev === 0 ? slides.length - 1 : prev - 1));
  };

  const goToSlide = (index) => {
    setCurrentSlide(index);
  };

  const handleJoinClick = () => {
    navigate("/register");
  };

  const handleBrowseClick = () => {
    if (isAuthenticated) {
      navigate("/search");
    } else {
      navigate("/register");
    }
  };

  return (
    <div className="relative w-full h-screen min-h-[500px] sm:min-h-[600px] lg:min-h-[700px] overflow-hidden">
      {/* Background Images */}
      <AnimatePresence mode="wait">
        <motion.div
          key={currentSlide}
          initial={{ opacity: 0, scale: 1.1 }}
          animate={{ opacity: 1, scale: 1 }}
          exit={{ opacity: 0, scale: 0.9 }}
          transition={{ duration: 1.2, ease: "easeInOut" }}
          className="absolute inset-0 w-full h-full"
        >
          {/* Show image if loaded successfully, otherwise show gradient */}
          {!imageErrors[currentSlide] ? (
            <>
              <img 
                src={slides[currentSlide].image}
                alt={slides[currentSlide].title}
                className="w-full h-full object-cover"
                style={{ 
                  objectFit: 'cover',
                  objectPosition: 'center',
                  opacity: imagesLoaded[currentSlide] ? 1 : 0,
                  transition: 'opacity 0.5s ease-in-out'
                }}
                onError={(e) => {
                  console.log('Image failed to load:', slides[currentSlide].image);
                  setImageErrors(prev => ({ ...prev, [currentSlide]: true }));
                  e.target.style.display = 'none';
                }}
                onLoad={() => {
                  console.log('Image loaded successfully:', slides[currentSlide].image);
                  setImagesLoaded(prev => ({ ...prev, [currentSlide]: true }));
                }}
              />
              {/* Loading placeholder */}
              {!imagesLoaded[currentSlide] && (
                <div className="absolute inset-0 bg-gradient-to-br from-rose-600 via-rose-700 to-amber-500 flex items-center justify-center">
                  <div className="text-white text-xl font-semibold">Loading...</div>
                </div>
              )}
            </>
          ) : (
            <div className="w-full h-full bg-gradient-to-br from-rose-600 via-rose-700 to-amber-500" />
          )}
          {/* Image gradient overlay */}
          <div className={`absolute inset-0 bg-gradient-to-r ${slides[currentSlide].gradient}`} />
        </motion.div>
      </AnimatePresence>

      {/* Content Overlay */}
      <div className="relative z-10 h-full flex items-center">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 md:px-8 lg:px-10 w-full">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 lg:gap-12 items-center">
            {/* Left Content */}
            <motion.div 
              key={`content-${currentSlide}`}
              initial={{ opacity: 0, x: -50 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ duration: 0.8, delay: 0.3 }}
              className="text-white space-y-4 sm:space-y-6 lg:space-y-8"
            >
              {/* Trust Indicators */}
              <motion.div 
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.6, delay: 0.5 }}
                className="flex flex-col sm:flex-row items-start sm:items-center gap-3 sm:gap-6 mb-4 sm:mb-6"
              >
                <div className="flex items-center gap-2">
                  <FaCheckCircle className="text-yellow-300 text-base sm:text-lg" />
                  <span className="text-xs sm:text-sm font-medium">100% Verified Profiles</span>
                </div>
                <div className="flex items-center gap-2">
                  <FaHeart className="text-pink-300 text-base sm:text-lg" />
                  <span className="text-xs sm:text-sm font-medium">50+ Happy Couples</span>
                </div>
              </motion.div>

              {/* Main Heading */}
              <motion.h1 
                initial={{ opacity: 0, y: 30 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.8, delay: 0.2 }}
                className="text-3xl sm:text-4xl md:text-5xl lg:text-6xl xl:text-7xl font-bold leading-tight"
              >
                Find Your <span className="text-yellow-300">Perfect</span> Match
              </motion.h1>

              {/* Subtitle */}
              <motion.h2 
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.6, delay: 0.4 }}
                className="text-lg sm:text-xl md:text-2xl lg:text-3xl font-semibold text-red-100"
              >
                {slides[currentSlide].title}
              </motion.h2>

              {/* Description */}
              <motion.p 
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.6, delay: 0.6 }}
                className="text-base sm:text-lg md:text-xl text-red-100 max-w-2xl leading-relaxed"
              >
                {slides[currentSlide].description}
              </motion.p>

              {/* CTA Buttons */}
              <motion.div 
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.6, delay: 0.8 }}
                className="flex flex-col sm:flex-row gap-3 sm:gap-4 mt-6 sm:mt-8"
              >
                <motion.button
                  whileHover={{ scale: 1.05 }}
                  whileTap={{ scale: 0.95 }}
                  onClick={handleJoinClick}
                  className="bg-white text-rose-600 px-6 sm:px-8 py-3 sm:py-4 rounded-full font-semibold hover:bg-yellow-100 transition-all duration-300 shadow-lg flex items-center justify-center gap-2 text-sm sm:text-base"
                >
                  Create Profile <FaHeart className="text-rose-500" />
                </motion.button>
                <motion.button
                  whileHover={{ scale: 1.05 }}
                  whileTap={{ scale: 0.95 }}
                  onClick={handleBrowseClick}
                  className="border-2 border-white px-6 sm:px-8 py-3 sm:py-4 rounded-full font-semibold hover:bg-white hover:text-rose-600 transition-all duration-300 text-sm sm:text-base"
                >
                  Find Matches
                </motion.button>
              </motion.div>
            </motion.div>

            {/* Right Content - Slider Info */}
            <motion.div 
              initial={{ opacity: 0, x: 50 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ duration: 0.8, delay: 0.5 }}
              className="hidden lg:flex justify-center"
            >
              <div className="bg-black/40 backdrop-blur-sm rounded-2xl p-6 lg:p-8 max-w-md w-full">
                <motion.h3 
                  key={`slide-title-${currentSlide}`}
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ duration: 0.5 }}
                  className="text-xl lg:text-2xl xl:text-3xl font-bold text-white mb-3 lg:mb-4"
                >
                  {slides[currentSlide].title}
                </motion.h3>
                <motion.p 
                  key={`slide-subtitle-${currentSlide}`}
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ duration: 0.5, delay: 0.1 }}
                  className="text-base lg:text-lg text-gray-200 mb-4 lg:mb-6"
                >
                  {slides[currentSlide].subtitle}
                </motion.p>
                <motion.button 
                  key={`slide-cta-${currentSlide}`}
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ duration: 0.5, delay: 0.2 }}
                  onClick={() => navigate("/register")}
                  whileHover={{ scale: 1.05 }}
                  whileTap={{ scale: 0.95 }}
                  className="bg-gradient-to-r from-rose-600 to-amber-500 text-white px-4 lg:px-6 py-2 lg:py-3 rounded-full font-semibold hover:from-rose-700 hover:to-amber-600 transition-all shadow-lg duration-300 w-full text-sm lg:text-base"
                >
                  Start Your Journey
                </motion.button>
              </div>
            </motion.div>
          </div>
        </div>
      </div>

      {/* Navigation Controls */}
      <div className="absolute inset-y-0 left-0 flex items-center z-20">
        <button
          onClick={prevSlide}
          onMouseEnter={() => setIsPaused(true)}
          onMouseLeave={() => setIsPaused(false)}
          className="ml-2 sm:ml-4 bg-white/20 hover:bg-white/30 backdrop-blur-sm text-white p-2 sm:p-3 rounded-full transition-all duration-300 hover:scale-110"
          aria-label="Previous slide"
        >
          <FaChevronLeft className="w-4 h-4 sm:w-6 sm:h-6" />
        </button>
      </div>

      <div className="absolute inset-y-0 right-0 flex items-center z-20">
        <button
          onClick={nextSlide}
          onMouseEnter={() => setIsPaused(true)}
          onMouseLeave={() => setIsPaused(false)}
          className="mr-2 sm:mr-4 bg-white/20 hover:bg-white/30 backdrop-blur-sm text-white p-2 sm:p-3 rounded-full transition-all duration-300 hover:scale-110"
          aria-label="Next slide"
        >
          <FaChevronRight className="w-4 h-4 sm:w-6 sm:h-6" />
        </button>
      </div>

      {/* Slide Indicators */}
      <div className="absolute bottom-4 sm:bottom-6 lg:bottom-8 left-1/2 transform -translate-x-1/2 z-20">
        <div className="flex space-x-2 sm:space-x-3">
          {slides.map((_, index) => (
            <button
              key={index}
              onClick={() => goToSlide(index)}
              onMouseEnter={() => setIsPaused(true)}
              onMouseLeave={() => setIsPaused(false)}
              className={`w-3 h-3 sm:w-4 sm:h-4 rounded-full transition-all duration-300 border-2 border-white ${
                index === currentSlide 
                  ? 'bg-white scale-125' 
                  : 'bg-transparent hover:bg-white/50'
              }`}
              aria-label={`Go to slide ${index + 1}`}
            />
          ))}
        </div>
      </div>

      {/* Progress Bar */}
      <div className="absolute bottom-0 left-0 w-full h-1 bg-white/20 z-20">
        <motion.div
          className="h-full bg-gradient-to-r from-rose-500 to-amber-500"
          initial={{ width: "0%" }}
          animate={{ width: "100%" }}
          transition={{ duration: 6, ease: "linear" }}
          key={currentSlide}
        />
      </div>
    </div>
  );
};

export default HeroSlider;