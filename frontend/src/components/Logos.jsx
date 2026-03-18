import React from 'react'
import { FiCode, FiShare2, FiShield, FiDatabase } from "react-icons/fi";
import { useNavigate } from 'react-router-dom';

function Logos() {
  const navigate = useNavigate();
  const categories = [
    {
      name: "Development",
      icon: <FiCode className="text-blue-500" />,
      theme: "bg-blue-50/10 border-blue-100/20"
    },
    {
      name: "Networking",
      icon: <FiShare2 className="text-emerald-500" />,
      theme: "bg-emerald-50/10 border-emerald-100/20"
    },
    {
      name: "Cybersecurity",
      icon: <FiShield className="text-purple-500" />,
      theme: "bg-purple-50/10 border-purple-100/20"
    },
    {
      name: "Data Science",
      icon: <FiDatabase className="text-orange-500" />,
      theme: "bg-orange-50/10 border-orange-100/20"
    }
  ];

  return (
    <section className="py-12 px-4 lg:px-12 max-w-7xl mx-auto">
      <div className="flex flex-col items-center space-y-8">
        <h2 className="text-2xl font-bold text-main">Top Categories</h2>
        
        <div className="flex flex-wrap items-center justify-center gap-4">
          {categories.map((category, index) => (
            <button 
              key={index}
              onClick={() => navigate(`/allcourses?category=${category.name}`)}
              className={`flex items-center gap-3 px-6 py-3 rounded-2xl border ${category.theme} shadow-sm hover:shadow-md hover:-translate-y-1 transition-all group`}
            >
              <span className="text-xl group-hover:scale-110 transition-transform">
                {category.icon}
              </span>
              <span className="font-semibold text-main">{category.name}</span>
            </button>
          ))}
        </div>
      </div>
    </section>
  )
}

export default Logos
