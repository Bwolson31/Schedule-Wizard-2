import React, { useState, useEffect } from 'react';
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
  const [currentSortBy, setCurrentSortBy] = useState(sortBy || 'DateCreated');
  const [currentSortOrder, setCurrentSortOrder] = useState(sortOrder || 'NewestFirst');

  useEffect(() => {
    console.log('Props changed in SortingComponent:', { sortBy, sortOrder });
    setCurrentSortBy(sortBy || 'DateCreated');
    setCurrentSortOrder(sortOrder || 'NewestFirst');
  }, [sortBy, sortOrder]);

  const handleSortChange = (newSortBy) => {
    const firstSortOrder = orderTypes[newSortBy] ? Object.keys(orderTypes[newSortBy])[0] : 'NewestFirst';
    console.log('handleSortChange called:', { newSortBy, firstSortOrder });
    setCurrentSortBy(newSortBy);
    setCurrentSortOrder(firstSortOrder);
    onSortChange(newSortBy, firstSortOrder);
  };

  const handleOrderChange = (newSortOrder) => {
    console.log('handleOrderChange called:', { newSortOrder });
    setCurrentSortOrder(newSortOrder);
    onSortChange(currentSortBy, newSortOrder);
  };

  return (
    <div className="sorting-component">
      <DropdownButton id="sort-by" title={`Sort by: ${sortFields[currentSortBy]}`} className="mb-3">
        {Object.keys(sortFields).map(key => (
          <Dropdown.Item key={key} active={key === currentSortBy} onClick={() => handleSortChange(key)}>
            {sortFields[key]}
          </Dropdown.Item>
        ))}
      </DropdownButton>

      {orderTypes[currentSortBy] ? (
        <DropdownButton id="sort-order" title={`Order: ${orderTypes[currentSortBy][currentSortOrder]}`} className="mb-3">
          {Object.keys(orderTypes[currentSortBy]).map(orderKey => (
            <Dropdown.Item key={orderKey} active={orderKey === currentSortOrder} onClick={() => handleOrderChange(orderKey)}>
              {orderTypes[currentSortBy][orderKey]}
            </Dropdown.Item>
          ))}
        </DropdownButton>
      ) : (
        <DropdownButton id="sort-order" title="Order: N/A" className="mb-3" disabled>
          <Dropdown.Item>N/A</Dropdown.Item>
        </DropdownButton>
      )}
    </div>
  );
}

export default SortingComponent;
