import React, { useState } from 'react';
import CategorySelector from '../CategorySelector';  


function ScheduleCategory({ category, onSave }) {
  const [selectedCategory, setSelectedCategory] = useState(category || 'GENERAL');

  // When a new category is selected
  const handleCategoryChange = (newCategory) => {
    setSelectedCategory(newCategory);  // Update the selected category in state
    onSave(newCategory);  // Immediately pass the selected category to the parent
  };

  return (
    <div>
      <CategorySelector
        selectedCategory={selectedCategory} 
        onCategoryChange={handleCategoryChange}  // Pass the handler to CategorySelector
      />
    </div>
  );
}

export default ScheduleCategory;
