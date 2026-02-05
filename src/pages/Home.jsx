import React from "react";
import { Link } from "react-router-dom";
import { Mail } from "lucide-react";
import Logo from "../assets/logo.jpg";

const Home = () => {
  const [email, setEmail] = React.useState("");
  const [status, setStatus] = React.useState("idle");
  const [message, setMessage] = React.useState("");

  const WEBHOOK_URL = "https://jeetzo.app.n8n.cloud/webhook/newsletter-subscribe";

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!email) return;
    setStatus("loading");

    try {
      const response = await fetch(WEBHOOK_URL, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ email }),
      });

      if (response.ok) {
        setStatus("success");
        setMessage("You’re now subscribed to academic insights.");
        setEmail("");
      } else throw new Error();
    } catch {
      setStatus("error");
      setMessage("Unable to subscribe right now.");
    }
  };

  return (
    <div className="bg-[#F9FAFC] text-gray-800">

      {/* ================= SIGNATURE HERO ================= */}
      <section className="relative overflow-hidden">
        {/* Background layers */}
        <div className="absolute inset-0 bg-gradient-to-br from-blue-50 via-white to-purple-50" />
        <div className="absolute -top-32 -right-32 w-[500px] h-[500px] bg-blue-200/30 rounded-full blur-3xl" />
        <div className="absolute top-1/2 -left-32 w-[400px] h-[400px] bg-purple-200/30 rounded-full blur-3xl" />

        <div className="relative max-w-6xl mx-auto px-6 py-36 text-center">

          {/* Logo */}
          <div className="flex justify-center mb-8">
            <img
              src={Logo}
              alt="Learniverse Logo"
              className="h-20 w-auto opacity-95"
            />
          </div>

          {/* Name */}
          <h1 className="text-5xl md:text-6xl font-bold text-gray-900 font-plus-jakarta tracking-tight">
            Prof. (Dr.) Vishal Dahiya
          </h1>

          {/* Role */}
          <p className="mt-4 text-lg md:text-xl text-blue-700 font-medium">
            Professor & Director · Integrated MCA
          </p>

          {/* Divider */}
          <div className="flex justify-center mt-6">
            <span className="w-24 h-[3px] bg-gradient-to-r from-blue-600 to-purple-600 rounded-full"></span>
          </div>

          {/* Vision */}
          <p className="mt-8 max-w-3xl mx-auto text-lg text-gray-600 leading-relaxed">
            An academic leader with over <strong>25 years of experience</strong> in higher
            education, research, and mentorship — shaping future-ready minds
            through Artificial Intelligence, data-driven systems, and
            curriculum innovation.
          </p>

          {/* CTAs */}
          <div className="mt-12 flex flex-wrap justify-center gap-4">
            <Link
              to="/about"
              className="px-8 py-4 rounded-xl bg-blue-700 text-white font-semibold hover:bg-blue-800 transition shadow-lg"
            >
              Academic Profile
            </Link>

          </div>

          {/* Trust badges */}
          <div className="mt-16 flex flex-wrap justify-center gap-8 text-sm text-gray-500">
            <span>• 25+ Years Academia</span>
            <span>• Ph.D. in Artificial Intelligence</span>
            <span>• Doctoral Scholar Mentor</span>
            <span>• Research & MOOCs Contributor</span>
          </div>
        </div>
      </section>

      {/* ================= STATS ================= */}
      <section className="py-16 bg-white border-t border-gray-100">
        <div className="max-w-6xl mx-auto px-6 grid grid-cols-2 md:grid-cols-4 gap-8 text-center">
          <Stat value="25+" label="Years in Academia" />
          <Stat value="50+" label="Research Publications" />
          <Stat value="Multiple" label="Ph.D. Scholars Guided" />
          <Stat value="2001" label="Academic Leadership Since" />
        </div>
      </section>

      {/* ================= TESTIMONIALS ================= */}
      <section className="py-24 bg-[#F9FAFC]">
        <div className="max-w-6xl mx-auto px-6">
          <h2 className="text-3xl font-bold text-gray-900 mb-12 font-plus-jakarta">
            Mentorship & Impact
          </h2>

          <div className="grid md:grid-cols-3 gap-10">
            {[
              {
                name: "Amit D.",
                role: "Ph.D. Scholar",
                quote:
                  "Her mentorship shaped my research discipline and academic confidence.",
              },
              {
                name: "Priya K.",
                role: "Postgraduate Student",
                quote:
                  "A rare blend of rigor, empathy, and academic excellence.",
              },
              {
                name: "Rahul S.",
                role: "Technology Professional",
                quote:
                  "The foundations I learned continue to guide my professional journey.",
              },
            ].map((t, i) => (
              <div
                key={i}
                className="bg-white p-8 rounded-2xl border border-gray-100 shadow-sm hover:shadow-md transition"
              >
                <p className="text-gray-600 italic mb-6">“{t.quote}”</p>
                <p className="font-semibold text-gray-900">{t.name}</p>
                <p className="text-sm text-blue-600">{t.role}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* ================= NEWSLETTER ================= */}
      <section className="py-24">
        <div className="max-w-4xl mx-auto px-6">
          <div className="bg-white border border-gray-200 rounded-2xl p-12">
            <h2 className="text-3xl font-bold text-gray-900 mb-4 font-plus-jakarta">
              Academic Newsletter
            </h2>
            <p className="text-gray-600 mb-8">
              Occasional insights on AI, research, and higher education.
            </p>

            <form
              onSubmit={handleSubmit}
              className="flex flex-col sm:flex-row gap-4"
            >
              <div className="relative flex-1">
                <Mail className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-400 w-5 h-5" />
                <input
                  type="email"
                  required
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  placeholder="Enter your email"
                  className="w-full pl-12 pr-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:outline-none"
                />
              </div>
              <button
                type="submit"
                disabled={status === "loading" || status === "success"}
                className="px-6 py-3 rounded-lg bg-blue-700 text-white font-semibold hover:bg-blue-800 transition"
              >
                {status === "loading"
                  ? "Subscribing…"
                  : status === "success"
                    ? "Subscribed"
                    : "Subscribe"}
              </button>
            </form>

            {message && (
              <p className="mt-4 text-sm text-gray-600">{message}</p>
            )}
          </div>
        </div>
      </section>
    </div>
  );
};

const Stat = ({ value, label }) => (
  <div>
    <p className="text-3xl font-bold text-gray-900">{value}</p>
    <p className="text-sm text-gray-500 mt-1">{label}</p>
  </div>
);

export default Home;
