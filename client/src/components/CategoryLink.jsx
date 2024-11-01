import React from 'react';
import { useNavigate } from 'react-router-dom';

const CategoryLink = ({ category }) => {
  const navigate = useNavigate();

  const handleCategoryClick = () => {
    // Redirect to the search page with the category
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
