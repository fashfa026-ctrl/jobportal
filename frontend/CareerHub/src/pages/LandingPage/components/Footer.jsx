import { Briefcase } from "lucide-react";

const Footer = () => {
  return (
    <footer className="relative bg-gray-50 dark:bg-slate-900 text-gray-900 dark:text-white border-t border-gray-100 dark:border-slate-800/80 overflow-hidden transition-colors duration-200">
        <div className="relative z-10 px-6 py-10">
            <div className="max-w-6xl mx-auto">
                {/* Main Footer Content */}
                <div className="text-center space-y-8">
                    {/* Logo/Brand */}
                    <div className="space-y-4">
                        <div className="flex items-center justify-center space-x-2 mb-6">
                            <div className="w-10 h-10 bg-gradient-to-r from-blue-500 to-purple-500 rounded-lg flex items-center justify-center">
                                <Briefcase className="w-6 h-6 text-white" />
                            </div>
                            <h3 className="text-2xl font-bold text-gray-800 dark:text-white">CareerHub</h3>
                        </div>

                        <p className={`text-sm text-gray-600 dark:text-slate-450 max-w-md mx-auto`}>
                            Connecting talented professionals with innovative companies 
                            worldwide. Your career success is our mission.
                        </p>
                    </div>

                    {/* Copyright */}
                    <div className="space-y-2">
                        <p className={`text-sm text-gray-600 dark:text-slate-400`}>
                          © {new Date().getFullYear()} Time To Program.
                        </p>
                        <p className={`text-xs text-gray-500 dark:text-slate-500`}>
                            Made with ❤️ — Happy Coding! 
                        </p>
                    </div>
                </div>
            </div>
        </div>
    </footer>
  )
}

export default Footer;
