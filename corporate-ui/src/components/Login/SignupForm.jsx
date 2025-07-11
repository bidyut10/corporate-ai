// eslint-disable-next-line no-unused-vars
import React, { useState } from "react";
import { User, Mail, KeyRound, Check, Eye, EyeOff } from "lucide-react";
import { useSignupValidation } from "../../hooks/useFormValidation";
import { useAuth } from "../../contexts/AuthContext";
import PropTypes from "prop-types";

const SignupForm = ({
  toggleForm,
  onNotification,
}) => {
  const [showPassword, setShowPassword] = useState(false);
  const { signup } = useAuth();

  const {
    name,
    setName,
    email,
    setEmail,
    password,
    setPassword,
    confirmPassword,
    setConfirmPassword,
    errors,
    setErrors,
    isSubmitting,
    setIsSubmitting,
    validateSignup,
  } = useSignupValidation();

  const togglePasswordVisibility = () => {
    setShowPassword(!showPassword);
  };

  const handleSignup = async (e) => {
    e.preventDefault();

    if (validateSignup()) {
      setIsSubmitting(true);

      const userData = {
        name,
        email,
        password,
      };

      const result = await signup(userData);

      setIsSubmitting(false);

      if (result.success) {
        onNotification({
          type: "success",
          message: "Account created successfully! You can now log in.",
        });
        toggleForm();
      } else {
        setErrors({ submit: result.message });
      }
    }
  };

  return (
    <form className="space-y-3" onSubmit={handleSignup}>
      <div className="relative rounded-md shadow-xs shadow-gray-100">
        <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
          <User className="h-5 w-5 text-gray-400" strokeWidth={1.5} />
        </div>
        <input
          id="name"
          name="name"
          type="text"
          autoComplete="name"
          required
          className={`appearance-none block w-full pl-10 px-3 py-2.5 border ${
            errors.name ? "border-red-500" : "border-gray-200"
          } rounded-lg shadow-sm placeholder-gray-400 focus:outline-none focus:ring-purple-400 focus:border-purple-400 text-sm`}
          placeholder="John Doe"
          value={name}
          onChange={(e) => setName(e.target.value)}
        />
        {errors.name && (
          <p className="mt-1 text-xs text-red-500">{errors.name}</p>
        )}
      </div>

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
          onChange={(e) => {
            setEmail(e.target.value);
            if (errors.email) {
              setErrors((prev) => ({ ...prev, email: "" }));
            }
          }}
        />
        {errors.email && (
          <p className="mt-1 text-xs text-red-500">{errors.email}</p>
        )}
      </div>

      <div className="relative rounded-md shadow-xs shadow-gray-100">
        <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
          <KeyRound className="h-5 w-5 text-gray-400" strokeWidth={1.5} />
        </div>
        <input
          id="password"
          name="password"
          type={showPassword ? "text" : "password"}
          autoComplete="new-password"
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

      <div className="relative rounded-md shadow-xs shadow-gray-100">
        <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
          <Check className="h-5 w-5 text-gray-400" strokeWidth={1.5} />
        </div>
        <input
          id="confirmPassword"
          name="confirmPassword"
          type={showPassword ? "text" : "password"}
          autoComplete="new-password"
          required
          className={`appearance-none block w-full pl-10 pr-10 px-3 py-2.5 border ${
            errors.confirmPassword ? "border-red-500" : "border-gray-200"
          } rounded-lg shadow-sm placeholder-gray-400 focus:outline-none focus:ring-purple-400 focus:border-purple-400 text-sm`}
          placeholder="••••••••"
          value={confirmPassword}
          onChange={(e) => setConfirmPassword(e.target.value)}
        />
        {errors.confirmPassword && (
          <p className="mt-1 text-xs text-red-500">{errors.confirmPassword}</p>
        )}
      </div>

      {errors.terms && (
        <p className="mt-1 text-xs text-red-500">{errors.terms}</p>
      )}

      {errors.submit && (
        <p className="text-xs text-red-500 text-center">{errors.submit}</p>
      )}

      <div className="inline-block rounded-[12px] bg-gradient-to-r from-purple-500 via-pink-500 to-red-500 p-[1.5px] w-full">
        <button
          className="bg-black text-white px-6 py-3 rounded-[11px] flex items-center gap-2 justify-center hover:bg-[#181818] transition-all w-full"
          type="submit"
          disabled={isSubmitting}
        >
          {isSubmitting ? "Creating Account..." : "Create Account"}
        </button>
      </div>

      <div className="flex items-center my-3">
        <div className="flex-grow border-t border-gray-200"></div>
        <div className="mx-3 text-xs text-gray-500 font-normal">
          or continue with
        </div>
        <div className="flex-grow border-t border-gray-200"></div>
      </div>
      <p className="mt-4 text-center font-normal text-xs sm:text-sm text-gray-600">
        Already have an account?{" "}
        <button
          type="button"
          onClick={toggleForm}
          className="font-medium text-[#141414] hover:text-[#0f0f0f] transition-colors underline underline-offset-2"
        >
          Sign in now
        </button>
      </p>
    </form>
  );
};

SignupForm.propTypes = {
  toggleForm: PropTypes.func.isRequired,
  onNotification: PropTypes.func.isRequired,
};

export default SignupForm;
