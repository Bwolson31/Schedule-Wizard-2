import React, { useState } from 'react';
import './TagInput.css';

const TagInput = ({ tags, setTags }) => {
  const [input, setInput] = useState('');

  const handleInputChange = (e) => {
    setInput(e.target.value);
  };

  const handleAddTag = (e) => {
    e.preventDefault(); // Prevent form submission

    if (input.trim() !== '') {
      const newTags = input.split(' ').map(tag => `#${tag.trim()}`);
      setTags([...tags, ...newTags]);
      setInput(''); // Clear input after adding tag
    } else {
      alert('Tags cannot be empty.');
    }
  };

  const handleRemoveTag = (tagToRemove) => {
    setTags(tags.filter(tag => tag !== tagToRemove)); // Remove the clicked tag
  };

  return (
    <div>
      <div className="tag-input-container">
        <input
          type="text"
          value={input}
          onChange={handleInputChange}
          placeholder="Add tags"
          className="tag-input-field"
        />
        <button type="button" onClick={handleAddTag} className="add-tag-button">Add Tag</button>
      </div>
      <div className="tag-list-container">
        {tags.map((tag, index) => (
          <span
            key={index}
            className="tag-pill"
            onClick={() => handleRemoveTag(tag)}  // Clicking a tag removes it
          >
            {tag} &times;
          </span>
        ))}
      </div>
    </div>
  );
};

export default TagInput;
