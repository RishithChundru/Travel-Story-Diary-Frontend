import axios from 'axios';

const API_BASE_URL = 'https://travel-story-diary-backend.onrender.com' || 'http://localhost:5000';
const API_URL = `${API_BASE_URL}/api/travelstories`;

const getAuthHeader = () => {
    const user = JSON.parse(localStorage.getItem('user'));

    if (user && user.token) {
        return {
            headers: {
                Authorization: `Bearer ${user.token}`,
                'Content-Type': 'application/json',
            },
        };
    } else {
        return {};
    }
};

// const getStories = async (searchQuery = '') => {
//     const response = await axios.get(`${API_URL}?search=${searchQuery}`, getAuthHeader());
//     return response.data;
// };

const getStories = async (searchQuery = '') => {
    const user = JSON.parse(localStorage.getItem('user'));
    const token = user?.token;

    if (!token) {
        // Handle case where no token is present (e.g., user not logged in)
        // You might want to throw an error or return an empty array here.
        // Given your HomePage handles !user, returning an empty array is safer for now.
        console.warn("No authentication token found when trying to get stories.");
        return [];
    }

    const config = {
        headers: {
            Authorization: `Bearer ${token}`,
        },
        params: {
            search: searchQuery, // Pass search query as a URL parameter
        },
    };

    try {
        const response = await axios.get(`${API_URL}/api/travelstories`, config);
        if (!Array.isArray(response.data)) {
            console.error("Backend /api/travelstories did not return an array:", response.data);
            return []; 
        }
        return response.data;
    } catch (error) {
        console.error('Error in storyService.getStories:', error.response?.data || error.message);
        throw error;
    }
};


const addStory = async (storyData) => {
    const response = await axios.post(API_URL, storyData, getAuthHeader());
    return response.data;
};

const updateStory = async (storyId, storyData) => {
    const response = await axios.put(`${API_URL}/${storyId}`, storyData, getAuthHeader());
    return response.data;
};

const deleteStory = async (storyId) => {
    const response = await axios.delete(`${API_URL}/${storyId}`, getAuthHeader());
    return response.data;
};

const toggleFavorite = async (storyId) => {
    const response = await axios.post(`${API_URL}/${storyId}/favorite`, {}, getAuthHeader());
    return response.data;
};

const storyService = {
    getStories,
    addStory,
    updateStory,
    deleteStory,
    toggleFavorite, 
};

export default storyService;