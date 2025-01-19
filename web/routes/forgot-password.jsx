import { useActionForm } from "@gadgetinc/react";
import { api } from "../api";
import gradient from "../assets/gradient.png";
import Reset from "../assets/Reset.png";

export default function() {
  const {
    submit,
    register,
    formState: { isSubmitSuccessful, isSubmitting },
  } = useActionForm(api.user.sendResetPassword);

  return (
    <div className="min-h-screen flex items-center justify-center bg-cover bg-center px-4"
      style={{ backgroundImage: `url(${gradient})` }}
    >
      <div className="flex flex-col items-center justify-center backdrop-blur-2xl bg-white/90 shadow-xl ring-1 ring-gray-900/5 p-8 rounded-lg w-full max-w-md">
       <img src={Reset} alt="Reset Password" className="w-[370px] h-auto mb-6" />
        {isSubmitSuccessful ? (
          <p className="text-green-600 text-center font-medium">
            Email has been sent. Please check your inbox.
          </p>
        ) : (
          <form className="flex flex-col gap-y-4 w-full" onSubmit={submit}>
            <input
              className="w-full px-4 py-3 text-gray-700 bg-white border rounded-lg focus:outline-none focus:ring-2 hover:ring-2 ring-blue-500 transition-all"
              placeholder="Email"
              type="email"
              {...register("email")}
            />
            <button
              className="w-full px-4 py-3 text-white font-semibold bg-blue-600 rounded-lg hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-blue-500 disabled:opacity-50 transition-all"
              disabled={isSubmitting}
              type="submit"
            >
              {isSubmitting ? "Sending..." : "Send Reset Link"}
            </button>
          </form>
        )}
      </div>
    </div>
  );
}
