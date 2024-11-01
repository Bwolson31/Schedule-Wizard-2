export function formatTimeForInput(timestamp) {
    if (!timestamp) {
      // If the timestamp is undefined or null, return a default value or empty string
      return '';
    }
  
    // Convert string to number if it's in string form
    timestamp = Number(timestamp);
    
    // Check if the timestamp is in milliseconds (commonly a large number)
    if (timestamp < 10000000000) {
      timestamp *= 1000; // Convert to milliseconds if it seems to be in seconds
    }
  
    const date = new Date(timestamp);
  
    if (isNaN(date.getTime())) {
      console.error('Invalid timestamp:', timestamp);
      return ''; // Return a fallback or default value
    }
  
    return date.toLocaleTimeString('en-US', {
      hour: '2-digit',
      minute: '2-digit',
      hour12: true
    });
  }
  