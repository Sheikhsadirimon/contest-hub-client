import React, { useEffect } from "react";
import { FiSearch } from "react-icons/fi";
import AOS from "aos";
import "aos/dist/aos.css";

const Banner = () => {
  useEffect(() => {
    AOS.init({
      duration: 1200,
      easing: "ease-out-cubic",
      once: true,
    });
  }, []);

  return (
    <section className="relative min-h-[500px] flex items-center justify-center bg-gradient-to-br from-[#1a1a1a] via-[#7d41ad] to-[#1a1a1a] overflow-hidden">
      {/* Subtle overlay for depth */}
      <div className="absolute inset-0 bg-black/30"></div>

      <div className="relative z-10 text-center px-6 max-w-5xl mx-auto">
        {/* Main heading with staggered word animation */}
        <h1 className="text-5xl md:text-7xl font-black text-white mb-8 tracking-tight leading-tight">
          <span data-aos="fade-down" data-aos-delay="0" className="inline-block">
            Unleash
          </span>{" "}
          <span data-aos="fade-down" data-aos-delay="200" className="inline-block text-primary">
            Your
          </span>{" "}
          <span data-aos="fade-down" data-aos-delay="400" className="inline-block">
            Creativity
          </span>
        </h1>

        {/* Description */}
        <p
          data-aos="fade-up"
          data-aos-delay="600"
          className="text-lg md:text-xl text-white/80 mb-14 max-w-3xl mx-auto leading-relaxed"
        >
          Join thousands of creators competing in exciting contests. Design, write, build, and earn prizes.
        </p>

        {/* Search bar with enhanced animation */}
        <div
          data-aos="zoom-in"
          data-aos-delay="800"
          className="flex flex-col sm:flex-row gap-4 justify-center items-center max-w-3xl mx-auto"
        >
          <div className="relative w-full sm:w-auto flex-1">
            <FiSearch className="absolute left-5 top-1/2 -translate-y-1/2 text-gray-300 text-2xl transition-colors duration-300" />
            <input
              type="text"
              placeholder="Search contests by name or type..."
              className="input input-lg w-full pl-14 pr-6 bg-white/10 backdrop-blur-md text-white placeholder-gray-400 border border-white/20 rounded-full focus:outline-none focus:ring-4 focus:ring-primary/60 focus:bg-white/20 transition-all duration-300 shadow-2xl"
            />
          </div>

          {/* Search button with bounce effect */}
          <button
            data-aos="fade-up"
            data-aos-delay="1000"
            className="btn btn-primary btn-lg rounded-full px-12 font-bold shadow-2xl hover:shadow-primary/50 transform hover:scale-105 transition-all duration-300"
          >
            Search
          </button>
        </div>
      </div>

      {/* Optional decorative floating elements */}
      <div className="absolute bottom-20 left-10 w-96 h-96 bg-black/20 rounded-full blur-3xl animate-pulse delay-1000"></div>
      <div className="absolute bottom-20 right-10 w-96 h-96 bg-black/20 rounded-full blur-3xl animate-pulse delay-1000"></div>
    </section>
  );
};

export default Banner;