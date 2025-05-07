const BASE_URL = "https://customer-rest-service-frontend-personaltrainer.2.rahtiapp.fi/api/";

/**
 * Fetches data from the given endpoint.
 * @param {string} endpoint - The API endpoint to fetch data from.
 * @returns {Promise<any>} - The response data.
 */
export const fetchData = async (endpoint) => {
    try {
        const response = await fetch(`${BASE_URL}${endpoint}`);
        if (!response.ok) {
            throw new Error(`Error: ${response.status}`);
        }
        return await response.json();
    } catch (error) {
        console.error("Fetch error:", error);
        throw error;
    }
};

/**
 * Sends data to the given endpoint using POST method.
 * @param {string} endpoint - The API endpoint to send data to.
 * @param {object} data - The data to send.
 * @returns {Promise<any>} - The response data.
 */
export const postData = async (endpoint, data) => {
    try {
        const response = await fetch(`${BASE_URL}${endpoint}`, {
            method: "POST",
            headers: {
                "Content-Type": "application/json",
            },
            body: JSON.stringify(data),
        });
        if (!response.ok) {
            throw new Error(`Error: ${response.status}`);
        }
        return await response.json();
    } catch (error) {
        console.error("Post error:", error);
        throw error;
    }
};

/**
 * Deletes data at the given endpoint using DELETE method.
 * @param {string} endpoint - The API endpoint to delete data from.
 * @returns {Promise<void>} - Resolves when the deletion is successful.
 */
export const deleteData = async (endpoint) => {
    try {
        const response = await fetch(`${BASE_URL}${endpoint}`, {
            method: "DELETE",
        });
        if (!response.ok) {
            throw new Error(`Error: ${response.status}`);
        }
    } catch (error) {
        console.error("Delete error:", error);
        throw error;
    }
};

/**
 * Generates a unique ID.
 * @returns {string} - A unique ID string.
 */
export const generateId = () => {
    return Math.random().toString(36).substr(2, 9);
};

export const resetData = async () => {
    try {
        const response = await fetch('https://customer-rest-service-frontend-personaltrainer.2.rahtiapp.fi/reset', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
            },
        });

        if (!response.ok) {
            throw new Error('Reset failed');
        }

        return await response.json();
    } catch (error) {
        console.error('Error resetting data:', error);
        throw error;
    }
};