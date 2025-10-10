import { GraduationCap, User, LogOut, Menu } from "lucide-react";
import { useAuth } from "../../context/AuthContext";
import Button from "./Button";
import { useState } from "react";

const Header = () => {
  const name = "James Walker";
  const role = "Teacher";
  const { handleLogout } = useAuth();
  const [showMobileMenu, setShowMobileMenu] = useState(false);

  const handleLogoutHandler = () => {
    handleLogout();
  };

  return (
    <header className="w-full bg-white border-b border-gray-200 px-4 py-3">
      <div className="flex items-center justify-between">
        {/* Left: Logo and App Name */}
        <div className="flex items-center gap-3">
          <div className="p-2 bg-blue-50 rounded-lg">
            <GraduationCap className="w-5 h-5 text-blue-600" />
          </div>
          <h1 className="font-heading text-lg font-semibold text-gray-900 hidden sm:block">
            GradeTracker
          </h1>
        </div>

        {/* Mobile Menu Button */}
        <button 
          className="sm:hidden p-2 rounded-md hover:bg-gray-100"
          onClick={() => setShowMobileMenu(!showMobileMenu)}
        >
          <Menu className="w-5 h-5 text-gray-600" />
        </button>

        {/* Desktop User Section */}
        <div className="hidden sm:flex items-center gap-4">
          <div className="flex items-center gap-3">
            <div className="w-8 h-8 flex items-center justify-center rounded-md bg-gray-100">
              <User className="w-4 h-4 text-gray-600" />
            </div>
            <div className="text-right">
              <p className="text-sm font-medium text-gray-900">{name}</p>
              <p className="text-xs text-gray-500">{role}</p>
            </div>
          </div>
          <Button
            onClick={handleLogoutHandler}
            label="Sign out"
            icon={<LogOut className="w-4 h-4" />}
            className="px-3 py-2 text-sm text-gray-600 hover:text-gray-800 hover:bg-gray-50 rounded-md"
            variant="ghost"
          />
        </div>
      </div>

      {/* Mobile Menu Dropdown */}
      {showMobileMenu && (
        <div className="sm:hidden mt-4 pt-4 border-t border-gray-200">
          <div className="flex items-center gap-3 mb-4">
            <div className="w-10 h-10 flex items-center justify-center rounded-md bg-gray-100">
              <User className="w-5 h-5 text-gray-600" />
            </div>
            <div>
              <p className="text-sm font-medium text-gray-900">{name}</p>
              <p className="text-xs text-gray-500">{role}</p>
            </div>
          </div>
          <Button
            onClick={handleLogoutHandler}
            label="Sign out"
            icon={<LogOut className="w-4 h-4" />}
            className="w-full justify-center py-3 text-gray-600 hover:bg-gray-50"
            variant="ghost"
          />
        </div>
      )}
    </header>
  );
};

export default Header;