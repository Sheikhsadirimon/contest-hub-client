import React, { useEffect } from "react";
import { Link } from "react-router";
import AOS from "aos";
import "aos/dist/aos.css";

const Showcase = () => {
  useEffect(() => {
    AOS.init({
      duration: 1200,
      easing: "ease-out-cubic",
      once: true,
    });
  }, []);

  return (
    <section className="py-24 bg-base-200">
      <div className="container mx-auto px-6 text-center max-w-4xl">
        <h2 className="text-5xl md:text-7xl font-black text-base-400 mb-8 tracking-tight">
          <span data-aos="fade-right" data-aos-delay="0">
            Ready to
          </span>{" "}
          <span data-aos="fade-down" data-aos-delay="200">
            Showcase
          </span>{" "}
          <span data-aos="fade-left" data-aos-delay="400">
            Your Talents?
          </span>
        </h2>

        <p
          data-aos="fade-up"
          data-aos-delay="600"
          className="text-lg md:text-xl  mb-12 max-w-2xl mx-auto"
        >
          Join thousands of creators and start competing today. Create your
          account and participate in your first contest now!
        </p>

        <div
          data-aos="fade-up"
          data-aos-delay="800"
          className="flex flex-col sm:flex-row gap-6 justify-center items-center"
        >
          <Link
            to="/auth/signup"
            className="btn btn-lg rounded-full px-10 bg-black text-white hover:bg-gray-800 font-bold shadow-xl hover:shadow-2xl transition-all"
          >
            Get Started
          </Link>

          <Link
            to="/all-contests"
            className="btn btn-lg rounded-full px-10 bg-transparent  border-4 border-primary hover:bg-black hover:text-white font-bold shadow-xl hover:shadow-2xl transition-all"
          >
            Explore Contests
          </Link>
        </div>
      </div>
    </section>
  );
};

export default Showcase;
