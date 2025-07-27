import image1 from "../../assets/companies/image1.svg";
import image2 from "../../assets/companies/image2.svg";
import image3 from "../../assets/companies/image3.svg";
import image4 from "../../assets/companies/image4.svg";
const ImageGrid = () => {
  return (
    <div className="group w-full sm:w-auto">
      <div className="flex items-center gap-2">
        <div className="flex -space-x-3">
          <img
            src={image1}
            alt="User"
            className="w-8 h-8 sm:w-10 sm:h-10 rounded-full border-2 border-purple-400 bg-white p-1 shadow-sm transition-transform "
          />
          <img
            src={image3}
            alt="User"
            className="w-8 h-8 sm:w-10 sm:h-10 rounded-full border-2 border-pink-400 bg-white p-1 shadow-sm transition-transform "
          />
          <img
            src={image4}
            alt="User"
            className="w-8 h-8 sm:w-10 sm:h-10 rounded-full border-2 border-red-400 bg-white p-1 shadow-sm transition-transform "
          />
          <img
            src={image2}
            alt="User"
            className="w-8 h-8 sm:w-10 sm:h-10 rounded-full border-2 border-red-600 bg-white p-1 shadow-sm transition-transform "
          />
          <span className="flex items-center justify-center w-8 h-8 sm:w-10 sm:h-10 rounded-full border-2 border-purple-600 bg-white text-xs font-medium text-neutral-900 shadow-sm transition-transform">
            50+
          </span>
        </div>
        <span className="text-xs sm:text-sm text-neutral-400 font-normal">
          Trusted by 50+ companies
        </span>
      </div>
    </div>
  );
};

export default ImageGrid;
