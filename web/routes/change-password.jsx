import { useUser, useActionForm } from "@gadgetinc/react";
import { api } from "../api";
import { Link } from "react-router-dom";
import gradient from "../assets/gradient.png";
import Change from "../assets/Change.png";

export default function() {
  const user = useUser(api);
  const {
    submit,
    register,
    formState: { errors, isSubmitSuccessful, isSubmitting },
  } = useActionForm(api.user.changePassword, { defaultValues: user });

 
  return (
    <main className="min-h-screen w-full bg-cover bg-center flex items-center justify-center px-4" style={{ backgroundImage: `url(${gradient})` }}>
      <div className="w-full max-w-md p-8 bg-white/70 rounded-xl shadow-xl backdrop-blur-md border border-gray-200">
        {isSubmitSuccessful ? (
          <div className="flex flex-col items-center gap-4">
            <h2 className="text-xl font-semibold text-green-600">Password Changed Successfully</h2>
            <Link 
              to="/profile"
              className="w-full py-2.5 px-4 bg-white hover:bg-gray-50 border border-gray-200 text-gray-700 rounded-lg font-medium text-center transition-colors no-underline"
            >
              Back to Profile
            </Link>
          </div>
        ) : (
          <form className="flex flex-col gap-4 p-4" onSubmit={submit}>
            <img 
              src={Change} 
              alt="Change Password"
              className="w-[600px] h-auto mb-2 mx-auto"
            />
            <input
              className="w-full px-4 py-2.5 text-gray-700 bg-white border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-colors"
              type="password"
              placeholder="Current password"
              {...register("currentPassword")}
            />
            <input
              className="w-full px-4 py-2.5 text-gray-700 bg-white border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-colors"
              type="password"
              placeholder="New password"
              {...register("newPassword")}
            />
            {errors?.user?.password?.message && (
              <p className="text-red-500 text-sm text-center">
                Password: {errors.user.password.message}
              </p>
            )}
            {errors?.root?.message && (
              <p className="text-red-500 text-sm text-center">
                {errors.root.message}
              </p>
            )}
            <div className="flex flex-col gap-3 mt-2">
              <button
                className="w-full py-2.5 px-4 bg-gradient-to-r from-blue-500 to-blue-600 hover:from-blue-600 hover:to-blue-700 text-white rounded-lg font-medium transition-colors"
                disabled={isSubmitting}
                type="submit"
              >
                {isSubmitting ? "Changing Password..." : "Change Password"}
              </button>
              <Link 
                to="/profile"
                className="w-full py-2.5 px-4 bg-white hover:bg-gray-50 border border-gray-200 text-gray-700 rounded-lg font-medium text-center transition-colors no-underline"
              >
                Back to Profile
              </Link>
            </div>
          </form>
        )}
      </div>
    </main>
  );
}
