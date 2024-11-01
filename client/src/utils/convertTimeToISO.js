export function convertTimeToISO(timeInput) {
    // Check if the input is a Unix timestamp in milliseconds (numeric value)
    if (typeof timeInput === 'number' || (!isNaN(timeInput) && !isNaN(parseFloat(timeInput)))) {
        const date = new Date(parseInt(timeInput));
        return date.toISOString();
    }

    // Handle "HH:MM AM/PM" format by converting to 24-hour time if it's a string
    if (typeof timeInput === 'string' && timeInput.trim() !== '') {
        let [time, modifier] = timeInput.split(' ');
        let [hours, minutes] = time.split(':');

        if (hours === '12') {
            hours = '00';
        }
        if (modifier === 'PM') {
            hours = parseInt(hours, 10) + 12;
        }

        // Recreate the time string in 24-hour format
        timeInput = `${hours}:${minutes}`;

        const date = new Date(`1970-01-01T${timeInput}:00Z`);

        if (!isNaN(date.getTime())) {
            return date.toISOString();
        } else {
            console.error('Invalid date created from time string:', timeInput);
            return null;
        }
    }

    console.error('Invalid or empty time input:', timeInput);
    return null;
}
