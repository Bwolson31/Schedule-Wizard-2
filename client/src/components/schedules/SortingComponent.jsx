import React from 'react';
import { Dropdown, DropdownButton } from 'react-bootstrap';

const sortFields = {
  DateCreated: 'Date Created',
  DateUpdated: 'Last Updated',
  Title: 'Title',
  Popularity: 'Popularity'
};

const orderTypes = {
  DateCreated: {
    NewestFirst: 'Newest First',
    OldestFirst: 'Oldest First'
  },
  DateUpdated: {
    NewestFirst: 'Newest First',
    OldestFirst: 'Oldest First'
  },
  Title: {
    Descending: 'Z to A',
    Ascending: 'A to Z'
  },
  Popularity: {
    Descending: 'Highest First',
    Ascending: 'Lowest First'
  }
};

function SortingComponent({ sortBy, sortOrder, onSortChange }) {
  const handleSortChange = (newSortBy) => {
    const firstSortOrder = Object.keys(orderTypes[newSortBy])[0]; // Default to the first order available for the new field
    onSortChange(newSortBy, firstSortOrder);
};


  const handleOrderChange = (newSortOrder) => {
    onSortChange(sortBy, newSortOrder);
  };

  // Ensure the sortOrder is valid to avoid rendering 'undefined'
  const currentSortOrderTitle = orderTypes[sortBy] && orderTypes[sortBy][sortOrder] ? orderTypes[sortBy][sortOrder] : 'Select Order';



  return (
    <div className="sorting-component">
      <DropdownButton id="sort-by" title={`Sort by: ${sortFields[sortBy]}`} className="mb-3">
        {Object.keys(sortFields).map(key => (
          <Dropdown.Item key={key} onClick={() => handleSortChange(key)}>
            {sortFields[key]}
          </Dropdown.Item>
        ))}
      </DropdownButton>
      
      <DropdownButton id="sort-order" title={`Order: ${currentSortOrderTitle}`} className="mb-3">
        {orderTypes[sortBy] && Object.keys(orderTypes[sortBy]).map(orderKey => (
          <Dropdown.Item key={orderKey} onClick={() => handleOrderChange(orderKey)}>
            {orderTypes[sortBy][orderKey]}
          </Dropdown.Item>
        ))}
      </DropdownButton>
    </div>
  );
}

export default SortingComponent;
