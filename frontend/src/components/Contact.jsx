import React, { useRef, useState } from 'react';
import { FiMail } from 'react-icons/fi';
import emailjs from '@emailjs/browser';
import { toast } from 'react-toastify';
import { ClipLoader } from 'react-spinners';
import axios from 'axios';
import { serverUrl } from '../App';

function Contact() {
  const form = useRef();
  const [loading, setLoading] = useState(false);

  const sendEmail = async (e) => {
    e.preventDefault();
    setLoading(true);

    const formData = new FormData(form.current);
    const data = {
      name: formData.get("user_name"),
      email: formData.get("user_email"),
      message: formData.get("message")
    };

    try {
      // 1. Store in Database (Primary) - This is the source of truth
      const dbResponse = await axios.post(`${serverUrl}/api/contact/submit`, data);
      
      // 2. Send via EmailJS (Optional/Notification)
      // We wrap this in a separate try-catch so placeholder keys don't break the UI
      try {
        const serviceId = import.meta.env.VITE_EMAILJS_SERVICE_ID;
        const templateId = import.meta.env.VITE_EMAILJS_TEMPLATE_ID;
        const publicKey = import.meta.env.VITE_EMAILJS_PUBLIC_KEY;

        // Only attempt if not using placeholders
        if (serviceId && !serviceId.includes("here") && 
            templateId && !templateId.includes("here") && 
            publicKey && !publicKey.includes("here")) {
          await emailjs.sendForm(serviceId, templateId, form.current, publicKey);
        }
      } catch (emailError) {
        console.warn("EmailJS notification failed:", emailError);
        // We don't toast an error here because the DB save succeeded
      }

      toast.success(dbResponse.data.message || "Message received! Our team will contact you soon.");
      form.current.reset();
    } catch (error) {
      console.error("Submission failed:", error);
      toast.error(error.response?.data?.message || "Something went wrong. Please try again.");
    } finally {
      setLoading(false);
    }
  };

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
          
          <a href="mailto:support@freesiksha.org" className="flex items-center gap-4 group cursor-pointer w-fit hover:opacity-80 transition-opacity">
            <div className="w-12 h-12 bg-white/10 backdrop-blur-md rounded-2xl flex items-center justify-center border border-white/20 group-hover:bg-white/20 transition-all">
              <FiMail className="text-white text-xl" />
            </div>
            <div>
              <p className="text-blue-100 text-sm font-medium">Email us at</p>
              <p className="text-white font-bold text-lg">support@freesiksha.org</p>
            </div>
          </a>
        </div>

        {/* Right Form */}
        <div className="lg:w-1/2 relative z-10">
          <div className="bg-surface rounded-[32px] p-8 lg:p-10 shadow-xl border border-border">
            <form ref={form} onSubmit={sendEmail} className="space-y-6">
              <div className="grid md:grid-cols-2 gap-6">
                <div className="space-y-2">
                  <label className="text-sm font-bold text-main ml-1">Name</label>
                  <input 
                    type="text" 
                    name="user_name"
                    required
                    placeholder="Amit Sharma"
                    className="w-full bg-[var(--bg-main)] border border-border rounded-2xl px-5 py-3.5 focus:outline-none focus:ring-2 focus:ring-blue-100 focus:bg-surface transition-all text-sm text-main"
                  />
                </div>
                <div className="space-y-2">
                  <label className="text-sm font-bold text-main ml-1">Email</label>
                  <input 
                    type="email" 
                    name="user_email"
                    required
                    placeholder="amit.sharma@gmail.com"
                    className="w-full bg-[var(--bg-main)] border border-border rounded-2xl px-5 py-3.5 focus:outline-none focus:ring-2 focus:ring-blue-100 focus:bg-surface transition-all text-sm text-main"
                  />
                </div>
              </div>
              
              <div className="space-y-2">
                <label className="text-sm font-bold text-main ml-1">Message</label>
                <textarea 
                  name="message"
                  required
                  placeholder="I'm interested in the Full Stack Web Development course. Could you share the syllabus?"
                  rows="4"
                  className="w-full bg-[var(--bg-main)] border border-border rounded-2xl px-5 py-3.5 focus:outline-none focus:ring-2 focus:ring-blue-100 focus:bg-surface transition-all text-sm text-main resize-none"
                ></textarea>
              </div>

              <button 
                type="submit"
                disabled={loading}
                className="w-full btn-primary py-4 rounded-2xl font-bold shadow-lg shadow-blue-200 flex items-center justify-center"
              >
                {loading ? <ClipLoader size={24} color="white" /> : "Send Message"}
              </button>
            </form>
          </div>
        </div>
      </div>
    </section>
  );
}

export default Contact;
