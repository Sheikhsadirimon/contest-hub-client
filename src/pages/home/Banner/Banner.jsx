import React, { useEffect, useState } from "react";
import { FiSearch } from "react-icons/fi";
import { useNavigate } from "react-router-dom";
import AOS from "aos";
import "aos/dist/aos.css";
import Swal from "sweetalert2";
import useAxiosSecure from "../../../hooks/useAxiosSecure";

const Banner = () => {
  const [searchTerm, setSearchTerm] = useState("");
  const [loading, setLoading] = useState(false);
  const axiosSecure = useAxiosSecure();
  const navigate = useNavigate();

  useEffect(() => {
    AOS.init({
      duration: 1200,
      easing: "ease-out-cubic",
      once: true,
    });
  }, []);

  const handleSearch = async () => {
    const term = searchTerm.trim();
    if (!term) {
      Swal.fire("Oops!", "Please enter a category to search", "warning");
      return;
    }

    setLoading(true);
    try {
      const res = await axiosSecure.get(
        `/contests/search?category=${encodeURIComponent(term)}`
      );
      const results = res.data;

      if (results.length === 0) {
        Swal.fire(
          "No Results",
          `No contests found in category "${term}" make sure to type exact category name correctly.`,
          "info"
        );
      }

      navigate(`/all-contests?category=${encodeURIComponent(term)}`);
    } catch (error) {
      Swal.fire("Error", "Failed to search contests", "error");
    } finally {
      setLoading(false);
    }
  };

  const handleKeyPress = (e) => {
    if (e.key === "Enter") handleSearch();
  };

  return (
    <section className="relative min-h-[500px] flex items-center justify-center bg-gradient-to-br from-[#1a1a1a] via-[#7d41ad] to-[#1a1a1a] overflow-hidden">
      <div className="absolute inset-0 bg-black/30"></div>

      <div className="relative z-10 text-center px-6 max-w-5xl mx-auto">
        <h1 className="text-5xl md:text-7xl font-black text-white mb-8 tracking-tight leading-tight">
          <span
            data-aos="fade-down"
            data-aos-delay="0"
            className="inline-block"
          >
            Unleash
          </span>{" "}
          <span
            data-aos="fade-down"
            data-aos-delay="200"
            className="inline-block text-primary"
          >
            Your
          </span>{" "}
          <span
            data-aos="fade-down"
            data-aos-delay="400"
            className="inline-block"
          >
            Creativity
          </span>
        </h1>

        <p
          data-aos="fade-up"
          data-aos-delay="600"
          className="text-lg md:text-xl text-white/80 mb-14 max-w-3xl mx-auto leading-relaxed"
        >
          Join thousands of creators competing in exciting contests. Design,
          write, build, and earn prizes.
        </p>

        <div
          data-aos="zoom-in"
          data-aos-delay="800"
          className="flex flex-col sm:flex-row gap-4 justify-center items-center max-w-3xl mx-auto"
        >
          <div className="relative w-full sm:w-auto flex-1">
            <FiSearch className="absolute left-5 top-1/2 -translate-y-1/2 text-gray-300 text-2xl" />
            <input
              type="text"
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              onKeyPress={handleKeyPress}
              placeholder="Search by category (e.g., Design, Writing, Gaming)..."
              className="input input-lg w-full pl-14 pr-6 bg-white/10 backdrop-blur-md text-white placeholder-gray-400 border border-white/20 rounded-full focus:outline-none focus:ring-4 focus:ring-primary/60 focus:bg-white/20 transition-all duration-300 shadow-2xl"
            />
          </div>

          <button
            onClick={handleSearch}
            disabled={loading || !searchTerm.trim()}
            className="btn btn-primary btn-lg rounded-full px-12 font-bold shadow-2xl hover:shadow-primary/50 transform hover:scale-105 transition-all duration-300 disabled:opacity-70"
          >
            {loading ? (
              <span className="loading loading-spinner"></span>
            ) : (
              "Search"
            )}
          </button>
        </div>
      </div>

      <div className="absolute bottom-20 left-10 w-96 h-96 bg-black/20 rounded-full blur-3xl animate-pulse"></div>
      <div className="absolute bottom-20 right-10 w-96 h-96 bg-black/20 rounded-full blur-3xl animate-pulse"></div>
    </section>
  );
};

export default Banner;
