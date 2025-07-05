import { CheckCircle, AlertCircle, X } from "lucide-react";
import PropTypes from "prop-types";

const Notification = ({ type, message, isVisible, onClose }) => {
  if (!isVisible) return null;

  return (
    <div
      className={`fixed top-1 right-1 p-4 rounded-lg shadow-md flex items-center gap-2 animate-fade-in z-50 ${
        type === "success"
          ? "bg-purple-400 text-[#181818]"
          : "bg-red-600 text-white"
      }`}
    >
      {type === "success" ? (
        <CheckCircle size={18} />
      ) : (
        <AlertCircle size={18} />
      )}
      <span className="text-sm font-medium">{message}</span>
      <button onClick={onClose} className="ml-2 opacity-70 hover:opacity-100">
        <X size={16} />
      </button>
    </div>
  );
};

Notification.propTypes = {
  type: PropTypes.oneOf(["success", "error"]).isRequired,
  message: PropTypes.string.isRequired,
  isVisible: PropTypes.bool.isRequired,
  onClose: PropTypes.func.isRequired,
};

export default Notification;