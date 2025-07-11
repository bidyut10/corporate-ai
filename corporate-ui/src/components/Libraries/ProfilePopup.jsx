import {
  X,
  Mail,
  User,
  UserCheck,
  BriefcaseBusiness,
  UserRoundPen,
} from "lucide-react";
import PropTypes from "prop-types";

const ProfilePopup = ({ isOpen, onClose, name, email, role }) => {
  if (!isOpen) return null;

  const getRoleIcon = (userRole) => {
    switch (userRole?.toLowerCase()) {
      case "employer":
        return <BriefcaseBusiness className="w-4 h-4 text-black" />;
      case "candidate":
        return <UserCheck className="w-4 h-4 text-black" />;
      default:
        return <User className="w-4 h-4 text-black" />;
    }
  };

  const getRoleText = (userRole) =>
    userRole
      ? userRole.charAt(0).toUpperCase() + userRole.slice(1).toLowerCase()
      : "User";

  return (
    <div className="fixed inset-0 z-50">
      <div className="fixed" onClick={onClose} />
      <div className="fixed top-16 right-4 z-60 w-80 max-w-[calc(100vw-2rem)]">
        <div className="bg-white border border-gray-200 rounded-2xl shadow-xl overflow-hidden">
          {/* Header */}
          <div className="px-5 py-4 border-b border-gray-200 flex justify-between items-center">
            <span className="text-base text-black font-normal">Profile</span>
            <button
              onClick={onClose}
              className="p-1 rounded-full hover:bg-gray-100"
            >
              <X className="w-4 h-4 text-black" />
            </button>
          </div>

          {/* Content */}
          <div className="px-6 py-6 grid gap-4">
            {/* Avatar on top */}
            <div className="flex justify-center">
              <div className="w-14 h-14 rounded-full bg-black flex items-center justify-center text-white text-2xl font-medium uppercase">
                {name?.charAt(0) || "U"}
              </div>
            </div>

            {/* Name + Edit */}
            <div className="flex justify-between items-center">
              <p className="text-base text-black font-normal truncate">
                {name}
              </p>
              <button className="p-1 hover:bg-gray-100 rounded">
                <UserRoundPen className="text-black" size={15} />
              </button>
            </div>

            {/* Email */}
            <div className="flex items-center gap-2 text-sm text-black">
              <Mail className="w-4 h-4" />
              <span className="truncate font-normal">{email}</span>
            </div>

            {/* Role */}
            <div className="flex items-center gap-2 text-sm text-black">
              {getRoleIcon(role)}
              <span className="font-normal">{getRoleText(role)}</span>
            </div>

            {/* Divider */}
            <div className="border-t border-gray-200" />

            {/* Status */}
            <div className="flex items-center justify-between text-sm text-black">
              <span>Status</span>
              <div className="flex items-center gap-2">
                <div className="w-2 h-2 bg-green-500 rounded-full" />
                <span>Active</span>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

ProfilePopup.propTypes = {
  isOpen: PropTypes.bool.isRequired,
  onClose: PropTypes.func.isRequired,
  name: PropTypes.string,
  email: PropTypes.string,
  role: PropTypes.oneOf(["candidate", "employer", "Candidate", "Employer"]),
};

export default ProfilePopup;
