import React from 'react';
import { FiMail } from 'react-icons/fi';

function Contact() {
  return (
    <section className="px-4 lg:px-12 max-w-7xl mx-auto py-12">
      <div className="bg-blue-600 rounded-[40px] p-8 lg:p-16 flex flex-col lg:flex-row shadow-2xl overflow-hidden relative">
        {/* Decorative Circles */}
        <div className="absolute -top-24 -left-24 w-64 h-64 bg-blue-500 rounded-full blur-3xl opacity-50"></div>
        <div className="absolute -bottom-24 -right-24 w-64 h-64 bg-blue-400 rounded-full blur-3xl opacity-50"></div>

        {/* Left Content */}
        <div className="lg:w-1/2 relative z-10 space-y-8 mb-12 lg:mb-0">
          <h2 className="text-4xl lg:text-6xl font-extrabold text-white leading-tight">
            Get in <br /> Touch
          </h2>
          
          <div className="flex items-center gap-4 group cursor-pointer w-fit">
            <div className="w-12 h-12 bg-white/10 backdrop-blur-md rounded-2xl flex items-center justify-center border border-white/20 group-hover:bg-white/20 transition-all">
              <FiMail className="text-white text-xl" />
            </div>
            <div>
              <p className="text-blue-100 text-sm font-medium">Email us at</p>
              <p className="text-white font-bold text-lg">support@freesiksha.org</p>
            </div>
          </div>
        </div>

        {/* Right Form */}
        <div className="lg:w-1/2 relative z-10">
          <div className="bg-surface rounded-[32px] p-8 lg:p-10 shadow-xl border border-border">
            <form className="space-y-6">
              <div className="grid md:grid-cols-2 gap-6">
                <div className="space-y-2">
                  <label className="text-sm font-bold text-main ml-1">Name</label>
                  <input 
                    type="text" 
                    placeholder="John Doe"
                    className="w-full bg-[var(--bg-main)] border border-border rounded-2xl px-5 py-3.5 focus:outline-none focus:ring-2 focus:ring-blue-100 focus:bg-surface transition-all text-sm text-main"
                  />
                </div>
                <div className="space-y-2">
                  <label className="text-sm font-bold text-main ml-1">Email</label>
                  <input 
                    type="email" 
                    placeholder="john@example.com"
                    className="w-full bg-[var(--bg-main)] border border-border rounded-2xl px-5 py-3.5 focus:outline-none focus:ring-2 focus:ring-blue-100 focus:bg-surface transition-all text-sm text-main"
                  />
                </div>
              </div>
              
              <div className="space-y-2">
                <label className="text-sm font-bold text-main ml-1">Message</label>
                <textarea 
                  placeholder="How can we help you?"
                  rows="4"
                  className="w-full bg-[var(--bg-main)] border border-border rounded-2xl px-5 py-3.5 focus:outline-none focus:ring-2 focus:ring-blue-100 focus:bg-surface transition-all text-sm text-main resize-none"
                ></textarea>
              </div>

              <button 
                type="button"
                className="w-full btn-primary py-4 rounded-2xl font-bold shadow-lg shadow-blue-200"
              >
                Send Message
              </button>
            </form>
          </div>
        </div>
      </div>
    </section>
  );
}

export default Contact;
