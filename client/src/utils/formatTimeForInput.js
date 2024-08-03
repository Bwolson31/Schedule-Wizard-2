export function formatTimeForInput(timestamp) {
    // Convert string to number if it's in string form
    timestamp = Number(timestamp);
    
    // Check if the timestamp is in milliseconds (commonly a large number)
    if (timestamp < 10000000000) {
        timestamp *= 1000; // Convert to milliseconds if it seems to be in seconds
    }

    const date = new Date(timestamp);

    if (isNaN(date.getTime())) {
        console.error('Invalid timestamp:', timestamp);
        return '00:00'; // Return a fallback or default value
    }

    return date.toLocaleTimeString('en-US', {
        hour: '2-digit',
        minute: '2-digit',
        hour12: false
    });
}
