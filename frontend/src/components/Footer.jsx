import React from "react";
import { useNavigate, Link } from "react-router-dom";
import logo from "../assets/logo.jpg";
import { FiTwitter, FiLinkedin } from "react-icons/fi";
import { FaWhatsapp } from "react-icons/fa";

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
              <span className="text-xl font-black tracking-tight text-transparent bg-clip-text bg-gradient-to-r from-blue-600 to-indigo-600">FreeSiksha.Com</span>
            </div>
            <p className="text-[var(--text-muted)] text-[15px] leading-relaxed max-w-sm">
              We are a non-profit organization dedicated to making high-quality tech education accessible to everyone, everywhere.
            </p>
            <div className="flex gap-4">
              <a href="https://x.com/FreeSikshaAll" target="_blank" rel="noopener noreferrer" title="Twitter / X" className="w-10 h-10 rounded-full bg-[var(--bg-surface)] flex items-center justify-center text-[var(--text-muted)] hover:bg-black dark:hover:bg-white hover:text-white dark:hover:text-black transition-all shadow-sm">
                  <FiTwitter />
              </a>
              <a href="https://api.whatsapp.com/send/?phone=9980887720&text&type=phone_number&app_absent=0" target="_blank" rel="noopener noreferrer" title="WhatsApp" className="w-10 h-10 rounded-full bg-[var(--bg-surface)] flex items-center justify-center text-[var(--text-muted)] hover:bg-green-500 hover:text-white transition-all shadow-sm">
                  <FaWhatsapp className="text-lg" />
              </a>
              <a href="https://www.linkedin.com/company/freesiksha-com/posts/?feedView=all" target="_blank" rel="noopener noreferrer" title="LinkedIn" className="w-10 h-10 rounded-full bg-[var(--bg-surface)] flex items-center justify-center text-[var(--text-muted)] hover:bg-blue-700 hover:text-white transition-all shadow-sm">
                  <FiLinkedin />
              </a>
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
              {["About Us", "Partners", "Contact", "Blog"].map((link) => {
                if (link === "Contact") {
                  return (
                    <li key={link}>
                      <a 
                        href="https://api.whatsapp.com/send/?phone=9980887720" 
                        target="_blank" 
                        rel="noopener noreferrer" 
                        className="text-[var(--text-muted)] hover:text-blue-600 transition-colors"
                      >
                        {link}
                      </a>
                    </li>
                  );
                }
                
                const target = link === "About Us" ? "/about" : link === "Blog" ? "/blogs" : `/#${link.toLowerCase().replace(' ', '')}`;
                
                return (
                  <li key={link}>
                    <Link to={target} className="text-[var(--text-muted)] hover:text-blue-600 transition-colors">{link}</Link>
                  </li>
                );
              })}
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
          <p>© {currentYear} FreeSiksha.Com Non-Profit Organization. All rights reserved.</p>
          <div className="flex items-center gap-2">
            Designed with <span className="text-red-500 animate-pulse">❤️</span> for Learners
          </div>
        </div>
      </div>
    </footer>
  );
};

export default Footer;
