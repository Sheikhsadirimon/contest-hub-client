// src/pages/HowItWorks.jsx
import React, { useEffect } from "react";
import AOS from "aos";
import "aos/dist/aos.css";
import { Link } from "react-router";

const HowItWorks = () => {
  useEffect(() => {
    AOS.init({ duration: 800, once: true });
  }, []);

  const steps = [
    {
      title: "Creators Make Contests",
      desc: "Anyone with 'Creator' role can create exciting contests with prizes, tasks, and deadlines.",
      icon: "🎨",
    },
    {
      title: "Admin Approves",
      desc: "Admins review and approve contests to ensure quality and fairness.",
      icon: "✅",
    },
    {
      title: "Users Join & Pay",
      desc: "Regular users discover contests, pay entry fee via Stripe, and register.",
      icon: "💳",
    },
    {
      title: "Submit Your Work",
      desc: "Participants submit their creative work (links, files, descriptions) before deadline.",
      icon: "📤",
    },
    {
      title: "Creator Picks Winner",
      desc: "After deadline, contest creator reviews submissions and declares a winner.",
      icon: "🏆",
    },
    {
      title: "Winner Celebrated!",
      desc: "Winner gets prize glory, appears on leaderboard and home page recent winners.",
      icon: "🎉",
    },
  ];

  return (
    <section className="py-16 bg-base-200 min-h-screen">
      <div className="container mx-auto px-6">
        <div className="text-center mb-16">
          <h1 className="text-5xl font-bold mb-6 bg-gradient-to-r from-primary to-secondary bg-clip-text text-transparent">
            How ContestHub Works
          </h1>
          <p className="text-xl text-base-content/70 max-w-3xl mx-auto">
            Simple, fair, and rewarding contest platform for creators and
            participants
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
          {steps.map((step, index) => (
            <div
              key={index}
              data-aos="fade-up"
              data-aos-delay={index * 100}
              className="card bg-base-100 shadow-xl hover:shadow-2xl transition-all duration-300 hover:-translate-y-2"
            >
              <div className="card-body text-center p-8">
                <div className="text-6xl mb-4">{step.icon}</div>
                <h3 className="text-2xl font-bold mb-3">{step.title}</h3>
                <p className="text-base-content/70">{step.desc}</p>
                <div className="mt-6">
                  <span className="text-4xl font-bold text-primary">
                    {index + 1}
                  </span>
                </div>
              </div>
            </div>
          ))}
        </div>

        <div className="text-center mt-20">
          <p className="text-2xl font-semibold mb-6">
            Ready to showcase your talent?
          </p>
          <Link to={'/all-contests'} className="btn btn-primary btn-lg">
            Explore Contests Now
          </Link>
        </div>
      </div>
    </section>
  );
};

export default HowItWorks;
