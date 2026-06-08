"use client";

import { useRef, useEffect } from "react";
import { Swiper, SwiperSlide } from "swiper/react";
import { Autoplay, Pagination, Navigation, EffectFade } from "swiper/modules";
import Image from "next/image";
import Link from "next/link";
import { FaShoppingCart, FaArrowRight, FaStar, FaTruck, FaClock, FaUtensils } from "react-icons/fa";
import { MdRestaurantMenu } from "react-icons/md";

import "swiper/css";
import "swiper/css/pagination";
import "swiper/css/navigation";
import "swiper/css/effect-fade";

const slides = [
  {
    id: 1,
    title: "Butter Chicken",
    subtitle: "Creamy & Spicy Delight",
    description: "Experience the rich, creamy texture of our signature butter chicken made with authentic Indian spices and fresh cream. A royal treat for your taste buds!",
    image: "/images/hero/hero1.jpg",
    price: "$14.99",
    rating: 4.8,
    reviews: 2340,
    time: "20-25 min",
    tag: "🔥 Popular"
  },
  {
    id: 2,
    title: "Royal Biryani",
    subtitle: "Fragrant Rice Masterpiece",
    description: "Aromatic basmati rice layered with tender marinated meat, caramelized onions, and exotic spices. Cooked in traditional dum style for authentic taste.",
    image: "/images/hero/hero2.jpg",
    price: "$16.99",
    rating: 4.9,
    reviews: 1850,
    time: "25-30 min",
    tag: "👑 Chef's Special"
  },
  {
    id: 3,
    title: "Wood Fired Pizza",
    subtitle: "Italian Classic Perfected",
    description: "Authentic wood-fired pizza with hand-tossed dough, San Marzano tomatoes, fresh mozzarella, basil, and a drizzle of extra virgin olive oil.",
    image: "/images/hero/hero3.jpg",
    price: "$18.99",
    rating: 4.7,
    reviews: 3120,
    time: "15-20 min",
    tag: "🍕 Best Seller"
  },
  {
    id: 4,
    title: "Grilled Burger",
    subtitle: "Juicy & Smoky Perfection",
    description: "Premium Angus beef patty grilled to perfection, topped with crispy bacon, fresh lettuce, ripe tomato, caramelized onions, and our secret sauce.",
    image: "/images/hero/hero4.jpg",
    price: "$12.99",
    rating: 4.8,
    reviews: 2780,
    time: "15-20 min",
    tag: "🍔 New Arrival"
  },
  {
    id: 5,
    title: "Pasta Alfredo",
    subtitle: "Creamy & Comforting",
    description: "Silky fettuccine pasta tossed in a rich, creamy Alfredo sauce with aged parmesan cheese, fresh garlic, and a touch of black pepper.",
    image: "/images/hero/hero5.jpg",
    price: "$15.99",
    rating: 4.6,
    reviews: 1950,
    time: "20-25 min",
    tag: "🌿 Vegetarian"
  }
];

export default function HeroSection() {
  const prevRef = useRef<HTMLButtonElement>(null);
  const nextRef = useRef<HTMLButtonElement>(null);

  return (
    <section className="relative w-full min-h-screen overflow-hidden">
      <Swiper
        modules={[Autoplay, Pagination, Navigation, EffectFade]}
        effect="fade"
        spaceBetween={0}
        slidesPerView={1}
        autoplay={{
          delay: 5000,
          disableOnInteraction: false,
        }}
        pagination={{
          clickable: true,
          dynamicBullets: true,
        }}
        navigation={{
          prevEl: prevRef.current,
          nextEl: nextRef.current,
        }}
        loop={true}
        className="w-full h-screen"
        onBeforeInit={(swiper) => {
          if (prevRef.current && nextRef.current) {
            // @ts-ignore
            swiper.params.navigation.prevEl = prevRef.current;
            // @ts-ignore
            swiper.params.navigation.nextEl = nextRef.current;
          }
        }}
      >
        {slides.map((slide, index) => (
          <SwiperSlide key={slide.id}>
            <div className="relative w-full h-screen overflow-hidden">
              {/* Background Image with Zoom Effect */}
              <div className="absolute inset-0 scale-110 animate-slow-zoom">
                <Image
                  src={slide.image}
                  alt={slide.title}
                  fill
                  className="object-cover"
                  priority={index === 0}
                />
              </div>

              {/* Gradient Overlay */}
              <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-black/40 to-black/20"></div>
              <div className="absolute inset-0 bg-gradient-to-r from-black/50 to-transparent"></div>

              {/* Glassmorphism Card */}
              <div className="relative z-10 h-full flex items-center px-4 sm:px-6 lg:px-8">
                <div className="max-w-2xl lg:max-w-3xl">
                  {/* Animated Tag */}
                  <div className="animate-slide-down">
                    <div className="inline-flex items-center gap-2 bg-gradient-to-r from-red-600 to-red-500 text-white px-4 py-1.5 rounded-full mb-4 shadow-lg backdrop-blur-sm">
                      <span className="text-xs sm:text-sm font-semibold tracking-wide">{slide.tag}</span>
                    </div>
                  </div>

                  {/* Rating with Animation */}
                  <div className="flex items-center gap-2 mb-4 animate-slide-down-delay">
                    <div className="flex items-center gap-0.5">
                      {[...Array(5)].map((_, i) => (
                        <FaStar key={i} className="text-yellow-500 text-xs sm:text-sm" />
                      ))}
                    </div>
                    <span className="text-white/80 text-xs sm:text-sm font-medium">
                      {slide.rating} (2.5k+ reviews)
                    </span>
                  </div>

                  {/* Title with Animation */}
                  <h1 className="text-4xl sm:text-5xl md:text-6xl lg:text-7xl font-bold text-white mb-2 leading-tight animate-slide-down-delay-2">
                    {slide.title}
                    <span className="block text-xl sm:text-2xl md:text-3xl text-red-500 font-semibold mt-1">
                      {slide.subtitle}
                    </span>
                  </h1>

                  {/* Description */}
                  <p className="text-gray-200 text-sm sm:text-base md:text-lg mb-6 leading-relaxed max-w-xl animate-slide-down-delay-3">
                    {slide.description}
                  </p>

                  {/* Info Chips */}
                  <div className="flex flex-wrap gap-2 mb-6 animate-slide-down-delay-4">
                    <div className="flex items-center gap-1.5 bg-white/10 backdrop-blur-md rounded-full px-3 py-1.5 border border-white/20">
                      <FaClock className="text-red-500 text-xs sm:text-sm" />
                      <span className="text-white text-xs sm:text-sm">{slide.time}</span>
                    </div>
                    <div className="flex items-center gap-1.5 bg-white/10 backdrop-blur-md rounded-full px-3 py-1.5 border border-white/20">
                      <FaTruck className="text-red-500 text-xs sm:text-sm" />
                      <span className="text-white text-xs sm:text-sm">Free Delivery</span>
                    </div>
                    <div className="flex items-center gap-1.5 bg-white/10 backdrop-blur-md rounded-full px-3 py-1.5 border border-white/20">
                      <FaUtensils className="text-red-500 text-xs sm:text-sm" />
                      <span className="text-white text-xs sm:text-sm">Dine In</span>
                    </div>
                  </div>

                  {/* Price & Buttons */}
                  <div className="flex flex-wrap items-center gap-4 mb-6 animate-slide-down-delay-5">
                    <div className="flex items-baseline gap-1">
                      <span className="text-3xl sm:text-4xl md:text-5xl font-bold text-red-500">{slide.price}</span>
                      <span className="text-gray-300 text-xs sm:text-sm">+ free delivery</span>
                    </div>
                  </div>

                  {/* Button Group */}
                  <div className="flex flex-col sm:flex-row gap-3 animate-slide-down-delay-6">
                    <Link
                      href="/order-now"
                      className="group relative inline-flex items-center justify-center gap-2 px-6 py-3 sm:px-8 sm:py-4 bg-gradient-to-r from-red-600 to-red-500 text-white rounded-xl font-bold text-sm sm:text-base transition-all duration-300 hover:scale-105 shadow-2xl overflow-hidden"
                    >
                      <span className="absolute inset-0 w-0 bg-white/20 transition-all duration-300 group-hover:w-full"></span>
                      <FaShoppingCart className="relative z-10 text-lg" />
                      <span className="relative z-10">Order Now</span>
                    </Link>
                    <Link
                      href="/menu"
                      className="inline-flex items-center justify-center gap-2 px-6 py-3 sm:px-8 sm:py-4 bg-white/10 backdrop-blur-md text-white rounded-xl font-semibold text-sm sm:text-base border border-white/30 hover:bg-white/20 transition-all duration-300 group"
                    >
                      <MdRestaurantMenu className="text-lg" />
                      View Menu
                      <FaArrowRight className="group-hover:translate-x-1 transition-transform" />
                    </Link>
                  </div>
                </div>
              </div>

              {/* Floating Elements */}
              <div className="absolute top-20 right-10 w-32 h-32 bg-red-500 rounded-full blur-3xl opacity-20 animate-pulse-slow hidden lg:block"></div>
              <div className="absolute bottom-20 left-10 w-40 h-40 bg-red-600 rounded-full blur-3xl opacity-20 animate-pulse-slow-delay hidden lg:block"></div>

              {/* Scroll Indicator */}
              <div className="absolute bottom-8 left-1/2 transform -translate-x-1/2 animate-bounce hidden sm:block">
                <div className="w-6 h-10 border-2 border-white/40 rounded-full flex justify-center">
                  <div className="w-1.5 h-2 bg-red-500 rounded-full mt-2 animate-pulse"></div>
                </div>
              </div>
            </div>
          </SwiperSlide>
        ))}
      </Swiper>

      {/* Custom Navigation Buttons */}
      <button
        ref={prevRef}
        className="absolute left-3 top-1/2 -translate-y-1/2 z-20 w-10 h-10 sm:w-12 sm:h-12 bg-red-600 hover:bg-red-700 text-white rounded-full flex items-center justify-center shadow-lg transition-all duration-300 hover:scale-110"
        aria-label="Previous slide"
      >
        <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 19l-7-7 7-7" />
        </svg>
      </button>
      <button
        ref={nextRef}
        className="absolute right-3 top-1/2 -translate-y-1/2 z-20 w-10 h-10 sm:w-12 sm:h-12 bg-red-600 hover:bg-red-700 text-white rounded-full flex items-center justify-center shadow-lg transition-all duration-300 hover:scale-110"
        aria-label="Next slide"
      >
        <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
        </svg>
      </button>

      <style jsx global>{`
        .swiper-pagination-bullet {
          background: white !important;
          opacity: 0.5;
          width: 8px;
          height: 8px;
          transition: all 0.3s ease;
        }
        
        .swiper-pagination-bullet-active {
          background: #dc2626 !important;
          opacity: 1;
          width: 24px;
          border-radius: 12px;
        }
        
        .swiper-pagination {
          bottom: 20px !important;
          z-index: 20;
        }
        
        /* Hide custom navigation on mobile */
        @media (max-width: 768px) {
          .custom-prev,
          .custom-next {
            display: none !important;
          }
        }
        
        @keyframes slowZoom {
          0% { transform: scale(1); }
          100% { transform: scale(1.15); }
        }
        
        .animate-slow-zoom {
          animation: slowZoom 15s ease-in-out infinite alternate;
        }
        
        @keyframes slideDown {
          from {
            opacity: 0;
            transform: translateY(-30px);
          }
          to {
            opacity: 1;
            transform: translateY(0);
          }
        }
        
        .animate-slide-down {
          animation: slideDown 0.5s ease-out forwards;
        }
        
        .animate-slide-down-delay {
          animation: slideDown 0.5s ease-out 0.1s forwards;
          opacity: 0;
        }
        
        .animate-slide-down-delay-2 {
          animation: slideDown 0.5s ease-out 0.2s forwards;
          opacity: 0;
        }
        
        .animate-slide-down-delay-3 {
          animation: slideDown 0.5s ease-out 0.3s forwards;
          opacity: 0;
        }
        
        .animate-slide-down-delay-4 {
          animation: slideDown 0.5s ease-out 0.4s forwards;
          opacity: 0;
        }
        
        .animate-slide-down-delay-5 {
          animation: slideDown 0.5s ease-out 0.5s forwards;
          opacity: 0;
        }
        
        .animate-slide-down-delay-6 {
          animation: slideDown 0.5s ease-out 0.6s forwards;
          opacity: 0;
        }
        
        @keyframes bounce {
          0%, 100% { transform: translateY(0); }
          50% { transform: translateY(-8px); }
        }
        
        .animate-bounce {
          animation: bounce 2s ease-in-out infinite;
        }
        
        @keyframes pulse-slow {
          0%, 100% { opacity: 0.1; transform: scale(1); }
          50% { opacity: 0.2; transform: scale(1.1); }
        }
        
        .animate-pulse-slow {
          animation: pulse-slow 6s ease-in-out infinite;
        }
        
        .animate-pulse-slow-delay {
          animation: pulse-slow 6s ease-in-out 3s infinite;
        }
      `}</style>
    </section>
  );
}