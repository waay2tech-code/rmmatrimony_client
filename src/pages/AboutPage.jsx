import { motion } from "framer-motion";
import { useNavigate } from "react-router-dom";
import { FaHeart, FaUsers, FaStar, FaCheckCircle, FaMedal } from "react-icons/fa";

const AboutPage = () => {
  const navigate = useNavigate();

  return (
    <div className="font-sans text-gray-800">
      {/* Hero Section */}
      <div className="bg-gradient-to-r from-red-600 to-orange-500 text-white py-20 px-6">
        <div className="max-w-7xl mx-auto text-center">
          <motion.h1 
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            className="text-4xl md:text-5xl font-bold mb-6"
          >
            About RM Matrimony
          </motion.h1>
          <motion.p 
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.2 }}
            className="text-xl max-w-4xl mx-auto"
          >
            South Tamil Nadu's trusted christian matrimony platform connecting hearts across the nation
          </motion.p>
        </div>
      </div>

      {/* Our Story */}
      <div className="py-16 px-6 md:px-20">
        <div className="max-w-7xl mx-auto">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 items-center">
            <motion.div
              initial={{ opacity: 0, x: -20 }}
              whileInView={{ opacity: 1, x: 0 }}
              viewport={{ once: true }}
            >
              <h2 className="text-3xl font-bold mb-6">Our Story</h2>
              <p className="text-gray-600 mb-4">
                Founded with a vision to create meaningful connections, RM Matrimony has grown to become one of the South Tamilnadu's most trusted christian matrimonial platforms. Our journey began with a simple idea - to help people find their perfect life partners through a secure and reliable platform.
              </p>
              <p className="text-gray-600 mb-4">
                Within a year,we've guided 50+ couples towards lasting happiness. Our commitment to authenticity, security, and user satisfaction has made us a preferred choice for matrimonial seekers across the country.
              </p>
              <p className="text-gray-600">
                Today, we continue to innovate and improve our services, ensuring that every user has the best possible experience in their journey to find love.
              </p>
            </motion.div>
            <motion.div
              initial={{ opacity: 0, x: 20 }}
              whileInView={{ opacity: 1, x: 0 }}
              viewport={{ once: true }}
              className="bg-gradient-to-br from-red-50 to-orange-50 p-8 rounded-xl shadow-lg"
            >
              <div className="grid grid-cols-2 gap-6">
                <div className="text-center">
                  <div className="bg-red-100 w-16 h-16 rounded-full flex items-center justify-center mx-auto mb-4">
                    <FaHeart className="text-red-600 text-2xl" />
                  </div>
                  <h3 className="font-bold text-lg mb-2">50+</h3>
                  <p className="text-gray-600">Success Stories</p>
                </div>
                <div className="text-center">
                  <div className="bg-orange-100 w-16 h-16 rounded-full flex items-center justify-center mx-auto mb-4">
                    <FaUsers className="text-orange-600 text-2xl" />
                  </div>
                  <h3 className="font-bold text-lg mb-2">200+</h3>
                  <p className="text-gray-600">Active Members</p>
                </div>
                <div className="text-center">
                  <div className="bg-yellow-100 w-16 h-16 rounded-full flex items-center justify-center mx-auto mb-4">
                    <FaStar className="text-yellow-600 text-2xl" />
                  </div>
                  <h3 className="font-bold text-lg mb-2">4.8/5</h3>
                  <p className="text-gray-600">User Rating</p>
                </div>
                <div className="text-center">
                  <div className="bg-green-100 w-16 h-16 rounded-full flex items-center justify-center mx-auto mb-4">
                    <FaMedal className="text-green-600 text-2xl" />
                  </div>
                  <h3 className="font-bold text-lg mb-2">2+</h3>
                  <p className="text-gray-600">Years of Service</p>
                </div>
              </div>
            </motion.div>
          </div>
        </div>
      </div>

      {/* Mission & Vision */}
      <div className="bg-gray-50 py-16 px-6 md:px-20">
        <div className="max-w-7xl mx-auto">
          <div className="text-center mb-12">
            <h2 className="text-3xl font-bold mb-4">Our Mission & Vision</h2>
            <p className="text-gray-600 max-w-3xl mx-auto">
              Creating meaningful connections that lead to lifelong happiness
            </p>
          </div>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
            <motion.div 
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              className="bg-white p-8 rounded-xl shadow-md"
            >
              <div className="bg-red-100 w-12 h-12 rounded-full flex items-center justify-center mb-6">
                <FaHeart className="text-red-600" />
              </div>
              <h3 className="text-2xl font-bold mb-4">Our Mission</h3>
              <p className="text-gray-600">
                To provide a secure, trustworthy, and efficient platform that connects compatible individuals seeking lifelong partnerships, fostering meaningful relationships that lead to successful marriages.
              </p>
            </motion.div>
            <motion.div 
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ delay: 0.2 }}
              className="bg-white p-8 rounded-xl shadow-md"
            >
              <div className="bg-orange-100 w-12 h-12 rounded-full flex items-center justify-center mb-6">
                <FaStar className="text-orange-600" />
              </div>
              <h3 className="text-2xl font-bold mb-4">Our Vision</h3>
              <p className="text-gray-600">
                To be the most trusted matrimonial platform in South Tamil Nadu, recognized for our commitment to authenticity, user satisfaction, and successful matchmaking through innovative technology and personalized service.
              </p>
            </motion.div>
          </div>
        </div>
      </div>

      {/* Values */}
      <div className="py-16 px-6 md:px-20">
        <div className="max-w-7xl mx-auto">
          <div className="text-center mb-12">
            <h2 className="text-3xl font-bold mb-4">Our Core Values</h2>
            <p className="text-gray-600 max-w-3xl mx-auto">
              Principles that guide everything we do
            </p>
          </div>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            <ValueCard 
              icon={<FaCheckCircle className="text-3xl text-red-600" />}
              title="Authenticity"
              description="We verify every profile to ensure genuine connections and build trust within our community."
            />
            <ValueCard 
              icon={<FaHeart className="text-3xl text-pink-500" />}
              title="Respect"
              description="We treat every individual with dignity and respect, protecting their privacy and preferences."
            />
            <ValueCard 
              icon={<FaUsers className="text-3xl text-blue-500" />}
              title="Inclusivity"
              description="Empathy we walk with our clients through every step of their journey,offering emotional understanding and compassionate support."
            />
          </div>
        </div>
      </div>

      {/* CTA Section */}
      <div className="bg-gradient-to-r from-red-600 to-orange-500 text-white py-16 px-6 md:px-20">
        <div className="max-w-7xl mx-auto text-center">
          <h2 className="text-3xl md:text-4xl font-bold mb-4">Ready to Find Your Perfect Partner?</h2>
          <p className="text-xl mb-8 max-w-2xl mx-auto">
            Join thousands of happy couples who found love through RM Matrimony
          </p>
          <button
            onClick={() => navigate("/register")}
            className="bg-white text-red-600 px-8 py-3 rounded-full font-semibold hover:bg-yellow-100 transition duration-300"
          >
            Create Your Profile
          </button>
        </div>
      </div>
    </div>
  );
};

const ValueCard = ({ icon, title, description }) => (
  <div className="bg-white p-6 rounded-xl shadow-md hover:shadow-lg transition duration-300">
    <div className="mb-4">{icon}</div>
    <h3 className="text-xl font-bold mb-2">{title}</h3>
    <p className="text-gray-600">{description}</p>
  </div>
);

export default AboutPage;