import { useState } from "react";
import axiosInstance from "../../utils/axiosInstance";
import toast from "react-hot-toast";
import logo from "../../../assets/logo.png";

const Footer = () => {
  const [formData, setFormData] = useState({ name: "", email: "", message: "" });
  const [loading, setLoading] = useState(false);

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!formData.name.trim() || !formData.email.trim() || !formData.message.trim()) {
      toast.error("Please fill in all fields");
      return;
    }
    setLoading(true);
    try {
      await axiosInstance.post("/api/feedback", formData);
      toast.success("Thank you for your message!");
      setFormData({ name: "", email: "", message: "" });
    } catch (err) {
      toast.error(err.response?.data?.message || "Failed to send message. Please try again.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <footer className="relative bg-gray-50 dark:bg-slate-900 text-gray-900 dark:text-white border-t border-gray-100 dark:border-slate-800/80 overflow-hidden transition-colors duration-200">
      <div className="relative z-10 px-6 py-12">
        <div className="max-w-3xl mx-auto space-y-10 text-center">
          {/* 1. Logo */}
          <div className="flex flex-col items-center space-y-4">
            <img src={logo} alt="Logo" className="w-16 h-16 object-contain" />
            <h3 className="text-2xl font-bold text-gray-800 dark:text-white">CareerHub</h3>
          </div>

          {/* 2. Description */}
          <p className="text-sm text-gray-600 dark:text-slate-400 max-w-md mx-auto leading-relaxed">
            Connecting talented professionals with innovative companies worldwide. Your career success is our mission.
          </p>

          {/* 3. Contact & Feedback Form */}
          <div className="bg-white dark:bg-slate-800 p-6 rounded-2xl border border-gray-100 dark:border-slate-850 shadow-sm space-y-4 text-left max-w-lg mx-auto">
            <h4 className="text-lg font-bold text-gray-900 dark:text-white text-center">Contact & Feedback</h4>
            <form onSubmit={handleSubmit} className="space-y-3">
              <div>
                <input
                  type="text"
                  placeholder="Your Name"
                  value={formData.name}
                  onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                  className="w-full px-4 py-2 border border-gray-200 dark:border-slate-700 rounded-xl text-sm focus:outline-none focus:ring-2 focus:ring-blue-500/20 bg-gray-50 dark:bg-slate-900 dark:text-white"
                />
              </div>
              <div>
                <input
                  type="email"
                  placeholder="Your Email"
                  value={formData.email}
                  onChange={(e) => setFormData({ ...formData, email: e.target.value })}
                  className="w-full px-4 py-2 border border-gray-200 dark:border-slate-700 rounded-xl text-sm focus:outline-none focus:ring-2 focus:ring-blue-500/20 bg-gray-50 dark:bg-slate-900 dark:text-white"
                />
              </div>
              <div>
                <textarea
                  placeholder="Your Message"
                  rows="3"
                  value={formData.message}
                  onChange={(e) => setFormData({ ...formData, message: e.target.value })}
                  className="w-full px-4 py-2 border border-gray-200 dark:border-slate-700 rounded-xl text-sm focus:outline-none focus:ring-2 focus:ring-blue-500/20 bg-gray-50 dark:bg-slate-900 dark:text-white resize-none"
                />
              </div>
              <button
                type="submit"
                disabled={loading}
                className="w-full py-2.5 bg-gradient-to-r from-blue-600 to-purple-600 hover:from-blue-700 hover:to-purple-700 text-white text-sm font-semibold rounded-xl transition cursor-pointer shadow-md"
              >
                {loading ? "Sending..." : "Send Message"}
              </button>
            </form>
          </div>

          {/* 4. Copyright Section (Bottom of Footer) */}
          <div className="pt-6 border-t border-gray-200/50 dark:border-slate-800/80 text-xs text-gray-500 dark:text-slate-500 space-y-1.5">
            <p>© 2026 CareerHub. All Rights Reserved.</p>
            <p>Developed by Time To Program.</p>
            <p>Made with ❤️ for Job Seekers & Employers.</p>
          </div>
        </div>
      </div>
    </footer>
  );
};

export default Footer;
