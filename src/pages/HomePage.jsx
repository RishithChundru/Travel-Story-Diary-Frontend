import React, { useState, useEffect, useCallback } from 'react';
import { useNavigate } from 'react-router-dom';
import storyService from '../api/storyService';
import StoryCard from '../components/StoryCard';
import AddEditStoryModal from '../components/AddEditStoryModal';
import { useSelector, useDispatch } from 'react-redux';
import { toast } from 'react-toastify';
import { FaHeart, FaRegHeart } from 'react-icons/fa';
import { updateFavorites } from '../features/auth/authSlice'; 

const HomePage = () => {
    const [allUserStories, setAllUserStories] = useState([]);
    const [displayedStories, setDisplayedStories] = useState([]);
    const [isAddModalOpen, setIsAddModalOpen] = useState(false);
    const [isEditModalOpen, setIsEditModalOpen] = useState(false);
    const [editingStory, setEditingStory] = useState(null);
    const [searchQuery, setSearchQuery] = useState('');
    const [showFavoritesOnly, setShowFavoritesOnly] = useState(false);
    const navigate = useNavigate();
    const dispatch = useDispatch();

    const { user } = useSelector((state) => state.auth);

    const filterAndSetDisplayedStories = useCallback(() => {
        let filtered = allUserStories; 

        if (searchQuery) {
            const lowerCaseQuery = searchQuery.toLowerCase();
            filtered = filtered.filter(story =>
                story.title.toLowerCase().includes(lowerCaseQuery) ||
                story.description.toLowerCase().includes(lowerCaseQuery) ||
                story.location.toLowerCase().includes(lowerCaseQuery)
            );
        }

        if (showFavoritesOnly && user && Array.isArray(user.favorites)) {
            filtered = filtered.filter(story => user.favorites.includes(story._id));
        }

        setDisplayedStories(filtered);
    }, [allUserStories, searchQuery, showFavoritesOnly, user]); 


    const fetchStories = useCallback(async () => {
        try {
            if (!user || !user.token) {
                setAllUserStories([]);
                setDisplayedStories([]);
                console.log("User not logged in, redirecting to login.");
                navigate('/login'); 
                return;
            }

            const fetchedStories = await storyService.getStories(searchQuery); 
            if (!Array.isArray(fetchedStories)) {
            console.error('API returned non-array data for stories:', fetchedStories);
            setAllUserStories([]); 
            setDisplayedStories([]);
            toast.error('Received invalid story data from server.');
            return;
        }
            setAllUserStories(fetchedStories); 
        } catch (error) {
            console.error('Error fetching stories:', error);
            if (error.response && error.response.status === 401) {
                toast.error('Session expired or unauthorized. Please log in again.');
                navigate('/login');
            } else {
                toast.error('Failed to load stories.');
            }
            setAllUserStories([]);
        setDisplayedStories([]);
        }
    }, [user, navigate, searchQuery]); 


    useEffect(() => {
        if (!user) {
            navigate('/login'); 
            return;
        } else {
            fetchStories();
        }
    }, [user, navigate, fetchStories]);

    useEffect(() => {
        filterAndSetDisplayedStories();
    }, [allUserStories, searchQuery, showFavoritesOnly, user?.favorites, filterAndSetDisplayedStories]); 

    const handleAddStory = async (newStoryData) => {
        try {
            await storyService.addStory(newStoryData);
            toast.success('Story added successfully!');
            setIsAddModalOpen(false);
            fetchStories(); 
        } catch (error) {
            console.error('Error adding story:', error);
            toast.error('Failed to add story.');
        }
    };

    const handleEditStory = async (storyId, updatedStoryData) => {
        try {
            const updatedStory = await storyService.updateStory(storyId, updatedStoryData);
            setAllUserStories(prevStories => prevStories.map((story) =>
                story._id === storyId ? { ...story, ...updatedStory } : story
            ));
            toast.success('Story updated successfully!');
            setIsEditModalOpen(false);
            setEditingStory(null);
        } catch (error) {
            console.error('Error updating story:', error);
            toast.error('Failed to update story.');
        }
    };

    const handleDeleteStory = async (storyId) => {
        if (window.confirm('Are you sure you want to delete this story? This action cannot be undone.')) {
            try {
                await storyService.deleteStory(storyId);
                setAllUserStories(prevStories => prevStories.filter((story) => story._id !== storyId));
                toast.success('Story deleted successfully!');
            } catch (error) {
                console.error('Error deleting story:', error);
                toast.error('Failed to delete story.');
            }
        }
    };

    const handleToggleFavorite = async (storyId) => {
        if (!user) {
            toast.info('Please log in to favorite stories.');
            navigate('/login');
            return;
        }
        try {
            const response = await storyService.toggleFavorite(storyId); 
            dispatch(updateFavorites(response.favorites));

            if (response.action === 'favorited') {
                toast.success(response.message, {
                    icon: <FaHeart className="text-red-500" />
                });
            } else {
                toast.info(response.message, {
                    icon: <FaRegHeart className="text-gray-500" />
                });
            }

        } catch (error) {
            console.error('Error toggling favorite:', error);
            const errorMessage = error.response?.data?.message || 'Failed to toggle favorite status.';
            toast.error(errorMessage);
        }
    };

    const openEditModal = (story) => {
        setEditingStory(story);
        setIsEditModalOpen(true);
    };

    return (
        <div className="home-page-container p-4">
            <h1 className="text-3xl text-black font-bold mb-6 text-center">Your Travel Stories</h1>

            <div className="mb-6 flex flex-col md:flex-row justify-center items-center gap-4">
                <input
                    type="text"
                    placeholder="Search stories by title, description, or location..."
                    className="p-2 border border-gray-300 rounded-md w-full max-w-md"
                    value={searchQuery}
                    onChange={(e) => setSearchQuery(e.target.value)}
                />
                {user && ( 
                    <button
                        onClick={() => setShowFavoritesOnly(!showFavoritesOnly)}
                        className={`px-4 py-2 rounded-md transition-colors ${
                            showFavoritesOnly ? 'bg-red-500 text-black hover:bg-red-600' : 'bg-gray-200 text-black hover:bg-gray-300'
                        }`}
                    >
                        {showFavoritesOnly ? 'Show All Stories' : 'Show Favorites'}
                    </button>
                )}
            </div>

            {displayedStories.length === 0 && !searchQuery && !showFavoritesOnly ? (
                <p className="text-center text-gray-600">No stories yet. Start by adding one!</p>
            ) : displayedStories.length === 0 && (searchQuery || showFavoritesOnly) ? (
                <p className="text-center text-gray-600">
                    No stories found {showFavoritesOnly ? 'in your favorites' : ''} {searchQuery ? `for "${searchQuery}"` : ''}.
                </p>
            ) : (
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                    {displayedStories.map((story) => (
                        <StoryCard
                            key={story._id}
                            story={story}
                            onEdit={openEditModal}
                            onDelete={handleDeleteStory}
                            currentUser={user}
                            onToggleFavorite={handleToggleFavorite}
                            isFavorited={user?.favorites?.includes(story._id) || false}
                        />
                    ))}
                </div>
            )}

            {user && ( 
                <button
                    className="fixed bottom-8 right-8 bg-orange-600 text-white rounded-full w-14 h-14 flex items-center justify-center text-3xl shadow-lg hover:bg-red-600 transition-colors"
                    onClick={() => setIsAddModalOpen(true)}
                >
                    +
                </button>
            )}

            {isAddModalOpen && (
                <AddEditStoryModal
                    onClose={() => setIsAddModalOpen(false)}
                    onSubmit={handleAddStory}
                    title="Add New Travel Story"
                />
            )}

            {isEditModalOpen && (
                <AddEditStoryModal
                    onClose={() => { setIsEditModalOpen(false); setEditingStory(null); }}
                    onSubmit={handleEditStory}
                    title="Edit Travel Story"
                    initialData={editingStory}
                />
            )}
        </div>
    );
};

export default HomePage;