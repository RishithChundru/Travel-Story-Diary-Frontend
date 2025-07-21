import { createSlice, createAsyncThunk } from '@reduxjs/toolkit';
import travelStoryService from './travelStoryService';

export const getStories = createAsyncThunk(
    'travelStories/getAll',
    async (_, thunkAPI) => {
        try {
            const token = thunkAPI.getState().auth.user.token; 
            return await travelStoryService.getTravelStories(token);
        } catch (error) {
            const message = (error.response && error.response.data && error.response.data.message) || error.message || error.toString();
            return thunkAPI.rejectWithValue(message);
        }
    }
);

export const createStory = createAsyncThunk(
    'travelStories/create',
    async (storyData, thunkAPI) => {
        try {
            const token = thunkAPI.getState().auth.user.token;
            return await travelStoryService.createTravelStory(storyData, token);
        } catch (error) {
            const message = (error.response && error.response.data && error.response.data.message) || error.message || error.toString();
            return thunkAPI.rejectWithValue(message);
        }
    }
);

export const toggleFavoriteStory = createAsyncThunk(
    'travelStories/toggleFavorite',
    async (storyId, thunkAPI) => {
        try {
            const token = thunkAPI.getState().auth.user.token;
            return await travelStoryService.toggleFavorite(storyId, token);
        } catch (error) {
            const message = (error.response && error.response.data && error.response.data.message) || error.message || error.toString();
            return thunkAPI.rejectWithValue(message);
        }
    }
);