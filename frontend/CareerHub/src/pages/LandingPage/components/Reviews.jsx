import { useEffect, useState } from "react";
import { motion } from "framer-motion";
import { Star, MessageSquare, Plus, X, Quote } from "lucide-react";
import { useNavigate } from "react-router-dom";
import { useAuth } from "../../../context/AuthContext";
import axiosInstance from "../../utils/axiosInstance";
import toast from "react-hot-toast";

const Reviews = () => {
  const { isAuthenticated } = useAuth();
  const navigate = useNavigate();

  const [reviews, setReviews] = useState([]);
  const [loading, setLoading] = useState(true);
  const [showModal, setShowModal] = useState(false);

  // Form states
  const [rating, setRating] = useState(5);
  const [comment, setComment] = useState("");
  const [submitLoading, setSubmitLoading] = useState(false);

  const fetchReviews = async () => {
    try {
      const response = await axiosInstance.get("/api/reviews");
      setReviews(response.data);
    } catch (error) {
      console.error("Error fetching reviews:", error);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchReviews();
  }, []);

  const handleLeaveReviewClick = () => {
    if (!isAuthenticated) {
      toast.error("Please login to leave a review");
      navigate("/login");
      return;
    }
    setShowModal(true);
  };

  const handleSubmitReview = async (e) => {
    e.preventDefault();
    if (!comment.trim()) {
      toast.error("Please write a comment");
      return;
    }

    setSubmitLoading(true);
    try {
      const response = await axiosInstance.post("/api/reviews", { rating, comment });
      toast.success(response.data.message || "Thank you for your review!");
      setComment("");
      setRating(5);
      setShowModal(false);
      fetchReviews(); // Refresh reviews list
    } catch (error) {
      toast.error(error.response?.data?.message || "Failed to submit review");
    } finally {
      setSubmitLoading(false);
    }
  };

  const renderStars = (ratingVal) => {
    return (
      <div className="flex space-x-0.5">
        {[1, 2, 3, 4, 5].map((star) => (
          <Star
            key={star}
            className={`w-4 h-4 ${
              star <= ratingVal
                ? "text-amber-500 fill-amber-500"
                : "text-gray-250 dark:text-slate-700"
            }`}
          />
        ))}
      </div>
    );
  };

  return (
    <section className="py-24 bg-slate-50/40 dark:bg-slate-900/10 border-y border-slate-100 dark:border-slate-800 relative overflow-hidden transition-colors duration-200">
      {/* Tech Grid Background */}
      <div className="absolute inset-0 bg-[linear-gradient(to_right,#80808008_1px,transparent_1px),linear-gradient(to_bottom,#80808008_1px,transparent_1px)] bg-[size:24px_24px] [mask-image:radial-gradient(ellipse_60%_50%_at_50%_50%,#000_70%,transparent_100%)] pointer-events-none" />

      {/* Decorative Blobs */}
      <div className="absolute top-10 right-1/4 w-72 h-72 bg-violet-200/20 dark:bg-violet-900/10 rounded-full blur-3xl pointer-events-none" />
      <div className="absolute bottom-10 left-1/4 w-72 h-72 bg-blue-200/20 dark:bg-blue-900/10 rounded-full blur-3xl pointer-events-none" />

      <div className="max-w-6xl mx-auto px-6 md:px-12 relative z-10">
        
        {/* Section Header */}
        <div className="flex flex-col md:flex-row md:items-end justify-between mb-16 gap-6">
          <motion.div
            initial={{ opacity: 0, x: -30 }}
            whileInView={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.8 }}
            viewport={{ once: true }}
            className="text-left"
          >
            <span className="px-3 py-1 bg-blue-50 dark:bg-blue-950/40 border border-blue-100 dark:border-blue-900/50 text-blue-600 dark:text-blue-400 text-xs font-semibold rounded-full uppercase tracking-wider">
              Testimonials
            </span>
            <h2 className="text-4xl md:text-5xl font-extrabold text-slate-900 dark:text-white mt-4 mb-3 tracking-tight">
              What Our
              <span className="bg-gradient-to-r from-blue-600 to-purple-600 bg-clip-text text-transparent"> Users Say </span>
            </h2>
            <p className="text-lg text-slate-500 dark:text-slate-400 max-w-2xl leading-relaxed">
              Read reviews and testimonials from candidates and recruiters who found success using CareerHub.
            </p>
          </motion.div>

          <motion.div
            initial={{ opacity: 0, x: 30 }}
            whileInView={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.8 }}
            viewport={{ once: true }}
          >
            <button
              onClick={handleLeaveReviewClick}
              className="flex items-center space-x-2 px-6 py-3 bg-gradient-to-r from-blue-600 to-purple-600 hover:from-blue-700 hover:to-purple-700 text-white font-semibold rounded-xl transition cursor-pointer shadow-md hover:shadow-lg scale-100 hover:scale-105"
            >
              <Plus className="w-5 h-5" />
              <span>Leave a Review</span>
            </button>
          </motion.div>
        </div>

        {/* Reviews Grid */}
        {loading ? (
          <div className="flex justify-center items-center py-12">
            <div className="animate-spin rounded-full h-10 w-10 border-t-2 border-b-2 border-blue-600"></div>
          </div>
        ) : reviews.length === 0 ? (
          <motion.div
            initial={{ opacity: 0, scale: 0.95 }}
            animate={{ opacity: 1, scale: 1 }}
            className="text-center py-16 bg-white dark:bg-slate-900 rounded-3xl border border-dashed border-gray-250 dark:border-slate-800 max-w-xl mx-auto shadow-sm"
          >
            <MessageSquare className="w-12 h-12 text-slate-300 dark:text-slate-700 mx-auto mb-4" />
            <h3 className="text-xl font-bold text-gray-800 dark:text-white mb-2">No Reviews Yet</h3>
            <p className="text-gray-500 dark:text-slate-400 mb-6">Be the first to leave a review!</p>
            <button
              onClick={handleLeaveReviewClick}
              className="px-6 py-2.5 bg-blue-600 hover:bg-blue-700 text-white font-semibold rounded-xl transition cursor-pointer"
            >
              Write Review
            </button>
          </motion.div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {reviews.map((review, index) => (
              <motion.div
                key={review._id}
                initial={{ opacity: 0, y: 35 }}
                whileInView={{ opacity: 1, y: 0 }}
                transition={{ delay: index * 0.08, duration: 0.6 }}
                viewport={{ once: true }}
                className="bg-white dark:bg-slate-900 p-6 rounded-2xl border border-slate-100 dark:border-slate-800/80 border-t-4 border-t-blue-500 shadow-[0_8px_30px_rgba(59,130,246,0.02)] dark:shadow-none hover:-translate-y-1.5 transition-all duration-300 flex flex-col justify-between min-h-[220px]"
              >
                <div>
                  <div className="flex items-center justify-between mb-4">
                    {renderStars(review.rating)}
                    <Quote className="w-5 h-5 text-gray-200 dark:text-slate-800" />
                  </div>
                  <p className="text-gray-600 dark:text-slate-350 text-sm leading-relaxed mb-6 italic">
                    "{review.comment}"
                  </p>
                </div>
                
                <div className="flex items-center justify-between border-t border-gray-50 dark:border-slate-850 pt-4">
                  <span className="font-bold text-sm text-gray-900 dark:text-white">
                    {review.user?.fullName || "Anonymous"}
                  </span>
                  <span className="text-xs text-gray-400 dark:text-slate-500">
                    {new Date(review.createdAt).toLocaleDateString(undefined, {
                      year: "numeric",
                      month: "short",
                      day: "numeric",
                    })}
                  </span>
                </div>
              </motion.div>
            ))}
          </div>
        )}

      </div>

      {/* Review Dialog/Modal overlay */}
      {showModal && (
        <div className="fixed inset-0 bg-black/60 backdrop-blur-sm z-50 flex items-center justify-center px-4">
          <motion.div
            initial={{ opacity: 0, scale: 0.95, y: 10 }}
            animate={{ opacity: 1, scale: 1, y: 0 }}
            exit={{ opacity: 0, scale: 0.95, y: 10 }}
            className="bg-white dark:bg-slate-900 p-6 md:p-8 rounded-3xl max-w-md w-full border border-gray-150 dark:border-slate-800 shadow-2xl relative"
          >
            {/* Close Button */}
            <button
              onClick={() => setShowModal(false)}
              className="absolute top-4 right-4 p-1.5 rounded-lg hover:bg-gray-100 dark:hover:bg-slate-800 text-gray-400 hover:text-gray-600 dark:hover:text-white transition cursor-pointer"
            >
              <X className="w-5 h-5" />
            </button>

            <h3 className="text-2xl font-extrabold text-gray-900 dark:text-white mb-2 text-center">
              Write a Review
            </h3>
            <p className="text-sm text-gray-500 dark:text-slate-400 text-center mb-6">
              Let us know how CareerHub has helped you in your job search or recruitment process.
            </p>

            <form onSubmit={handleSubmitReview} className="space-y-5">
              {/* Star Rating Select Container */}
              <div className="flex flex-col items-center">
                <span className="text-sm font-semibold text-gray-600 dark:text-slate-400 mb-2">Rating</span>
                <div className="flex space-x-1.5">
                  {[1, 2, 3, 4, 5].map((star) => (
                    <button
                      key={star}
                      type="button"
                      onClick={() => setRating(star)}
                      className="focus:outline-none"
                    >
                      <Star
                        className={`w-8 h-8 cursor-pointer transition-transform duration-100 ${
                          star <= rating
                            ? "text-amber-500 fill-amber-500 scale-110"
                            : "text-gray-300 dark:text-slate-700 hover:scale-105"
                        }`}
                      />
                    </button>
                  ))}
                </div>
              </div>

              {/* Comment Box */}
              <div className="flex flex-col">
                <label className="text-sm font-semibold text-gray-600 dark:text-slate-400 mb-2">Comment</label>
                <textarea
                  value={comment}
                  onChange={(e) => setComment(e.target.value)}
                  className="w-full px-4 py-3 border border-gray-250 dark:border-slate-700 rounded-2xl text-sm focus:outline-none focus:ring-2 focus:ring-blue-500/20 bg-gray-50 dark:bg-slate-950 dark:text-white resize-none h-28"
                  placeholder="Tell us what you think..."
                  required
                />
              </div>

              {/* Actions Grid */}
              <div className="flex space-x-3 pt-2">
                <button
                  type="button"
                  onClick={() => setShowModal(false)}
                  className="w-1/2 py-2.5 border border-gray-250 dark:border-slate-700 text-gray-500 hover:bg-gray-50 dark:hover:bg-slate-800 rounded-xl text-sm font-semibold transition cursor-pointer"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  disabled={submitLoading}
                  className="w-1/2 py-2.5 bg-gradient-to-r from-blue-600 to-purple-600 hover:from-blue-700 hover:to-purple-700 text-white rounded-xl text-sm font-semibold transition cursor-pointer shadow-md disabled:opacity-50"
                >
                  {submitLoading ? "Submitting..." : "Submit Review"}
                </button>
              </div>
            </form>
          </motion.div>
        </div>
      )}
    </section>
  );
};

export default Reviews;
