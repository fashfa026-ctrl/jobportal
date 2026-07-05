import { useState, useRef, useEffect } from "react";
import {
  Share2,
  Copy,
  Check,
  Mail,
  X,
} from "lucide-react";
import toast from "react-hot-toast";
import { motion, AnimatePresence } from "framer-motion";

// Custom official brand SVG Icons for maximum visual quality
const LinkedInIcon = () => (
  <svg className="w-5 h-5 fill-current" viewBox="0 0 24 24">
    <path d="M19 0h-14c-2.761 0-5 2.239-5 5v14c0 2.761 2.239 5 5 5h14c2.762 0 5-2.239 5-5v-14c0-2.761-2.238-5-5-5zm-11 19h-3v-11h3v11zm-1.5-12.268c-.966 0-1.75-.779-1.75-1.75s.784-1.75 1.75-1.75 1.75.779 1.75 1.75-.784 1.75-1.75 1.75zm13.5 12.268h-3v-5.604c0-3.368-4-3.113-4 0v5.604h-3v-11h3v1.765c1.396-2.586 7-2.777 7 2.476v6.759z"/>
  </svg>
);

const XIcon = () => (
  <svg className="w-5 h-5 fill-current" viewBox="0 0 24 24">
    <path d="M18.244 2.25h3.308l-7.227 8.26 8.502 11.24H16.17l-5.214-6.817L4.99 21.75H1.68l7.73-8.835L1.254 2.25H8.08l4.713 6.231zm-1.161 17.52h1.833L7.084 4.126H5.117z"/>
  </svg>
);

const WhatsAppIcon = () => (
  <svg className="w-5 h-5 fill-current" viewBox="0 0 24 24">
    <path d="M.057 24l1.687-6.163c-1.041-1.804-1.588-3.849-1.587-5.946C.06 5.348 5.397.01 12.008.01c3.202.001 6.212 1.246 8.477 3.514 2.266 2.268 3.507 5.28 3.505 8.484-.004 6.657-5.34 11.997-11.953 11.997-2.005-.001-3.973-.502-5.724-1.455L0 24zm6.59-4.846c1.6.95 3.188 1.449 4.825 1.451 5.436 0 9.86-4.37 9.864-9.799.002-2.63-1.023-5.101-2.885-6.968C16.63 1.97 14.155.947 11.53.947c-5.445 0-9.87 4.372-9.874 9.802-.001 1.768.463 3.49 1.345 5.021l-.997 3.637 3.737-.969zm11.368-7.14c-.302-.15-1.787-.872-2.064-.972-.277-.1-.479-.15-.679.15-.201.3-.778.972-.954 1.173-.176.2-.353.225-.655.075-.302-.15-1.275-.467-2.428-1.484-.897-.796-1.503-1.778-1.679-2.077-.176-.3-.019-.462.132-.612.136-.134.302-.35.453-.524.151-.174.201-.3.302-.5.101-.2.05-.375-.025-.526-.075-.15-.679-1.623-.93-2.224-.244-.588-.493-.508-.679-.518-.176-.01-.378-.012-.579-.012-.201 0-.528.075-.805.375-.277.3-1.057 1.023-1.057 2.493c0 1.47 1.07 2.89 1.221 3.09.151.2 2.107 3.195 5.104 4.47.712.305 1.27.487 1.705.625.717.227 1.37.195 1.887.118.577-.087 1.787-.726 2.039-1.43.252-.704.252-1.306.176-1.43-.076-.124-.277-.199-.579-.349z"/>
  </svg>
);

const FacebookIcon = () => (
  <svg className="w-5 h-5 fill-current" viewBox="0 0 24 24">
    <path d="M24 12.073c0-6.627-5.373-12-12-12s-12 5.373-12 12c0 5.99 4.388 10.954 10.125 11.854v-8.385H7.078v-3.47h3.047V9.43c0-3.007 1.792-4.669 4.533-4.669 1.312 0 2.686.235 2.686.235v2.953H15.83c-1.491 0-1.956.925-1.956 1.874v2.25h3.328l-.532 3.47h-2.796v8.385C19.612 23.027 24 18.062 24 12.073z"/>
  </svg>
);

const TelegramIcon = () => (
  <svg className="w-5 h-5 fill-current" viewBox="0 0 24 24">
    <path d="M12 0C5.373 0 0 5.373 0 12s5.373 12 12 12 12-5.373 12-12S18.627 0 12 0zm5.562 8.161c-.18.717-.962 4.084-1.362 5.418-.169.565-.478.754-.679.772-.44.04-1.11-.274-1.536-.554-.668-.438-1.046-.71-1.695-1.137-.75-.494-.264-.766.164-1.21.112-.116 2.062-1.892 2.1-2.057.005-.021.009-.1-.038-.141-.047-.042-.116-.028-.167-.016-.072.016-1.224.776-3.45 2.28-.326.224-.622.334-.888.328-.293-.006-.857-.166-1.277-.302-.514-.167-.923-.255-.887-.539.019-.148.223-.3.612-.456 2.396-1.042 3.993-1.73 4.792-2.063 2.28-.949 2.754-1.114 3.063-1.12.068-.001.22.017.318.097.083.067.106.159.115.228.009.069.02.24.011.396z"/>
  </svg>
);

const ShareButton = ({ url, title }) => {
  const [isOpen, setIsOpen] = useState(false);
  const [copied, setCopied] = useState(false);
  const modalRef = useRef(null);

  const shareUrl = url || window.location.href;
  const shareText = title ? `Check out this job: ${title} on CareerHub` : "Check out this job on CareerHub";

  // Prevent background scrolling when modal is open
  useEffect(() => {
    if (isOpen) {
      document.body.style.overflow = "hidden";
    } else {
      document.body.style.overflow = "unset";
    }
    return () => {
      document.body.style.overflow = "unset";
    };
  }, [isOpen]);

  // Handle click outside to close
  useEffect(() => {
    const handleClickOutside = (e) => {
      if (modalRef.current && !modalRef.current.contains(e.target)) {
        setIsOpen(false);
      }
    };
    if (isOpen) {
      document.addEventListener("mousedown", handleClickOutside);
    }
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, [isOpen]);

  const handleCopyLink = async () => {
    try {
      await navigator.clipboard.writeText(shareUrl);
      setCopied(true);
      toast.success("Link copied to clipboard!");
      setTimeout(() => setCopied(false), 2000);
    } catch (err) {
      toast.error("Failed to copy link");
    }
  };

  const platforms = [
    {
      name: "LinkedIn",
      icon: LinkedInIcon,
      color: "group-hover:bg-[#0077b5] group-hover:text-white group-hover:border-[#0077b5]",
      href: `https://www.linkedin.com/sharing/share-offsite/?url=${encodeURIComponent(shareUrl)}`,
    },
    {
      name: "WhatsApp",
      icon: WhatsAppIcon,
      color: "group-hover:bg-[#25d366] group-hover:text-white group-hover:border-[#25d366]",
      href: `https://wa.me/?text=${encodeURIComponent(shareText + " " + shareUrl)}`,
    },
    {
      name: "Twitter",
      icon: XIcon,
      color: "group-hover:bg-[#111] group-hover:text-white group-hover:border-[#111]",
      href: `https://twitter.com/intent/tweet?text=${encodeURIComponent(shareText)}&url=${encodeURIComponent(shareUrl)}`,
    },
    {
      name: "Facebook",
      icon: FacebookIcon,
      color: "group-hover:bg-[#1877f2] group-hover:text-white group-hover:border-[#1877f2]",
      href: `https://www.facebook.com/sharer/sharer.php?u=${encodeURIComponent(shareUrl)}`,
    },
    {
      name: "Telegram",
      icon: TelegramIcon,
      color: "group-hover:bg-[#24A1DE] group-hover:text-white group-hover:border-[#24A1DE]",
      href: `https://t.me/share/url?url=${encodeURIComponent(shareUrl)}&text=${encodeURIComponent(shareText)}`,
    },
    {
      name: "Email",
      icon: Mail,
      color: "group-hover:bg-rose-500 group-hover:text-white group-hover:border-rose-500",
      href: `mailto:?subject=${encodeURIComponent(title || "Job Opportunity")}&body=${encodeURIComponent(shareText + "\n\n" + shareUrl)}`,
    },
  ];

  return (
    <>
      <button
        onClick={() => setIsOpen(true)}
        className="flex items-center gap-1.5 text-sm text-slate-500 hover:text-indigo-600 font-medium transition cursor-pointer"
      >
        <Share2 className="h-3.5 w-3.5" />
        Share
      </button>

      <AnimatePresence>
        {isOpen && (
          <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-900/40 backdrop-blur-sm">
            {/* Backdrop Fade */}
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              className="absolute inset-0"
            />

            {/* Modal Card */}
            <motion.div
              ref={modalRef}
              initial={{ scale: 0.95, opacity: 0, y: 10 }}
              animate={{ scale: 1, opacity: 1, y: 0 }}
              exit={{ scale: 0.95, opacity: 0, y: 10 }}
              transition={{ type: "spring", duration: 0.4 }}
              className="relative w-full max-w-md bg-white rounded-2xl shadow-xl border border-slate-100 overflow-hidden p-6 z-10"
            >
              {/* Header */}
              <div className="flex items-center justify-between mb-4">
                <div>
                  <h3 className="text-lg font-bold text-slate-900">Share this job</h3>
                  <p className="text-xs text-slate-500 mt-0.5">
                    Share this opportunity with your network or friends.
                  </p>
                </div>
                <button
                  onClick={() => setIsOpen(false)}
                  className="p-1.5 rounded-lg text-slate-400 hover:bg-slate-50 hover:text-slate-700 transition"
                >
                  <X className="w-4 h-4" />
                </button>
              </div>

              {/* Grid of Social Channels */}
              <div className="grid grid-cols-3 gap-4 my-6">
                {platforms.map((platform) => (
                  <a
                    key={platform.name}
                    href={platform.href}
                    target="_blank"
                    rel="noopener noreferrer"
                    onClick={() => setIsOpen(false)}
                    className="flex flex-col items-center justify-center p-2 rounded-xl transition-colors group cursor-pointer"
                  >
                    <div className={`w-12 h-12 rounded-full flex items-center justify-center bg-slate-50 border border-slate-100 text-slate-500 shadow-sm transition-all duration-200 ${platform.color} group-hover:scale-110`}>
                      <platform.icon className="w-5 h-5" />
                    </div>
                    <span className="text-xs font-medium mt-2 text-slate-500 transition-colors group-hover:text-slate-800">
                      {platform.name}
                    </span>
                  </a>
                ))}
              </div>

              {/* Copy Link Input Bar */}
              <div className="space-y-2">
                <label className="text-[10px] font-bold text-slate-400 uppercase tracking-wider">
                  Or Copy Link
                </label>
                <div className="relative flex items-center">
                  <input
                    type="text"
                    readOnly
                    value={shareUrl}
                    onClick={(e) => e.target.select()}
                    className="w-full bg-slate-50 border border-slate-200 rounded-xl px-4 py-3 pr-28 text-xs text-slate-600 font-mono select-all focus:outline-none focus:border-indigo-500 transition"
                  />
                  <button
                    onClick={handleCopyLink}
                    className={`absolute right-1.5 top-1.5 bottom-1.5 text-xs font-semibold px-4 rounded-lg flex items-center gap-1.5 transition-all duration-300 ${
                      copied
                        ? "bg-emerald-600 text-white"
                        : "bg-indigo-600 hover:bg-indigo-700 text-white cursor-pointer"
                    }`}
                  >
                    {copied ? (
                      <>
                        <Check className="w-3.5 h-3.5" />
                        Copied!
                      </>
                    ) : (
                      <>
                        <Copy className="w-3.5 h-3.5" />
                        Copy
                      </>
                    )}
                  </button>
                </div>
              </div>
            </motion.div>
          </div>
        )}
      </AnimatePresence>
    </>
  );
};

export default ShareButton;