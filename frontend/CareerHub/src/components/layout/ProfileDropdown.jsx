import { useNavigate } from "react-router-dom";
import { LogOut, User, ChevronDown } from "lucide-react";

const ProfileDropdown = ({
  isOpen,
  onToggle,
  avatar,
  companyName,
  email,
  userRole,
  onLogout,
}) => {
  const navigate = useNavigate();

  const handleLogout = () => {
    onLogout();
    navigate("/login");
  };

  const displayName = companyName || "User";

  return (
    <div className="relative">
      {/* Profile Button */}
      <button
        onClick={(e) => {
          e.stopPropagation();
          onToggle(e);
        }}
        className="flex items-center space-x-2 p-1.5 rounded-xl hover:bg-gray-100 transition-colors duration-200"
      >
        {/* Avatar */}
        <div className="w-8 h-8 rounded-full overflow-hidden border-2 border-gray-200">
          {avatar ? (
            <img
              src={avatar}
              alt={displayName}
              className="w-full h-full object-cover"
              onError={(e) => {
                e.target.src = "https://cdn-icons-png.flaticon.com/512/149/149071.png";
              }}
            />
          ) : (
            <div className="w-full h-full bg-gradient-to-r from-blue-500 to-purple-500 flex items-center justify-center">
              <span className="text-white text-sm font-semibold">
                {displayName.charAt(0).toUpperCase()}
              </span>
            </div>
          )}
        </div>

        {/* Name + Role */}
        <div className="hidden sm:block text-left">
          <p className="text-sm font-medium text-gray-900 leading-none">
            {displayName}
          </p>
          <p className="text-xs text-gray-500 mt-0.5 capitalize">{userRole || "Candidate"}</p>
        </div>

        <ChevronDown
          className={`h-4 w-4 text-gray-500 transition-transform duration-200 ${
            isOpen ? "rotate-180" : ""
          }`}
        />
      </button>

      {/* Dropdown Menu */}
      {isOpen && (
        <div className="absolute right-0 mt-2 w-56 bg-white rounded-xl shadow-lg border border-gray-100 py-2 z-50">
          {/* User Info */}
          <div className="px-4 py-3 border-b border-gray-100">
            <div className="flex items-center space-x-3">
              <div className="w-10 h-10 rounded-full overflow-hidden border-2 border-gray-200">
                {avatar ? (
                  <img
                    src={avatar}
                    alt={displayName}
                    className="w-full h-full object-cover"
                    onError={(e) => {
                      e.target.src = "https://cdn-icons-png.flaticon.com/512/149/149071.png";
                    }}
                  />
                ) : (
                  <div className="w-full h-full bg-gradient-to-r from-blue-500 to-purple-500 flex items-center justify-center">
                    <span className="text-white text-sm font-semibold">
                      {displayName.charAt(0).toUpperCase()}
                    </span>
                  </div>
                )}
              </div>
              <div className="overflow-hidden">
                <p className="text-sm font-semibold text-gray-900 truncate">{displayName}</p>
                <p className="text-xs text-gray-500 truncate">{email}</p>
              </div>
            </div>
          </div>

          {/* Profile Link */}
          <button
            onClick={() => {
              onToggle(null);
              navigate(userRole === "employer" ? "/employer-profile" : "/profile");
            }}
            className="w-full flex items-center space-x-3 px-4 py-2.5 text-sm text-gray-700 hover:bg-gray-50 transition-colors"
          >
            <User className="h-4 w-4 text-gray-500" />
            <span>Profile</span>
          </button>

          {/* Logout */}
          <button
            onClick={() => {
              onToggle(null);
              handleLogout();
            }}
            className="w-full flex items-center space-x-3 px-4 py-2.5 text-sm text-red-600 hover:bg-red-50 transition-colors"
          >
            <LogOut className="h-4 w-4 text-red-500" />
            <span>Logout</span>
          </button>
        </div>
      )}
    </div>
  );
};

export default ProfileDropdown;