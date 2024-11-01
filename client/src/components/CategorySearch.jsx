
import React from 'react';
import { useNavigate } from 'react-router-dom';
import { NavDropdown } from 'react-bootstrap';
import { categoryOptions } from './CategorySelector';

const CategorySearch = () => {
  const navigate = useNavigate();

  const handleCategorySelect = (category) => {
    // Redirect to the search page with the selected category as a query parameter
    navigate(`/search?category=${category}`);
  };

  return (
    <NavDropdown title="Categories" id="category-dropdown" align="end">
      {categoryOptions.map(option => (
        <NavDropdown.Item
          key={option.value}
          onClick={() => handleCategorySelect(option.value)}
        >
          {option.label}
        </NavDropdown.Item>
      ))}
    </NavDropdown>
  );
};

export default CategorySearch;
