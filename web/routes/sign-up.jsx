import { useActionForm } from "@gadgetinc/react";
import { api } from "../api";
import { useLocation } from "react-router-dom";
import { GoogleOAuthButton } from "../components";
import signUpImage from "../assets/signUp.png";
import gradient from "../assets/gradient.png";
  
 
export default function () {
  const {
    register,
    submit,
    formState: { errors, isSubmitting, isSubmitSuccessful },
  } = useActionForm(api.user.signUp);
  const { search } = useLocation();

  return (
    <div className="min-h-screen w-full bg-cover bg-center flex items-center justify-center p-4" style={{ backgroundImage: `url(${gradient})` }}>
      <div className="bg-white rounded-lg shadow-xl p-8 w-full max-w-md">
         <div className="flex flex-col items-center mb-8">
          <img src={signUpImage} alt="Sign Up" className="h-24" />
        </div>
        <div className="mb-6">
          <GoogleOAuthButton search={search} />
        </div>
        <div className="relative mb-6">
          <div className="absolute inset-0 flex items-center"><div className="w-full border-t border-gray-300"></div></div>
          <div className="relative flex justify-center text-sm"><span className="bg-white px-4 text-gray-500">or</span></div>
        </div>
        <form className="flex flex-col gap-4" onSubmit={submit}>
          <div className="grid grid-cols-2 gap-4">
            <div>
              <input
                type="text"
                placeholder="First Name"
                className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent outline-none"
                {...register("firstName")}
              />
              {errors?.user?.firstName?.message && (
                <p className="mt-1 text-sm text-red-600">
                  {errors.user.firstName.message}
                </p>
              )}
            </div>
            <div>
              <input
                type="text"
                placeholder="Last Name"
                className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent outline-none"
                {...register("lastName")}
              />
              {errors?.user?.lastName?.message && (
                <p className="mt-1 text-sm text-red-600">
                  {errors.user.lastName.message}
                </p>
              )}
            </div>
          </div>
          <div>
            <input
              type="email"
              placeholder="Email"
              className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent outline-none"
              {...register("email")}
            />
            {errors?.user?.email?.message && (
              <p className="mt-1 text-sm text-red-600">
                {errors.user.email.message}
              </p>
            )}
          </div>
          <div>
            <input
              type="password"
              placeholder="Password"
              className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent outline-none"
              {...register("password")}
            />
            {errors?.user?.password?.message && (
              <p className="mt-1 text-sm text-red-600">
                {errors.user.password.message}
              </p>
            )}
          </div>
          {errors?.root?.message && (
            <p className="text-sm text-red-600 text-center">
              {errors.root.message}
            </p>
          )}
          {isSubmitSuccessful && (
            <p className="text-sm text-green-600 text-center">
              Please check your inbox to verify your email
            </p>
          )}
          <button
            type="submit"
            disabled={isSubmitting}
            className="w-full py-3 px-4 bg-blue-600 hover:bg-blue-700 text-white font-semibold rounded-lg disabled:opacity-50 transition-colors mt-2"
          >
            {isSubmitting ? "Signing up..." : "Sign Up"}
          </button>
        </form>
      </div>
    </div>
  );}
