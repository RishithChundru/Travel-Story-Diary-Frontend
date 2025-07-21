import React from 'react';
import { FaHeart, FaRegHeart } from 'react-icons/fa';

const StoryCard = ({ story, onEdit, onDelete, currentUser, onToggleFavorite }) => {
    const isOwner = currentUser && story.user === currentUser._id;

    const formatDate = (dateString) => {
        return new Date(dateString).toLocaleDateString('en-US', {
            year: 'numeric',
            month: 'long',
            day: 'numeric'
        });
    };

    const imageUrl = story.image; 

    return (
        <div className="bg-white rounded-lg shadow-md overflow-hidden hover:shadow-xl transition-shadow duration-300 relative">
            {story.image && (
                <img src={imageUrl} alt={story.title} className="w-full h-48 object-cover" />
            )}
            <div className="p-4">
                <h3 className="text-xl font-semibold mb-2">{story.title}</h3>
                <p className="text-gray-600 text-sm mb-2">Location: {story.location}</p>
                <p className="text-gray-600 text-sm mb-4">Date: {formatDate(story.date)}</p>
                <p className="text-gray-700 text-base mb-4 line-clamp-3">{story.description}</p>

                <div className="flex justify-between items-center mt-auto">
                    {currentUser && (
                        <button
                            onClick={() => onToggleFavorite(story._id)}
                            className="text-2xl transition-colors duration-200"
                            title={story.isFavorited ? "Unfavorite" : "Favorite"}
                        >
                            {story.isFavorited ? (
                                <FaHeart className="text-red-500 hover:text-red-600" />
                            ) : (
                                <FaRegHeart className="text-gray-400 hover:text-red-400" />
                            )}
                        </button>
                    )}

                    {isOwner && (
                        <div className="flex space-x-2">
                            <button
                                className="px-4 py-2 bg-yellow-500 text-white rounded-md hover:bg-yellow-600 transition-colors text-sm"
                                onClick={() => onEdit(story)}
                            >
                                Edit
                            </button>
                            <button
                                className="px-4 py-2 bg-red-500 text-white rounded-md hover:bg-red-600 transition-colors text-sm"
                                onClick={() => onDelete(story._id)}
                            >
                                Delete
                            </button>
                        </div>
                    )}
                </div>
            </div>
        </div>
    );
};

export default StoryCard;