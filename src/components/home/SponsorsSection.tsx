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
    logo: "/images/brand/brand1.png",
    slogan: "SLOGAN GOES HERE"
  },
  {
    id: 2,
    name: "Restaurant",
    logo: "/images/brand/brand2.png",
    slogan: "SLOGAN GOES HERE"
  },
  {
    id: 3,
    name: "Restaurant",
    logo: "/images/brand/brand3.png",
    slogan: "SLOGAN GOES HERE"
  },
  {
    id: 4,
    name: "Restaurant",
    logo: "/images/brand/brand4.png",
    slogan: "SLOGAN GOES HERE"
  },
  {
    id: 5,
    name: "Food Court",
    logo: "/images/brand/brand5.png",
    slogan: "SLOGAN GOES HERE"
  },
  
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
          
        </div>

        

        {/* Auto-moving Swiper Slider with Images */}
        <div className="relative mt-8 pt-8 border-t border-red-200">
          <div className="absolute -top-3 left-1/2 transform -translate-x-1/2 bg-red-600 text-white px-4 py-1 rounded-full text-sm whitespace-nowrap">
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
                  <div className="flex items-center justify-center gap-3 bg-white rounded-lg px-4 py-3 shadow-sm">
                    {/* Sponsor Logo in Slider */}
                    <div className="relative w-10 h-10 bg-red-100 rounded-full flex items-center justify-center overflow-hidden flex-shrink-0">
                      {sponsor.logo ? (
                        <Image
                          src={sponsor.logo}
                          alt={sponsor.name}
                          width={40}
                          height={40}
                          className="object-contain p-1"
                          onError={(e) => {
                            const target = e.target as HTMLImageElement;
                            target.style.display = "none";
                            const parent = target.parentElement;
                            if (parent) {
                              const fallback = document.createElement("div");
                              fallback.className = "text-red-600 font-bold";
                              fallback.textContent = sponsor.name.charAt(0);
                              parent.appendChild(fallback);
                            }
                          }}
                        />
                      ) : (
                        <span className="text-red-600 font-bold">
                          {sponsor.name.charAt(0)}
                        </span>
                      )}
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