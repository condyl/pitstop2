import { useActionForm } from "@gadgetinc/react";
import { api } from "../api";
import { Link, useLocation } from "react-router-dom";
import { GoogleOAuthButton } from "../components";
import gradientBg from "../assets/gradient.png";
import loginImage from "../assets/Login.png"; 
   
  
export default function () {
  const {
    register,
    submit,
    formState: { errors, isSubmitting },
  } = useActionForm(api.user.signIn);
  const { search } = useLocation();
 
  return (
      <div 
      className="min-h-screen min-w-screen w-full flex items-center justify-center p-6 pt-[50px]"
      style={{
        backgroundImage: `url(${gradientBg})`,
        backgroundSize: 'cover',
        backgroundPosition: 'center center',
        backgroundRepeat: 'no-repeat',
        backgroundColor: 'rgba(255,255,255,0.5)'
      }} 
    >
      <div className="backdrop-blur-2xl bg-white/90 p-8 rounded-2xl shadow-xl ring-1 ring-black/5 max-w-md w-full">
        <div className="flex flex-col items-center mb-3">
          <img
            src={loginImage}
            alt="Login illustration"
            alt="Login illustration" 
            className="w-72 h-auto object-contain"
            loading="eager"
            style={{ maxHeight: '280px', minHeight: '200px' }}
          />
        </div>
        <form className="flex gap-5 flex-col w-full" onSubmit={submit}>
          <GoogleOAuthButton search={search} />
          <div className="flex items-center gap-3">
            <div className="flex-grow h-px bg-gray-200"></div>
            <span className="text-sm text-gray-600 px-2">
              or
            </span>
            <div className="flex-grow h-px bg-gray-200"></div>
          </div>

          <div className="relative">
            <input
              className="w-full px-4 py-3 border border-gray-200 rounded-lg focus:ring-2 focus:ring-blue-400 focus:border-transparent transition-all bg-white/70"
              type="email"
              aria-label="Email address"
              placeholder="Email"
              {...register("email")}
            />
          </div>
          <div className="relative">
            <input
              className="w-full px-4 py-3 border border-gray-200 rounded-lg focus:ring-2 focus:ring-blue-400 focus:border-transparent transition-all bg-white/70"
              aria-label="Password"
              placeholder="Password"
              type="password"
              {...register("password")}
            />
          </div>
          {errors?.root?.message && (
            <p className="text-red-500 text-sm px-1">
              {errors.root.message}
            </p>
          )}
          <div className="mt-2">
            <button
              className="w-full py-3 px-6 text-white font-semibold bg-blue-600 rounded-lg hover:bg-blue-700 focus:ring-2 focus:ring-blue-300 disabled:opacity-50 transition-all"
              disabled={isSubmitting}
              type="submit"
            >
              {isSubmitting ? (
                "Signing in..."
              ) : (
                "Sign in"
              )}
            </button>
            <div className="flex flex-col gap-2 text-sm text-center mt-6">
              <p className="text-gray-600">
                Forgot your password?{" "}
                <Link className="text-blue-500 hover:text-blue-700 transition-colors" to="/forgot-password">
                  Reset password
                </Link>
              </p>
              <p className="text-gray-600">
                Don't have an account?{" "}
                <Link className="text-blue-500 hover:text-blue-700 transition-colors" to="/sign-up">
                  Create account
                </Link>
              </p>
            </div>
          </div>
        </form>
      </div>
    </div>
  );
}
