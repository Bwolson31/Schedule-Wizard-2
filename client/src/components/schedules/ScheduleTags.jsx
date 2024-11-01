import React, { useState } from 'react';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faPlusCircle, faPencilAlt, faTrashAlt } from '@fortawesome/free-solid-svg-icons';
import HashtagLink from '../HashtagLink';

const ScheduleTags = ({ tags, isEditable, onSave, onDeleteTag }) => {
  const [isEditingTag, setIsEditingTag] = useState(null); 
  const [updatedTag, setUpdatedTag] = useState('');  
  const [isAddingTag, setIsAddingTag] = useState(false);  
  const [newTag, setNewTag] = useState('');  


  const handleSaveTag = (oldTag) => {
    if (updatedTag.trim()) {
      const updatedTags = tags.map(tag => tag === oldTag ? updatedTag : tag);
      onSave(updatedTags);  
      setIsEditingTag(null);  
    }
  };

  // Handle adding new tag
  const handleAddTag = () => {
    if (newTag.trim()) {
      onSave([...tags, newTag]); 
      setNewTag('');  
      setIsAddingTag(false);  
    }
  };

  return (
    <div className="tags-container">
      {tags.length > 0 ? (
        tags.map((tag, index) => (
          <div key={index} className="tag-item d-flex align-items-center">

            {/* Edit specific tag */}
            {isEditingTag === tag ? (
              <>
                <input
                  type="text"
                  value={updatedTag}
                  onChange={(e) => setUpdatedTag(e.target.value)}
                  onBlur={() => handleSaveTag(tag)}
                  autoFocus
                />
              </>
            ) : (
              <>
                {/* Render existing tag */}
                <HashtagLink tag={tag} />
                {isEditable && (
                  <>
                    {/* Edit icon */}
                    <FontAwesomeIcon
                      icon={faPencilAlt}
                      onClick={() => {
                        setIsEditingTag(tag);  // Set this tag to edit mode
                        setUpdatedTag(tag);  // Pre-fill input with existing tag value
                      }}
                      style={{ cursor: 'pointer', color: 'green', marginLeft: '10px' }}
                    />
                    {/* Delete icon */}
                    <FontAwesomeIcon
                      icon={faTrashAlt}
                      onClick={() => onDeleteTag(tag)}  // Call delete function for tag
                      style={{ cursor: 'pointer', color: 'red', marginLeft: '10px' }}
                    />
                  </>
                )}
              </>
            )}
          </div>
        ))
      ) : (
        <span>No tags</span>
      )}

      {/* Add new tag section */}
      {isEditable && (
        <>
          {/* Add tag icon - Shows input when clicked */}
          {!isAddingTag && (
            <FontAwesomeIcon
              icon={faPlusCircle}
              onClick={() => setIsAddingTag(true)}  // Show the input field for adding a new tag
              style={{ cursor: 'pointer', color: 'green', marginTop: '10px' }}
            />
          )}
          {/* Input for adding a new tag */}
          {isAddingTag && (
            <div className="add-tag-container d-flex align-items-center" style={{ marginTop: '10px' }}>
              <input
                type="text"
                placeholder="Enter new tag"
                value={newTag}
                onChange={(e) => setNewTag(e.target.value)}
              />
              <FontAwesomeIcon
                icon={faPlusCircle}
                onClick={handleAddTag}  // Save the new tag
                style={{ cursor: 'pointer', color: 'green', marginLeft: '10px' }}
              />
            </div>
          )}
        </>
      )}
    </div>
  );
};

export default ScheduleTags;
