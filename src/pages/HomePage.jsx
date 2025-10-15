import { motion } from "framer-motion";
import { useNavigate } from "react-router-dom";
import { FaCheckCircle, FaHeart, FaStar, FaUsers, FaTimes, FaQuoteLeft } from "react-icons/fa";
import { useState, useEffect, useContext } from "react";
import heroImage from "../assets/hero-couple.png";
import PremiumUpgradeModal from "../components/PremiumUpgradeModal";
import HeroSlider from "../components/HeroSlider";
import { AuthContext } from "../context/AuthContext";

// Animation variants
const container = {
  hidden: { opacity: 0 },
  show: {
    opacity: 1,
    transition: {
      staggerChildren: 0.1
    }
  }
};

const item = {
  hidden: { opacity: 0, y: 20 },
  show: { opacity: 1, y: 0 }
};

const fadeIn = {
  hidden: { opacity: 0 },
  show: { opacity: 1, transition: { duration: 0.8 } }
};

const HomePage = () => {
  const navigate = useNavigate();
  const { user } = useContext(AuthContext);
  const [showContactForm, setShowContactForm] = useState(false);
  const [showPremiumModal, setShowPremiumModal] = useState(false);
  const [email, setEmail] = useState('');
  const [message, setMessage] = useState('');
  const [loading, setLoading] = useState(false);
  const handleJoinClick = () => {
    navigate("/register");
  };

  const handleMatchmakingClick = () => {
    if (user) {
      navigate("/matches");
    } else {
      navigate("/register");
    }
  };

  const handleContactSubmit = async (e) => {
   console.log("hello");
   
    e.preventDefault();
    setLoading(true);
    
    try {
      const response = await fetch('http://localhost:5000/api/contact', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          email,
          message
        }),
      });
  
      const result = await response.json();
  
      if (response.ok) {
        alert('Message sent successfully!');
        setEmail('');
        setMessage('');
        setShowContactForm(false);
      } else {
        // Handle validation errors
        if (result.errors) {
          const errorMessages = result.errors.map(err => err.msg).join(', ');
          alert(`Validation Error: ${errorMessages}`);
        } else {
          alert(result.message || 'Failed to send message');
        }
      }
    } catch (error) {
      console.error('Error:', error);
      alert('Network error. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="font-sans text-gray-800 overflow-x-hidden">
      {/* Hero Slider Section */}
      <HeroSlider />

      {/* Stats Section */}
      <motion.div 
        initial="hidden"
        whileInView="show"
        viewport={{ once: true }}
        variants={container}
        className="bg-white py-12 px-6 md:px-20"
      >
        <div className="max-w-7xl mx-auto">
          <div className="grid grid-cols-2 md:grid-cols-4 gap-8 text-center">
            {[
              ["200+", "Active Members"],
              ["40+", "Success Stories"],
              ["500+", "Daily Matches"],
              ["98%", "Satisfaction Rate"],
            ].map(([value, label], i) => (
              <motion.div key={i} variants={item} className="p-4">
                <motion.h2 
                  whileHover={{ scale: 1.1 }}
                  className="text-3xl md:text-4xl font-bold text-red-600 mb-2"
                >
                  {value}
                </motion.h2>
                <p className="text-gray-600 font-medium">{label}</p>
              </motion.div>
            ))}
          </div>
        </div>
      </motion.div>

      {/* How It Works */}
      <div className="bg-gradient-to-br from-gray-50 to-gray-100 py-16 px-6 md:px-20">
        <div className="max-w-7xl mx-auto">
          <motion.div 
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            className="text-center mb-12"
          >
            <h2 className="text-3xl md:text-4xl font-bold text-gray-800 mb-4">How RM Matrimony Works</h2>
            <p className="text-gray-600 max-w-2xl mx-auto">
              Finding your perfect partner is just three simple steps away
            </p>
          </motion.div>
          
          <motion.div 
            initial="hidden"
            whileInView="show"
            viewport={{ once: true }}
            variants={container}
            className="grid grid-cols-1 md:grid-cols-3 gap-8"
          >
            <StepCard 
              number="1"
              title="Create Profile"
              description="Sign up and create your detailed profile with photos and preferences"
            />
            <StepCard 
              number="2"
              title="Find Matches"
              description="Our smart algorithm finds compatible matches based on your criteria"
            />
            <StepCard 
              number="3"
              title="Connect & Meet"
              description="Connect with matches and arrange meetings to find your perfect partner"
            />
          </motion.div>
        </div>
      </div>

      {/* Why Choose Us Section */}
      <div className="bg-white py-16 px-6 md:px-20">
        <div className="max-w-7xl mx-auto">
          <motion.h2 
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.6 }}
            className="text-3xl md:text-4xl font-bold text-gray-800 text-center mb-4"
          >
            Why Choose RM Matrimony?
          </motion.h2>
          <motion.p 
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.6, delay: 0.2 }}
            className="text-gray-600 text-center max-w-2xl mx-auto mb-12"
          >
            We provide the most secure, efficient, and successful platform for finding your life partner.
          </motion.p>
          <motion.div 
            initial="hidden"
            whileInView="show"
            viewport={{ once: true }}
            variants={container}
            className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6"
          >
            <motion.div variants={item}>
              <FeatureCard 
                icon={<FaCheckCircle className="text-red-500 text-3xl" />} 
                title="Verified Profiles" 
                desc="Each profile is manually verified for authenticity and safety." 
              />
            </motion.div>
            <motion.div variants={item}>
              <FeatureCard 
                icon={<FaHeart className="text-red-500 text-3xl" />} 
                title="Smart Matching" 
                desc="AI-powered algorithm finds your compatible soulmate quickly." 
              />
            </motion.div>
            <motion.div variants={item}>
              <FeatureCard 
                icon={<FaStar className="text-red-500 text-3xl" />} 
                title="Success Stories" 
                desc="Over 50,000+ successful matches through our platform." 
              />
            </motion.div>
            <motion.div variants={item}>
              <FeatureCard 
                icon={<FaUsers className="text-red-500 text-3xl" />} 
                title="Premium Support" 
                desc="24/7 customer support to help you find your perfect match." 
              />
            </motion.div>
          </motion.div>
        </div>
      </div>

      {/* Success Stories */}
      <div className="bg-gradient-to-br from-red-50 to-orange-50 py-16 px-6 md:px-20">
        <div className="max-w-7xl mx-auto">
          <motion.h2 
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.6 }}
            className="text-3xl font-bold text-center mb-4"
          >
            Success Stories
          </motion.h2>
          <motion.p 
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.6, delay: 0.2 }}
            className="text-gray-600 text-center max-w-2xl mx-auto mb-12"
          >
            Real stories from real couples who found love through RM Matrimony
          </motion.p>
          <motion.div 
            initial="hidden"
            whileInView="show"
            viewport={{ once: true }}
            variants={container}
            className="grid grid-cols-1 md:grid-cols-2 gap-8"
          >
            <motion.div variants={item}>
              <StoryCard 
                name="Priya & Rajesh" 
                content="Found my soulmate through RM Matrimony. The matching algorithm is incredible! We connected within a week of joining and got married within a year. Highly recommend!" 
                location="Chennai, Tamil Nadu"
              />
            </motion.div>
            <motion.div variants={item}>
              <StoryCard 
                name="Sneha & Vikram" 
                content="User-friendly interface, verified profiles and excellent customer service! The team helped us throughout our journey. We found each other in just 3 months!" 
                location="Bangalore, Karnataka"
              />
            </motion.div>
          </motion.div>
        </div>
      </div>

      {/* Testimonials */}
      <div className="bg-white py-16 px-6 md:px-20">
        <div className="max-w-7xl mx-auto">
          <motion.h2 
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.6 }}
            className="text-3xl font-bold text-center mb-4"
          >
            What Our Members Say
          </motion.h2>
          <motion.p 
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.6, delay: 0.2 }}
            className="text-gray-600 text-center max-w-2xl mx-auto mb-12"
          >
            Hear from our community of happy members
          </motion.p>
          <motion.div 
            initial="hidden"
            whileInView="show"
            viewport={{ once: true }}
            variants={container}
            className="grid grid-cols-1 lg:grid-cols-3 gap-8"
          >
            <TestimonialCard 
              quote="The verification process gave me confidence that I was connecting with real people. Found my partner within 2 months!"
              author="Anjali"
              role="Member since 2023"
            />
            <TestimonialCard 
              quote="As a working professional, I appreciated the privacy options. The matching algorithm understood what I was looking for."
              author="Rahul"
              role="Member since 2022"
            />
            <TestimonialCard 
              quote="The customer support team was incredibly helpful throughout my journey. They made the entire process smooth."
              author="Kavita"
              role="Member since 2023"
            />
          </motion.div>
        </div>
      </div>

      {/* CTA Section */}
      <motion.div 
        initial={{ opacity: 0 }}
        whileInView={{ opacity: 1 }}
        viewport={{ once: true }}
        transition={{ duration: 0.8 }}
        className="bg-gradient-to-br from-red-600 to-orange-500 text-white py-16 px-6 md:px-20 text-center relative"
      >
        <motion.h2 
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.6 }}
          className="text-3xl md:text-4xl font-bold mb-4"
        >
          Ready to Find Your Soulmate?
        </motion.h2>
        <motion.p 
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.6, delay: 0.2 }}
          className="text-xl mb-8 max-w-2xl mx-auto"
        >
          Join thousands of happy couples who found love through RM Matrimony
        </motion.p>
        <div className="flex flex-col sm:flex-row justify-center gap-4">
          <motion.button
            whileHover={{ scale: 1.05 }}
            whileTap={{ scale: 0.95 }}
            onClick={handleJoinClick}
            className="bg-white text-red-600 px-8 py-4 rounded-full font-semibold hover:bg-yellow-100 transition-all duration-300 shadow-lg"
          >
            Start Your Journey ❤️
          </motion.button>
          <motion.button
            whileHover={{ scale: 1.05 }}
            whileTap={{ scale: 0.95 }}
            onClick={() => setShowContactForm(true)}
            className="bg-transparent border-2 border-white px-8 py-4 rounded-full font-semibold hover:bg-white hover:text-red-600 transition-all duration-300"
          >
            Contact Us
          </motion.button>
        </div>

        {/* Contact Form Modal */}
        {showContactForm && (
          <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center p-4 z-50">
            <motion.div 
              initial={{ opacity: 0, scale: 0.9 }}
              animate={{ opacity: 1, scale: 1 }}
              className="bg-white rounded-xl shadow-2xl w-full max-w-md"
            >
              <div className="p-6">
                <div className="flex justify-between items-center mb-4">
                  <h3 className="text-xl font-bold text-gray-800">Contact Us</h3>
                  <button 
                    onClick={() => setShowContactForm(false)}
                    className="text-gray-500 hover:text-gray-700"
                  >
                    <FaTimes />
                  </button>
                </div>
                
                <p className="text-gray-600 mb-6">
                  Have an inquiry or a complaint? Send us a message and we'll get back to you.
                </p>
                
                <form onSubmit={handleContactSubmit} className="space-y-4">
                <div>
  <label className="block text-sm font-medium text-gray-700 mb-1">Email</label>
  <input
    type="email"
    value={email}
    onChange={(e) => setEmail(e.target.value)}
    required
    className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-orange-500 text-black"
    placeholder="your@email.com"
  />
</div>

                  
                  <div>
  <label className="block text-sm font-medium text-gray-700 mb-1">Message</label>
  <textarea
    value={message}
    onChange={(e) => setMessage(e.target.value)}
    required
    rows="4"
    className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-orange-500 text-black"
    placeholder="Your message..."
  />
</div>

                  
                  <button
                    type="submit"
                    disabled={loading}
                    className="w-full py-3 bg-orange-500 text-white rounded-md hover:bg-orange-600 transition duration-200 disabled:opacity-50 font-semibold"
                  >
                    {loading ? "Sending..." : "Send Message"}
                  </button>
                </form>
              </div>
            </motion.div>
          </div>
        )}
        <PremiumUpgradeModal isOpen={showPremiumModal} onClose={() => setShowPremiumModal(false)} />
      </motion.div>

      {/* Footer */}
      <footer className="bg-gray-900 text-white pt-16 pb-8 px-6 md:px-20">
        <div className="max-w-7xl mx-auto">
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-5 gap-8 mb-12">
            <div className="lg:col-span-2">
              <h3 className="text-2xl font-bold mb-4">RM Matrimony</h3>
              <p className="text-gray-400 mb-6 max-w-md">
                India's most trusted matrimony platform with verified profiles and advanced matching technology. Helping you find your perfect life partner.
              </p>
              <div className="flex space-x-4">
                <a href="https://www.facebook.com/profile.php?id=61555915692275" className="bg-gray-800 p-2 rounded-full hover:bg-red-600 transition">
                  <span className="sr-only">Facebook</span>
                  <svg className="h-5 w-5" fill="currentColor" viewBox="0 0 24 24" aria-hidden="true">
                    <path fillRule="evenodd" d="M22 12c0-5.523-4.477-10-10-10S2 6.477 2 12c0 4.991 3.657 9.128 8.438 9.878v-6.987h-2.54V12h2.54V9.797c0-2.506 1.492-3.89 3.777-3.89 1.094 0 2.238.195 2.238.195v2.46h-1.26c-1.243 0-1.63.771-1.63 1.562V12h2.773l-.443 2.89h-2.33v6.988C18.343 21.128 22 16.991 22 12z" clipRule="evenodd" />
                  </svg>
                </a>
                <a href="https://www.instagram.com/rmmatrimony/" className="bg-gray-800 p-2 rounded-full hover:bg-red-600 transition">
                  <span className="sr-only">Instagram</span>
                  <svg className="h-5 w-5" fill="currentColor" viewBox="0 0 24 24" aria-hidden="true">
                    <path fillRule="evenodd" d="M12.315 2c2.43 0 2.784.013 3.808.06 1.064.049 1.791.218 2.427.465a4.902 4.902 0 011.772 1.153 4.902 4.902 0 011.153 1.772c.247.636.416 1.363.465 2.427.048 1.067.06 1.407.06 4.123v.08c0 2.643-.012 2.987-.06 4.043-.049 1.064-.218 1.791-.465 2.427a4.902 4.902 0 01-1.153 1.772 4.902 4.902 0 01-1.772 1.153c-.636.247-1.363.416-2.427.465-1.067.048-1.407.06-4.123.06h-.08c-2.643 0-2.987-.012-4.043-.06-1.064-.049-1.791-.218-2.427-.465a4.902 4.902 0 01-1.772-1.153 4.902 4.902 0 01-1.153-1.772c-.247-.636-.416-1.363-.465-2.427-.047-1.024-.06-1.379-.06-3.808v-.63c0-2.43.013-2.784.06-3.808.049-1.064.218-1.791.465-2.427a4.902 4.902 0 011.153-1.772A4.902 4.902 0 015.45 2.525c.636-.247 1.363-.416 2.427-.465C8.901 2.013 9.256 2 11.685 2h.63zm-.081 1.802h-.468c-2.456 0-2.784.011-3.807.058-.975.045-1.504.207-1.857.344-.467.182-.8.398-1.15.748-.35.35-.566.683-.748 1.15-.137.353-.3.882-.344 1.857-.047 1.023-.058 1.351-.058 3.807v.468c0 2.456.011 2.784.058 3.807.045.975.207 1.504.344 1.857.182.466.399.8.748 1.15.35.35.683.566 1.15.748.353.137.882.3 1.857.344 1.054.048 1.37.058 4.041.058h.08c2.597 0 2.917-.01 3.96-.058.976-.045 1.505-.207 1.858-.344.466-.182.8-.398 1.15-.748.35-.35.566-.683.748-1.15.137-.353.3-.882.344-1.857.048-1.055.058-1.37.058-4.041v-.08c0-2.597-.01-2.917-.058-3.96-.045-.976-.207-1.505-.344-1.858a3.097 3.097 0 00-.748-1.15 3.098 3.098 0 00-1.15-.748c-.353-.137-.882-.3-1.857-.344-1.023-.047-1.351-.058-3.807-.058zM12 6.865a5.135 5.135 0 110 10.27 5.135 5.135 0 010-10.27zm0 1.802a3.333 3.333 0 100 6.666 3.333 3.333 0 000-6.666zm5.338-3.205a1.2 1.2 0 110 2.4 1.2 1.2 0 010-2.4z" clipRule="evenodd" />
                  </svg>
                </a>
                <a href="#" className="bg-gray-800 p-2 rounded-full hover:bg-red-600 transition">
                  <span className="sr-only">Twitter</span>
                  <svg className="h-5 w-5" fill="currentColor" viewBox="0 0 24 24" aria-hidden="true">
                    <path d="M8.29 20.251c7.547 0 11.675-6.253 11.675-11.675 0-.178 0-.355-.012-.53A8.348 8.348 0 0022 5.92a8.19 8.19 0 01-2.357.646 4.118 4.118 0 001.804-2.27 8.224 8.224 0 01-2.605.996 4.107 4.107 0 00-6.993 3.743 11.65 11.65 0 01-8.457-4.287 4.106 4.106 0 001.27 5.477A4.072 4.072 0 012.8 9.713v.052a4.105 4.105 0 003.292 4.022 4.095 4.095 0 01-1.853.07 4.108 4.108 0 003.834 2.85A8.233 8.233 0 012 18.407a11.616 11.616 0 006.29 1.84" />
                  </svg>
                </a>
              </div>
            </div>
            
            <div>
              <h4 className="font-semibold text-lg mb-4">Quick Links</h4>
              <ul className="space-y-3">
                <li><button onClick={() => navigate("/")} className="text-gray-400 hover:text-white transition">Home</button></li>
                <li><button onClick={() => navigate("/about")} className="text-gray-400 hover:text-white transition">About Us</button></li>
                <li><button onClick={() => navigate("/search")} className="text-gray-400 hover:text-white transition">Search Profiles</button></li>
                <li><button onClick={() => setShowContactForm(true)} className="text-gray-400 hover:text-white transition">Contact Us</button></li>
              </ul>
            </div>
            
            <div>
              <h4 className="font-semibold text-lg mb-4">Services</h4>
              <ul className="space-y-3">
                <li><button onClick={() => navigate("/register")} className="text-gray-400 hover:text-white transition text-left w-full">Profile Creation</button></li>
                <li><button onClick={handleMatchmakingClick} className="text-gray-400 hover:text-white transition text-left w-full">Matchmaking</button></li>
                <li><button onClick={() => setShowPremiumModal(true)} className="text-gray-400 hover:text-white transition text-left w-full">Premium Plans</button></li>
                <li><a href="#" className="text-gray-400 hover:text-white transition">Success Stories</a></li>
              </ul>
            </div>
            
            <div>
              <h4 className="font-semibold text-lg mb-4">Contact Info</h4>
              <ul className="space-y-3 text-gray-400">
                <li className="flex items-start">
                  <svg className="h-5 w-5 mr-2 mt-0.5" fill="currentColor" viewBox="0 0 20 20">
                    <path d="M2.003 5.884L10 9.882l7.997-3.998A2 2 0 0016 4H4a2 2 0 00-1.997 1.884z" />
                    <path d="M18 8.118l-8 4-8-4V14a2 2 0 002 2h12a2 2 0 002-2V8.118z" />
                  </svg>
                  <span> rmmatrimony2024@gmail.com</span>
                </li>
                <li className="flex items-start">
                  <svg className="h-5 w-5 mr-2 mt-0.5" fill="currentColor" viewBox="0 0 20 20">
                    <path d="M2 3a1 1 0 011-1h2.153a1 1 0 01.986.836l.74 4.435a1 1 0 01-.54 1.06l-1.548.773a11.037 11.037 0 006.105 6.105l.774-1.548a1 1 0 011.059-.54l4.435.74a1 1 0 01.836.986V17a1 1 0 01-1 1h-2C7.82 18 2 12.18 2 5V3z" />
                  </svg>
                  <span>+91 98944 08100</span>
                </li>
                <li className="flex items-start">
                  <svg className="h-5 w-5 mr-2 mt-0.5" fill="currentColor" viewBox="0 0 20 20">
                    <path fillRule="evenodd" d="M5.05 4.05a7 7 0 119.9 9.9L10 18.9l-4.95-4.95a7 7 0 010-9.9zM10 11a2 2 0 100-4 2 2 0 000 4z" clipRule="evenodd" />
                  </svg>
                  <span>Nagercoil, Tamil Nadu, India</span>
                </li>
              </ul>
            </div>
          </div>
          
          <div className="border-t border-gray-800 pt-8 mt-8 text-center text-gray-500">
            <p>&copy; {new Date().getFullYear()} RM Matrimony. All rights reserved.❤️ Developed by W2T</p>
          </div>
        </div>
      </footer>
    </div>
  );
};

const FeatureCard = ({ icon, title, desc }) => (
  <motion.div 
    whileHover={{ y: -5 }}
    className="bg-white p-6 rounded-xl shadow-lg hover:shadow-xl transition-all duration-300 h-full"
  >
    <div className="mb-4">{icon}</div>
    <h3 className="text-lg font-semibold mb-2">{title}</h3>
    <p className="text-gray-600 text-sm">{desc}</p>
  </motion.div>
);

const StoryCard = ({ name, content, location }) => (
  <motion.div 
    whileHover={{ y: -5 }}
    className="bg-gradient-to-br from-white to-red-50 p-6 rounded-xl shadow-lg hover:shadow-xl transition-all duration-300"
  >
    <div className="flex items-center mb-4">
      <div className="bg-gradient-to-r from-red-500 to-orange-400 w-12 h-12 rounded-full flex items-center justify-center text-white font-bold text-lg mr-4">
        {name.charAt(0)}
      </div>
      <div>
        <h3 className="font-bold text-lg">{name}</h3>
        <p className="text-gray-600 text-sm">{location}</p>
      </div>
    </div>
    <p className="text-gray-700">"{content}"</p>
  </motion.div>
);

const TestimonialCard = ({ quote, author, role }) => (
  <motion.div 
    whileHover={{ y: -5 }}
    className="bg-white p-6 rounded-xl shadow-lg hover:shadow-xl transition-all duration-300"
  >
    <div className="text-orange-500 mb-4">
      <FaQuoteLeft className="text-2xl" />
    </div>
    <p className="text-gray-700 mb-6 italic">"{quote}"</p>
    <div>
      <p className="font-semibold">{author}</p>
      <p className="text-gray-600 text-sm">{role}</p>
    </div>
  </motion.div>
);

const StepCard = ({ number, title, description }) => (
  <motion.div 
    whileHover={{ y: -5 }}
    className="bg-white p-6 rounded-xl shadow-lg hover:shadow-xl transition-all duration-300 text-center"
  >
    <div className="bg-gradient-to-r from-red-500 to-orange-400 w-16 h-16 rounded-full flex items-center justify-center text-white font-bold text-2xl mx-auto mb-4">
      {number}
    </div>
    <h3 className="text-xl font-bold mb-2">{title}</h3>
    <p className="text-gray-600">{description}</p>
  </motion.div>
);

export default HomePage;