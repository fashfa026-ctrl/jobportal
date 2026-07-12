import logo from "../../assets/logo.png";

const LoadingSpinner = () => {
  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-50 to-gray-100 flex items-center justify-center">
      <div className="text-center">
        {/* Animated Icon Container */}
        <div className="relative flex items-center justify-center h-16 w-16 mx-auto mb-4">
          {/* Outer spinning ring */}
          <div className="animate-spin rounded-full h-12 w-12 border-4 border-blue-100 border-t-blue-600"></div>
          
          {/* Inner static icon */}
          <div className="absolute inset-0 flex items-center justify-center">
            <img src={logo} alt="Logo" className="w-5 h-5 object-contain" />
          </div>
        </div>

        {/* Loading Text Message */}
        <p className="text-gray-600 font-medium text-sm tracking-wide animate-pulse">
          Finding amazing opportunities...
        </p>
      </div>
    </div>
  );
};

export default LoadingSpinner;