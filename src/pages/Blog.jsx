import React, { useState, useEffect } from "react";
import { useAuth } from "../context/AuthContext";
import { useToast } from "../context/ToastContext";

const Blog = () => {
  const { isAdmin } = useAuth();
  const toast = useToast();

  const [posts, setPosts] = useState([]);
  const [selectedPost, setSelectedPost] = useState(null);

  /* ================= COMMENTS STATE ================= */
  const [allComments, setAllComments] = useState({});
  const [comments, setComments] = useState([]);
  const [newComment, setNewComment] = useState("");
  const [commenterName, setCommenterName] = useState("");

  /* ================= MODALS STATE ================= */
  const [isAddModalOpen, setIsAddModalOpen] = useState(false);
  const [isCommentManagerOpen, setIsCommentManagerOpen] = useState(false);
  const [isHeaderModalOpen, setIsHeaderModalOpen] = useState(false);
  const [isEditing, setIsEditing] = useState(false);
  const [editingId, setEditingId] = useState(null);
  const [customCategory, setCustomCategory] = useState("");

  /* ================= HEADER STATE ================= */
  const [headerData, setHeaderData] = useState(() => {
    const stored = localStorage.getItem("blogHeader");
    return stored ? JSON.parse(stored) : {
      title: "Academic Insights",
      subtitle: "Research, education, and technology perspectives"
    };
  });

  // Confirmation Modal State
  const [isDeleteModalOpen, setIsDeleteModalOpen] = useState(false);
  const [deleteTarget, setDeleteTarget] = useState(null); // { type: 'post' | 'comment', id: string, postId?: string }
  const [deleteAction, setDeleteAction] = useState(null);

  const [newPost, setNewPost] = useState({
    title: "",
    category: "Education",
    image: "",
    content: "",
    fullContent: "",
  });

  /* ================= DEFAULT POSTS ================= */
  const defaultPosts = [
    {
      id: 1,
      title: "The Future of Digital Learning",
      category: "Education",
      categoryColor: "text-blue-700",
      modalCategoryColor: "text-blue-200",
      date: "Dec 15, 2025",
      readTime: "5 min read",
      image:
        "https://images.unsplash.com/photo-1501504905252-473c47e087f8?auto=format&fit=crop&w=1200&q=80",
      content: "Digital learning is transforming education...",
      fullContent: `
        <p>Digital learning is transforming education by making it more accessible, personalized, and engaging.</p>
        <p>With the integration of AI and data-driven tools, learning experiences can now adapt to individual student needs.</p>
      `,
      author: "Prof. (Dr.) Vishal Dahiya",
    },
    {
      id: 2,
      title: "AI in Modern Education",
      category: "Technology",
      categoryColor: "text-blue-700",
      modalCategoryColor: "text-blue-200",
      date: "Dec 10, 2025",
      readTime: "4 min read",
      image:
        "https://images.unsplash.com/photo-1454165804606-c3d57bc86b40?auto=format&fit=crop&w=1200&q=80",
      content: "Artificial Intelligence is reshaping classrooms...",
      fullContent: `
        <p>AI is no longer a futuristic concept; it is actively transforming modern education.</p>
        <p>From intelligent tutoring systems to automated assessment, AI empowers educators and learners alike.</p>
      `,
      author: "Prof. (Dr.) Vishal Dahiya",
    },
  ];

  /* ================= REACTION STATE ================= */
  // Track which posts user has reacted to: { [postId]: 'like' | 'dislike' }
  const [userReactions, setUserReactions] = useState({});


  /* ================= INIT ================= */
  useEffect(() => {
    loadAllData();
  }, []);

  const loadAllData = async () => {
    const { fetchPosts, fetchComments } = await import('../services/api');

    // 1. Posts
    const dbPosts = await fetchPosts();
    if (dbPosts && dbPosts.length > 0) {
      // Ensure numbers are numbers (MySQL returns strings)
      const formatted = dbPosts.map(p => ({
        ...p,
        id: parseInt(p.id),
        likes: parseInt(p.likes),
        dislikes: parseInt(p.dislikes),
        fullContent: p.full_content, // Map DB column to Frontend prop
        date: new Date(p.created_at).toLocaleDateString("en-US", { month: "short", day: "numeric", year: "numeric" }), // Format Date
      }));
      setPosts(formatted);
    } else {
      setPosts([]); // No posts found
    }

    // 2. Comments
    const dbComments = await fetchComments();
    setAllComments(dbComments || {});

    // 3. User Reactions (Local Only is fine, or could be DB if we had auth)
    const storedReactions = localStorage.getItem("blogReactions");
    if (storedReactions) setUserReactions(JSON.parse(storedReactions));
  };


  /* ================= HELPERS ================= */
  const openPost = (post) => {
    // Refresh post from current state to get latest counts
    const currentPost = posts.find(p => p.id === post.id) || post;
    setSelectedPost(currentPost);
    setComments(allComments[post.id] || []);
  };

  const closePost = () => {
    setSelectedPost(null);
  };

  const handleReaction = async (type) => { // type: 'like' | 'dislike'
    if (!selectedPost) return;

    const pid = selectedPost.id;
    const currentAction = userReactions[pid];

    // ... (Same logic for calculating numbers) ...
    let newLikes = selectedPost.likes;
    let newDislikes = selectedPost.dislikes;
    let newAction = null;

    if (currentAction === type) {
      if (type === 'like') newLikes--;
      else newDislikes--;
      newAction = null;
    } else {
      if (type === 'like') {
        newLikes++;
        if (currentAction === 'dislike') newDislikes--;
      } else {
        newDislikes++;
        if (currentAction === 'like') newLikes--;
      }
      newAction = type;
    }

    // 1. Update State
    const updatedPosts = posts.map(p =>
      p.id === pid ? { ...p, likes: newLikes, dislikes: newDislikes } : p
    );
    setPosts(updatedPosts);
    setSelectedPost(prev => ({ ...prev, likes: newLikes, dislikes: newDislikes }));

    const updatedReactions = { ...userReactions };
    if (newAction) updatedReactions[pid] = newAction;
    else delete updatedReactions[pid];
    setUserReactions(updatedReactions);
    localStorage.setItem("blogReactions", JSON.stringify(updatedReactions));

    // 2. DB Update
    const { updatePostCounts } = await import('../services/api');
    await updatePostCounts(pid, newLikes, newDislikes);
  };


  const handleCommentSubmit = async (e) => {
    e.preventDefault();
    if (!newComment.trim()) return;

    const { createComment } = await import('../services/api');

    const commentPayload = {
      postId: selectedPost.id,
      user: isAdmin ? "Admin" : (commenterName.trim() || "Guest User"),
      text: newComment
    };

    const res = await createComment(commentPayload);

    if (res.status === 'success') {
      // Optimistic UI Update
      const newCommentObj = {
        id: res.id,
        user: commentPayload.user,
        text: commentPayload.text,
        date: new Date().toLocaleDateString(),
      };

      const updatedComments = [...comments, newCommentObj];
      setComments(updatedComments);
      setAllComments({ ...allComments, [selectedPost.id]: updatedComments });

      setNewComment("");
      setCommenterName("");
    } else {
      toast.error("Failed to post comment.");
    }
  };

  const handleDeleteComment = async (postId, commentId) => {
    // Removed legacy window.confirm. Now we just delete and show a toast.
    const { deleteComment } = await import('../services/api');

    const res = await deleteComment(commentId);
    if (res.status === 'success') {
      const postComments = allComments[postId] || [];
      const updatedPostComments = postComments.filter(c => c.id !== commentId);

      setAllComments({ ...allComments, [postId]: updatedPostComments });
      if (selectedPost && selectedPost.id === postId) {
        setComments(updatedPostComments);
      }
      toast.success("Comment deleted");
    } else {
      toast.error("Failed to delete comment");
    }
  };

  /* ================= CONFIRMATION MODAL LOGIC ================= */
  const confirmDelete = async () => {
    if (!deleteTarget) return;

    if (deleteTarget.type === 'post') {
      const { deletePost } = await import('../services/api');
      await deletePost(deleteTarget.id);

      const updatedPosts = posts.filter((p) => p.id !== deleteTarget.id);
      setPosts(updatedPosts);
      toast.success("Post deleted successfully");

    } else if (deleteTarget.type === 'comment') {
      // Re-use existing delete logic or implement here
      // For now, simpler to reuse the handleDeleteComment logic above directly 
      // but since this modal is what calls it, we implement the API call here.
      // actually handleDeleteComment above had confirm(), so we should refactor or just direct call api here.

      const { deleteComment } = await import('../services/api');
      await deleteComment(deleteTarget.id);

      // ... UI update logic Same as above ...
      const { postId, id } = deleteTarget;
      const postComments = allComments[postId] || [];
      const updatedPostComments = postComments.filter(c => c.id !== id);
      setAllComments({ ...allComments, [postId]: updatedPostComments });
      if (selectedPost && selectedPost.id === postId) setComments(updatedPostComments);

      toast.success("Comment deleted successfully");
    }

    setIsDeleteModalOpen(false);
    setDeleteTarget(null);
  };

  /* ================= DELETE POST ================= */
  const handleDelete = (e, postId) => {
    e.stopPropagation();
    setDeleteTarget({ type: 'post', id: postId });
    setIsDeleteModalOpen(true);
  };



  /* ================= EDIT POST ================= */
  const handleEdit = (e, post) => {
    e.stopPropagation();
    setNewPost({
      title: post.title,
      category: post.category,
      image: post.image,
      content: post.content,
      fullContent: post.fullContent,
    });
    setCustomCategory(post.category === "Custom" ? post.category : "");
    setEditingId(post.id);
    setIsAddModalOpen(true);
  };

  /* ================= ADD / EDIT SUBMIT ================= */
  const handlePostSubmit = async (e) => {
    e.preventDefault();

    // 1. Validation
    if (!newPost.title) {
      toast.error("Please enter a post title.");
      return;
    }
    // ... (rest of validation)

    try {
      const postData = {
        ...newPost,
        // ... (Category Logic)
        category: ["Education", "Technology", "Research"].includes(newPost.category)
          ? newPost.category
          : customCategory || newPost.category,
      };

      const { createPost, updatePost } = await import('../services/api');
      let res;

      if (editingId) {
        // Update
        console.log("Updating post:", editingId, postData);
        res = await updatePost({ ...postData, id: editingId });
        console.log("Update response:", res);
        if (res.status === 'success') {
          await loadAllData();
        } else {
          console.error("Update failed:", res);
          toast.error("Update failed: " + (res.message || "Unknown error"));
          return;
        }
      } else {
        // Create
        res = await createPost(postData);
        if (res.status === 'success') {
          await loadAllData();
        }
      }

      // Reset
      setNewPost({ title: "", category: "Education", image: "", content: "", fullContent: "" });
      setCustomCategory("");
      setEditingId(null);
      setIsAddModalOpen(false);
      toast.success(editingId ? "Post updated!" : "Post published!");

    } catch (err) {
      console.error(err);
      toast.error("Failed to save post.");
    }
  };

  /* ================= BODY SCROLL LOCK ================= */
  useEffect(() => {
    document.body.style.overflow =
      selectedPost || isAddModalOpen || isCommentManagerOpen || isDeleteModalOpen ? "hidden" : "unset";
    return () => (document.body.style.overflow = "unset");
  }, [selectedPost, isAddModalOpen, isCommentManagerOpen, isDeleteModalOpen]);

  /* ================= UI ================= */
  return (
    <div className="bg-gray-50 py-16">
      <div className="max-w-7xl mx-auto px-4">

        {/* HEADER */}
        <div className="flex flex-col md:flex-row justify-between items-start md:items-center mb-12">
          <div className="flex-grow">
            <div className="flex items-center gap-3">
              <h1 className="text-4xl font-bold text-gray-900">
                {headerData.title}
              </h1>
              {isAdmin && (
                <button
                  onClick={() => setIsHeaderModalOpen(true)}
                  className="p-1.5 text-gray-400 hover:text-blue-600 hover:bg-blue-50 rounded-full transition"
                  title="Edit Header"
                >
                  <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M17 3a2.828 2.828 0 1 1 4 4L7.5 20.5 2 22l1.5-5.5L17 3z"></path></svg>
                </button>
              )}
            </div>
            <p className="text-lg text-gray-600 mt-2">
              {headerData.subtitle}
            </p>
          </div>

          {isAdmin && (
            <button
              onClick={() => {
                setEditingId(null);
                setNewPost({
                  title: "",
                  category: "Education",
                  image: "",
                  content: "",
                  fullContent: "",
                });
                setIsAddModalOpen(true);
              }}
              className="mt-6 md:mt-0 px-6 py-3 bg-blue-700 text-white rounded-md font-medium hover:bg-blue-800 transition"
            >
              + Add Post
            </button>
          )}
          {isAdmin && (
            <button
              onClick={() => setIsCommentManagerOpen(true)}
              className="ml-4 mt-6 md:mt-0 px-6 py-3 bg-gray-800 text-white rounded-md font-medium hover:bg-gray-900 transition"
            >
              Manage Comments
            </button>
          )}
        </div>

        {/* POSTS GRID */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
          {posts.map((post) => (
            <article
              key={post.id}
              onClick={() => openPost(post)}
              className="bg-white rounded-xl border shadow-sm hover:shadow-md transition cursor-pointer overflow-hidden flex flex-col relative group"
            >
              {/* Admin Actions */}
              {isAdmin && (
                <div className="absolute top-3 right-3 flex gap-2 z-10 opacity-0 group-hover:opacity-100 transition-opacity">
                  <button
                    onClick={(e) => handleEdit(e, post)}
                    className="p-2 bg-white/90 backdrop-blur rounded-full shadow text-gray-600 hover:text-blue-600 transition"
                    title="Edit Post"
                  >
                    ✏️
                  </button>
                  <button
                    onClick={(e) => handleDelete(e, post.id)}
                    className="p-2 bg-white/90 backdrop-blur rounded-full shadow text-gray-600 hover:text-red-600 transition"
                    title="Delete Post"
                  >
                    🗑️
                  </button>
                </div>
              )}

              <img
                src={post.image}
                alt={post.title}
                className="h-48 w-full object-cover"
              />
              <div className="p-6 space-y-3 grow">
                <span className={`text-xs font-semibold ${post.categoryColor}`}>
                  {post.category}
                </span>
                <h3 className="text-xl font-semibold text-gray-900">
                  {post.title}
                </h3>
                <p className="text-gray-600 text-sm line-clamp-3">
                  {post.content}
                </p>
                <p className="text-xs text-gray-500">
                  {post.author} • {post.readTime}
                </p>
              </div>
            </article>
          ))}
        </div>
      </div>

      {/* ================= READ POST MODAL ================= */}
      {selectedPost && (
        <div
          className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 backdrop-blur-sm px-4"
          onClick={closePost}
        >
          <div
            onClick={(e) => e.stopPropagation()}
            className="relative w-full max-w-4xl max-h-[90vh] bg-white rounded-2xl shadow-2xl overflow-hidden animate-fadeInUp"
          >
            {/* Close */}
            <button
              onClick={closePost}
              className="absolute top-5 right-5 z-20 bg-white shadow-lg rounded-full w-10 h-10 flex items-center justify-center text-gray-600 hover:text-gray-900 transition hover:scale-105"
            >
              ✕
            </button>

            {/* Header */}
            <div className="relative h-72">
              <img
                src={selectedPost.image}
                alt={selectedPost.title}
                className="w-full h-full object-cover"
              />
              <div className="absolute inset-0 bg-gradient-to-t from-black/70 via-black/30 to-transparent" />
              <div className="absolute bottom-6 left-6 right-6 text-white">
                <span className="inline-block mb-2 px-3 py-1 text-xs font-semibold bg-white/20 rounded-full">
                  {selectedPost.category}
                </span>
                <h2 className="text-3xl md:text-4xl font-bold leading-tight">
                  {selectedPost.title}
                </h2>
                <p className="mt-2 text-sm text-gray-200">
                  {selectedPost.author} • {selectedPost.date} •{" "}
                  {selectedPost.readTime}
                </p>
              </div>
            </div>

            {/* Content */}
            <div className="p-8 md:p-12 overflow-y-auto max-h-[60vh]">
              <article
                className="prose prose-lg prose-gray max-w-none"
                dangerouslySetInnerHTML={{
                  __html: selectedPost.fullContent,
                }}
              />

              {/* Engagement */}
              <div className="mt-12 pt-6 border-t flex gap-6">
                <button
                  onClick={() => handleReaction('like')}
                  className={`font-medium transition-colors ${userReactions[selectedPost.id] === "like"
                    ? "text-blue-700 font-bold"
                    : "text-gray-500 hover:text-blue-600"
                    }`}
                >
                  👍 {selectedPost.likes}
                </button>
                <button
                  onClick={() => handleReaction('dislike')}
                  className={`font-medium transition-colors ${userReactions[selectedPost.id] === "dislike"
                    ? "text-red-600 font-bold"
                    : "text-gray-500 hover:text-red-600"
                    }`}
                >
                  👎 {selectedPost.dislikes}
                </button>
              </div>

              {/* Comments */}
              <div className="mt-10">
                <h3 className="text-xl font-semibold mb-4">
                  Discussion ({comments.length})
                </h3>

                {!isAdmin && (
                  <form onSubmit={handleCommentSubmit} className="mb-6">
                    <textarea
                      rows="3"
                      value={newComment}
                      onChange={(e) => setNewComment(e.target.value)}
                      className="w-full border rounded-xl p-4 focus:ring-2 focus:ring-blue-500 mb-3"
                      placeholder="Share your academic thoughts..."
                    />
                    <input
                      type="text"
                      value={commenterName}
                      onChange={(e) => setCommenterName(e.target.value)}
                      className="w-full border rounded-xl p-3 focus:ring-2 focus:ring-blue-500"
                      placeholder="Your Name (Optional)"
                    />
                    <button
                      type="submit"
                      disabled={!newComment.trim()}
                      className="mt-3 px-5 py-2 bg-blue-700 text-white rounded-md hover:bg-blue-800 disabled:opacity-50"
                    >
                      Post Comment
                    </button>
                  </form>
                )}

                <div className="space-y-4">
                  {comments.length === 0 ? (
                    <p className="text-gray-500 italic">
                      No comments yet. Start the discussion.
                    </p>
                  ) : (
                    comments.map((c) => (
                      <div
                        key={c.id}
                        className="bg-gray-50 p-4 rounded-xl"
                      >
                        <p className="font-semibold">{c.user}</p>
                        <p className="text-gray-700 mt-1">{c.text}</p>
                      </div>
                    ))
                  )}
                </div>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* ================= ADD POST MODAL ================= */}
      {isAddModalOpen && (
        <div
          className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 backdrop-blur-sm px-4"
          onClick={() => setIsAddModalOpen(false)}
        >
          <div
            onClick={(e) => e.stopPropagation()}
            className="w-full max-w-2xl bg-white rounded-2xl shadow-2xl overflow-hidden animate-fadeInUp flex flex-col max-h-[90vh]"
          >
            {/* Header */}
            <div className="bg-gray-50 px-8 py-6 border-b flex-shrink-0 flex justify-between items-center">
              <h2 className="text-2xl font-bold text-gray-900">
                {editingId ? "Edit Post" : "Create New Post"}
              </h2>
              <button
                onClick={() => setIsAddModalOpen(false)}
                className="text-gray-500 hover:text-gray-700 transition"
              >
                ✕
              </button>
            </div>

            {/* Form */}
            <form onSubmit={handlePostSubmit} className="p-8 space-y-6 overflow-y-auto">

              {/* Title */}
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Title
                </label>
                <input
                  type="text"
                  required
                  value={newPost.title}
                  onChange={(e) =>
                    setNewPost({ ...newPost, title: e.target.value })
                  }
                  className="w-full px-4 py-3 rounded-lg border focus:ring-2 focus:ring-blue-500 outline-none transition"
                  placeholder="Enter post title..."
                />
              </div>

              {/* Category */}
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Category
                  </label>
                  <select
                    value={newPost.category}
                    onChange={(e) =>
                      setNewPost({ ...newPost, category: e.target.value })
                    }
                    className="w-full px-4 py-3 rounded-lg border focus:ring-2 focus:ring-blue-500 outline-none transition"
                  >
                    <option value="Education">Education</option>
                    <option value="Technology">Technology</option>
                    <option value="Research">Research</option>
                    <option value="Custom">Other (Custom)</option>
                  </select>
                </div>
                {newPost.category === "Custom" && (
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      Custom Category Name
                    </label>
                    <input
                      type="text"
                      required
                      value={customCategory}
                      onChange={(e) => setCustomCategory(e.target.value)}
                      className="w-full px-4 py-3 rounded-lg border focus:ring-2 focus:ring-blue-500 outline-none transition"
                      placeholder="e.g. AI Ethics"
                    />
                  </div>
                )}
              </div>

              {/* Image Upload */}
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Cover Image
                </label>
                <div className="flex items-center justify-center w-full">
                  <label htmlFor="dropzone-file" className="flex flex-col items-center justify-center w-full h-48 border-2 border-gray-300 border-dashed rounded-lg cursor-pointer bg-gray-50 hover:bg-gray-100 transition overflow-hidden relative">
                    {newPost.image ? (
                      <div className="relative w-full h-full group">
                        <img src={newPost.image} alt="Preview" className="w-full h-full object-cover" />
                        <div className="absolute inset-0 bg-black/40 opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center">
                          <p className="text-white font-medium">Click to change</p>
                        </div>
                        <button
                          type="button"
                          onClick={(e) => {
                            e.preventDefault();
                            e.stopPropagation();
                            setNewPost(prev => ({ ...prev, image: "" }));
                          }}
                          className="absolute top-2 right-2 p-1.5 bg-red-600 text-white rounded-full hover:bg-red-700 transition shadow-lg z-20"
                          title="Remove Image"
                        >
                          <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><line x1="18" y1="6" x2="6" y2="18"></line><line x1="6" y1="6" x2="18" y2="18"></line></svg>
                        </button>
                      </div>
                    ) : (
                      <div className="flex flex-col items-center justify-center pt-5 pb-6 px-4 text-center">
                        <svg aria-hidden="true" className="w-10 h-10 mb-3 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M7 16a4 4 0 01-.88-7.903A5 5 0 1115.9 6L16 6a5 5 0 011 9.9M15 13l-3-3m0 0l-3 3m3-3v12"></path></svg>
                        <p className="mb-2 text-sm text-gray-500"><span className="font-semibold">Click to upload</span> or drag and drop</p>
                        <p className="text-xs text-gray-500">SVG, PNG, JPG or GIF (MAX. 2MB)</p>
                      </div>
                    )}
                    <input
                      id="dropzone-file"
                      type="file"
                      accept="image/*"
                      className="hidden"
                      onChange={(e) => {
                        const file = e.target.files[0];
                        if (file) {
                          if (file.size > 2 * 1024 * 1024) {
                            toast.error("File is too large! Please select an image under 2MB.");
                            return;
                          }
                          const reader = new FileReader();
                          reader.onloadend = () => {
                            // Use functional update to ensure fresh state
                            setNewPost(prev => ({ ...prev, image: reader.result }));
                          };
                          reader.readAsDataURL(file);
                        }
                      }}
                    />
                  </label>
                </div>
              </div>

              {/* Short Description */}
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Short Summary
                </label>
                <textarea
                  required
                  rows="2"
                  value={newPost.content}
                  onChange={(e) =>
                    setNewPost({ ...newPost, content: e.target.value })
                  }
                  className="w-full px-4 py-3 rounded-lg border focus:ring-2 focus:ring-blue-500 outline-none transition"
                  placeholder="Brief preview text..."
                />
              </div>

              {/* Full Content */}
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Full Content (HTML Supported)
                </label>
                <textarea
                  required
                  rows="6"
                  value={newPost.fullContent}
                  onChange={(e) =>
                    setNewPost({ ...newPost, fullContent: e.target.value })
                  }
                  className="w-full px-4 py-3 rounded-lg border focus:ring-2 focus:ring-blue-500 outline-none transition font-mono text-sm"
                  placeholder="<p>Write your article content here...</p>"
                />
              </div>

              {/* Actions */}
              <div className="flex justify-end gap-3 pt-4 border-t">
                <button
                  type="button"
                  onClick={() => setIsAddModalOpen(false)}
                  className="px-6 py-2.5 rounded-lg border border-gray-300 text-gray-700 font-medium hover:bg-gray-50 transition"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="px-6 py-2.5 rounded-lg bg-blue-700 text-white font-medium hover:bg-blue-800 transition shadow-lg hover:shadow-xl hover:-translate-y-0.5"
                >
                  Publish Post
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* ================= COMMENT MANAGER MODAL (ADMIN ONLY) ================= */}
      {isCommentManagerOpen && isAdmin && (
        <div
          className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 backdrop-blur-sm px-4"
          onClick={() => setIsCommentManagerOpen(false)}
        >
          <div
            onClick={(e) => e.stopPropagation()}
            className="w-full max-w-4xl bg-white rounded-2xl shadow-2xl overflow-hidden animate-fadeInUp flex flex-col max-h-[90vh]"
          >
            <div className="bg-gray-50 px-8 py-6 border-b flex justify-between items-center">
              <h2 className="text-2xl font-bold text-gray-900">Manage Comments</h2>
              <button
                onClick={() => setIsCommentManagerOpen(false)}
                className="text-gray-500 hover:text-gray-700 transition"
              >
                ✕
              </button>
            </div>

            <div className="p-8 overflow-y-auto bg-gray-50/50">
              {Object.keys(allComments).length === 0 ? (
                <div className="text-center py-12">
                  <p className="text-gray-500 text-lg">No comments found across any blogs.</p>
                </div>
              ) : (
                <div className="space-y-4">
                  {Object.entries(allComments)
                    .flatMap(([postId, postComments]) => {
                      const postTitle = posts.find(p => p.id === parseInt(postId))?.title || "Unknown Post";
                      return postComments.map(comment => ({
                        ...comment,
                        postId: parseInt(postId),
                        postTitle
                      }));
                    })
                    .sort((a, b) => b.id - a.id) // Newest first
                    .map((comment) => (
                      <div
                        key={`${comment.postId}-${comment.id}`}
                        className="bg-white p-5 rounded-xl border border-gray-100 shadow-sm hover:shadow-md transition flex flex-col md:flex-row gap-4 justify-between group"
                      >
                        <div className="flex-grow">
                          {/* Blog Title Badge */}
                          <div className="mb-2">
                            <a
                              href="#"
                              onClick={(e) => {
                                e.preventDefault();
                                setIsCommentManagerOpen(false);
                                const post = posts.find(p => p.id === comment.postId);
                                if (post) openPost(post);
                              }}
                              className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-md text-xs font-medium bg-blue-50 text-blue-700 border border-blue-100 hover:bg-blue-100 transition"
                            >
                              📄 {comment.postTitle}
                            </a>
                          </div>

                          {/* Comment Content */}
                          <p className="text-gray-800 text-base leading-relaxed">
                            "{comment.text}"
                          </p>

                          {/* Meta */}
                          <div className="mt-3 flex items-center gap-3 text-sm text-gray-400">
                            <span className="font-semibold text-gray-600">👤 {comment.user}</span>
                            <span>•</span>
                            <span>{comment.date}</span>
                          </div>
                        </div>

                        {/* Actions */}
                        <div className="flex-shrink-0 flex items-start pt-1">
                          <button
                            onClick={() => handleDeleteComment(comment.postId, comment.id)}
                            className="p-2 text-red-400 hover:text-red-600 hover:bg-red-50 rounded-lg transition"
                            title="Delete Comment"
                          >
                            🗑️
                          </button>
                        </div>
                      </div>
                    ))
                  }
                </div>
              )}
            </div>
          </div>
        </div>
      )}

      {/* ================= DELETE CONFIRMATION MODAL ================= */}
      {isDeleteModalOpen && (
        <div
          className="fixed inset-0 z-[60] flex items-center justify-center bg-black/60 backdrop-blur-sm px-4 animate-fadeIn"
          onClick={() => setIsDeleteModalOpen(false)}
        >
          <div
            className="bg-white rounded-2xl shadow-2xl p-6 w-full max-w-sm animate-scaleIn"
            onClick={(e) => e.stopPropagation()}
          >
            <div className="flex flex-col items-center text-center">
              <div className="w-12 h-12 rounded-full bg-red-100 flex items-center justify-center mb-4 text-red-600">
                <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M3 6h18" /><path d="M19 6v14c0 1-1 2-2 2H7c-1 0-2-1-2-2V6" /><path d="M8 6V4c0-1 1-2 2-2h4c1 0 2 1 2 2v2" /><line x1="10" x2="10" y1="11" y2="17" /><line x1="14" x2="14" y1="11" y2="17" /></svg>
              </div>
              <h3 className="text-xl font-bold text-gray-900 mb-2">Are you sure?</h3>
              <p className="text-gray-500 mb-6">
                {deleteTarget?.type === 'post'
                  ? "This action cannot be undone. This post will be permanently deleted."
                  : "Do you really want to delete this comment? This process cannot be undone."
                }
              </p>
              <div className="flex gap-3 w-full">
                <button
                  onClick={() => setIsDeleteModalOpen(false)}
                  className="flex-1 px-4 py-2 bg-gray-100 text-gray-700 rounded-lg font-medium hover:bg-gray-200 transition"
                >
                  Cancel
                </button>
                <button
                  onClick={confirmDelete}
                  className="flex-1 px-4 py-2 bg-red-600 text-white rounded-lg font-medium hover:bg-red-700 transition shadow-lg shadow-red-500/30"
                >
                  Delete
                </button>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* ================= HEADER EDIT MODAL ================= */}
      {isHeaderModalOpen && isAdmin && (
        <div
          className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 backdrop-blur-sm px-4"
          onClick={() => setIsHeaderModalOpen(false)}
        >
          <div
            onClick={(e) => e.stopPropagation()}
            className="w-full max-w-lg bg-white rounded-2xl shadow-2xl overflow-hidden animate-fadeInUp"
          >
            <div className="bg-gray-50 px-8 py-6 border-b flex justify-between items-center">
              <h2 className="text-xl font-bold text-gray-900">Edit Page Header</h2>
              <button
                onClick={() => setIsHeaderModalOpen(false)}
                className="text-gray-500 hover:text-gray-700 transition"
              >
                ✕
              </button>
            </div>
            <form
              onSubmit={(e) => {
                e.preventDefault();
                localStorage.setItem("blogHeader", JSON.stringify(headerData));
                toast.success("Header updated successfully!");
                setIsHeaderModalOpen(false);
              }}
              className="p-8 space-y-6"
            >
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Page Title
                </label>
                <input
                  type="text"
                  required
                  value={headerData.title}
                  onChange={(e) => setHeaderData({ ...headerData, title: e.target.value })}
                  className="w-full px-4 py-2 rounded-lg border focus:ring-2 focus:ring-blue-500 outline-none"
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Subtitle
                </label>
                <input
                  type="text"
                  required
                  value={headerData.subtitle}
                  onChange={(e) => setHeaderData({ ...headerData, subtitle: e.target.value })}
                  className="w-full px-4 py-2 rounded-lg border focus:ring-2 focus:ring-blue-500 outline-none"
                />
              </div>
              <div className="flex justify-end pt-2">
                <button
                  type="submit"
                  className="px-6 py-2 bg-blue-700 text-white rounded-md font-medium hover:bg-blue-800 transition shadow-lg"
                >
                  Save Changes
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};

export default Blog;
