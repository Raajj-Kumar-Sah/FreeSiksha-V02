import React, { useEffect, useState } from 'react'
import Card from "./Card.jsx"
import { useSelector } from 'react-redux';
import { FiArrowRight } from "react-icons/fi";
import { useNavigate } from 'react-router-dom';

function Cardspage() {
  const [popularCourses, setPopularCourses] = useState([]);
  const { courseData } = useSelector(state => state.course)
  const navigate = useNavigate()

  useEffect(() => {
    setPopularCourses(Array.isArray(courseData) ? courseData.slice(0, 4) : []);
  }, [courseData])

  return (
    <section className="py-24 px-4 lg:px-12 max-w-7xl mx-auto">
      <div className="flex flex-col md:flex-row justify-between items-end mb-12 gap-6">
        <div className="space-y-4">
          <h2 className="text-3xl lg:text-4xl font-bold text-main">Featured Courses</h2>
          <p className="text-muted max-w-xl">
            Start learning for free with these high-rated programs, designed to boost your skills and enhance your career.
          </p>
        </div>
        
        <button 
          onClick={() => navigate("/allcourses")}
          className="flex items-center gap-2 text-blue-600 font-bold hover:gap-3 transition-all"
        >
          View all <FiArrowRight />
        </button>
      </div>

      <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-8">
        {popularCourses.map((item, index) => (
          <Card 
            key={index} 
            id={item._id} 
            thumbnail={item.thumbnail} 
            title={item.title} 
            price={item.price} 
            category={item.category} 
            reviews={item.reviews}
            creatorName={item.creatorName} // Assuming backend provides this or it will fall back
          />
        ))}
      </div>
    </section>
  )
}

export default Cardspage
