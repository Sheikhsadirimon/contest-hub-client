import React, { useEffect, useState } from "react";
import AOS from "aos";
import "aos/dist/aos.css";

const FAQ = () => {
  const [openIndex, setOpenIndex] = useState(null);

  useEffect(() => {
    AOS.init({ duration: 800, once: true });
  }, []);

  const faqs = [
    {
      q: "How do I become a Creator?",
      a: "Register as a normal user, then go to your Profile and request 'Creator' role. Admin will approve it.",
    },
    {
      q: "Is payment secure?",
      a: "Yes! We use Stripe for secure payment processing. Your card details are never stored on our servers.",
    },
    {
      q: "Can I submit multiple times?",
      a: "No, only one submission per contest is allowed. Make sure your best work is submitted!",
    },
    {
      q: "When can the winner be declared?",
      a: "Only after the contest deadline has passed. Creator will review all submissions and pick one winner.",
    },
    {
      q: "What types of contests are allowed?",
      a: "Design, Writing, Gaming, Video Editing, Business Ideas, Photography — any creative skill-based contest!",
    },
    {
      q: "How do I contact support?",
      a: "Email us at support@contesthub.com or message on our social media.",
    },
  ];

  const toggleFAQ = (index) => {
    setOpenIndex(openIndex === index ? null : index);
  };

  return (
    <section className="py-16 bg-base-200 min-h-screen">
      <div className="container mx-auto px-6 max-w-4xl">
        <div className="text-center mb-16">
          <h1 className="text-5xl font-bold mb-6 bg-gradient-to-r from-primary to-secondary bg-clip-text text-transparent">
            Frequently Asked Questions
          </h1>
          <p className="text-xl text-base-content/70">
            Everything you need to know about ContestHub
          </p>
        </div>

        <div className="space-y-6">
          {faqs.map((faq, index) => (
            <div
              key={index}
              data-aos="fade-up"
              data-aos-delay={index * 50}
              className="card bg-base-100 shadow-xl"
            >
              <div
                className="card-body p-6 cursor-pointer"
                onClick={() => toggleFAQ(index)}
              >
                <div className="flex justify-between items-center">
                  <h3 className="text-xl font-semibold">{faq.q}</h3>
                  <span className="text-2xl">
                    {openIndex === index ? "−" : "+"}
                  </span>
                </div>
                {openIndex === index && (
                  <p className="mt-4 text-base-content/70">{faq.a}</p>
                )}
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
};

export default FAQ;
