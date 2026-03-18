import React from "react";
import { useNavigate, Link } from "react-router-dom";
import logo from "../assets/logo.jpg";
import { FiFacebook, FiTwitter, FiInstagram, FiLinkedin, FiShare2 } from "react-icons/fi";

const Footer = () => {
  const navigate = useNavigate();
  const currentYear = new Date().getFullYear();

  return (
    <footer className="pt-24 pb-12 px-4 lg:px-12 bg-[var(--bg-main)] border-t border-[var(--border-color)]">
      <div className="max-w-7xl mx-auto">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-5 gap-12 mb-16">
          
          {/* Brand Column */}
          <div className="lg:col-span-2 space-y-6">
            <div className="flex items-center gap-2 cursor-pointer" onClick={() => navigate("/")}>
              <img src={logo} className="w-10 h-10 rounded-lg shadow-sm" alt="FreeSiksha Logo" />
              <span className="text-xl font-bold tracking-tight text-blue-600">FreeSiksha</span>
            </div>
            <p className="text-[var(--text-muted)] text-[15px] leading-relaxed max-w-sm">
              We are a non-profit organization dedicated to making high-quality tech education accessible to everyone, everywhere.
            </p>
            <div className="flex gap-4">
              {[FiShare2, FiTwitter, FiInstagram].map((Icon, i) => (
                <button key={i} className="w-10 h-10 rounded-full bg-[var(--bg-surface)] flex items-center justify-center text-[var(--text-muted)] hover:bg-blue-600 hover:text-white transition-all shadow-sm">
                  <Icon />
                </button>
              ))}
            </div>
          </div>

          {/* Links Columns */}
          <div className="space-y-6">
            <h4 className="font-bold text-[var(--text-main)]">Platform</h4>
            <ul className="space-y-4 text-[14px]">
              {["Courses", "Mentors", "Community", "Certificates"].map((link) => (
                <li key={link}>
                  <Link to={`/${link.toLowerCase()}`} className="text-[var(--text-muted)] hover:text-blue-600 transition-colors">{link}</Link>
                </li>
              ))}
            </ul>
          </div>

          <div className="space-y-6">
            <h4 className="font-bold text-[var(--text-main)]">Company</h4>
            <ul className="space-y-4 text-[14px]">
              {["About Us", "Partners", "Contact", "Blog"].map((link) => (
                <li key={link}>
                  <Link to={link === "About Us" ? "/about" : `/#${link.toLowerCase().replace(' ', '')}`} className="text-[var(--text-muted)] hover:text-blue-600 transition-colors">{link}</Link>
                </li>
              ))}
            </ul>
          </div>

          <div className="space-y-6">
            <h4 className="font-bold text-[var(--text-main)]">Support</h4>
            <ul className="space-y-4 text-[14px]">
              {["Help Center", "Privacy Policy", "Terms of Use", "Donate"].map((link) => (
                <li key={link}>
                  <Link to={`/#${link.toLowerCase().replace(' ', '')}`} className="text-[var(--text-muted)] hover:text-blue-600 transition-colors">{link}</Link>
                </li>
              ))}
            </ul>
          </div>
        </div>

        {/* Bottom Bar */}
        <div className="pt-8 border-t border-[var(--border-color)] flex flex-col md:flex-row justify-between items-center gap-4 text-sm text-[var(--text-muted)] font-medium">
          <p>© {currentYear} FreeSiksha Non-Profit Organization. All rights reserved.</p>
          <div className="flex items-center gap-2">
            Designed with <span className="text-red-500 animate-pulse">❤️</span> for Learners
          </div>
        </div>
      </div>
    </footer>
  );
};

export default Footer;
