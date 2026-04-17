// utils.js - Placeholder for any common utility functions

// Example: A function to generate random numbers within a range
export function getRandomInRange(min, max) {
    return Math.random() * (max - min) + min;
}

// Example: A function to get URL parameters
export function getUrlParameter(name) {
    name = name.replace(/[\[]/, '\[').replace(/[\]]/, '\]');
    const regex = new RegExp('[\?&]' + name + '=([^&#]*)');
    const results = regex.exec(location.search);
    return results === null ? null : decodeURIComponent(results[1].replace(/\+/g, ' '));
}

// Add more utility functions as needed for the project.
