// components/home/SponsorsSection.tsx
"use client";

import { Swiper, SwiperSlide } from "swiper/react";
import { Autoplay } from "swiper/modules";
import Image from "next/image";

// Import Swiper styles
import "swiper/css";

const sponsors = [
  {
    id: 1,
    name: "Food Court",
    logo: "/images/sponsors/sponsor-1.png",
    slogan: "SLOGAN GOES HERE"
  },
  {
    id: 2,
    name: "Restaurant",
    logo: "/images/sponsors/sponsor-2.png",
    slogan: "SLOGAN GOES HERE"
  },
  {
    id: 3,
    name: "Restaurant",
    logo: "/images/sponsors/sponsor-3.png",
    slogan: "SLOGAN GOES HERE"
  },
  {
    id: 4,
    name: "Restaurant",
    logo: "/images/brand/brand_2_1-1.svg",
    slogan: "SLOGAN GOES HERE"
  },
  {
    id: 5,
    name: "Food Court",
    logo: "/images/sponsors/sponsor-5.png",
    slogan: "SLOGAN GOES HERE"
  },
  {
    id: 6,
    name: "Restaurant",
    logo: "/images/sponsors/sponsor-6.png",
    slogan: "SLOGAN GOES HERE"
  }
];

export default function SponsorsSection() {
  return (
    <section className="py-16 bg-gradient-to-br from-red-50 to-red-100">
      <div className="container mx-auto px-4">
        {/* Header Section */}
        <div className="text-center mb-12">
          <div className="inline-block bg-red-100 text-red-600 px-4 py-1 rounded-full text-sm font-medium mb-4">
            Our Partners
          </div>
          <h2 className="text-4xl md:text-5xl font-bold text-gray-800 mb-4">
            Global <span className="text-red-600">5K+ Happy</span> Sponsors
          </h2>
          <p className="text-gray-600 max-w-2xl mx-auto">
            Trusted by thousands of restaurants and food brands worldwide
          </p>
          <div className="w-24 h-1 bg-red-600 mx-auto mt-4"></div>
        </div>

        {/* Sponsors Grid */}
        <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-6 gap-6 mb-12">
          {sponsors.map((sponsor) => (
            <div
              key={sponsor.id}
              className="bg-white rounded-2xl p-6 text-center shadow-md hover:shadow-xl transition-all duration-300 group hover:-translate-y-2"
            >
              <div className="w-20 h-20 mx-auto mb-4 bg-red-50 rounded-full flex items-center justify-center group-hover:bg-red-100 transition-colors duration-300">
                <div className="text-3xl font-bold text-red-600">
                  {sponsor.name.charAt(0)}
                </div>
              </div>
              <h3 className="font-semibold text-gray-800 mb-1">{sponsor.name}</h3>
              <p className="text-xs text-gray-500">{sponsor.slogan}</p>
            </div>
          ))}
        </div>

        {/* Auto-moving Swiper Slider */}
        <div className="relative mt-8 pt-8 border-t border-red-200">
          <div className="absolute -top-3 left-1/2 transform -translate-x-1/2 bg-red-600 text-white px-4 py-1 rounded-full text-sm">
            Trusted Partners
          </div>
          
          <Swiper
            modules={[Autoplay]}
            spaceBetween={30}
            slidesPerView={2}
            autoplay={{
              delay: 0,
              disableOnInteraction: false,
              reverseDirection: false,
              pauseOnMouseEnter: true,
            }}
            speed={5000}
            loop={true}
            breakpoints={{
              320: { slidesPerView: 2, spaceBetween: 20 },
              640: { slidesPerView: 3, spaceBetween: 30 },
              768: { slidesPerView: 4, spaceBetween: 30 },
              1024: { slidesPerView: 5, spaceBetween: 40 },
              1280: { slidesPerView: 6, spaceBetween: 50 },
            }}
            className="sponsor-slider"
          >
            {[...sponsors, ...sponsors].map((sponsor, index) => (
              <SwiperSlide key={index}>
                <div className="text-center py-4">
                  <div className="flex items-center justify-center gap-3">
                    <div className="w-12 h-12 bg-red-100 rounded-full flex items-center justify-center">
                      <span className="text-red-600 font-bold text-lg">
                        {sponsor.name.charAt(0)}
                      </span>
                    </div>
                    <div className="text-left">
                      <p className="font-semibold text-gray-800 text-sm">{sponsor.name}</p>
                      <p className="text-xs text-gray-500">{sponsor.slogan}</p>
                    </div>
                  </div>
                </div>
              </SwiperSlide>
            ))}
          </Swiper>
        </div>
      </div>

      <style jsx global>{`
        .sponsor-slider {
          overflow: hidden;
        }
        .sponsor-slider .swiper-wrapper {
          transition-timing-function: linear !important;
        }
      `}</style>
    </section>
  );
}