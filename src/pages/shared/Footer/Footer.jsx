import { Facebook, Linkedin, Zap } from "lucide-react";
import React from "react";
import { FaLinkedinIn } from "react-icons/fa";

const Footer = () => {
  return (
    <footer className="footer footer-horizontal footer-center   p-10">
      <aside>
        <Zap className="w-10 h-10 text-primary-foreground" />
        <p className="font-bold text-2xl">
          ContestHub
        </p>
        <p>Copyright © 2025 ContestHub</p>
      </aside>
      <nav>
        <div className="grid grid-flow-col gap-4">
          <a
                  href="https://facebook.com"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="hover:text-accent transition-colors flex gap-1"
                >
                  <Facebook></Facebook>
                </a>
          
          <a
                  href="https://www.linkedin.com"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="hover:text-accent transition-colors flex gap-1"
                >
                  <Linkedin></Linkedin>
                </a>
        </div>
      </nav>
    </footer>
  );
};

export default Footer;
