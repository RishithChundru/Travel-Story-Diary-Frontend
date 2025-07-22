// import axios from 'axios';

// const API_URL = '/api/travelstories/';

// // Create new travel story
// const createTravelStory = async (travelStoryData, token) => {
//     const config = {
//         headers: {
//             Authorization: `Bearer ${token}`,
//         },
//     };
//     const response = await axios.post(API_URL, travelStoryData, config);
//     return response.data;
// };

// // Get user travel stories
// const getTravelStories = async (token) => {
//     const config = {
//         headers: {
//             Authorization: `Bearer ${token}`,
//         },
//     };
//     const response = await axios.get(API_URL, config);
//     return response.data;
// };

// // Update travel story (you'll need to pass id and data)
// const updateTravelStory = async (storyId, travelStoryData, token) => {
//     const config = {
//         headers: {
//             Authorization: `Bearer ${token}`,
//         },
//     };
//     const response = await axios.put(API_URL + storyId, travelStoryData, config);
//     return response.data;
// };

// // Delete travel story
// const deleteTravelStory = async (storyId, token) => {
//     const config = {
//         headers: {
//             Authorization: `Bearer ${token}`,
//         },
//     };
//     const response = await axios.delete(API_URL + storyId, config);
//     return response.data;
// };

// const travelStoryService = {
//     createTravelStory,
//     getTravelStories,
//     updateTravelStory,
//     deleteTravelStory,
// };

// export default travelStoryService;



import axios from 'axios';

const BASE_API_URL = 'https://travel-story-diary-backend.onrender.com' || 'http://localhost:5000';
const TRAVEL_STORIES_API_URL = `${BASE_API_URL}/api/travelstories`;

// Create new travel story
const createTravelStory = async (travelStoryData, token) => {
    const config = {
        headers: {
            Authorization: `Bearer ${token}`,
        },
    };
    const response = await axios.post(TRAVEL_STORIES_API_URL, travelStoryData, config);
    return response.data;
};

// Get user travel stories
const getTravelStories = async (token) => {
    const config = {
        headers: {
            Authorization: `Bearer ${token}`,
        },
    };
    const response = await axios.get(TRAVEL_STORIES_API_URL, config);
    return response.data;
};

// Update travel story (you'll need to pass id and data)
const updateTravelStory = async (storyId, travelStoryData, token) => {
    const config = {
        headers: {
            Authorization: `Bearer ${token}`,
        },
    };
    const response = await axios.put(`${TRAVEL_STORIES_API_URL}/${storyId}`, travelStoryData, config);
    return response.data;
};

// Delete travel story
const deleteTravelStory = async (storyId, token) => {
    const config = {
        headers: {
            Authorization: `Bearer ${token}`,
        },
    };
    const response = await axios.delete(`${TRAVEL_STORIES_API_URL}/${storyId}`, config);
    return response.data;
};

const travelStoryService = {
    createTravelStory,
    getTravelStories,
    updateTravelStory,
    deleteTravelStory,
};

export default travelStoryService;