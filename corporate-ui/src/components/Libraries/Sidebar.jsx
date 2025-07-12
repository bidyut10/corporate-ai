import { Briefcase, BarChart3, Settings, Menu, X, LogOut } from "lucide-react";
import { useState } from "react";
import PropTypes from "prop-types";
import Logo from "./Logo";
import { useAuth } from "../../contexts/AuthContext";

const Sidebar = ({ activeSection, onSectionChange }) => {
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
  const { logout } = useAuth();

  const menuItems = [
    {
      id: "overview",
      label: "Home",
      icon: BarChart3,
    },
    {
      id: "jobs",
      label: "Jobs",
      icon: Briefcase,
    },
    {
      id: "settings",
      label: "Settings",
      icon: Settings,
    },
  ];

  const handleSectionChange = (sectionId) => {
    onSectionChange(sectionId);
    setIsMobileMenuOpen(false);
  };

  const handleLogout = () => {
    logout();
    setIsMobileMenuOpen(false);
  };

  return (
    <>
      {/* Mobile Menu Button */}
      <button
        className="lg:hidden fixed top-4 left-4 z-50 p-2 rounded-lg bg-white/80 backdrop-blur-sm border border-gray-200"
        onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}
      >
        {isMobileMenuOpen ? (
          <X className="w-5 h-5" />
        ) : (
          <Menu className="w-5 h-5" />
        )}
      </button>

      {/* Mobile Overlay */}
      {isMobileMenuOpen && (
        <div
          className="lg:hidden fixed inset-0 bg-black/50 z-40"
          onClick={() => setIsMobileMenuOpen(false)}
        />
      )}

      {/* Sidebar */}
      <div
        className={`
        fixed lg:static inset-y-0 left-0 z-40
        w-64 bg-[#222222] backdrop-blur-md
        transform transition-transform duration-300 ease-in-out
        ${
          isMobileMenuOpen
            ? "translate-x-0"
            : "-translate-x-full lg:translate-x-0"
        }
      `}
      >
        <div className="flex flex-col h-full">
          {/* Logo */}
          <div className="p-6 pt-20 md:pt-6">
            <div className="flex items-center gap-2">
              <div className="w-7 h-7 bg-white flex justify-center items-center rounded-lg p-1">
                <Logo />
              </div>
              <h1 className="text-xl font-normal text-white">Corporate AI</h1>
            </div>
          </div>

          {/* Navigation - Scrollable */}
          <nav className="flex-1 p-4 space-y-2 overflow-y-auto">
            {menuItems.map((item) => {
              const Icon = item.icon;
              const isActive = activeSection === item.id;

              return (
                <button
                  key={item.id}
                  onClick={() => handleSectionChange(item.id)}
                  className={`
                    w-full flex items-center space-x-3 px-4 py-3 rounded-xl text-left transition-all duration-200
                    ${
                      isActive
                        ? "bg-gray-400/10 text-gray-100 shadow-sm"
                        : "text-gray-400 hover:bg-gray-50 hover:text-black"
                    }
                  `}
                >
                  <Icon size={14} />
                  <span className="font-normal">{item.label}</span>
                </button>
              );
            })}
          </nav>

          {/* Logout Button - Fixed at bottom */}
          <div className="p-4 border-t border-gray-700">
            <button
              onClick={handleLogout}
              className="w-full flex items-center space-x-3 px-4 py-3 rounded-xl text-left transition-all duration-200 text-red-400 hover:bg-red-500/10 hover:text-red-300"
            >
              <LogOut size={14} />
              <span className="font-normal">Logout</span>
            </button>
          </div>
        </div>
      </div>
    </>
  );
};

Sidebar.propTypes = {
  activeSection: PropTypes.string.isRequired,
  onSectionChange: PropTypes.func.isRequired,
};

export default Sidebar; 