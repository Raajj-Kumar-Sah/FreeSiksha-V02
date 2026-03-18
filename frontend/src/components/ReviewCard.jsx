import React from "react";
import { FaStar } from "react-icons/fa";

const ReviewCard = ({ text, name, image, role, rating }) => {
  return (
    <div className="premium-card p-8 flex flex-col gap-6 h-full border border-border">
      {/* 👤 Reviewer Header */}
      <div className="flex items-center gap-4">
        <div className="w-12 h-12 rounded-full overflow-hidden border-2 border-border p-0.5">
          <img
            src={image}
            alt={name}
            className="w-full h-full rounded-full object-cover"
          />
        </div>
        <div>
          <h4 className="font-bold text-main leading-tight">{name}</h4>
          <p className="text-xs text-muted font-medium">{role}</p>
        </div>
      </div>

      {/* 💬 Review Text */}
      <blockquote className="relative">
        <div className="flex text-yellow-400 text-xs mb-4">
          {[...Array(5)].map((_, i) => (
            <FaStar key={i} className={i < rating ? "fill-current" : "text-border"} />
          ))}
        </div>
        <span className="absolute -top-4 -left-2 text-4xl text-blue-100 font-serif leading-none">"</span>

        <p className="text-muted text-[15px] italic leading-relaxed relative z-10">
          {text}
        </p>
        <span className="absolute -bottom-6 right-0 text-4xl text-blue-100 font-serif leading-none">"</span>
      </blockquote>
    </div>
  );
};

export default ReviewCard;
