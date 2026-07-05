import React from "react";
import { Sun, Moon } from "lucide-react";
import { useTheme } from "../../context/ThemeContext";
import { motion } from "framer-motion";

const ThemeToggle = () => {
  const { theme, toggleTheme } = useTheme();

  return (
    <motion.button
      whileHover={{ scale: 1.05 }}
      whileTap={{ scale: 0.95 }}
      onClick={toggleTheme}
      className="p-2.5 rounded-xl bg-gray-50 hover:bg-gray-100 text-gray-600 dark:bg-slate-900 dark:hover:bg-slate-855 dark:text-slate-300 border border-gray-100 dark:border-slate-800 transition-colors duration-200 focus:outline-none focus:ring-2 focus:ring-blue-500 cursor-pointer"
      aria-label="Toggle Theme"
    >
      <motion.div
        initial={{ rotate: 0 }}
        animate={{ rotate: theme === "dark" ? 180 : 0 }}
        transition={{ duration: 0.3 }}
      >
        {theme === "dark" ? (
          <Sun className="h-5 w-5 text-amber-400 fill-amber-400" />
        ) : (
          <Moon className="h-5 w-5 text-slate-600 fill-slate-100" />
        )}
      </motion.div>
    </motion.button>
  );
};

export default ThemeToggle;
