import React from "react";
import { FaStar } from "react-icons/fa";
import { useNavigate } from "react-router-dom";

const CourseCard = ({ thumbnail, title, category, price, id, reviews, creatorName }) => {
  const navigate = useNavigate();
  
  const calculateAverageRating = (reviews) => {
    if (!reviews || reviews.length === 0) return 0;
    const total = reviews.reduce((sum, review) => sum + review.rating, 0);
    return (total / reviews.length).toFixed(1);
  };

  const avgRating = calculateAverageRating(reviews);

  return (
    <div 
      onClick={() => { navigate(`/viewcourse/${id}`); window.scrollTo(0, 0); }} 
      className="w-[280px] h-[360px] bg-[var(--bg-surface)] border border-[var(--border-color)] rounded-2xl shadow-sm hover:shadow-xl hover:-translate-y-1 transition-all duration-300 cursor-pointer overflow-hidden group"
    >
      {/* Thumbnail Container */}
      <div className="relative h-48 w-full overflow-hidden">
        <img 
          src={thumbnail} 
          alt={title} 
          className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-500" 
        />
        <div className="absolute top-3 left-3 bg-blue-600/90 backdrop-blur-sm text-white text-[10px] font-bold px-2.5 py-1 rounded-full uppercase tracking-wider">
          {category}
        </div>
      </div>

      {/* Content */}
      <div className="p-5 flex flex-col justify-between h-[168px]">
        <div>
          <h3 className="text-sm font-bold text-[var(--text-main)] line-clamp-2 leading-snug group-hover:text-blue-600 transition-colors">
            {title}
          </h3>
          
          <div className="flex items-center gap-1.5 mt-3">
            <div className="flex text-yellow-500 text-xs">
              {[...Array(5)].map((_, i) => (
                <FaStar key={i} className={i < Math.floor(avgRating) ? "fill-yellow-500" : "fill-gray-300"} />
              ))}
            </div>
            <span className="text-[11px] font-medium text-[var(--text-muted)]">({reviews?.length || 0})</span>
          </div>
        </div>

        <div className="flex items-center justify-between mt-auto pt-4 border-t border-[var(--border-color)]">
          <p className="text-lg font-extrabold text-blue-600">Free</p>
          <div className="w-8 h-8 rounded-full bg-blue-50 dark:bg-blue-900/30 flex items-center justify-center text-blue-600 group-hover:bg-blue-600 group-hover:text-white transition-all">
            <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
            </svg>
          </div>
        </div>
      </div>
    </div>
  );
};

export default CourseCard;
