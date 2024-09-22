import React from 'react';

// Enum values mapped to user-friendly labels
const categoryOptions = [
  { value: 'EXERCISE', label: 'Exercise' },
  { value: 'NUTRITION', label: 'Nutrition' },
  { value: 'WORK_PRODUCTIVITY', label: 'Work & Productivity' },
  { value: 'HOBBIES_CRAFTS', label: 'Hobbies & Crafts' },
  { value: 'EDUCATION', label: 'Education' },
  { value: 'HOMELIFE', label: 'Homelife' },
  { value: 'SOCIAL_LIFE', label: 'Social Life' },
  { value: 'MINDFULNESS', label: 'Mindfulness' },
  { value: 'GENERAL', label: 'General'}

];

const CategorySelector = ({ selectedCategory, onCategoryChange }) => {
  return (
    <select value={selectedCategory} onChange={e => onCategoryChange(e.target.value)}>
      <option value="">Select Category</option>
      {categoryOptions.map(option => (
        <option key={option.value} value={option.value}>
          {option.label}
        </option>
      ))}
    </select>
  );
};

export default CategorySelector;
