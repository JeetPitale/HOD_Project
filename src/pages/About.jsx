import React, { useState, useEffect } from "react";
import { useAuth } from "../context/AuthContext";
import { useToast } from "../context/ToastContext";


/* =========================
   ABOUT PAGE (ACADEMIC THEME)
========================= */

const About = () => {
  const { isAdmin } = useAuth();
  const toast = useToast();
  const [isEditModalOpen, setIsEditModalOpen] = useState(false);

  /* ================= DEFAULT DATA ================= */
  const defaultAboutData = {
    profile: {
      name: "Prof. (Dr.) Vishal Dahiya",
      title: "Professor & Director, Integrated MCA",
      image:
        "",
      qualifications: "Ph.D. (CS), M.Phil., MCA, B.Sc. (CS)",
      academicExp: "25 Years",
      industryExp: "2 Years",
      email: "director-i-mca@cpi.edu.in",
      previousAffiliation: "Indus University, Ahmedabad",
      subjects: "Big Data, DBMS, Java Programming, Deep Learning",
      bio: `
        <p>She has more than two decades of experience in academics and administration. A continuous learner, researcher, and explorer of emerging technologies.</p>
        <p>She began her professional journey with system analysis at <strong>ER&DCI India</strong> and later developed computer-based training packages at <strong>CRIS, New Delhi</strong>.</p>
        <p>Her academic contributions include MOOCs and e-content for the <strong>e-Pathshala & SWAYAM portals</strong> under MHRD, Government of India.</p>
        <p>She is the author of the book <em>“First Step towards AI: From Logic to Learning”</em>.</p>
      `,
    },

    research: [
      {
        title:
          "Predicting Breast Cancer using Machine Learning Classifiers and Enhancing the Output by Combining the Prediction to Generate Optimal F1-score",
        details:
          "Biomedical and Biotechnology Research (Scopus), Sep 2021",
      },
      {
        title:
          "A systematic review on protein functions and various machine learning algorithms",
        details:
          "International Journal of Interdisciplinary Global Studies, Dec 2020",
      },
      {
        title:
          "Argumentation Mining: Automatic Annotation of Parliamentary Debates",
        details:
          "Studies in Indian Place Names, March 2020",
      },
      {
        title:
          "Intelligent System to Diagnose LBP Using Genetic Algorithm and SVM",
        details:
          "Springer – Advanced Computing Technologies, 2020",
      },
      {
        title:
          "Keystroke Logging using NLP for Log Data Analysis",
        details:
          "International Journal of Innovative Technology, Jan 2020",
      },
    ],

    intlConferences: [
      {
        title:
          "Big Data Heterogeneity Paradigm – Literature Review",
        details:
          "International Conference on Smart Green Society, 2021",
      },
      {
        title:
          "SVM with Advanced Kernel for Lower Back Pain",
        details:
          "ComITCon – International Conference, 2019",
      },
    ],

    natConferences: [
      {
        title:
          "Knowledge Management System Architecture",
        details:
          "National Conference, Surat – 2006",
      },
      {
        title:
          "Role of IT in Rural Development",
        details:
          "Rajkot University – 2006",
      },
      {
        title:
          "Business Transformation through IT",
        details:
          "SKPIMCS, Gandhinagar – 2006",
      },
    ],

    achievements: [
      "Academia ERP Award",
      "MOOCs recorded for ePG Pathshala (MHRD & UGC)",
      "Ph.D. Scholar won Innovation Award – Govt. of Gujarat",
      "Research paper included as Springer Book Chapter",
      "Appreciation Trophy from IITE for Research Work",
    ],

    memberships: [
      "Lifetime Member – Computer Society of India",
      "Editorial Board – International Journal of Innovation Technology & Research",
      "Reviewer – Future Generation Computer Systems (USA)",
    ],

    expertSessions: [
      {
        title: "Big Data & Data Analytics",
        details:
          "FDP – G. Pulla Reddy Engineering College",
      },
      {
        title: "IoT & Cloud Computing",
        details:
          "MHRD FDP – MSU Ajmer",
      },
      {
        title:
          "Funding Agencies in India for Ph.D.",
        details:
          "Research Scholars Program",
      },
      {
        title:
          "Role of IT in Career Development",
        details:
          "ISHLS Student Program",
      },
    ],
  };


  /* ================= INIT DATA ================= */
  // We initialize with default data to avoid blank screen while loading
  const [aboutData, setAboutData] = useState(defaultAboutData);
  const [loading, setLoading] = useState(true);

  // Load from DB on Mount
  useEffect(() => {
    // Import the fetch function dynamically or use prop if you prefer, 
    // but here we just need to use the one we can import at top.
    // But since imports are at top, let's just use a useEffect.
    loadData();
  }, []);

  const loadData = async () => {
    try {
      const { fetchAboutData } = await import('../services/api');
      const data = await fetchAboutData();
      if (data && data.profile) {
        setAboutData(data);
      }
    } catch (e) {
      console.error(e);
    } finally {
      setLoading(false);
    }
  };

  // Editor State
  const [editFormData, setEditFormData] = useState(aboutData);

  // Sync edit form when data loads
  useEffect(() => {
    setEditFormData(aboutData);
  }, [aboutData]);

  const handleSave = async (e) => {
    e.preventDefault();

    // Optimistic Update
    setAboutData(editFormData);
    setIsEditModalOpen(false);

    try {
      const { saveAboutData } = await import('../services/api');
      await saveAboutData(editFormData);
      toast.success("Profile updated & saved to Database!");
    } catch (e) {
      toast.error("Failed to save to database.");
    }
  };


  const subjectsArray = aboutData.profile.subjects
    .split(",")
    .map((s) => s.trim());

  return (
    <div className="bg-gray-50 py-16">
      <div className="max-w-7xl mx-auto px-4">

        {/* HERO */}
        <section className="text-center mb-20">
          <h1 className="text-5xl font-bold text-gray-900 mb-4">
            Academic Profile
          </h1>
          <p className="text-xl text-gray-600 max-w-3xl mx-auto">
            Leadership, research, innovation, and academic excellence
          </p>
        </section>

        {/* PROFILE SECTION */}
        <section className="grid grid-cols-1 lg:grid-cols-3 gap-12 mb-24">
          <div className="bg-white rounded-2xl shadow-lg overflow-hidden transition-all duration-300 hover:-translate-y-1 hover:shadow-2xl">
            <div className="overflow-hidden">
              <img
                src={aboutData.profile.image}
                alt={aboutData.profile.name}
                className="w-full h-80 object-cover transition-transform duration-500 hover:scale-105"
              />
            </div>
            <div className="p-8">
              <h2 className="text-2xl font-bold text-gray-900">
                {aboutData.profile.name}
              </h2>
              <p className="text-blue-700 font-medium mb-4">
                {aboutData.profile.title}
              </p>

              <div className="space-y-3 text-sm">
                <p><strong>Qualifications:</strong> {aboutData.profile.qualifications}</p>
                <p><strong>Academic Experience:</strong> {aboutData.profile.academicExp}</p>
                <p><strong>Industry Experience:</strong> {aboutData.profile.industryExp}</p>
                <p>
                  <strong>Email:</strong>{" "}
                  <a
                    href={`mailto:${aboutData.profile.email} `}
                    className="text-blue-600 hover:underline"
                  >
                    {aboutData.profile.email}
                  </a>
                </p>
              </div>

            </div>
          </div>

          {/* BIO */}
          <div className="lg:col-span-2">
            <h3 className="text-3xl font-bold mb-6">
              Professional Biography
            </h3>
            <div
              className="prose prose-lg max-w-none text-gray-700"
              dangerouslySetInnerHTML={{ __html: aboutData.profile.bio }}
            />

            <div className="mt-8">
              <h4 className="font-semibold mb-3">
                Subjects Taught
              </h4>
              <div className="flex flex-wrap gap-2">
                {subjectsArray.map((sub, idx) => (
                  <span
                    key={idx}
                    className="bg-blue-50 text-blue-800 text-xs px-3 py-1 rounded-full border transition-all hover:bg-blue-100 hover:scale-105"
                  >
                    {sub}
                  </span>
                ))}
              </div>
            </div>
          </div>
        </section>

        {/* SECTIONS */}
        <Section title="Research Publications">
          {aboutData.research.map((r, i) => (
            <Item key={i} title={r.title} details={r.details} />
          ))}
        </Section>

        <Section title="International Conferences">
          {aboutData.intlConferences.map((c, i) => (
            <Item key={i} title={c.title} details={c.details} />
          ))}
        </Section>

        <Section title="National Conferences">
          {aboutData.natConferences.map((c, i) => (
            <Item key={i} title={c.title} details={c.details} />
          ))}
        </Section>

        {/* ACHIEVEMENTS & MEMBERSHIPS */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-8 mb-24">
          <ListCard title="Achievements" items={aboutData.achievements} />
          <ListCard title="Professional Memberships" items={aboutData.memberships} />
        </div>

        {/* EXPERT SESSIONS */}
        <Section title="Expert Sessions Delivered">
          {aboutData.expertSessions.map((s, i) => (
            <Item key={i} title={s.title} details={s.details} />
          ))}
        </Section>

      </div >

      {/* FLOAT EDIT BUTTON */}
      {
        isAdmin && (
          <button
            onClick={() => {
              setEditFormData(aboutData);
              setIsEditModalOpen(true);
            }}
            className="fixed bottom-8 right-8 bg-blue-700 text-white p-4 rounded-full shadow-2xl hover:bg-blue-800 transition z-40"
            title="Edit Profile"
          >
            <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M17 3a2.828 2.828 0 1 1 4 4L7.5 20.5 2 22l1.5-5.5L17 3z"></path></svg>
          </button>
        )
      }

      {/* EDIT MODAL */}
      {
        isEditModalOpen && (
          <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 backdrop-blur-sm px-4">
            <div className="w-full max-w-4xl bg-white rounded-2xl shadow-2xl overflow-hidden flex flex-col max-h-[90vh]">
              <div className="bg-gray-50 px-8 py-6 border-b flex justify-between items-center">
                <h2 className="text-2xl font-bold text-gray-900">Edit Academic Profile</h2>
                <button
                  onClick={() => setIsEditModalOpen(false)}
                  className="text-gray-500 hover:text-gray-700 transition"
                >
                  ✕
                </button>
              </div>

              <form onSubmit={handleSave} className="p-8 overflow-y-auto space-y-8">

                {/* SECTION: PROFILE */}
                <div className="space-y-4">
                  <h3 className="text-xl font-bold text-blue-800 border-b pb-2">Profile Details</h3>
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <div>
                      <label className="block text-sm font-medium text-gray-700">Name</label>
                      <input
                        type="text"
                        className="w-full border rounded-lg p-2"
                        value={editFormData.profile.name}
                        onChange={(e) => setEditFormData({ ...editFormData, profile: { ...editFormData.profile, name: e.target.value } })}
                      />
                    </div>
                    <div>
                      <label className="block text-sm font-medium text-gray-700">Title</label>
                      <input
                        type="text"
                        className="w-full border rounded-lg p-2"
                        value={editFormData.profile.title}
                        onChange={(e) => setEditFormData({ ...editFormData, profile: { ...editFormData.profile, title: e.target.value } })}
                      />
                    </div>
                    <div className="md:col-span-2">
                      <label className="block text-sm font-medium text-gray-700">Qualifications</label>
                      <input
                        type="text"
                        className="w-full border rounded-lg p-2"
                        value={editFormData.profile.qualifications}
                        onChange={(e) => setEditFormData({ ...editFormData, profile: { ...editFormData.profile, qualifications: e.target.value } })}
                      />
                    </div>
                    <div>
                      <label className="block text-sm font-medium text-gray-700">Academic Experience</label>
                      <input
                        type="text"
                        className="w-full border rounded-lg p-2"
                        value={editFormData.profile.academicExp}
                        onChange={(e) => setEditFormData({ ...editFormData, profile: { ...editFormData.profile, academicExp: e.target.value } })}
                      />
                    </div>
                    <div>
                      <label className="block text-sm font-medium text-gray-700">Industry Experience</label>
                      <input
                        type="text"
                        className="w-full border rounded-lg p-2"
                        value={editFormData.profile.industryExp}
                        onChange={(e) => setEditFormData({ ...editFormData, profile: { ...editFormData.profile, industryExp: e.target.value } })}
                      />
                    </div>
                    <div className="md:col-span-2">
                      <label className="block text-sm font-medium text-gray-700">Previous Affiliation</label>
                      <input
                        type="text"
                        className="w-full border rounded-lg p-2"
                        value={editFormData.profile.previousAffiliation}
                        onChange={(e) => setEditFormData({ ...editFormData, profile: { ...editFormData.profile, previousAffiliation: e.target.value } })}
                      />
                    </div>
                    <div className="md:col-span-2">
                      <label className="block text-sm font-medium text-gray-700">Profile Image</label>
                      <div className="flex gap-4 items-center">
                        <input
                          type="text"
                          className="grow border rounded-lg p-2 text-gray-600 text-sm"
                          value={editFormData.profile.image}
                          placeholder="Image URL or Base64"
                          onChange={(e) => setEditFormData({ ...editFormData, profile: { ...editFormData.profile, image: e.target.value } })}
                        />
                        <label className="cursor-pointer bg-gray-100 hover:bg-gray-200 text-gray-700 px-4 py-2 rounded-lg border transition text-sm shrink-0">
                          <span>Upload Photo</span>
                          <input
                            type="file"
                            accept="image/*"
                            className="hidden"
                            onChange={async (e) => {
                              const file = e.target.files[0];
                              if (file) {
                                if (file.size > 5 * 1024 * 1024) { // 5MB limit
                                  toast.error("Image size too large! Max 5MB.");
                                  return;
                                }

                                try {
                                  toast.success("Uploading image..."); // Simple feedback
                                  const { uploadFile } = await import('../services/api');
                                  const res = await uploadFile(file);

                                  if (res.status === 'success') {
                                    setEditFormData(prev => ({
                                      ...prev,
                                      profile: { ...prev.profile, image: res.url }
                                    }));
                                    toast.success("Image uploaded successfully!");
                                  } else {
                                    toast.error(res.message || "Upload failed");
                                  }
                                } catch (err) {
                                  console.error(err);
                                  toast.error("Upload failed");
                                }
                              }
                            }}
                          />
                        </label>
                      </div>
                      <p className="text-xs text-gray-500 mt-1">Max size: 5MB (Stored on Server)</p>
                    </div>

                    <div>
                      <label className="block text-sm font-medium text-gray-700">Email</label>
                      <input
                        type="text"
                        className="w-full border rounded-lg p-2"
                        value={editFormData.profile.email}
                        onChange={(e) => setEditFormData({ ...editFormData, profile: { ...editFormData.profile, email: e.target.value } })}
                      />
                    </div>
                    <div>
                      <label className="block text-sm font-medium text-gray-700">Subjects (comma separated)</label>
                      <input
                        type="text"
                        className="w-full border rounded-lg p-2"
                        value={editFormData.profile.subjects}
                        onChange={(e) => setEditFormData({ ...editFormData, profile: { ...editFormData.profile, subjects: e.target.value } })}
                      />
                    </div>
                    <div className="md:col-span-2">
                      <label className="block text-sm font-medium text-gray-700">Bio (HTML supported)</label>
                      <textarea
                        rows="5"
                        className="w-full border rounded-lg p-2 font-mono text-sm"
                        value={editFormData.profile.bio}
                        onChange={(e) => setEditFormData({ ...editFormData, profile: { ...editFormData.profile, bio: e.target.value } })}
                      />
                    </div>
                  </div>
                </div>

                {/* SECTION: RESEARCH */}
                <div className="space-y-4">
                  <div className="flex justify-between items-center border-b pb-2">
                    <h3 className="text-xl font-bold text-blue-800">Research Publications</h3>
                    <button
                      type="button"
                      onClick={() => setEditFormData({
                        ...editFormData,
                        research: [{ title: "", details: "" }, ...editFormData.research]
                      })}
                      className="text-sm bg-green-600 text-white px-3 py-1 rounded hover:bg-green-700"
                    >
                      + Add New
                    </button>
                  </div>
                  {editFormData.research.map((item, idx) => (
                    <div key={idx} className="bg-gray-50 p-4 rounded-lg flex gap-4 items-start group">
                      <div className="grow grid gap-2">
                        <input
                          placeholder="Title"
                          className="w-full border rounded p-2 text-sm font-medium"
                          value={item.title}
                          onChange={(e) => {
                            const updated = editFormData.research.map((el, i) =>
                              i === idx ? { ...el, title: e.target.value } : el
                            );
                            setEditFormData({ ...editFormData, research: updated });
                          }}
                        />
                        <input
                          placeholder="Details (Journal, Date, etc.)"
                          className="w-full border rounded p-2 text-sm text-gray-600"
                          value={item.details}
                          onChange={(e) => {
                            const updated = editFormData.research.map((el, i) =>
                              i === idx ? { ...el, details: e.target.value } : el
                            );
                            setEditFormData({ ...editFormData, research: updated });
                          }}
                        />
                      </div>
                      <button
                        type="button"
                        onClick={() => {
                          const updated = editFormData.research.filter((_, i) => i !== idx);
                          setEditFormData({ ...editFormData, research: updated });
                        }}
                        className="text-red-500 hover:text-red-700 p-1"
                        title="Remove"
                      >
                        ✕
                      </button>
                    </div>
                  ))}
                </div>

                {/* SECTION: INTERNATIONAL CONFERENCES */}
                <div className="space-y-4">
                  <div className="flex justify-between items-center border-b pb-2">
                    <h3 className="text-xl font-bold text-blue-800">International Conferences</h3>
                    <button
                      type="button"
                      onClick={() => setEditFormData({
                        ...editFormData,
                        intlConferences: [{ title: "", details: "" }, ...editFormData.intlConferences]
                      })}
                      className="text-sm bg-green-600 text-white px-3 py-1 rounded hover:bg-green-700"
                    >
                      + Add New
                    </button>
                  </div>
                  {editFormData.intlConferences.map((item, idx) => (
                    <div key={idx} className="bg-gray-50 p-4 rounded-lg flex gap-4 items-start group">
                      <div className="grow grid gap-2">
                        <input
                          placeholder="Title"
                          className="w-full border rounded p-2 text-sm font-medium"
                          value={item.title}
                          onChange={(e) => {
                            const updated = editFormData.intlConferences.map((el, i) =>
                              i === idx ? { ...el, title: e.target.value } : el
                            );
                            setEditFormData({ ...editFormData, intlConferences: updated });
                          }}
                        />
                        <input
                          placeholder="Details"
                          className="w-full border rounded p-2 text-sm text-gray-600"
                          value={item.details}
                          onChange={(e) => {
                            const updated = editFormData.intlConferences.map((el, i) =>
                              i === idx ? { ...el, details: e.target.value } : el
                            );
                            setEditFormData({ ...editFormData, intlConferences: updated });
                          }}
                        />
                      </div>
                      <button
                        type="button"
                        onClick={() => {
                          const updated = editFormData.intlConferences.filter((_, i) => i !== idx);
                          setEditFormData({ ...editFormData, intlConferences: updated });
                        }}
                        className="text-red-500 hover:text-red-700 p-1"
                        title="Remove"
                      >
                        ✕
                      </button>
                    </div>
                  ))}
                </div>

                {/* SECTION: NATIONAL CONFERENCES */}
                <div className="space-y-4">
                  <div className="flex justify-between items-center border-b pb-2">
                    <h3 className="text-xl font-bold text-blue-800">National Conferences</h3>
                    <button
                      type="button"
                      onClick={() => setEditFormData({
                        ...editFormData,
                        natConferences: [{ title: "", details: "" }, ...editFormData.natConferences]
                      })}
                      className="text-sm bg-green-600 text-white px-3 py-1 rounded hover:bg-green-700"
                    >
                      + Add New
                    </button>
                  </div>
                  {editFormData.natConferences.map((item, idx) => (
                    <div key={idx} className="bg-gray-50 p-4 rounded-lg flex gap-4 items-start group">
                      <div className="grow grid gap-2">
                        <input
                          placeholder="Title"
                          className="w-full border rounded p-2 text-sm font-medium"
                          value={item.title}
                          onChange={(e) => {
                            const updated = editFormData.natConferences.map((el, i) =>
                              i === idx ? { ...el, title: e.target.value } : el
                            );
                            setEditFormData({ ...editFormData, natConferences: updated });
                          }}
                        />
                        <input
                          placeholder="Details"
                          className="w-full border rounded p-2 text-sm text-gray-600"
                          value={item.details}
                          onChange={(e) => {
                            const updated = editFormData.natConferences.map((el, i) =>
                              i === idx ? { ...el, details: e.target.value } : el
                            );
                            setEditFormData({ ...editFormData, natConferences: updated });
                          }}
                        />
                      </div>
                      <button
                        type="button"
                        onClick={() => {
                          const updated = editFormData.natConferences.filter((_, i) => i !== idx);
                          setEditFormData({ ...editFormData, natConferences: updated });
                        }}
                        className="text-red-500 hover:text-red-700 p-1"
                        title="Remove"
                      >
                        ✕
                      </button>
                    </div>
                  ))}
                </div>

                {/* SECTION: ACHIEVEMENTS */}
                <div className="space-y-4">
                  <div className="flex justify-between items-center border-b pb-2">
                    <h3 className="text-xl font-bold text-blue-800">Achievements</h3>
                    <button
                      type="button"
                      onClick={() => setEditFormData({
                        ...editFormData,
                        achievements: ["", ...editFormData.achievements]
                      })}
                      className="text-sm bg-green-600 text-white px-3 py-1 rounded hover:bg-green-700"
                    >
                      + Add New
                    </button>
                  </div>
                  {editFormData.achievements.map((item, idx) => (
                    <div key={idx} className="flex gap-2 items-center">
                      <input
                        className="grow border rounded p-2 text-sm"
                        value={item}
                        onChange={(e) => {
                          const newList = [...editFormData.achievements];
                          newList[idx] = e.target.value;
                          setEditFormData({ ...editFormData, achievements: newList });
                        }}
                      />
                      <button
                        type="button"
                        onClick={() => {
                          const newList = [...editFormData.achievements];
                          newList.splice(idx, 1);
                          setEditFormData({ ...editFormData, achievements: newList });
                        }}
                        className="text-red-500 hover:text-red-700 p-1"
                      >
                        ✕
                      </button>
                    </div>
                  ))}
                </div>

                {/* SECTION: MEMBERSHIPS */}
                <div className="space-y-4">
                  <div className="flex justify-between items-center border-b pb-2">
                    <h3 className="text-xl font-bold text-blue-800">Memberships</h3>
                    <button
                      type="button"
                      onClick={() => setEditFormData({
                        ...editFormData,
                        memberships: ["", ...editFormData.memberships]
                      })}
                      className="text-sm bg-green-600 text-white px-3 py-1 rounded hover:bg-green-700"
                    >
                      + Add New
                    </button>
                  </div>
                  {editFormData.memberships.map((item, idx) => (
                    <div key={idx} className="flex gap-2 items-center">
                      <input
                        className="grow border rounded p-2 text-sm"
                        value={item}
                        onChange={(e) => {
                          const newList = [...editFormData.memberships];
                          newList[idx] = e.target.value;
                          setEditFormData({ ...editFormData, memberships: newList });
                        }}
                      />
                      <button
                        type="button"
                        onClick={() => {
                          const newList = [...editFormData.memberships];
                          newList.splice(idx, 1);
                          setEditFormData({ ...editFormData, memberships: newList });
                        }}
                        className="text-red-500 hover:text-red-700 p-1"
                      >
                        ✕
                      </button>
                    </div>
                  ))}
                </div>

                {/* SECTION: EXPERT SESSIONS */}
                <div className="space-y-4">
                  <div className="flex justify-between items-center border-b pb-2">
                    <h3 className="text-xl font-bold text-blue-800">Expert Sessions</h3>
                    <button
                      type="button"
                      onClick={() => setEditFormData({
                        ...editFormData,
                        expertSessions: [{ title: "", details: "" }, ...editFormData.expertSessions]
                      })}
                      className="text-sm bg-green-600 text-white px-3 py-1 rounded hover:bg-green-700"
                    >
                      + Add New
                    </button>
                  </div>
                  {editFormData.expertSessions.map((item, idx) => (
                    <div key={idx} className="bg-gray-50 p-4 rounded-lg flex gap-4 items-start group">
                      <div className="grow grid gap-2">
                        <input
                          placeholder="Topic / Title"
                          className="w-full border rounded p-2 text-sm font-medium"
                          value={item.title}
                          onChange={(e) => {
                            const updated = editFormData.expertSessions.map((el, i) =>
                              i === idx ? { ...el, title: e.target.value } : el
                            );
                            setEditFormData({ ...editFormData, expertSessions: updated });
                          }}
                        />
                        <input
                          placeholder="Details (Event, Location)"
                          className="w-full border rounded p-2 text-sm text-gray-600"
                          value={item.details}
                          onChange={(e) => {
                            const updated = editFormData.expertSessions.map((el, i) =>
                              i === idx ? { ...el, details: e.target.value } : el
                            );
                            setEditFormData({ ...editFormData, expertSessions: updated });
                          }}
                        />
                      </div>
                      <button
                        type="button"
                        onClick={() => {
                          const updated = editFormData.expertSessions.filter((_, i) => i !== idx);
                          setEditFormData({ ...editFormData, expertSessions: updated });
                        }}
                        className="text-red-500 hover:text-red-700 p-1"
                        title="Remove"
                      >
                        ✕
                      </button>
                    </div>
                  ))}
                </div>

                {/* ACTION BUTTONS */}
                <div className="flex justify-end pt-4 border-t">
                  <button
                    type="button"
                    onClick={() => setIsEditModalOpen(false)}
                    className="px-6 py-2 mr-3 border rounded-lg hover:bg-gray-50"
                  >
                    Cancel
                  </button>
                  <button
                    type="submit"
                    className="px-6 py-2 bg-blue-700 text-white rounded-lg hover:bg-blue-800"
                  >
                    Save Changes
                  </button>
                </div>
              </form>
            </div>
          </div >
        )
      }

    </div >
  );
};

/* ================= REUSABLE COMPONENTS ================= */

const Section = ({ title, children }) => (
  <section className="mb-24">
    <h3 className="text-3xl font-bold text-gray-900 mb-10 text-center">
      {title}
    </h3>
    <div className="bg-white rounded-2xl shadow-md p-8 space-y-6 transition-all hover:shadow-xl">
      {children}
    </div>
  </section>
);

const Item = ({ title, details }) => (
  <div className="border-l-4 border-blue-600 pl-4 transition-all hover:bg-blue-50 hover:border-blue-700 hover:pl-6 rounded-r-md">
    <p className="font-medium text-gray-900">
      “{title}”
    </p>
    <p className="text-sm text-gray-500 mt-1">
      {details}
    </p>
  </div>
);

const ListCard = ({ title, items }) => (
  <div className="bg-white rounded-2xl shadow-md p-8 transition-all hover:-translate-y-1 hover:shadow-xl">
    <h4 className="text-2xl font-bold mb-6">{title}</h4>
    <ul className="space-y-3 text-gray-700">
      {items.map((item, idx) => (
        <li key={idx} className="hover:text-blue-700 transition-colors">
          • {item}
        </li>
      ))}
    </ul>
  </div>
);

export default About;
