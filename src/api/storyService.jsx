import axios from 'axios';

const API_BASE_URL = process.env.REACT_APP_API_URL || 'http://localhost:5000';
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

const getStories = async (searchQuery = '') => {
    const response = await axios.get(`${API_URL}?search=${searchQuery}`, getAuthHeader());
    return response.data;
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