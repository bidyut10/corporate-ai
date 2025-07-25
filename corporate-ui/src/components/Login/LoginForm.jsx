// eslint-disable-next-line no-unused-vars
import React, { useState } from "react";
import { Mail, Lock, Eye, EyeOff } from "lucide-react";
import { useLoginValidation } from "../../hooks/useFormValidation";
import { useAuth } from "../../contexts/AuthContext";
import PropTypes from "prop-types";

const LoginForm = ({ toggleForm, onNotification }) => {
  const [showPassword, setShowPassword] = useState(false);

  const { login } = useAuth();

  const {
    email,
    setEmail,
    password,
    setPassword,
    errors,
    setErrors,
    isSubmitting,
    setIsSubmitting,
    validateLogin,
  } = useLoginValidation();

  const togglePasswordVisibility = () => {
    setShowPassword(!showPassword);
  };

  const handleLogin = async (e) => {
    e.preventDefault();

    if (validateLogin()) {
      setIsSubmitting(true);

      const result = await login(email, password);

      setIsSubmitting(false);

      if (result.success) {
        onNotification({
          type: "success",
          message: "Login successful!",
        });
      } else {
        setErrors({ submit: result.message });
      }
    }
  };

  return (
    <form className="space-y-3" onSubmit={handleLogin}>
      <div className="relative rounded-md shadow-xs shadow-gray-100">
        <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
          <Mail className="h-5 w-5 text-gray-400" strokeWidth={1.5} />
        </div>
        <input
          id="email"
          name="email"
          type="email"
          autoComplete="email"
          required
          className={`appearance-none block w-full pl-10 px-3 py-2.5 border ${
            errors.email ? "border-red-500" : "border-gray-200"
          } rounded-lg shadow-sm placeholder-gray-400 focus:outline-none focus:ring-purple-400 focus:border-purple-400 text-sm`}
          placeholder="you@example.com"
          value={email}
          onChange={(e) => setEmail(e.target.value)}
        />
        {errors.email && (
          <p className="mt-1 text-xs text-red-500">{errors.email}</p>
        )}
      </div>

      <div className="relative rounded-md shadow-xs shadow-gray-100">
        <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
          <Lock className="h-5 w-5 text-gray-400" strokeWidth={1.5} />
        </div>
        <input
          id="password"
          name="password"
          type={showPassword ? "text" : "password"}
          autoComplete="current-password"
          required
          className={`appearance-none block w-full pl-10 pr-10 px-3 py-2.5 border ${
            errors.password ? "border-red-500" : "border-gray-200"
          } rounded-lg shadow-sm placeholder-gray-400 focus:outline-none focus:ring-purple-400 focus:border-purple-400 text-sm`}
          placeholder="••••••••"
          value={password}
          onChange={(e) => setPassword(e.target.value)}
        />
        <button
          type="button"
          className="absolute inset-y-0 right-0 pr-3 flex items-center"
          onClick={togglePasswordVisibility}
        >
          {showPassword ? (
            <EyeOff className="h-5 w-5 text-gray-400" strokeWidth={1.5} />
          ) : (
            <Eye className="h-5 w-5 text-gray-400" strokeWidth={1.5} />
          )}
        </button>
        {errors.password && (
          <p className="mt-1 text-xs text-red-500">{errors.password}</p>
        )}
      </div>

      <div className="flex items-center justify-between py-1 mb-1">
        <div className="flex items-center">
          <input
            id="remember-me"
            name="remember-me"
            type="checkbox"
            className="h-4 w-4 text-purple-400 focus:ring-purple-400 border-gray-300 rounded"
          />
          <label
            htmlFor="remember-me"
            className="ml-2 block text-xs sm:text-sm text-gray-700"
          >
            Remember me
          </label>
        </div>
      </div>

      {errors.submit && (
        <p className="text-xs text-red-500 text-center">{errors.submit}</p>
      )}
      <div className="inline-block rounded-[12px] bg-gradient-to-r from-purple-500 via-pink-500 to-red-500 p-[1.5px] w-full">
        <button
          className="bg-black text-white px-6 py-3 rounded-[11px] flex items-center gap-2 justify-center hover:bg-[#181818] transition-all w-full"
          type="submit"
          disabled={isSubmitting}
        >
          {isSubmitting ? "Signing in..." : "Sign In"}
        </button>
      </div>

      <div className="flex items-center my-3">
        <div className="flex-grow border-t border-gray-200"></div>
        <div className="mx-3 text-xs text-gray-500 font-normal">
          or continue with
        </div>
        <div className="flex-grow border-t border-gray-200"></div>
      </div>
      <p className="mt-8 text-center text-xs sm:text-sm font-normal text-gray-600">
        Don&apos;t have an account?{" "}
        <button
          type="button"
          onClick={toggleForm}
          className="font-medium text-[#111111] hover:text-[#000000] transition-colors underline underline-offset-2"
        >
          Sign up now
        </button>
      </p>
    </form>
  );
};

LoginForm.propTypes = {
  toggleForm: PropTypes.func.isRequired,
  onNotification: PropTypes.func.isRequired,
};

export default LoginForm;
