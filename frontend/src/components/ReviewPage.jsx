import React, { useEffect, useState } from 'react'
import ReviewCard from './ReviewCard'
import { useSelector } from 'react-redux';

function ReviewPage() {
  const [latestReview, setLatestReview] = useState([]);
  const { allReview } = useSelector(state => state.review)
  
  useEffect(() => {
    setLatestReview(allReview.slice(0, 3));
  }, [allReview])

  return (
    <section className="py-24 px-4 lg:px-12 max-w-7xl mx-auto bg-surface">
      <div className="text-center space-y-4 mb-16">
        <h2 className="text-3xl lg:text-4xl font-bold text-main">What Our Students Say</h2>
        <p className="text-muted max-w-2xl mx-auto">
          Discover how FreeSiksha is transforming learning experiences through real feedback from students and professionals worldwide.
        </p>
      </div>

      <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-8">
        {latestReview.map((item, index) => (
          <ReviewCard 
            key={index} 
            rating={item.rating} 
            image={item.user.photoUrl} 
            text={item.comment} 
            name={item.user.name} 
            role={item.user.role} 
          />
        ))}
      </div>
    </section>
  )
}

export default ReviewPage
