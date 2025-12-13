import React from "react";
import { FiSearch } from "react-icons/fi";

const Banner = () => {
  return (
    <section className="relative min-h-[500px] flex items-center justify-center bg-gradient-to-br from-[#3a0161] via-[#7d41ad] to-[#1a1a1a] overflow-hidden">
      
      <div className="absolute inset-0 bg-black/20"></div>

      <div className="relative z-10 text-center px-6 max-w-4xl mx-auto">
        <h1 className="text-5xl md:text-7xl font-black text-black mb-6 tracking-tight">
          Unleash Your Creativity
        </h1>

        <p className="text-lg md:text-xl text-black/80 mb-12 max-w-2xl mx-auto">
          Join thousands of creators competing in exciting contests. Design, write, build, and earn prizes.
        </p>

        
        <div className="flex flex-col sm:flex-row gap-4 justify-center items-center max-w-2xl mx-auto">
          <div className="relative w-full sm:w-auto flex-1">
            <FiSearch className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-400 text-xl" />
            <input
              type="text"
              placeholder="Search contests by name or type..."
              className="input input-lg w-full pl-12 bg-black/80 text-white placeholder-gray-400 border-none rounded-full focus:outline-none focus:ring-4 focus:ring-primary/50"
            />
          </div>

          <button className="btn btn-primary btn-lg rounded-full px-10  font-bold shadow-lg">
            Search
          </button>
        </div>
      </div>
    </section>
  );
};

export default Banner;