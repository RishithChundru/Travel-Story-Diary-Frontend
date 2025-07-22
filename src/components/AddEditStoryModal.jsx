import React, { useState, useEffect } from 'react';

const AddEditStoryModal = ({ onClose, onSubmit, title, initialData }) => {
    const [formData, setFormData] = useState({
        title: '',
        date: '',
        image: '',
        description: '',
        location: '',
    });
    const [errors, setErrors] = useState({});

    useEffect(() => {
        if (initialData) {
            setFormData({
                title: initialData.title || '',
                date: initialData.date ? new Date(initialData.date).toISOString().split('T')[0] : '',
                image: initialData.image || '',
                description: initialData.description || '',
                location: initialData.location || '',
            });
        }
    }, [initialData]);

    const handleChange = (e) => {
        setFormData({ ...formData, [e.target.name]: e.target.value });
        setErrors({ ...errors, [e.target.name]: '' }); 
    };

    const validateForm = () => {
        const newErrors = {};
        if (!formData.title) newErrors.title = 'Title is required';
        if (!formData.date) newErrors.date = 'Date is required';
        if (!formData.image) newErrors.image = 'Image URL is required';
        if (!formData.description) newErrors.description = 'Description is required';
        if (!formData.location) newErrors.location = 'Location is required';
        setErrors(newErrors);
        return Object.keys(newErrors).length === 0;
    };

    const handleSubmit = (e) => {
        e.preventDefault();
        if (validateForm()) {
            if (initialData) {
                onSubmit(initialData._id, formData); 
            } else {
                onSubmit(formData);
            }
        }
    };

    return (
        <div className="fixed inset-0 bg-gray-600 bg-opacity-50 flex justify-center items-center z-50">
            <div className="bg-white rounded-lg shadow-xl p-6 w-full max-w-md mx-4 relative">
                <h2 className="text-2xl font-bold mb-6 text-center">{title}</h2>
                <button
                    className="absolute top-4 right-4 text-gray-500 hover:text-gray-700 text-xl"
                    onClick={onClose}
                >
                    &times;
                </button>
                <form onSubmit={handleSubmit}>
                    <div className="mb-4">
                        <label className="block text-gray-700 text-sm font-bold mb-2" htmlFor="title">
                            Title
                        </label>
                        <input
                            type="text"
                            id="title"
                            name="title"
                            value={formData.title}
                            onChange={handleChange}
                            className="shadow appearance-none border rounded w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline"
                            required
                        />
                        {errors.title && <p className="text-red-500 text-xs italic">{errors.title}</p>}
                    </div>

                    <div className="mb-4">
                        <label className="block text-gray-700 text-sm font-bold mb-2" htmlFor="date">
                            Date
                        </label>
                        <input
                            type="date"
                            id="date"
                            name="date"
                            value={formData.date}
                            onChange={handleChange}
                            className="shadow appearance-none border rounded w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline"
                            required
                        />
                         {errors.date && <p className="text-red-500 text-xs italic">{errors.date}</p>}
                    </div>

                    <div className="mb-4">
                        <label className="block text-gray-700 text-sm font-bold mb-2" htmlFor="image">
                            Image URL
                        </label>
                        <input
                            type="url"
                            id="image"
                            name="image"
                            value={formData.image}
                            onChange={handleChange}
                            className="shadow appearance-none border rounded w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline"
                            required
                        />
                         {errors.image && <p className="text-red-500 text-xs italic">{errors.image}</p>}
                    </div>

                    <div className="mb-4">
                        <label className="block text-gray-700 text-sm font-bold mb-2" htmlFor="location">
                            Location
                        </label>
                        <input
                            type="text"
                            id="location"
                            name="location"
                            value={formData.location}
                            onChange={handleChange}
                            className="shadow appearance-none border rounded w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline"
                            required
                        />
                         {errors.location && <p className="text-red-500 text-xs italic">{errors.location}</p>}
                    </div>

                    <div className="mb-6">
                        <label className="block text-gray-700 text-sm font-bold mb-2" htmlFor="description">
                            Description
                        </label>
                        <textarea
                            id="description"
                            name="description"
                            value={formData.description}
                            onChange={handleChange}
                            rows="5"
                            className="shadow appearance-none border rounded w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline"
                            required
                        ></textarea>
                         {errors.description && <p className="text-red-500 text-xs italic">{errors.description}</p>}
                    </div>

                    <div className="flex items-center justify-between">
                        <button
                            type="button"
                            onClick={onClose}
                            className="bg-gray-500 hover:bg-gray-700 text-white font-bold py-2 px-4 rounded focus:outline-none focus:shadow-outline"
                        >
                            Cancel
                        </button>
                        <button
                            type="submit"
                            className="bg-orange-500 hover:bg-orange-700 text-white font-bold py-2 px-4 rounded focus:outline-none focus:shadow-outline"
                        >
                            {initialData ? 'Update Story' : 'Add Story'}
                        </button>
                    </div>
                </form>
            </div>
        </div>
    );
};

export default AddEditStoryModal;