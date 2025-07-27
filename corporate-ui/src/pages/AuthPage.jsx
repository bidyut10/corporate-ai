// eslint-disable-next-line no-unused-vars
import React, { useState } from "react";
import { Link } from "react-router-dom";
import LoginForm from "../components/Login/LoginForm";
import SignupForm from "../components/Login/SignupForm";
import Notification from "../components/Libraries/Notification";
import Logo from "../components/Libraries/Logo";

const AuthPage = () => {
  const [isLogin, setIsLogin] = useState(true);
  const [notification, setNotification] = useState({
    type: null,
    message: "",
    isVisible: false,
  });

  const toggleForm = () => {
    setIsLogin(!isLogin);
  };

  const handleNotification = ({ type, message }) => {
    setNotification({
      type,
      message,
      isVisible: true,
    });

    setTimeout(() => {
      setNotification((prev) => ({
        ...prev,
        isVisible: false,
      }));
    }, 5000);
  };

  const closeNotification = () => {
    setNotification((prev) => ({
      ...prev,
      isVisible: false,
    }));
  };

  return (
    <div className="h-screen flex flex-col justify-center">
      <div className="absolute inset-0 overflow-hidden pointer-events-none">
        <div className="absolute top-20 left-20 w-64 h-64 bg-lime-100 rounded-full opacity-20 blur-xl"></div>
        <div className="absolute bottom-20 right-20 w-80 h-80 bg-cyan-50 rounded-full opacity-20 blur-xl"></div>
        <div className="absolute top-1/2 left-1/3 w-40 h-40 bg-green-200 rounded-full opacity-20 blur-lg"></div>
      </div>

      <div className="sm:mx-auto sm:w-full sm:max-w-md relative z-10">
        <div className="bg-white py-6 px-5 shadow-xl rounded-2xl sm:px-8 border border-neutral-100 mx-4 md:mx-0">
          <div className="sm:mx-auto sm:w-full sm:max-w-md mb-4">
            <Link to="/" className="flex items-center justify-center gap-2">
              <div className="w-10 h-10 sm:w-12 sm:h-12 bg-[#000000] rounded-xl flex items-center justify-center shadow-md">
                <Logo />
              </div>
            </Link>
            <h2 className="mt-4 text-center text-lg font-normal text-neutral-950">
              {isLogin
                ? "Welcome Back to Corporate AI"
                : "Join Corporate AI Today!"}
            </h2>
          </div>

          {isLogin ? (
            <LoginForm
              toggleForm={toggleForm}
              onNotification={handleNotification}
            />
          ) : (
            <SignupForm
              toggleForm={toggleForm}
              onNotification={handleNotification}
            />
          )}
        </div>
      </div>

      <div className="mt-4 text-center text-xs text-neutral-500">
        <p>© 2025 Corporate AI. All rights reserved.</p>
      </div>

      <Notification
        type={notification.type}
        message={notification.message}
        isVisible={notification.isVisible}
        onClose={closeNotification}
      />
    </div>
  );
};

export default AuthPage;