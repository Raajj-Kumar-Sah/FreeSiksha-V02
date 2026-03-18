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
      className="premium-card group cursor-pointer overflow-hidden border border-border"
      onClick={() => navigate(`/viewcourse/${id}`)}
    >
      {/* Thumbnail & Badge */}
      <div className="relative aspect-video overflow-hidden">
        <img
          src={thumbnail}
          alt={title}
          className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-500"
        />
        <div className="absolute top-3 left-3 px-3 py-1 bg-emerald-500 text-white text-[10px] font-bold rounded-md shadow-lg tracking-wider">
          FREE
        </div>
      </div>

      {/* Content */}
      <div className="p-5 space-y-3">
        <h2 className="text-lg font-bold text-main line-clamp-2 min-h-[3.5rem] leading-tight group-hover:text-blue-600 transition-colors">
          {title}
        </h2>
        
        <div className="flex flex-col gap-1">
          <p className="text-sm text-muted font-medium">Instructor: {creatorName || "Expert Instructor"}</p>
          
          <div className="flex items-center gap-2">
            <span className="text-sm font-bold text-main">{avgRating}</span>
            <div className="flex text-yellow-400 text-xs">
              {[...Array(5)].map((_, i) => (
                <FaStar key={i} className={i < Math.round(avgRating) ? "fill-current" : "text-border"} />
              ))}
            </div>
            <span className="text-xs text-muted">({reviews?.length || 0})</span>
          </div>
        </div>

        <button 
          className="w-full btn-primary rounded-xl py-3 text-sm font-bold mt-2"
          onClick={(e) => {
            e.stopPropagation();
            navigate(`/viewcourse/${id}`);
          }}
        >
          Enroll Free
        </button>
      </div>
    </div>
  );
};

export default CourseCard;
