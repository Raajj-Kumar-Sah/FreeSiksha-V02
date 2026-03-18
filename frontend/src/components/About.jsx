import React from 'react'
import { FiCpu, FiAward, FiUsers, FiClock, FiGlobe, FiBriefcase } from "react-icons/fi";

function About() {
  const features = [
    {
      icon: <FiCpu className="text-blue-600 text-2xl" />,
      title: "AI Recommendation",
      description: "Get personalized learning paths tailored to your career goals and previous knowledge.",
      bgColor: "bg-blue-50"
    },
    {
      icon: <FiAward className="text-indigo-600 text-2xl" />,
      title: "Industry Certificates",
      description: "Earn recognized credentials from top tech companies and educational institutions.",
      bgColor: "bg-indigo-50"
    },
    {
      icon: <FiUsers className="text-purple-600 text-2xl" />,
      title: "Expert Mentors",
      description: "Direct access to industry veterans who guide you through complex subjects and projects.",
      bgColor: "bg-purple-50"
    },
    {
      icon: <FiClock className="text-emerald-600 text-2xl" />,
      title: "Flexible Learning",
      description: "Self-paced video lectures and live sessions that fit into your busy schedule.",
      bgColor: "bg-emerald-50"
    },
    {
      icon: <FiGlobe className="text-cyan-600 text-2xl" />,
      title: "Community Support",
      description: "Join a global network of peers for collaborative projects and peer-to-peer learning.",
      bgColor: "bg-cyan-50"
    },
    {
      icon: <FiBriefcase className="text-amber-600 text-2xl" />,
      title: "Career Guidance",
      description: "Resume reviews, interview prep, and direct job placement assistance with partners.",
      bgColor: "bg-amber-50"
    }
  ];

  return (
    <section id="about" className="py-24 px-4 lg:px-12 max-w-7xl mx-auto">
      <div className="text-center space-y-4 mb-16">
        <h2 className="text-3xl lg:text-4xl font-bold text-main">Why Choose FreeSiksha?</h2>
        <p className="text-muted max-w-2xl mx-auto">
          Experience a new way of learning with our comprehensive platform designed for student success.
        </p>
      </div>

      <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-8">
        {features.map((feature, index) => (
          <div 
            key={index} 
            className="premium-card p-8 group hover:border-blue-200"
          >
            <div className={`w-14 h-14 ${feature.bgColor} rounded-2xl flex items-center justify-center mb-6 group-hover:scale-110 transition-transform`}>
              {feature.icon}
            </div>
            <h3 className="text-xl font-bold text-main mb-3">{feature.title}</h3>
            <p className="text-muted leading-relaxed text-sm">
              {feature.description}
            </p>
          </div>
        ))}
      </div>
    </section>
  )
}

export default About
