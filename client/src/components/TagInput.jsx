import React, { useState } from 'react';
import './TagInput.css';

const TagInput = ({ tags, setTags }) => {
    const [input, setInput] = useState('');

    const handleInputChange = (e) => {
        setInput(e.target.value);
    };

    const handleAddTag = () => {
        event.preventDefault();
        
      if (input.trim() !== '') {
          const newTags = input.split(' ').map(tag => tag.trim().startsWith('#') ? tag.trim() : `#${tag.trim()}`);
          setTags(prevTags => [...newTags, ...prevTags]);  // Ensure new tags are added to existing tags
          setInput('');  // Clear the input after adding tags
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
            <div className="tag-list-container">
                {tags.map((tag, index) => (
                    <span key={index} className="tag-pill" onClick={() => handleRemoveTag(tag)}>
                        {tag} <span>&times;</span>
                    </span>
                ))}
            </div>
        </div>
    );
};

export default TagInput;
