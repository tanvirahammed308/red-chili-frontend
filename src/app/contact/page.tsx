
"use client";

import { useState } from "react";
import { FaMapMarkerAlt, FaPhone, FaEnvelope, FaClock, FaFacebook, FaTwitter, FaInstagram, FaWhatsapp, FaPaperPlane } from "react-icons/fa";

import { RiCustomerService2Fill } from "react-icons/ri";
import Swal from "sweetalert2";

export default function ContactPage() {
  const [formData, setFormData] = useState({
    name: "",
    email: "",
    subject: "",
    message: ""
  });
  const [isSubmitting, setIsSubmitting] = useState(false);

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value
    });
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsSubmitting(true);

    // Simulate API call
    setTimeout(() => {
      Swal.fire({
        icon: "success",
        title: "Message Sent!",
        text: "Thank you for contacting us. We'll get back to you soon.",
        confirmButtonColor: "#dc2626",
      });
      setFormData({ name: "", email: "", subject: "", message: "" });
      setIsSubmitting(false);
    }, 1500);
  };

  const contactInfo = [
    {
      icon: <FaMapMarkerAlt className="text-3xl text-red-600" />,
      title: "Visit Us",
      details: ["123 Food Street, Dhaka", "Bangladesh - 1200"],
      action: null
    },
    {
      icon: <FaPhone className="text-3xl text-red-600" />,
      title: "Call Us",
      details: ["+880 1234 56789", "+880 9876 54321"],
      action: "tel:+880123456789"
    },
    {
      icon: <FaEnvelope className="text-3xl text-red-600" />,
      title: "Email Us",
      details: ["support@redchili.com", "info@redchili.com"],
      action: "mailto:support@redchili.com"
    },
    {
      icon: <FaClock className="text-3xl text-red-600" />,
      title: "Opening Hours",
      details: ["Mon - Fri: 10:00 AM - 11:00 PM", "Sat - Sun: 11:00 AM - 12:00 AM"],
      action: null
    }
  ];

  const faqs = [
    {
      question: "How do I place an order?",
      answer: "You can place an order by browsing our menu, selecting your favorite items, adding them to cart, and proceeding to checkout."
    },
    {
      question: "What payment methods do you accept?",
      answer: "We accept cash on delivery, credit/debit cards, mobile banking (bKash, Nagad), and online payment."
    },
    {
      question: "How long does delivery take?",
      answer: "Delivery usually takes 30-45 minutes depending on your location and traffic conditions."
    },
    {
      question: "Can I cancel my order?",
      answer: "Yes, you can cancel your order within 5 minutes of placing it. Contact our support team for assistance."
    },
    {
      question: "Do you offer bulk orders for events?",
      answer: "Yes, we offer bulk ordering for parties, corporate events, and gatherings. Please contact us at least 24 hours in advance."
    },
    {
      question: "Is there a minimum order amount?",
      answer: "The minimum order amount is ৳200 for delivery. For pickup, there's no minimum amount."
    }
  ];

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-50 to-gray-100">
      {/* Hero Section */}
      <div className="relative h-[300px] flex items-center justify-center bg-gradient-to-r from-red-600 to-red-800">
        <div className="absolute inset-0 bg-black/50"></div>
        <div className="relative z-10 text-center text-white px-4">
          <h1 className="text-5xl md:text-6xl font-bold mb-4">Contact Us</h1>
          <p className="text-xl md:text-2xl max-w-2xl mx-auto">
            We'd love to hear from you
          </p>
        </div>
      </div>

      <div className="max-w-7xl mx-auto px-4 py-16">
        {/* Contact Info Cards */}
        <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-6 mb-16">
          {contactInfo.map((info, index) => (
            <div key={index} className="bg-white p-6 rounded-xl shadow-md hover:shadow-lg transition text-center group">
              <div className="flex justify-center mb-4">
                <div className="p-3 bg-red-50 rounded-full group-hover:bg-red-100 transition">
                  {info.icon}
                </div>
              </div>
              <h3 className="text-lg font-semibold text-gray-800 mb-2">{info.title}</h3>
              {info.details.map((detail, i) => (
                <p key={i} className="text-gray-500 text-sm">{detail}</p>
              ))}
              {info.action && (
                <a
                  href={info.action}
                  className="inline-block mt-3 text-red-600 text-sm font-medium hover:underline"
                >
                  Contact Now →
                </a>
              )}
            </div>
          ))}
        </div>

        {/* Contact Form & Map Section */}
        <div className="grid lg:grid-cols-2 gap-12 mb-16">
          {/* Contact Form */}
          <div className="bg-white rounded-2xl shadow-xl p-8">
            <div className="mb-6">
              <h2 className="text-2xl font-bold text-gray-800 mb-2">Send us a Message</h2>
              <div className="w-20 h-1 bg-red-600"></div>
              <p className="text-gray-500 mt-4">
                Have a question or feedback? Fill out the form below and we'll get back to you within 24 hours.
              </p>
            </div>

            <form onSubmit={handleSubmit} className="space-y-5">
              <div>
                <label className="block text-gray-700 font-medium mb-2">Your Name *</label>
                <input
                  type="text"
                  name="name"
                  value={formData.name}
                  onChange={handleChange}
                  required
                  className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-red-500 focus:border-transparent"
                  placeholder="Enter your name"
                />
              </div>

              <div>
                <label className="block text-gray-700 font-medium mb-2">Email Address *</label>
                <input
                  type="email"
                  name="email"
                  value={formData.email}
                  onChange={handleChange}
                  required
                  className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-red-500 focus:border-transparent"
                  placeholder="your@email.com"
                />
              </div>

              <div>
                <label className="block text-gray-700 font-medium mb-2">Subject *</label>
                <select
                  name="subject"
                  value={formData.subject}
                  onChange={handleChange}
                  required
                  className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-red-500 focus:border-transparent"
                >
                  <option value="">Select a subject</option>
                  <option value="Order Issue">Order Issue</option>
                  <option value="Delivery Question">Delivery Question</option>
                  <option value="Feedback">Feedback</option>
                  <option value="Partnership">Partnership Inquiry</option>
                  <option value="Other">Other</option>
                </select>
              </div>

              <div>
                <label className="block text-gray-700 font-medium mb-2">Message *</label>
                <textarea
                  name="message"
                  value={formData.message}
                  onChange={handleChange}
                  required
                  rows={5}
                  className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-red-500 focus:border-transparent"
                  placeholder="Tell us how we can help..."
                />
              </div>

              <button
                type="submit"
                disabled={isSubmitting}
                className="w-full bg-red-600 text-white py-3 rounded-lg font-semibold hover:bg-red-700 transition flex items-center justify-center gap-2 disabled:opacity-50"
              >
                {isSubmitting ? (
                  <>
                    <svg className="animate-spin h-5 w-5 text-white" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                      <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                      <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                    </svg>
                    Sending...
                  </>
                ) : (
                  <>
                    <FaPaperPlane />
                    Send Message
                  </>
                )}
              </button>
            </form>
          </div>

          {/* Map & Social */}
          <div className="space-y-8">
            {/* Map */}
            <div className="bg-white rounded-2xl shadow-xl overflow-hidden">
              <div className="h-[300px] bg-gray-200 relative">
                <iframe
                  src="https://www.google.com/maps/embed?pb=!1m18!1m12!1m3!1d3652.348253476114!2d90.3949083!3d23.747409!2m3!1f0!2f0!3f0!3m2!1i1024!2i768!4f13.1!3m3!1m2!1s0x3755b8b3a1c7b9c1%3A0x5c8b3a1c7b9c1e0!2sDhaka!5e0!3m2!1sen!2sbd!4v1700000000000!5m2!1sen!2sbd"
                  width="100%"
                  height="100%"
                  style={{ border: 0 }}
                  allowFullScreen
                  loading="lazy"
                  referrerPolicy="no-referrer-when-downgrade"
                  title="Red Chili Location"
                ></iframe>
              </div>
              <div className="p-6">
                <h3 className="text-lg font-semibold text-gray-800 mb-2">Find Us</h3>
                <p className="text-gray-500">123 Food Street, Dhaka, Bangladesh</p>
              </div>
            </div>

            {/* Social Media */}
            <div className="bg-white rounded-2xl shadow-xl p-6">
              <h3 className="text-lg font-semibold text-gray-800 mb-4">Connect With Us</h3>
              <p className="text-gray-500 mb-4">Follow us on social media for updates and offers</p>
              <div className="flex gap-4">
                <a
                  href="https://facebook.com"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="w-12 h-12 bg-blue-600 text-white rounded-full flex items-center justify-center hover:bg-blue-700 transition transform hover:scale-110"
                >
                  <FaFacebook size={24} />
                </a>
                <a
                  href="https://twitter.com"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="w-12 h-12 bg-sky-500 text-white rounded-full flex items-center justify-center hover:bg-sky-600 transition transform hover:scale-110"
                >
                  <FaTwitter size={24} />
                </a>
                <a
                  href="https://instagram.com"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="w-12 h-12 bg-pink-600 text-white rounded-full flex items-center justify-center hover:bg-pink-700 transition transform hover:scale-110"
                >
                  <FaInstagram size={24} />
                </a>
                <a
                  href="https://wa.me/880123456789"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="w-12 h-12 bg-green-600 text-white rounded-full flex items-center justify-center hover:bg-green-700 transition transform hover:scale-110"
                >
                  <FaWhatsapp size={24} />
                </a>
              </div>
            </div>

            {/* Support Hours */}
            <div className="bg-gradient-to-r from-red-600 to-red-800 rounded-2xl shadow-xl p-6 text-white">
              <div className="flex items-center gap-3 mb-4">
                <RiCustomerService2Fill className="text-3xl" />
                <h3 className="text-xl font-semibold">24/7 Customer Support</h3>
              </div>
              <p className="text-red-100 mb-4">
                Our support team is available around the clock to assist you with any questions or concerns.
              </p>
              <div className="flex items-center gap-2">
                <FaPhone />
                <span className="font-semibold">+880 1234 56789</span>
              </div>
            </div>
          </div>
        </div>

        {/* FAQ Section */}
        <div className="bg-white rounded-2xl shadow-xl p-8">
          <div className="text-center mb-8">
            <h2 className="text-3xl font-bold text-gray-800 mb-2">Frequently Asked Questions</h2>
            <div className="w-20 h-1 bg-red-600 mx-auto"></div>
            <p className="text-gray-500 mt-4">
              Find answers to common questions about our service
            </p>
          </div>

          <div className="grid md:grid-cols-2 gap-6">
            {faqs.map((faq, index) => (
              <div key={index} className="border-b border-gray-200 pb-4">
                <h3 className="text-lg font-semibold text-gray-800 mb-2">{faq.question}</h3>
                <p className="text-gray-500">{faq.answer}</p>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}