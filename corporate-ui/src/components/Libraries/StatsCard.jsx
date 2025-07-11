import PropTypes from "prop-types";

const StatsCard = ({ title, value, icon: Icon, color = "purple" }) => {
  const colorClasses = {
    purple: "text-purple-400",
    red: "text-red-400",
    pink: "text-pink-400",
    black: "text-black",
  };

  const bgClasses = {
    purple: "bg-purple-400/10",
    red: "bg-red-400/10",
    pink: "bg-pink-400/10",
    black: "bg-black/10",
  };

  return (
    <div className="bg-white/80 backdrop-blur-sm rounded-2xl border border-gray-100 p-6 hover:shadow-lg transition-all duration-300 hover:scale-105">
      <div className="flex items-center justify-between">
        <div>
          <p className="text-sm font-medium text-gray-600 mb-1">{title}</p>
          <p className="text-3xl font-bold text-black">{value}</p>
        </div>
        <div className={`p-4 rounded-xl ${bgClasses[color]}`}>
          <Icon className={`w-6 h-6 ${colorClasses[color]}`} />
        </div>
      </div>
    </div>
  );
};

StatsCard.propTypes = {
  title: PropTypes.string.isRequired,
  value: PropTypes.oneOfType([PropTypes.string, PropTypes.number]).isRequired,
  icon: PropTypes.elementType.isRequired,
  color: PropTypes.oneOf(["purple", "red", "pink", "black"]),
};

export default StatsCard; 