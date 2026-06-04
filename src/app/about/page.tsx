// app/about/page.tsx
"use client";

import Image from "next/image";
import Link from "next/link";
import { FaUtensils, FaTruck, FaMedal, FaUsers, FaStar, FaClock, FaHeart } from "react-icons/fa";
import { MdDeliveryDining, MdRestaurantMenu } from "react-icons/md";

export default function AboutPage() {
  const features = [
    {
      icon: <FaUtensils className="text-4xl text-red-500" />,
      title: "Premium Quality",
      description: "We use only the freshest ingredients sourced from local farms to ensure every bite is delicious."
    },
    {
      icon: <FaTruck className="text-4xl text-red-500" />,
      title: "Fast Delivery",
      description: "Hot and fresh food delivered to your doorstep within 30-45 minutes."
    },
    {
      icon: <FaMedal className="text-4xl text-red-500" />,
      title: "Best Chefs",
      description: "Our experienced chefs bring years of expertise to create mouth-watering dishes."
    },
    {
      icon: <FaUsers className="text-4xl text-red-500" />,
      title: "Customer First",
      description: "Your satisfaction is our priority. We're committed to providing excellent service."
    }
  ];

  const stats = [
    { number: "50+", label: "Food Items" },
    { number: "10k+", label: "Happy Customers" },
    { number: "30+", label: "Expert Chefs" },
    { number: "4.8", label: "Customer Rating" }
  ];

  const teamMembers = [
    {
      name: "Md. Tanvir Ahammed",
      role: "Founder & CEO",
      image: "/images/team/team-1.jpg",
      bio: "Passionate about creating exceptional dining experiences."
    },
    {
      name: "Rafiqul Islam",
      role: "Head Chef",
      image: "/images/team/team-2.jpg",
      bio: "20+ years of culinary expertise in international cuisine."
    },
    {
      name: "Fatema Begum",
      role: "Operations Manager",
      image: "/images/team/team-3.jpg",
      bio: "Ensures smooth operations and customer satisfaction."
    }
  ];

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-50 to-gray-100">
      {/* Hero Section */}
      <div className="relative h-[400px] flex items-center justify-center bg-gradient-to-r from-red-600 to-red-800">
        <div className="absolute inset-0 bg-black/50"></div>
        <div className="relative z-10 text-center text-white px-4">
          <h1 className="text-5xl md:text-6xl font-bold mb-4">About Red Chili</h1>
          <p className="text-xl md:text-2xl max-w-2xl mx-auto">
            Serving delicious meals with love since 2024
          </p>
        </div>
      </div>

      {/* Our Story Section */}
      <div className="max-w-7xl mx-auto px-4 py-16">
        <div className="grid md:grid-cols-2 gap-12 items-center">
          <div>
            <h2 className="text-3xl font-bold text-gray-800 mb-4">Our Story</h2>
            <div className="w-20 h-1 bg-red-500 mb-6"></div>
            <p className="text-gray-600 leading-relaxed mb-4">
              Red Chili was born from a simple idea: to bring delicious, high-quality food 
              directly to your doorstep. What started as a small kitchen in Dhaka has now 
              grown into one of the most beloved food delivery platforms in the city.
            </p>
            <p className="text-gray-600 leading-relaxed mb-4">
              We believe that good food has the power to bring people together. That's why 
              we're committed to using only the freshest ingredients and maintaining the 
              highest standards of quality in every dish we prepare.
            </p>
            <p className="text-gray-600 leading-relaxed">
              Our team of passionate chefs and delivery partners work tirelessly to ensure 
              that every meal is prepared with care and delivered with a smile.
            </p>
          </div>
          <div className="relative h-96 rounded-2xl overflow-hidden shadow-xl">
            <img 
              src="https://images.unsplash.com/photo-1555396273-367ea4eb4db5?w=800&h=600&fit=crop"
              alt="Restaurant interior"
              className="w-full h-full object-cover"
            />
          </div>
        </div>
      </div>

      {/* Mission & Vision Section */}
      <div className="bg-white py-16">
        <div className="max-w-7xl mx-auto px-4">
          <div className="grid md:grid-cols-2 gap-8">
            <div className="bg-gray-50 p-8 rounded-2xl shadow-md">
              <h3 className="text-2xl font-bold text-gray-800 mb-3">Our Mission</h3>
              <div className="w-16 h-1 bg-red-500 mb-4"></div>
              <p className="text-gray-600 leading-relaxed">
                To provide our customers with exceptional food experiences by delivering 
                delicious, high-quality meals right to their doorstep, while maintaining 
                the highest standards of service and hygiene.
              </p>
            </div>
            <div className="bg-gray-50 p-8 rounded-2xl shadow-md">
              <h3 className="text-2xl font-bold text-gray-800 mb-3">Our Vision</h3>
              <div className="w-16 h-1 bg-red-500 mb-4"></div>
              <p className="text-gray-600 leading-relaxed">
                To become the most trusted and preferred food delivery platform in Bangladesh, 
                known for our commitment to quality, innovation, and customer satisfaction.
              </p>
            </div>
          </div>
        </div>
      </div>

      {/* Features Section */}
      <div className="max-w-7xl mx-auto px-4 py-16">
        <div className="text-center mb-12">
          <h2 className="text-3xl font-bold text-gray-800 mb-4">Why Choose Us</h2>
          <div className="w-20 h-1 bg-red-500 mx-auto"></div>
          <p className="text-gray-600 mt-4 max-w-2xl mx-auto">
            We're committed to providing the best food delivery experience
          </p>
        </div>

        <div className="grid sm:grid-cols-2 lg:grid-cols-4 gap-6">
          {features.map((feature, index) => (
            <div key={index} className="bg-white p-6 rounded-xl shadow-md hover:shadow-lg transition text-center group">
              <div className="flex justify-center mb-4">
                <div className="p-3 bg-red-50 rounded-full group-hover:bg-red-100 transition">
                  {feature.icon}
                </div>
              </div>
              <h3 className="text-xl font-semibold text-gray-800 mb-2">{feature.title}</h3>
              <p className="text-gray-500 text-sm">{feature.description}</p>
            </div>
          ))}
        </div>
      </div>

      {/* Stats Section */}
      <div className="bg-gradient-to-r from-red-600 to-red-800 py-16">
        <div className="max-w-7xl mx-auto px-4">
          <div className="grid grid-cols-2 md:grid-cols-4 gap-8">
            {stats.map((stat, index) => (
              <div key={index} className="text-center text-white">
                <p className="text-4xl md:text-5xl font-bold mb-2">{stat.number}</p>
                <p className="text-sm md:text-base text-red-100">{stat.label}</p>
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* Team Section */}
      <div className="max-w-7xl mx-auto px-4 py-16">
        <div className="text-center mb-12">
          <h2 className="text-3xl font-bold text-gray-800 mb-4">Meet Our Team</h2>
          <div className="w-20 h-1 bg-red-500 mx-auto"></div>
          <p className="text-gray-600 mt-4 max-w-2xl mx-auto">
            The passionate people behind Red Chili
          </p>
        </div>

        <div className="grid md:grid-cols-3 gap-8">
          {teamMembers.map((member, index) => (
            <div key={index} className="bg-white rounded-xl shadow-md overflow-hidden hover:shadow-lg transition">
              <div className="h-64 bg-gray-300 relative">
                <img 
                  src={member.image}
                  alt={member.name}
                  className="w-full h-full object-cover"
                  onError={(e) => {
                    (e.target as HTMLImageElement).src = "https://via.placeholder.com/400x300?text=Team+Member";
                  }}
                />
              </div>
              <div className="p-6">
                <h3 className="text-xl font-semibold text-gray-800">{member.name}</h3>
                <p className="text-red-600 text-sm mb-3">{member.role}</p>
                <p className="text-gray-500 text-sm">{member.bio}</p>
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* CTA Section */}
      <div className="bg-gray-900 py-16">
        <div className="max-w-4xl mx-auto text-center px-4">
          <h2 className="text-3xl font-bold text-white mb-4">Ready to Order?</h2>
          <p className="text-gray-300 mb-8">
            Experience the best food delivery service in town
          </p>
          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <Link
              href="/menu"
              className="inline-flex items-center gap-2 px-6 py-3 bg-red-600 text-white rounded-lg font-semibold hover:bg-red-700 transition"
            >
              <MdRestaurantMenu />
              View Menu
            </Link>
            <Link
              href="/contact"
              className="inline-flex items-center gap-2 px-6 py-3 border border-red-600 text-red-600 bg-transparent rounded-lg font-semibold hover:bg-red-600 hover:text-white transition"
            >
              <FaClock />
              Contact Us
            </Link>
          </div>
        </div>
      </div>
    </div>
  );
}