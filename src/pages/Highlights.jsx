import React, { useState, useEffect } from "react";
import { useAuth } from "../context/AuthContext";
import { useToast } from "../context/ToastContext";

const Highlights = () => {
    const { isAdmin } = useAuth();
    const toast = useToast();
    const [highlights, setHighlights] = useState([]);
    const [isAddModalOpen, setIsAddModalOpen] = useState(false);
    const [isDeleteModalOpen, setIsDeleteModalOpen] = useState(false);
    const [deleteId, setDeleteId] = useState(null);

    // Form State
    const [formData, setFormData] = useState({
        id: null,
        title: "",
        description: "",
        icon: "🎓",
        date: new Date().getFullYear().toString()
    });

    /* ================= DATA LOADING ================= */
    useEffect(() => {
        loadHighlights();
    }, []);

    const loadHighlights = async () => {
        const { fetchHighlights } = await import('../services/api');
        const data = await fetchHighlights();
        if (Array.isArray(data)) {
            setHighlights(data);
        } else {
            console.error("Failed to load highlights", data);
            setHighlights([]);
        }
    };

    /* ================= ACTIONS ================= */
    const handleAddClick = () => {
        setFormData({
            id: null,
            title: "",
            description: "",
            icon: "🎓",
            date: new Date().getFullYear().toString()
        });
        setIsAddModalOpen(true);
    };

    const handleEditClick = (highlight) => {
        setFormData({
            id: highlight.id,
            title: highlight.title,
            description: highlight.description,
            icon: highlight.icon || "🎓",
            date: highlight.date || ""
        });
        setIsAddModalOpen(true);
    };

    const handleDeleteClick = (id) => {
        setDeleteId(id);
        setIsDeleteModalOpen(true);
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        const { createHighlight, updateHighlight } = await import('../services/api');

        let res;
        if (formData.id) {
            res = await updateHighlight(formData);
        } else {
            res = await createHighlight(formData);
        }

        if (res.status === 'success') {
            toast.success(formData.id ? "Highlight updated" : "Highlight added");
            setIsAddModalOpen(false);
            loadHighlights();
        } else {
            toast.error("Operation failed: " + (res.message || "Unknown error"));
        }
    };

    const handleConfirmDelete = async () => {
        if (!deleteId) return;
        const { deleteHighlight } = await import('../services/api');
        const res = await deleteHighlight(deleteId);

        if (res.status === 'success') {
            toast.success("Highlight deleted");
            setHighlights(prev => prev.filter(h => h.id !== deleteId));
        } else {
            toast.error("Failed to delete highlight");
        }
        setIsDeleteModalOpen(false);
        setDeleteId(null);
    };

    return (
        <div className="bg-gray-50 min-h-screen py-16">
            <div className="max-w-7xl mx-auto px-6">

                {/* Header */}
                <div className="flex flex-col md:flex-row justify-between items-center mb-16">
                    <div className="text-center md:text-left mb-6 md:mb-0">
                        <h1 className="text-4xl md:text-5xl font-bold text-gray-900 mb-4">
                            Highlights
                        </h1>
                        <p className="text-lg text-gray-600 max-w-2xl">
                            A showcase of significant milestones, achievements, and professional impact.
                        </p>
                    </div>
                    {isAdmin && (
                        <button
                            onClick={handleAddClick}
                            className="px-6 py-3 bg-blue-700 text-white rounded-md font-medium hover:bg-blue-800 transition shadow-lg"
                        >
                            + Add Highlight
                        </button>
                    )}
                </div>

                {/* Highlights Grid */}
                <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
                    {highlights.map((item) => (
                        <div
                            key={item.id}
                            className="bg-white p-8 rounded-2xl shadow-sm border border-gray-100 hover:shadow-md transition group relative"
                        >
                            {/* Admin Actions */}
                            {isAdmin && (
                                <div className="absolute top-4 right-4 flex gap-2 opacity-0 group-hover:opacity-100 transition-opacity">
                                    <button
                                        onClick={() => handleEditClick(item)}
                                        className="p-2 bg-gray-50 rounded-full hover:bg-blue-50 text-gray-600 hover:text-blue-600 transition"
                                        title="Edit"
                                    >
                                        ✏️
                                    </button>
                                    <button
                                        onClick={() => handleDeleteClick(item.id)}
                                        className="p-2 bg-gray-50 rounded-full hover:bg-red-50 text-gray-600 hover:text-red-600 transition"
                                        title="Delete"
                                    >
                                        🗑️
                                    </button>
                                </div>
                            )}

                            <div className="text-4xl mb-6">{item.icon}</div>
                            <div className="flex justify-between items-start mb-4">
                                <h3 className="text-2xl font-bold text-gray-900 group-hover:text-blue-700 transition pr-12">
                                    {item.title}
                                </h3>
                                <span className="px-3 py-1 bg-blue-50 text-blue-700 text-xs font-semibold rounded-full shrink-0">
                                    {item.date}
                                </span>
                            </div>
                            <p className="text-gray-600 leading-relaxed">
                                {item.description}
                            </p>
                        </div>
                    ))}
                </div>

                {/* Empty State */}
                {highlights.length === 0 && (
                    <div className="text-center py-20 text-gray-500">
                        <p className="text-xl">No highlights found.</p>
                        {isAdmin && <p className="mt-2">Click the button above to add your first milestone!</p>}
                    </div>
                )}

                {/* Add/Edit Modal */}
                {isAddModalOpen && (
                    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 backdrop-blur-sm p-4">
                        <div className="bg-white rounded-2xl shadow-2xl max-w-lg w-full flex flex-col overflow-hidden animate-fadeInUp">
                            <div className="bg-gray-50 px-8 py-6 border-b flex justify-between items-center">
                                <h2 className="text-2xl font-bold text-gray-900">
                                    {formData.id ? "Edit Highlight" : "Add Highlight"}
                                </h2>
                                <button onClick={() => setIsAddModalOpen(false)} className="text-gray-500 hover:text-gray-700">✕</button>
                            </div>

                            <form onSubmit={handleSubmit} className="p-8 space-y-6">
                                <div>
                                    <label className="block text-sm font-medium text-gray-700 mb-2">Title</label>
                                    <input
                                        type="text"
                                        required
                                        value={formData.title}
                                        onChange={(e) => setFormData({ ...formData, title: e.target.value })}
                                        className="w-full px-4 py-3 rounded-lg border focus:ring-2 focus:ring-blue-500 outline-none"
                                        placeholder="Milestone title..."
                                    />
                                </div>

                                <div className="grid grid-cols-2 gap-4">
                                    <div>
                                        <label className="block text-sm font-medium text-gray-700 mb-2">Icon (Emoji)</label>
                                        <input
                                            type="text"
                                            value={formData.icon}
                                            onChange={(e) => setFormData({ ...formData, icon: e.target.value })}
                                            className="w-full px-4 py-3 rounded-lg border focus:ring-2 focus:ring-blue-500 outline-none"
                                            placeholder="e.g. 🎓, 🔬"
                                        />
                                    </div>
                                    <div>
                                        <label className="block text-sm font-medium text-gray-700 mb-2">Year / Date</label>
                                        <input
                                            type="text"
                                            required
                                            value={formData.date}
                                            onChange={(e) => setFormData({ ...formData, date: e.target.value })}
                                            className="w-full px-4 py-3 rounded-lg border focus:ring-2 focus:ring-blue-500 outline-none"
                                            placeholder="e.g. 2024"
                                        />
                                    </div>
                                </div>

                                <div>
                                    <label className="block text-sm font-medium text-gray-700 mb-2">Description</label>
                                    <textarea
                                        rows="4"
                                        required
                                        value={formData.description}
                                        onChange={(e) => setFormData({ ...formData, description: e.target.value })}
                                        className="w-full px-4 py-3 rounded-lg border focus:ring-2 focus:ring-blue-500 outline-none"
                                        placeholder="Describe the achievement..."
                                    />
                                </div>

                                <div className="flex justify-end gap-3 pt-4 border-t">
                                    <button
                                        type="button"
                                        onClick={() => setIsAddModalOpen(false)}
                                        className="px-6 py-2.5 rounded-lg border border-gray-300 text-gray-700 font-medium hover:bg-gray-50"
                                    >
                                        Cancel
                                    </button>
                                    <button
                                        type="submit"
                                        className="px-6 py-2.5 rounded-lg bg-blue-700 text-white font-medium hover:bg-blue-800 shadow-lg"
                                    >
                                        {formData.id ? "Update" : "Add Highlight"}
                                    </button>
                                </div>
                            </form>
                        </div>
                    </div>
                )}

                {/* Delete Confirmation Modal */}
                {isDeleteModalOpen && (
                    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 backdrop-blur-sm p-4">
                        <div className="bg-white rounded-2xl p-8 max-w-sm w-full text-center shadow-2xl animate-fadeInUp">
                            <h3 className="text-xl font-bold text-gray-900 mb-2">Confirm Deletion</h3>
                            <p className="text-gray-600 mb-6">Are you sure you want to delete this highlight?</p>
                            <div className="flex justify-center gap-4">
                                <button
                                    onClick={() => setIsDeleteModalOpen(false)}
                                    className="px-5 py-2.5 border border-gray-300 text-gray-700 rounded-lg hover:bg-gray-50 font-medium"
                                >
                                    Cancel
                                </button>
                                <button
                                    onClick={handleConfirmDelete}
                                    className="px-5 py-2.5 bg-red-600 text-white rounded-lg hover:bg-red-700 font-medium shadow-md"
                                >
                                    Delete
                                </button>
                            </div>
                        </div>
                    </div>
                )}

            </div>
        </div>
    );
};

export default Highlights;
