import React from 'react';
import './StarRating.css'; 

const StarRating = ({ rating, setRating, totalStars = 5, interactive = true }) => {
  // Function to handle star click, only if interactive
  const handleStarClick = (index) => {
    if (interactive) {
      setRating(index + 1);  // Update the rating based on the star clicked
    }
  };

  // Create an array of stars
  const createStars = () => {
    let stars = [];
    for (let i = 0; i < totalStars; i++) {
      stars.push(
        <span key={i}
          className={`star ${i < rating ? 'filled' : ''}`}
          onClick={() => handleStarClick(i)}
          style={{ cursor: interactive ? 'pointer' : 'default' }}
        >
          ★
        </span>
      );
    }
    return stars;
  };

  return <div className="star-rating">{createStars()}</div>;
};


export default StarRating;