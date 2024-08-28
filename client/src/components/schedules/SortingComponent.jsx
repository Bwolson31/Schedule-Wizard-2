import React from 'react';
import { Dropdown, DropdownButton } from 'react-bootstrap';

const sortFields = {
  DateCreated: "Date Created",
  DateUpdated: "Last Updated",
  Title: "Title",
  Popularity: "Popularity" 
};

const orderTypes = {
  NewestFirst: {
    DateCreated: "Newest First",
    DateUpdated: "Newest First",
    Title: "Z to A",
    Popularity: "Highest First" 
  },
  OldestFirst: {
    DateCreated: "Oldest First",
    DateUpdated: "Oldest First",
    Title: "A to Z",
    Popularity: "Lowest First" 
  }
};

function SortingComponent({ sortBy, setSortBy, sortOrder, setSortOrder }) {
  const handleSortChange = (fieldKey) => {
    setSortBy(fieldKey);
  };

  const handleOrderChange = (orderKey) => {
    setSortOrder(orderKey);
  };

  return (
    <>
      <DropdownButton id="sort-by" title={`Sort by: ${sortFields[sortBy]}`} className="mb-3">
        {Object.keys(sortFields).map(key => (
          <Dropdown.Item key={key} onClick={() => handleSortChange(key)}>
            {sortFields[key]}
          </Dropdown.Item>
        ))}
      </DropdownButton>
      
      <DropdownButton id="sort-order" title={`Order: ${orderTypes[sortOrder][sortBy]}`} className="mb-3">
        {Object.entries(orderTypes).map(([key, labels]) => (
          <Dropdown.Item key={key} onClick={() => handleOrderChange(key)}>
            {labels[sortBy]}
          </Dropdown.Item>
        ))}
      </DropdownButton>
    </>
  );
}

export default SortingComponent;
