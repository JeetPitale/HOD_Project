import React, { useState, useEffect } from "react";
import { useAuth } from "../context/AuthContext";
import { useToast } from "../context/ToastContext";

const EBooks = () => {
    const { isAdmin } = useAuth();
    const toast = useToast();
    const [books, setBooks] = useState([]);
    const [selectedBook, setSelectedBook] = useState(null);
    const [isAddModalOpen, setIsAddModalOpen] = useState(false);
    const [isDeleteModalOpen, setIsDeleteModalOpen] = useState(false);
    const [deleteId, setDeleteId] = useState(null);

    // Form State
    const [formData, setFormData] = useState({
        id: null,
        title: "",
        description: "",
        fullDescription: "",
        image: "",
        link: "",
        tag: ""
    });

    /* ================= DATA LOADING ================= */
    useEffect(() => {
        loadBooks();
    }, []);

    const loadBooks = async () => {
        const { fetchEbooks } = await import('../services/api');
        const data = await fetchEbooks();
        // Since the DB might be empty or table missing, fallback to empty array
        // We also need to map DB columns if they differ, but we kept them consistent in PHP.
        // PHP returns arrays, ensure we have an array
        if (Array.isArray(data)) {
            // Map DB fields to frontend if needed (e.g. full_description -> fullDescription)
            const formatted = data.map(b => ({
                ...b,
                fullDescription: b.full_description || b.fullDescription, // Handle snake_case from DB
                // Ensure ID is a number
                id: parseInt(b.id)
            }));
            setBooks(formatted);
        } else {
            console.error("Failed to load books or invalid format", data);
            // Optional: set to empty if failed
            setBooks([]);
        }
    };

    /* ================= ACTIONS ================= */
    const openBook = (book) => {
        setSelectedBook(book);
        document.body.style.overflow = "hidden";
    };

    const closeBook = () => {
        setSelectedBook(null);
        document.body.style.overflow = "unset";
    };

    // Open Add Modal
    const handleAddClick = () => {
        setFormData({
            id: null,
            title: "",
            description: "",
            fullDescription: "",
            image: "",
            link: "",
            tag: ""
        });
        setIsAddModalOpen(true);
    };

    // Open Edit Modal
    const handleEditClick = (e, book) => {
        e.stopPropagation(); // Prevent opening the detail modal
        setFormData({
            id: book.id,
            title: book.title,
            description: book.description,
            fullDescription: book.fullDescription || "",
            image: book.image || "",
            link: book.link || "",
            tag: book.tag || "Computer Science"
        });
        setIsAddModalOpen(true);
    };

    // Open Delete Confirmation
    const handleDeleteClick = (e, id) => {
        e.stopPropagation();
        setDeleteId(id);
        setIsDeleteModalOpen(true);
    };

    // Submit Form (Add or Update)
    const handleSubmit = async (e) => {
        e.preventDefault();

        const { createEbook, updateEbook } = await import('../services/api');

        let res;
        if (formData.id) {
            // Update
            res = await updateEbook(formData);
        } else {
            // Create
            res = await createEbook(formData);
        }

        if (res.status === 'success') {
            toast.success(formData.id ? "Book updated successfully" : "Book added successfully");
            setIsAddModalOpen(false);
            loadBooks(); // Reload data
        } else {
            toast.error("Operation failed: " + (res.message || "Unknown error"));
        }
    };

    // Confirm Delete
    const handleConfirmDelete = async () => {
        if (!deleteId) return;
        const { deleteEbook } = await import('../services/api');
        const res = await deleteEbook(deleteId);

        if (res.status === 'success') {
            toast.success("Book deleted successfully");
            setBooks(prev => prev.filter(b => b.id !== deleteId));
        } else {
            toast.error("Failed to delete book");
        }
        setIsDeleteModalOpen(false);
        setDeleteId(null);
    };

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

    return (
        <div className="bg-gray-50 min-h-screen py-16">
            <div className="max-w-7xl mx-auto px-6">

                {/* Header */}
                <div className="flex flex-col md:flex-row justify-between items-center mb-16">
                    <div className="text-center md:text-left mb-6 md:mb-0">
                        <h1 className="text-4xl md:text-5xl font-bold text-gray-900 mb-4 font-plus-jakarta">
                            E-Books & Resources
                        </h1>
                        <p className="text-lg text-gray-600 max-w-2xl">
                            Explore a curated collection of books, research papers, and educational resources.
                        </p>
                    </div>
                    {isAdmin && (
                        <button
                            onClick={handleAddClick}
                            className="px-6 py-3 bg-blue-700 text-white rounded-md font-medium hover:bg-blue-800 transition shadow-lg"
                        >
                            + Add New Book
                        </button>
                    )}
                </div>

                {/* Books Grid */}
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
                    {books.map((book) => (
                        <div
                            key={book.id}
                            onClick={() => openBook(book)}
                            className="bg-white rounded-2xl shadow-sm border border-gray-100 overflow-hidden hover:shadow-md transition group cursor-pointer relative"
                        >
                            {/* Admin Actions */}
                            {isAdmin && (
                                <div className="absolute top-3 right-3 flex gap-2 z-10 opacity-0 group-hover:opacity-100 transition-opacity">
                                    <button
                                        onClick={(e) => handleEditClick(e, book)}
                                        className="p-2 bg-white/90 backdrop-blur rounded-full shadow text-gray-600 hover:text-blue-600 transition"
                                        title="Edit"
                                    >
                                        ✏️
                                    </button>
                                    <button
                                        onClick={(e) => handleDeleteClick(e, book.id)}
                                        className="p-2 bg-white/90 backdrop-blur rounded-full shadow text-gray-600 hover:text-red-600 transition"
                                        title="Delete"
                                    >
                                        🗑️
                                    </button>
                                </div>
                            )}

                            <div className="relative h-64 overflow-hidden">
                                <img
                                    src={book.image}
                                    alt={book.title}
                                    className="w-full h-full object-cover group-hover:scale-105 transition duration-500"
                                />
                                <div className="absolute top-4 left-4">
                                    <span className="px-3 py-1 bg-white/90 backdrop-blur text-xs font-semibold text-blue-700 rounded-full shadow-sm">
                                        {book.tag}
                                    </span>
                                </div>
                            </div>
                            <div className="p-8">
                                <h3 className="text-xl font-bold text-gray-900 mb-3 group-hover:text-blue-700 transition">
                                    {book.title}
                                </h3>
                                <p className="text-gray-600 text-sm leading-relaxed mb-6 line-clamp-3">
                                    {book.description}
                                </p>
                                <button className="inline-flex items-center text-blue-700 font-semibold text-sm hover:gap-2 transition-all">
                                    View Details <span className="ml-1">→</span>
                                </button>
                            </div>
                        </div>
                    ))}
                </div>

                {/* Empty State / Coming Soon */}
                {books.length === 0 && (
                    <div className="text-center py-20">
                        <div className="inline-block p-4 rounded-full bg-blue-50 mb-4">
                            <svg xmlns="http://www.w3.org/2000/svg" className="h-8 w-8 text-blue-600" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 6.253v13m0-13C10.832 5.477 9.246 5 7.5 5S4.168 5.477 3 6.253v13C4.168 18.477 5.754 18 7.5 18s3.332.477 4.5 1.253m0-13C13.168 5.477 14.754 5 16.5 5c1.747 0 3.332.477 4.5 1.253v13C19.832 18.477 18.247 18 16.5 18c-1.746 0-3.332.477-4.5 1.253" />
                            </svg>
                        </div>
                        <h3 className="text-xl font-semibold text-gray-900">No Books Found</h3>
                        <p className="text-gray-500 mt-2">
                            {isAdmin ? "Use the 'Add New Book' button to get started." : "Check back later for new resources!"}
                        </p>
                    </div>
                )}

                {/* Book Details Modal */}
                {selectedBook && (
                    <div
                        className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 backdrop-blur-sm p-4"
                        onClick={closeBook}
                    >
                        <div
                            className="bg-white rounded-2xl shadow-2xl max-w-4xl w-full max-h-[90vh] overflow-y-auto flex flex-col md:flex-row overflow-hidden animate-fadeInUp"
                            onClick={(e) => e.stopPropagation()}
                        >
                            {/* Image Section */}
                            <div className="md:w-1/2 h-64 md:h-auto relative">
                                <img
                                    src={selectedBook.image}
                                    alt={selectedBook.title}
                                    className="w-full h-full object-cover"
                                />
                                <div className="absolute top-4 left-4">
                                    <span className="px-3 py-1 bg-white/90 backdrop-blur text-xs font-semibold text-blue-700 rounded-full shadow-sm">
                                        {selectedBook.tag}
                                    </span>
                                </div>
                            </div>

                            {/* Content Section */}
                            <div className="md:w-1/2 p-8 md:p-12 flex flex-col relative">
                                <button
                                    onClick={closeBook}
                                    className="absolute top-4 right-4 p-2 text-gray-400 hover:text-gray-600 rounded-full hover:bg-gray-100 transition"
                                >
                                    <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><line x1="18" y1="6" x2="6" y2="18"></line><line x1="6" y1="6" x2="18" y2="18"></line></svg>
                                </button>

                                <h2 className="text-3xl font-bold text-gray-900 mb-4">{selectedBook.title}</h2>
                                <p className="text-gray-600 mb-6 leading-relaxed whitespace-pre-line">
                                    {selectedBook.fullDescription || selectedBook.description}
                                </p>

                                <div className="mt-auto">
                                    <a
                                        href={selectedBook.link}
                                        target="_blank"
                                        rel="noopener noreferrer"
                                        className="block w-full py-4 bg-blue-700 text-white text-center font-semibold rounded-xl hover:bg-blue-800 transition shadow-lg hover:shadow-xl hover:-translate-y-0.5"
                                    >
                                        View Book on Amazon
                                    </a>
                                </div>
                            </div>
                        </div>
                    </div>
                )}

                {/* ADD / EDIT MODAL (Admin) */}
                {isAddModalOpen && (
                    <div
                        className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 backdrop-blur-sm p-4"
                        onClick={() => setIsAddModalOpen(false)}
                    >
                        <div
                            className="bg-white rounded-2xl shadow-2xl max-w-2xl w-full max-h-[90vh] overflow-y-auto flex flex-col animate-fadeInUp"
                            onClick={(e) => e.stopPropagation()}
                        >
                            <div className="bg-gray-50 px-8 py-6 border-b flex justify-between items-center">
                                <h2 className="text-2xl font-bold text-gray-900">
                                    {formData.id ? "Edit Book" : "Add New Book"}
                                </h2>
                                <button onClick={() => setIsAddModalOpen(false)} className="text-gray-500 hover:text-gray-700">✕</button>
                            </div>

                            <form onSubmit={handleSubmit} className="p-8 space-y-6">
                                <div>
                                    <label className="block text-sm font-medium text-gray-700 mb-2">Book Title</label>
                                    <input
                                        type="text"
                                        required
                                        value={formData.title}
                                        onChange={(e) => setFormData({ ...formData, title: e.target.value })}
                                        className="w-full px-4 py-3 rounded-lg border focus:ring-2 focus:ring-blue-500 outline-none"
                                        placeholder="Enter book title..."
                                    />
                                </div>

                                <div className="grid grid-cols-2 gap-4">
                                    <div>
                                        <label className="block text-sm font-medium text-gray-700 mb-2">Tag / Category</label>
                                        <input
                                            type="text"
                                            value={formData.tag}
                                            onChange={(e) => setFormData({ ...formData, tag: e.target.value })}
                                            className="w-full px-4 py-3 rounded-lg border focus:ring-2 focus:ring-blue-500 outline-none"
                                            placeholder="Computer Science"
                                        />
                                    </div>
                                    <div>
                                        <label className="block text-sm font-medium text-gray-700 mb-2">Amazon Link</label>
                                        <input
                                            type="url"
                                            required
                                            value={formData.link}
                                            onChange={(e) => setFormData({ ...formData, link: e.target.value })}
                                            className="w-full px-4 py-3 rounded-lg border focus:ring-2 focus:ring-blue-500 outline-none"
                                            placeholder="https://amazon.com..."
                                        />
                                    </div>
                                </div>

                                <div>
                                    <label className="block text-sm font-medium text-gray-700 mb-2">Cover Image</label>
                                    <input
                                        type="file"
                                        accept="image/*"
                                        onChange={handleImageUpload}
                                        className="w-full px-3 py-2 rounded-lg border text-xs outline-none focus:ring-2 focus:ring-blue-500"
                                    />
                                    {formData.image && (
                                        <img src={formData.image} alt="Preview" className="h-32 object-cover mt-2 rounded border" />
                                    )}
                                </div>

                                <div>
                                    <label className="block text-sm font-medium text-gray-700 mb-2">Short Description</label>
                                    <textarea
                                        rows="2"
                                        required
                                        value={formData.description}
                                        onChange={(e) => setFormData({ ...formData, description: e.target.value })}
                                        className="w-full px-4 py-3 rounded-lg border focus:ring-2 focus:ring-blue-500 outline-none"
                                        placeholder="Brief summary..."
                                    />
                                </div>

                                <div>
                                    <label className="block text-sm font-medium text-gray-700 mb-2">Full Description</label>
                                    <textarea
                                        rows="5"
                                        value={formData.fullDescription}
                                        onChange={(e) => setFormData({ ...formData, fullDescription: e.target.value })}
                                        className="w-full px-4 py-3 rounded-lg border focus:ring-2 focus:ring-blue-500 outline-none"
                                        placeholder="Detailed description for the modal..."
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
                                        {formData.id ? "Update Book" : "Add Book"}
                                    </button>
                                </div>
                            </form>
                        </div>
                    </div>
                )}

                {/* DELETE CONFIRMATION MODAL */}
                {isDeleteModalOpen && (
                    <div
                        className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 backdrop-blur-sm p-4"
                        onClick={() => setIsDeleteModalOpen(false)}
                    >
                        <div
                            className="bg-white rounded-2xl p-8 max-w-sm w-full text-center shadow-2xl animate-fadeInUp"
                            onClick={(e) => e.stopPropagation()}
                        >
                            <h3 className="text-xl font-bold text-gray-900 mb-2">Confirm Deletion</h3>
                            <p className="text-gray-600 mb-6">Are you sure you want to delete this book? This action cannot be undone.</p>
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

export default EBooks;
