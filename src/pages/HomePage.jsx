// import React, { useState, useEffect, useCallback } from 'react';
// import { useNavigate } from 'react-router-dom';
// import storyService from '../api/storyService';
// import StoryCard from '../components/StoryCard';
// import AddEditStoryModal from '../components/AddEditStoryModal';
// import { useSelector, useDispatch } from 'react-redux';
// import { toast } from 'react-toastify';
// import { FaHeart, FaRegHeart } from 'react-icons/fa';
// import { updateFavorites } from '../features/auth/authSlice'; 

// const HomePage = () => {
//     const [allUserStories, setAllUserStories] = useState([]);
//     const [displayedStories, setDisplayedStories] = useState([]);
//     const [isAddModalOpen, setIsAddModalOpen] = useState(false);
//     const [isEditModalOpen, setIsEditModalOpen] = useState(false);
//     const [editingStory, setEditingStory] = useState(null);
//     const [searchQuery, setSearchQuery] = useState('');
//     const [showFavoritesOnly, setShowFavoritesOnly] = useState(false);
//     const navigate = useNavigate();
//     const dispatch = useDispatch();

//     const { user } = useSelector((state) => state.auth);

//     const filterAndSetDisplayedStories = useCallback(() => {
//         let filtered = allUserStories; 

//         if (searchQuery) {
//             const lowerCaseQuery = searchQuery.toLowerCase();
//             filtered = filtered.filter(story =>
//                 story.title.toLowerCase().includes(lowerCaseQuery) ||
//                 story.description.toLowerCase().includes(lowerCaseQuery) ||
//                 story.location.toLowerCase().includes(lowerCaseQuery)
//             );
//         }

//         if (showFavoritesOnly && user && Array.isArray(user.favorites)) {
//             filtered = filtered.filter(story => user.favorites.includes(story._id));
//         }

//         setDisplayedStories(filtered);
//     }, [allUserStories, searchQuery, showFavoritesOnly, user]); 


//     const fetchStories = useCallback(async () => {
//         try {
//             if (!user || !user.token) {
//                 setAllUserStories([]);
//                 setDisplayedStories([]);
//                 console.log("User not logged in, redirecting to login.");
//                 navigate('/login'); 
//                 return;
//             }

//             const fetchedStories = await storyService.getStories(searchQuery); 
//             if (!Array.isArray(fetchedStories)) {
//             console.error('API returned non-array data for stories:', fetchedStories);
//             setAllUserStories([]); 
//             setDisplayedStories([]);
//             toast.error('Received invalid story data from server.');
//             return;
//         }
//             setAllUserStories(fetchedStories); 
//         } catch (error) {
//             console.error('Error fetching stories:', error);
//             if (error.response && error.response.status === 401) {
//                 toast.error('Session expired or unauthorized. Please log in again.');
//                 navigate('/login');
//             } else {
//                 toast.error('Failed to load stories.');
//             }
//             setAllUserStories([]);
//         setDisplayedStories([]);
//         }
//     }, [user, navigate, searchQuery]); 


//     useEffect(() => {
//         if (!user) {
//             navigate('/login'); 
//             return;
//         } else {
//             fetchStories();
//         }
//     }, [user, navigate, fetchStories]);

//     useEffect(() => {
//         filterAndSetDisplayedStories();
//     }, [allUserStories, searchQuery, showFavoritesOnly, user?.favorites, filterAndSetDisplayedStories]); 

//     const handleAddStory = async (newStoryData) => {
//         try {
//             await storyService.addStory(newStoryData);
//             toast.success('Story added successfully!');
//             setIsAddModalOpen(false);
//             fetchStories(); 
//         } catch (error) {
//             console.error('Error adding story:', error);
//             toast.error('Failed to add story.');
//         }
//     };

//     const handleEditStory = async (storyId, updatedStoryData) => {
//         try {
//             const updatedStory = await storyService.updateStory(storyId, updatedStoryData);
//             setAllUserStories(prevStories => prevStories.map((story) =>
//                 story._id === storyId ? { ...story, ...updatedStory } : story
//             ));
//             toast.success('Story updated successfully!');
//             setIsEditModalOpen(false);
//             setEditingStory(null);
//         } catch (error) {
//             console.error('Error updating story:', error);
//             toast.error('Failed to update story.');
//         }
//     };

//     const handleDeleteStory = async (storyId) => {
//         if (window.confirm('Are you sure you want to delete this story? This action cannot be undone.')) {
//             try {
//                 await storyService.deleteStory(storyId);
//                 setAllUserStories(prevStories => prevStories.filter((story) => story._id !== storyId));
//                 toast.success('Story deleted successfully!');
//             } catch (error) {
//                 console.error('Error deleting story:', error);
//                 toast.error('Failed to delete story.');
//             }
//         }
//     };

//     const handleToggleFavorite = async (storyId) => {
//         if (!user) {
//             toast.info('Please log in to favorite stories.');
//             navigate('/login');
//             return;
//         }
//         try {
//             const response = await storyService.toggleFavorite(storyId); 
//             dispatch(updateFavorites(response.favorites));

//             if (response.action === 'favorited') {
//                 toast.success(response.message, {
//                     icon: <FaHeart className="text-red-500" />
//                 });
//             } else {
//                 toast.info(response.message, {
//                     icon: <FaRegHeart className="text-gray-500" />
//                 });
//             }

//         } catch (error) {
//             console.error('Error toggling favorite:', error);
//             const errorMessage = error.response?.data?.message || 'Failed to toggle favorite status.';
//             toast.error(errorMessage);
//         }
//     };

//     const openEditModal = (story) => {
//         setEditingStory(story);
//         setIsEditModalOpen(true);
//     };

//     return (
//         <div className="home-page-container p-4">
//             <h1 className="text-3xl text-black font-bold mb-6 text-center">Your Travel Stories</h1>

//             <div className="mb-6 flex flex-col md:flex-row justify-center items-center gap-4">
//                 <input
//                     type="text"
//                     placeholder="Search stories by title, description, or location..."
//                     className="p-2 border border-gray-300 rounded-md w-full max-w-md"
//                     value={searchQuery}
//                     onChange={(e) => setSearchQuery(e.target.value)}
//                 />
//                 {user && ( 
//                     <button
//                         onClick={() => setShowFavoritesOnly(!showFavoritesOnly)}
//                         className={`px-4 py-2 rounded-md transition-colors ${
//                             showFavoritesOnly ? 'bg-red-500 text-black hover:bg-red-600' : 'bg-gray-200 text-black hover:bg-gray-300'
//                         }`}
//                     >
//                         {showFavoritesOnly ? 'Show All Stories' : 'Show Favorites'}
//                     </button>
//                 )}
//             </div>

//             {displayedStories.length === 0 && !searchQuery && !showFavoritesOnly ? (
//                 <p className="text-center text-gray-600">No stories yet. Start by adding one!</p>
//             ) : displayedStories.length === 0 && (searchQuery || showFavoritesOnly) ? (
//                 <p className="text-center text-gray-600">
//                     No stories found {showFavoritesOnly ? 'in your favorites' : ''} {searchQuery ? `for "${searchQuery}"` : ''}.
//                 </p>
//             ) : (
//                 <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
//                     {displayedStories.map((story) => (
//                         <StoryCard
//                             key={story._id}
//                             story={story}
//                             onEdit={openEditModal}
//                             onDelete={handleDeleteStory}
//                             currentUser={user}
//                             onToggleFavorite={handleToggleFavorite}
//                             isFavorited={user?.favorites?.includes(story._id) || false}
//                         />
//                     ))}
//                 </div>
//             )}

//             {user && ( 
//                 <button
//                     className="fixed bottom-8 right-8 bg-orange-600 text-white rounded-full w-14 h-14 flex items-center justify-center text-3xl shadow-lg hover:bg-red-600 transition-colors"
//                     onClick={() => setIsAddModalOpen(true)}
//                 >
//                     +
//                 </button>
//             )}

//             {isAddModalOpen && (
//                 <AddEditStoryModal
//                     onClose={() => setIsAddModalOpen(false)}
//                     onSubmit={handleAddStory}
//                     title="Add New Travel Story"
//                 />
//             )}

//             {isEditModalOpen && (
//                 <AddEditStoryModal
//                     onClose={() => { setIsEditModalOpen(false); setEditingStory(null); }}
//                     onSubmit={handleEditStory}
//                     title="Edit Travel Story"
//                     initialData={editingStory}
//                 />
//             )}
//         </div>
//     );
// };

// export default HomePage;

import React, { useState, useEffect, useCallback } from 'react';
import { useNavigate } from 'react-router-dom';
import travelStoryService from '../features/travelStories/travelStoryService'; // Renamed import
import StoryCard from '../components/StoryCard';
import AddEditStoryModal from '../components/AddEditStoryModal';
import { useSelector, useDispatch } from 'react-redux';
import { toast } from 'react-toastify';
import { FaHeart, FaRegHeart } from 'react-icons/fa';
import { updateFavorites } from '../features/auth/authSlice';
import { getStories, createStory, updateStory, deleteStory, toggleFavoriteStory } from '../features/travelStories/travelStoriesSlice';


const HomePage = () => {
    // Redux state for stories and authentication
    const { stories, isLoading, isError, message } = useSelector((state) => state.travelStories);
    const { user } = useSelector((state) => state.auth);

    const [isAddModalOpen, setIsAddModalOpen] = useState(false);
    const [isEditModalOpen, setIsEditModalOpen] = useState(false);
    const [editingStory, setEditingStory] = useState(null);
    const [searchQuery, setSearchQuery] = useState('');
    const [showFavoritesOnly, setShowFavoritesOnly] = useState(false);
    const navigate = useNavigate();
    const dispatch = useDispatch();

    // Memoize the filtering logic
    const displayedStories = React.useMemo(() => {
        let filtered = stories;

        if (searchQuery) {
            const lowerCaseQuery = searchQuery.toLowerCase();
            filtered = filtered.filter(story =>
                story.title.toLowerCase().includes(lowerCaseQuery) ||
                story.description.toLowerCase().includes(lowerCaseQuery) ||
                story.location.toLowerCase().includes(lowerCaseQuery)
            );
        }

        if (showFavoritesOnly && user && Array.isArray(user.favorites)) {
            // Check if story._id is in user.favorites
            filtered = filtered.filter(story => user.favorites.includes(story._id));
        }

        // Add 'isFavorited' flag to each story for rendering in StoryCard
        return filtered.map(story => ({
            ...story,
            isFavorited: user && Array.isArray(user.favorites) ? user.favorites.includes(story._id) : false
        }));

    }, [stories, searchQuery, showFavoritesOnly, user]);


    // Fetch stories on component mount or user change
    useEffect(() => {
        if (!user) {
            navigate('/login');
            return;
        }
        // Dispatch the Redux thunk to fetch stories, passing the current searchQuery
        dispatch(getStories(searchQuery));

        if (isError) {
            toast.error(message);
        }
    }, [user, navigate, dispatch, isError, message, searchQuery]); // Add searchQuery here if getStories uses it for backend filtering

    const handleAddStory = async (newStoryData) => {
        try {
            await dispatch(createStory(newStoryData)).unwrap(); // .unwrap() to handle rejected promises
            toast.success('Story added successfully!');
            setIsAddModalOpen(false);
            // No need to call fetchStories explicitly, Redux state is updated by createStory fulfilled case
        } catch (error) {
            console.error('Error adding story:', error);
            toast.error(error || 'Failed to add story.'); // Error from thunkAPI.rejectWithValue
        }
    };

    const handleEditStory = async (storyId, updatedStoryData) => {
        try {
            await dispatch(updateStory({ storyId, storyData: updatedStoryData })).unwrap();
            toast.success('Story updated successfully!');
            setIsEditModalOpen(false);
            setEditingStory(null);
            // Redux state is updated by updateStory fulfilled case
        } catch (error) {
            console.error('Error updating story:', error);
            toast.error(error || 'Failed to update story.');
        }
    };

    const handleDeleteStory = async (storyId) => {
        if (window.confirm('Are you sure you want to delete this story? This action cannot be undone.')) {
            try {
                await dispatch(deleteStory(storyId)).unwrap();
                toast.success('Story deleted successfully!');
                // Redux state is updated by deleteStory fulfilled case
            } catch (error) {
                console.error('Error deleting story:', error);
                toast.error(error || 'Failed to delete story.');
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
            const response = await dispatch(toggleFavoriteStory(storyId)).unwrap();

            // Update local Redux state for user's favorites
            dispatch(updateFavorites(response.favorites)); // Assuming response.favorites contains the updated array

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
            const errorMessage = error || 'Failed to toggle favorite status.';
            toast.error(errorMessage);
        }
    };

    const openEditModal = (story) => {
        setEditingStory(story);
        setIsEditModalOpen(true);
    };

    // Show loading spinner or message
    if (isLoading) {
        return <div className="text-center p-8 text-xl font-semibold">Loading stories...</div>;
    }


    return (
        // Added h-full and overflow-y-auto to enable scrolling for the page content
        <div className="home-page-container p-4 h-full overflow-y-auto">
            <h1 className="text-3xl text-black font-bold mb-6 text-center">Your Travel Stories</h1>

            <div className="mb-6 flex flex-col md:flex-row justify-center items-center gap-4">
                <input
                    type="text"
                    placeholder="Search stories..."
                    value={searchQuery}
                    onChange={(e) => setSearchQuery(e.target.value)}
                    className="w-full md:w-1/3 p-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
                />
                <div className="flex items-center space-x-2">
                    <input
                        type="checkbox"
                        id="showFavorites"
                        checked={showFavoritesOnly}
                        onChange={(e) => setShowFavoritesOnly(e.target.checked)}
                        className="h-4 w-4 text-blue-600 focus:ring-blue-500 border-gray-300 rounded"
                    />
                    <label htmlFor="showFavorites" className="text-gray-700">Show Favorites Only</label>
                </div>
                <button
                    onClick={() => setIsAddModalOpen(true)}
                    className="bg-blue-600 hover:bg-blue-700 text-white font-bold py-2 px-4 rounded-md shadow-md transition-colors"
                >
                    Add New Story
                </button>
            </div>

            {displayedStories.length === 0 && !isLoading ? (
                <p className="text-center text-gray-600 text-lg mt-8">
                    {searchQuery ? "No stories found matching your search." : "You haven't added any travel stories yet. Click 'Add New Story' to get started!"}
                </p>
            ) : (
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
                    {displayedStories.map((story) => (
                        <StoryCard
                            key={story._id}
                            story={story}
                            onEdit={openEditModal}
                            onDelete={handleDeleteStory}
                            currentUser={user}
                            onToggleFavorite={handleToggleFavorite}
                        />
                    ))}
                </div>
            )}

            {/* The fixed button remains fixed relative to the viewport, even if the content scrolls */}
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
                    title="Add New Travel Story"
                    onClose={() => setIsAddModalOpen(false)}
                    onSubmit={handleAddStory}
                    initialData={null}
                />
            )}

            {isEditModalOpen && (
                <AddEditStoryModal
                    title="Edit Travel Story"
                    onClose={() => setIsEditModalOpen(false)}
                    onSubmit={handleEditStory}
                    initialData={editingStory}
                />
            )}
        </div>
    );
};

export default HomePage;
