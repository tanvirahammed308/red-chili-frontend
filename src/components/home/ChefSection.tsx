
"use client";

import { useRef } from "react";
import type { Swiper as SwiperType } from "swiper";
import { Swiper, SwiperSlide } from "swiper/react";
import { Autoplay, Pagination, Navigation, EffectCoverflow } from "swiper/modules";
import { 
  FaStar, 
  FaFacebook, 
  FaTwitter, 
  FaInstagram, 
  FaLinkedin, 
  FaChevronLeft, 
  FaChevronRight,
  FaUtensils
} from "react-icons/fa";

// Import Swiper styles
import "swiper/css";
import "swiper/css/pagination";
import "swiper/css/navigation";
import "swiper/css/effect-coverflow";

const chefs = [
  {
    id: 1,
    name: "Rubina Jenny",
    role: "Senior Chef",
    image: "/images/chef/chef1.jpg",
    experience: "12+ Years",
    specialty: "Italian Cuisine",
    rating: 5,
    reviews: 128,
    social: {
      facebook: "#",
      twitter: "#",
      instagram: "#",
      linkedin: "#"
    }
  },
  {
    id: 2,
    name: "Michael Chen",
    role: "Executive Chef",
    image: "/images/chef/chef2.jpg",
    experience: "15+ Years",
    specialty: "Asian Fusion",
    rating: 5,
    reviews: 156,
    social: {
      facebook: "#",
      twitter: "#",
      instagram: "#",
      linkedin: "#"
    }
  },
  {
    id: 3,
    name: "Sarah Johnson",
    role: "Pastry Chef",
    image: "/images/chef/chef3.jpg",
    experience: "8+ Years",
    specialty: "Desserts & Bakery",
    rating: 5,
    reviews: 98,
    social: {
      facebook: "#",
      twitter: "#",
      instagram: "#",
      linkedin: "#"
    }
  },
  {
    id: 4,
    name: "David Martinez",
    role: "Grill Master",
    image: "/images/chef/chef4.jpg",
    experience: "10+ Years",
    specialty: "BBQ & Steak",
    rating: 5,
    reviews: 112,
    social: {
      facebook: "#",
      twitter: "#",
      instagram: "#",
      linkedin: "#"
    }
  },
  {
    id: 5,
    name: "Emma Wilson",
    role: "Sous Chef",
    image: "/images/chef/chef5.jpg",
    experience: "6+ Years",
    specialty: "Seafood",
    rating: 5,
    reviews: 84,
    social: {
      facebook: "#",
      twitter: "#",
      instagram: "#",
      linkedin: "#"
    }
  }
];

export default function ChefSection() {
  const swiperRef = useRef<SwiperType | null>(null);

  return (
    <section className="py-20 bg-gradient-to-br from-red-50 via-red-100 to-red-50 relative overflow-hidden">
      {/* Background Decoration */}
      <div className="absolute inset-0 opacity-10">
        <div className="absolute top-20 left-10 w-72 h-72 bg-red-500 rounded-full blur-3xl"></div>
        <div className="absolute bottom-20 right-10 w-96 h-96 bg-red-600 rounded-full blur-3xl"></div>
      </div>

      <div className="container mx-auto px-4 relative z-10">
        {/* Section Header */}
        <div className="text-center mb-12">
          <div className="inline-flex items-center justify-center gap-2 bg-red-100 text-red-600 px-4 py-2 rounded-full mb-4">
            <FaUtensils className="text-lg" />
            <span className="text-sm font-medium">Our Culinary Team</span>
          </div>
          <h2 className="text-4xl md:text-5xl font-bold text-gray-800 mb-4">
            Meet Our <span className="text-red-600 relative inline-block">
              Expert Chefs
              
            </span>
          </h2>
          <p className="text-gray-600 max-w-2xl mx-auto">
            Our talented team of culinary experts brings passion and creativity to every dish
          </p>
        </div>

        {/* Custom Navigation Buttons */}
        <div className="relative">
          {/* Previous Button */}
          <button
            className="custom-swiper-prev absolute left-0 top-1/2 -translate-y-1/2 z-20 w-12 h-12 bg-white rounded-full shadow-lg flex items-center justify-center text-red-600 hover:bg-red-600 hover:text-white transition-all duration-300 -ml-6"
            aria-label="Previous Slide"
          >
            <FaChevronLeft size={20} />
          </button>

          {/* Next Button */}
          <button
            className="custom-swiper-next absolute right-0 top-1/2 -translate-y-1/2 z-20 w-12 h-12 bg-white rounded-full shadow-lg flex items-center justify-center text-red-600 hover:bg-red-600 hover:text-white transition-all duration-300 -mr-6"
            aria-label="Next Slide"
          >
            <FaChevronRight size={20} />
          </button>

          {/* Swiper Slider */}
          <Swiper
            onSwiper={(swiper) => {
              swiperRef.current = swiper;
            }}
            modules={[Autoplay, Pagination, Navigation, EffectCoverflow]}
            effect="coverflow"
            grabCursor={true}
            centeredSlides={true}
            slidesPerView="auto"
            coverflowEffect={{
              rotate: 50,
              stretch: 0,
              depth: 100,
              modifier: 1,
              slideShadows: true,
            }}
            autoplay={{
              delay: 3000,
              disableOnInteraction: false,
            }}
            pagination={{
              clickable: true,
              dynamicBullets: true,
            }}
            navigation={{
              prevEl: '.custom-swiper-prev',
              nextEl: '.custom-swiper-next',
            }}
            breakpoints={{
              320: {
                slidesPerView: 1,
                spaceBetween: 20,
              },
              640: {
                slidesPerView: 2,
                spaceBetween: 30,
              },
              1024: {
                slidesPerView: 3,
                spaceBetween: 30,
              },
              1280: {
                slidesPerView: 4,
                spaceBetween: 30,
              },
            }}
            className="chef-slider"
          >
            {chefs.map((chef) => (
              <SwiperSlide key={chef.id}>
                <div className="bg-white rounded-2xl overflow-hidden shadow-lg hover:shadow-2xl transition-all duration-300 group">
                  {/* Image Container */}
                  <div className="relative overflow-hidden h-80 bg-gray-200">
                    <img
                      src={chef.image}
                      alt={chef.name}
                      className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-500"
                      onError={(e) => {
                        (e.target as HTMLImageElement).src = "https://via.placeholder.com/400x400?text=Chef";
                      }}
                    />
                    {/* Social Media Overlay */}
                    <div className="absolute inset-0 bg-black/50 opacity-0 group-hover:opacity-100 transition-opacity duration-300 flex items-center justify-center gap-4">
                      <a
                        href={chef.social.facebook}
                        className="w-10 h-10 bg-white rounded-full flex items-center justify-center text-blue-600 hover:bg-blue-600 hover:text-white transition-all duration-300 transform hover:scale-110"
                      >
                        <FaFacebook size={20} />
                      </a>
                      <a
                        href={chef.social.twitter}
                        className="w-10 h-10 bg-white rounded-full flex items-center justify-center text-sky-500 hover:bg-sky-500 hover:text-white transition-all duration-300 transform hover:scale-110"
                      >
                        <FaTwitter size={20} />
                      </a>
                      <a
                        href={chef.social.instagram}
                        className="w-10 h-10 bg-white rounded-full flex items-center justify-center text-pink-600 hover:bg-pink-600 hover:text-white transition-all duration-300 transform hover:scale-110"
                      >
                        <FaInstagram size={20} />
                      </a>
                      <a
                        href={chef.social.linkedin}
                        className="w-10 h-10 bg-white rounded-full flex items-center justify-center text-blue-700 hover:bg-blue-700 hover:text-white transition-all duration-300 transform hover:scale-110"
                      >
                        <FaLinkedin size={20} />
                      </a>
                    </div>
                  </div>

                  {/* Content */}
                  <div className="p-6 text-center">
                    <h3 className="text-xl font-bold text-gray-800 mb-1">{chef.name}</h3>
                    <p className="text-red-600 font-medium mb-2">{chef.role}</p>
                    
                    {/* Rating Stars */}
                    <div className="flex justify-center items-center gap-1 mb-3">
                      {[...Array(chef.rating)].map((_, i) => (
                        <FaStar key={i} className="text-yellow-500 text-sm" />
                      ))}
                      <span className="text-gray-500 text-sm ml-2">({chef.reviews})</span>
                    </div>

                    {/* Info Badges */}
                    <div className="flex justify-center gap-3 mb-3">
                      <span className="text-xs bg-gray-100 text-gray-600 px-3 py-1 rounded-full">
                        {chef.experience}
                      </span>
                      <span className="text-xs bg-gray-100 text-gray-600 px-3 py-1 rounded-full">
                        {chef.specialty}
                      </span>
                    </div>

                    {/* Decorative Line */}
                    <div className="w-12 h-0.5 bg-red-500 mx-auto"></div>
                  </div>
                </div>
              </SwiperSlide>
            ))}
          </Swiper>
        </div>

        {/* Navigation Hint */}
        <div className="text-center mt-8">
          <p className="text-sm text-gray-500 flex items-center justify-center gap-2">
            <span className="w-8 h-px bg-gray-300 inline-block"></span>
            Swipe to see more chefs
            <span className="w-8 h-px bg-gray-300 inline-block"></span>
          </p>
        </div>
      </div>

      {/* Custom CSS for Swiper */}
      <style jsx global>{`
        .chef-slider {
          padding: 20px 0 50px !important;
        }
        
        /* Pagination Styles */
        .chef-slider .swiper-pagination {
          bottom: 0 !important;
        }
        
        .chef-slider .swiper-pagination-bullet {
          background: #dc2626 !important;
          opacity: 0.5;
          transition: all 0.3s ease;
        }
        
        .chef-slider .swiper-pagination-bullet-active {
          background: #dc2626 !important;
          opacity: 1;
          width: 10px;
          height: 10px;
        }
        
        /* Navigation Button Styles */
        .custom-swiper-prev,
        .custom-swiper-next {
          transition: all 0.3s ease;
        }
        
        .custom-swiper-prev:hover,
        .custom-swiper-next:hover {
          transform: scale(1.1);
        }
        
        /* Hide navigation buttons on mobile */
        @media (max-width: 1024px) {
          .custom-swiper-prev,
          .custom-swiper-next {
            display: none !important;
          }
        }
        
        /* Slide Shadow Effect */
        .chef-slider .swiper-slide-shadow {
          border-radius: 16px;
        }
      `}</style>
    </section>
  );
}