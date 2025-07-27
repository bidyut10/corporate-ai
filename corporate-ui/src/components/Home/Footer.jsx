import { useState } from "react";
import {
  Box,
  GithubIcon,
  Twitter,
  SendHorizonal,
  Mail,
  MapPin,
  Heart,
  ArrowUpRight,
} from "lucide-react";
import Notification from "../Libraries/Notification";
const Footer = () => {

  const handleSubscribe = (e) => {
    e.preventDefault();
    setNotification((prev) => ({
      ...prev,
      isVisible: true,
    }));
  };
  const profilePage = () => {
    window.open("https://bidyutkundu.netlify.app/", "_blank");
  };
    const [notification, setNotification] = useState({
      type: 'success',
      message: "Thanks for subscribing!",
      isVisible: false,
    });

    const closeNotification = () => {
      setNotification((prev) => ({
        ...prev,
        isVisible: false,
      }));
    };
  return (
    <footer id="contact" className="w-full pt-36 text-md bg-white">
      <Notification
        type={notification.type}
        message={notification.message}
        isVisible={notification.isVisible}
        onClose={closeNotification}
      />

      <div className="mx-auto flex justify-center items-center w-full flex-col">
        {/* Main Footer Content */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-12 mb-16  px-4 w-full max-w-7xl">
          {/* Company Info */}
          <div className="space-y-8">
            <div className="space-y-4">
              <p className="text-neutral-950 text-lg max-w-md">
                Corporate AI helps you hire smarter by instantly analyzing
                resumes, scoring candidates, and delivering clear, data-driven
                insights—so you can focus on the best talent.
              </p>
            </div>

            <div className="space-y-4">
              <h3 className="font-normal">Created & Maintained by</h3>
              <div className="flex items-center gap-3">
                <div className="space-y-2">
                  <div
                    className="flex items-center  underline underline-offset-2 cursor-pointer"
                    onClick={profilePage}
                  >
                    <p className="text-md font-medium">Bidyut Kundu</p>
                    <ArrowUpRight size={18} />
                  </div>
                  <p className="text-sm">Founder & Developer</p>
                </div>
              </div>
            </div>

            <div className="space-y-3">
              <div className="flex items-center gap-2 text-neutral-950">
                <MapPin size={16} />
                <span>India</span>
              </div>
              <div className="flex items-center gap-2 text-neutral-950">
                <Mail size={16} />
                <span>bidyut.kundu.dev@gmail.com</span>
              </div>
            </div>
          </div>

          {/* Newsletter & Social */}
          <div className="space-y-8">
            <div className="space-y-4">
              <h3 className="font-normal">Stay Updated</h3>
              <p className="text-neutral-950">
                Get the latest updates about features and improvements
              </p>
              <form onSubmit={handleSubscribe} className="space-y-3">
                <input
                  type="email"
                  placeholder="Enter your email"
                  className="w-full p-3 rounded-xl border border-neutral-200 text-neutral-950 focus:outline-none focus:border-purple-400 transition-colors"
                />
                <div className="inline-block rounded-[12px] bg-gradient-to-r from-purple-500 via-pink-500 to-red-500 p-[1.5px] w-full">
                  <button
                    className="bg-black text-white px-6 py-3 rounded-[11px] flex items-center gap-2 justify-center hover:bg-[#181818] transition-all w-full"
                    type="submit"
                  >
                    <p className="leading-2 text-lg">Subscribe</p>
                    <SendHorizonal size={16} strokeWidth={1.4} />
                  </button>
                </div>
              </form>
            </div>

            <div className="space-y-4">
              <h3 className="font-normal">Connect With Us</h3>
              <div className="flex space-x-4">
                <a
                  href="https://x.com/BidyutKundu12"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="p-2 rounded-lg hover:bg-purple-400 transition-colors"
                >
                  <Twitter className="w-5 h-5 text-neutral-950" />
                </a>
                <a
                  href="https://github.com/bidyut10"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="p-2 rounded-lg hover:bg-purple-400 transition-colors"
                >
                  <GithubIcon className="w-5 h-5 text-neutral-950" />
                </a>
                <a
                  href="https://www.producthunt.com/products/codewise-ai"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="p-2 rounded-lg hover:bg-purple-400 transition-colors"
                >
                  <Box className="w-5 h-5 text-neutral-950" />
                </a>
              </div>
            </div>
          </div>
        </div>

        {/* Bottom Bar */}
        <div className="bg-[#0f0f0f] flex justify-center items-center py-6 w-full">
          <div className="flex flex-col md:flex-row justify-between items-center gap-4 text-xs text-white w-full max-w-7xl px-4">
            <div>
              &copy; {new Date().getFullYear()} Corporate AI. All rights
              reserved.
            </div>
            <div className="flex items-center gap-2">
              <span className="text-white">Founded 2025</span>
              <span>•</span>
              <span className="flex items-center gap-1">
                Made with{" "}
                <Heart size={14} className="text-white fill-[#ffffff]" /> in
                India
              </span>
            </div>
          </div>
        </div>
      </div>
    </footer>
  );
};

export default Footer;
