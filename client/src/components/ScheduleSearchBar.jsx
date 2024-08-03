import React, { useState } from 'react';

function SearchBar() {
    const [query, setQuery] = useState('');
    const [schedules, setSchedules] = useState([]);

    const handleSearch = async () => {
        if (!query) return;  // Prevent empty queries

        try {
            const response = await fetch(`/api/schedules/search?query=${encodeURIComponent(query)}`);
            if (!response.ok) throw new Error('Search failed');
            const data = await response.json();
            setSchedules(data);
        } catch (error) {
            console.error('Error:', error.message);
        }
    };

    return (
        <div>
            <input
                type="text"
                value={query}
                onChange={e => setQuery(e.target.value)}
                placeholder="Search schedules..."
            />
            <button onClick={handleSearch}>Search</button>

            <ul>
                {schedules.map(schedule => (
                    <li key={schedule._id}>{schedule.title} - {schedule.owner.username}</li>
                ))}
            </ul>
        </div>
    );
}

export default SearchBar;
