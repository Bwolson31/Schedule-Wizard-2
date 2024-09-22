import React, { useState } from 'react';
import './TagInput.css';
const TagInput = ({ tags, setTags }) => {
  const [input, setInput] = useState('');

  const handleInputChange = (e) => {
    setInput(e.target.value);
  };

  const handleAddTag = () => {
    if (input.trim() !== '') {
      const newTags = input.split(' ').map(tag => `#${tag.trim()}`);
      setTags([...tags, ...newTags]);
      setInput('');
    } else {
      alert('Tags cannot be empty.');
    }
  };

  const handleRemoveTag = (tagToRemove) => {
    setTags(tags.filter(tag => tag !== tagToRemove));
  };

  return (
    <div>
      <input
        type="text"
        value={input}
        onChange={handleInputChange}
        placeholder="Add tags"
        className="tag-input-field"
      />
      <button onClick={handleAddTag} className="add-tag-button">Add Tag</button>
      <ul className="tag-list">
        {tags.map((tag, index) => (
          <li
            key={index}
            className="tag-red" // Applying the red tag style
            onClick={() => handleRemoveTag(tag)} // Clicking the tag removes it
          >
            {tag}
          </li>
        ))}
      </ul>
    </div>
  );
};

export default TagInput;