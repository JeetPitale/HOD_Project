import React, { useState, useEffect } from "react";
import { useAuth } from "../context/AuthContext";
import { useToast } from "../context/ToastContext";
import { X, Calendar, Award, ExternalLink } from "lucide-react";

const Highlights = () => {
    const { isAdmin } = useAuth();
    const toast = useToast();
    const [highlights, setHighlights] = useState([]);
    const [isAddModalOpen, setIsAddModalOpen] = useState(false);
    const [isDeleteModalOpen, setIsDeleteModalOpen] = useState(false);
    const [selectedHighlight, setSelectedHighlight] = useState(null);
    const [deleteId, setDeleteId] = useState(null);

    // Form State
    const [formData, setFormData] = useState({
        id: null,
        title: "",
        description: "",
        image: "",
        date: new Date().getFullYear().toString()
    });

    // Image Upload Helper
    const handleImageUpload = (e) => {
        const file = e.target.files[0];
        if (file) {
            if (file.size > 2 * 1024 * 1024) {
                toast.error("File is too large! Max 2MB.");
                return;
            }
            const reader = new FileReader();
            reader.onloadend = () => {
                setFormData(prev => ({ ...prev, image: reader.result }));
            };
            reader.readAsDataURL(file);
        }
    };

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
            image: "",
            date: new Date().getFullYear().toString()
        });
        setIsAddModalOpen(true);
    };

    const handleEditClick = (e, highlight) => {
        e.stopPropagation(); // Avoid opening preview
        setFormData({
            id: highlight.id,
            title: highlight.title,
            description: highlight.description,
            image: highlight.image || "",
            date: highlight.date || ""
        });
        setIsAddModalOpen(true);
    };

    const handleDeleteClick = (e, id) => {
        e.stopPropagation(); // Avoid opening preview
        setDeleteId(id);
        setIsDeleteModalOpen(true);
    };

    const handleCardClick = (highlight) => {
        setSelectedHighlight(highlight);
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
                            onClick={() => handleCardClick(item)}
                            className="bg-white p-6 rounded-2xl shadow-sm border border-gray-100 hover:shadow-xl hover:-translate-y-1 transition duration-300 group relative flex flex-row gap-6 items-center cursor-pointer"
                        >
                            {/* Admin Actions */}
                            {isAdmin && (
                                <div className="absolute top-4 right-4 flex gap-2 opacity-0 group-hover:opacity-100 transition-opacity z-10">
                                    <button
                                        onClick={(e) => handleEditClick(e, item)}
                                        className="p-2 bg-white/90 backdrop-blur shadow-sm rounded-full hover:bg-blue-50 text-gray-600 hover:text-blue-600 border border-gray-100 transition"
                                        title="Edit"
                                    >
                                        ✏️
                                    </button>
                                    <button
                                        onClick={(e) => handleDeleteClick(e, item.id)}
                                        className="p-2 bg-white/90 backdrop-blur shadow-sm rounded-full hover:bg-red-50 text-gray-600 hover:text-red-600 border border-gray-100 transition"
                                        title="Delete"
                                    >
                                        🗑️
                                    </button>
                                </div>
                            )}

                            {/* Image Part (1/4 approx) */}
                            <div className="w-24 h-24 sm:w-32 sm:h-32 rounded-xl overflow-hidden bg-gray-50 border border-gray-100 shrink-0">
                                {item.image ? (
                                    <img src={item.image} alt={item.title} className="w-full h-full object-cover transition duration-500 group-hover:scale-110" />
                                ) : (
                                    <div className="w-full h-full flex items-center justify-center text-3xl bg-linear-to-br from-blue-50 to-blue-100 text-blue-700 font-bold">
                                        {item.title.charAt(0)}
                                    </div>
                                )}
                            </div>

                            {/* Text Part (3/4 approx) */}
                            <div className="flex-grow">
                                <div className="flex justify-between items-start mb-2">
                                    <h3 className="text-xl font-bold text-gray-900 group-hover:text-blue-700 transition pr-4">
                                        {item.title}
                                    </h3>
                                    <div className="flex flex-col items-end gap-1">
                                        <span className="px-3 py-1 bg-blue-50 text-blue-700 text-[10px] font-bold rounded-full uppercase tracking-wider shrink-0 whitespace-nowrap">
                                            {item.date}
                                        </span>
                                    </div>
                                </div>
                                <p className="text-gray-600 text-sm leading-relaxed line-clamp-2">
                                    {item.description}
                                </p>
                                <div className="mt-4 flex items-center text-blue-600 text-xs font-semibold opacity-0 group-hover:opacity-100 transition-opacity">
                                    View Details <ExternalLink className="ml-1 w-3 h-3" />
                                </div>
                            </div>
                        </div>
                    ))}
                </div>

                {/* Empty State */}
                {highlights.length === 0 && (
                    <div className="text-center py-20 text-gray-500">
                        <Award className="w-16 h-16 mx-auto mb-4 text-gray-300" />
                        <p className="text-xl">No highlights found.</p>
                        {isAdmin && <p className="mt-2">Click the button above to add your first milestone!</p>}
                    </div>
                )}

                {/* Detail View Modal (Hovering Tab) */}
                {selectedHighlight && (
                    <div className="fixed inset-0 z-100 flex items-center justify-center bg-black/60 backdrop-blur-md p-4 animate-fadeIn">
                        <div
                            className="bg-white rounded-3xl shadow-2xl max-w-4xl w-full max-h-[90vh] overflow-hidden flex flex-col md:flex-row animate-scaleUp"
                            onClick={(e) => e.stopPropagation()}
                        >
                            {/* Close Button */}
                            <button
                                onClick={() => setSelectedHighlight(null)}
                                className="absolute top-6 right-6 z-10 p-2 bg-white/20 hover:bg-white/40 backdrop-blur rounded-full text-white md:text-gray-500 md:bg-gray-100 md:hover:bg-gray-200 transition"
                            >
                                <X className="w-6 h-6" />
                            </button>

                            {/* Image Side */}
                            <div className="w-full md:w-1/2 h-64 md:h-auto relative bg-gray-900">
                                {selectedHighlight.image ? (
                                    <img
                                        src={selectedHighlight.image}
                                        alt={selectedHighlight.title}
                                        className="w-full h-full object-cover"
                                    />
                                ) : (
                                    <div className="w-full h-full flex items-center justify-center text-6xl text-white bg-linear-to-br from-blue-600 to-indigo-700 font-bold">
                                        {selectedHighlight.title.charAt(0)}
                                    </div>
                                )}
                                <div className="absolute inset-x-0 bottom-0 h-32 bg-linear-to-t from-black/60 to-transparent md:hidden" />
                                <div className="absolute bottom-6 left-6 text-white md:hidden">
                                    <span className="px-3 py-1 bg-blue-600 rounded-full text-xs font-bold uppercase tracking-widest mb-2 inline-block">
                                        {selectedHighlight.date}
                                    </span>
                                    <h2 className="text-2xl font-bold">{selectedHighlight.title}</h2>
                                </div>
                            </div>

                            {/* Content Side */}
                            <div className="w-full md:w-1/2 p-8 md:p-12 overflow-y-auto">
                                <div className="hidden md:block mb-8">
                                    <span className="px-3 py-1 bg-blue-50 text-blue-700 rounded-full text-xs font-bold uppercase tracking-widest mb-4 inline-block">
                                        {selectedHighlight.date}
                                    </span>
                                    <h2 className="text-4xl font-black text-gray-900 leading-tight">
                                        {selectedHighlight.title}
                                    </h2>
                                </div>

                                <div className="space-y-6">
                                    <div className="flex items-start gap-4">
                                        <div className="p-2 bg-blue-50 rounded-lg shrink-0">
                                            <Calendar className="w-5 h-5 text-blue-600" />
                                        </div>
                                        <div>
                                            <p className="text-xs font-bold text-gray-400 uppercase tracking-tighter">Event Date / Year</p>
                                            <p className="text-gray-700 font-medium">{selectedHighlight.date}</p>
                                        </div>
                                    </div>

                                    <div className="border-t border-gray-100 pt-6">
                                        <h4 className="text-sm font-bold text-gray-900 mb-3 flex items-center">
                                            <Award className="w-4 h-4 mr-2 text-yellow-500" /> Description & Impact
                                        </h4>
                                        <div className="prose prose-sm text-gray-600 leading-relaxed whitespace-pre-line">
                                            {selectedHighlight.description}
                                        </div>
                                    </div>
                                </div>

                                <div className="mt-12 flex gap-4">
                                    <button
                                        onClick={() => setSelectedHighlight(null)}
                                        className="flex-1 px-8 py-4 bg-gray-900 text-white rounded-2xl font-bold hover:bg-gray-800 transition active:scale-95 shadow-xl shadow-gray-200"
                                    >
                                        Close Details
                                    </button>
                                </div>
                            </div>
                        </div>
                    </div>
                )}

                {/* Add/Edit Modal */}
                {isAddModalOpen && (
                    <div className="fixed inset-0 z-100 flex items-center justify-center bg-black/50 backdrop-blur-sm p-4">
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
                                        <label className="block text-sm font-medium text-gray-700 mb-2">Display Image</label>
                                        <input
                                            type="file"
                                            accept="image/*"
                                            onChange={handleImageUpload}
                                            className="w-full px-4 py-3 rounded-lg border text-sm outline-none focus:ring-2 focus:ring-blue-500"
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

                                {formData.image && (
                                    <div className="relative w-24 h-24 rounded-lg overflow-hidden border">
                                        <img src={formData.image} alt="Preview" className="w-full h-full object-cover" />
                                        <button
                                            type="button"
                                            onClick={() => setFormData(prev => ({ ...prev, image: "" }))}
                                            className="absolute top-1 right-1 p-1 bg-red-600 text-white rounded-full hover:bg-red-700 transition"
                                        >
                                            <X className="w-3 h-3" />
                                        </button>
                                    </div>
                                )}

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
                    <div className="fixed inset-0 z-110 flex items-center justify-center bg-black/50 backdrop-blur-sm p-4">
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
