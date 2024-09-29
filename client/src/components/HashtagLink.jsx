import React from 'react';
import { useNavigate } from 'react-router-dom';

const HashtagLink = ({ tag }) => {
  const navigate = useNavigate();

  const handleTagClick = () => {
    // Pass the tag as a query parameter in the URL, ensuring it's encoded properly
    navigate(`/search?searchTerm=${encodeURIComponent(tag)}`);
  };

  return (
    <span
      onClick={handleTagClick}
      style={{ color: 'blue', cursor: 'pointer', textDecoration: 'underline' }}
    >
      #{tag}
    </span>
  );
};

export default HashtagLink;
