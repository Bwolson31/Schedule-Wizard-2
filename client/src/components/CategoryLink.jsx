import React from 'react';
import { useNavigate } from 'react-router-dom';

const CategoryLink = ({ category }) => {
  const navigate = useNavigate();

  const handleCategoryClick = () => {
    // Trigger search with the category as a query parameter
    navigate(`/search?category=${category}`);
  };

  return (
    <span
      onClick={handleCategoryClick}
      style={{ color: 'blue', cursor: 'pointer', textDecoration: 'underline' }}
    >
      {category}
    </span>
  );
};

export default CategoryLink;
