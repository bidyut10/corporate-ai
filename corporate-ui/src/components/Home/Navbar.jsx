import { useState } from "react";
import { Menu, X} from "lucide-react";
import { useAuth } from "../../contexts/AuthContext";
import Logo from "../Libraries/Logo";

const Navbar = () => {
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const { checkAuthAndRedirect } = useAuth();
  
  const navigation = [
    { name: "Features", href: "#features" },
    { name: "How it Works", href: "#how-it-works" },
    { name: "Pricing", href: "#pricing" },
    { name: "Contact", href: "#contact" },
  ];

  const handleLoginClick = async () => {
    await checkAuthAndRedirect('/home');
  };

  return (
    <nav className="fixed top-0 left-0 right-0 z-50">
      <div className="bg-white/70 backdrop-blur-md ">
        <div className="max-w-7xl mx-auto px-4">
          <div className="flex items-center justify-between h-16">
            <div className="flex items-center gap-2 cursor-pointer">
              <div className="w-8 h-8 bg-black flex justify-center items-center rounded-lg p-1.5">
                <Logo/>
              </div>
              <h1 className="text-2xl font-normal">Corporate AI</h1>
            </div>

            <div className="hidden md:flex items-center text-sm font-normal gap-8">
              {navigation.map((item) => (
                <a
                  key={item.name}
                  href={item.href}
                  className="text-sm cursor-pointer text-gray-600 hover:text-gray-900 transition-colors"
                >
                  {item.name}
                </a>
              ))}
              <div className="flex items-center gap-4">
                <div className="inline-block rounded-[10px] bg-gradient-to-r from-purple-500 via-pink-500 to-red-500 p-[1.5px]">
                  <button
                    className="text-sm text-white bg-black px-4 pt-1.5 pb-2 rounded-[9px] hover:bg-[#181818] transition-all"
                    onClick={handleLoginClick}
                  >
                    Log in
                  </button>
                </div>
              </div>
            </div>

            <button
              className="md:hidden"
              onClick={() => setIsMenuOpen(!isMenuOpen)}
            >
              {isMenuOpen ? (
                <X className="w-6 h-6 text-gray-600" />
              ) : (
                <Menu className="w-6 h-6 text-gray-600" />
              )}
            </button>
          </div>
        </div>

        {isMenuOpen && (
          <div className="md:hidden bg-white/70 backdrop-blur-md">
            <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-6 space-y-4">
              {navigation.map((item) => (
                <a
                  key={item.name}
                  href={item.href}
                  className="block text-sm text-gray-600 hover:text-gray-900 transition-colors"
                  onClick={() => setIsMenuOpen(false)}
                >
                  {item.name}
                </a>
              ))}
              <div className="flex items-center gap-4 w-full">
                <div className="w-full inline-block rounded-[10px] bg-gradient-to-r from-purple-500 via-pink-500 to-red-500 p-[1.5px]">
                  <button
                    className="text-sm w-full text-white bg-black px-4 pt-1.5 pb-2 rounded-[9px] hover:bg-[#181818] transition-all"
                    onClick={handleLoginClick}
                  >
                    Log in
                  </button>
                </div>
              </div>
            </div>
          </div>
        )}
      </div>
    </nav>
  );
};

export default Navbar;
