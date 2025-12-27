// src/services/api.js

const API_BASE_URL = import.meta.env.VITE_API_BASE_URL || "http://localhost:8000";

/**
 * Generic helper to send data to PHP backend
 */
const postData = async (endpoint, data) => {
    try {
        const response = await fetch(`${API_BASE_URL}/${endpoint}`, {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
            },
            body: JSON.stringify(data),
        });

        const result = await response.json();
        return result;
    } catch (error) {
        console.error("API Error:", error);
        return { status: 'error', message: error.message };
    }
};

/**
 * Example: Save contact data
 * @param {Object} data - { name, email, message }
 */
export const saveContact = async (data) => {
    return await postData('save_contact.php', data);
};

export const uploadFile = async (file) => {
    const formData = new FormData();
    formData.append('file', file);

    try {
        const response = await fetch(`${API_BASE_URL}/upload.php`, {
            method: 'POST',
            body: formData, // No Content-Type header; fetch adds it with boundary automatically
        });
        return await response.json();
    } catch (error) {
        return { status: 'error', message: error.message };
    }
};

/* ================= ABOUT PAGE API ================= */
export const fetchAboutData = async () => {
    try {
        const response = await fetch(`${API_BASE_URL}/about_api.php`);
        const data = await response.json();
        return data;
    } catch (e) {
        console.error("Fetch About Failed:", e);
        return null;
    }
};

export const saveAboutData = async (data) => {
    return await postData('about_api.php', data);
};

/* ================= BLOG API ================= */
export const fetchPosts = async () => {
    try {
        const response = await fetch(`${API_BASE_URL}/blog_api.php`);
        return await response.json();
    } catch (e) {
        return [];
    }
};

export const createPost = async (payload) => {
    return await postData('blog_api.php', payload);
};

export const updatePost = async (payload) => {
    try {
        const response = await fetch(`${API_BASE_URL}/blog_api.php`, {
            method: 'PUT',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify(payload),
        });
        return await response.json();
    } catch (error) {
        return { status: 'error', message: error.message };
    }
};

export const deletePost = async (id) => {
    try {
        await fetch(`${API_BASE_URL}/blog_api.php?id=${id}`, { method: 'DELETE' });
        return { status: 'success' };
    } catch (e) { return { status: 'error' }; }
};

export const updatePostCounts = async (id, likes, dislikes) => {
    return await postData('blog_api.php', {
        action: 'update_counts',
        id, likes, dislikes
    });
};


/* ================= COMMENTS API ================= */
export const fetchComments = async () => {
    try {
        const response = await fetch(`${API_BASE_URL}/comments_api.php`);
        return await response.json();
    } catch (e) { return {}; }
};

export const createComment = async (commentData) => {
    return await postData('comments_api.php', commentData);
};

export const deleteComment = async (id) => {
    try {
        await fetch(`${API_BASE_URL}/comments_api.php?id=${id}`, { method: 'DELETE' });
        return { status: 'success' };
    } catch (e) { return { status: 'error' }; }
};
