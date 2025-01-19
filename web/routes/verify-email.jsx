import { api } from "../api";
import { useEffect, useRef } from "react";
import { useLocation, Link } from "react-router-dom";
import { useAction, useAuth } from "@gadgetinc/react";
import gradient from "../assets/gradient.png";

export default function () {
  const location = useLocation();
  const params = new URLSearchParams(location.search);
  const code = params.get("code");
  const [{ error: verifyEmailError, data }, verifyEmail] = useAction(
    api.user.verifyEmail
  );
  const verificationAttempted = useRef(false);
  const { configuration } = useAuth();

  useEffect(() => {
    if (!verificationAttempted.current) {
      code && verifyEmail({ code });
      verificationAttempted.current = true;
    }
  }, []);

  return (
    <div 
      className="min-h-screen flex items-center justify-center py-12 px-4 sm:px-6 lg:px-8"
      style={{ backgroundImage: `url(${gradient})`, backgroundSize: 'cover' }}
    >
      <div className="max-w-md w-full space-y-8 bg-white p-8 rounded-lg shadow-lg">
        {!data && !verifyEmailError && verificationAttempted.current && (
          <div className="text-center">
            <p className="text-gray-600">
              Verifying your email...
            </p>
          </div>
        )}
        
        {verifyEmailError && (
          <div className="text-center p-4 bg-red-50 rounded-md">
            <p className="text-red-600 first-letter:capitalize">
              {verifyEmailError.message}
            </p>
          </div>
        )}
        
        {data && (
          <div className="text-center space-y-4">
            <p className="text-green-600 first-letter:capitalize mb-4">Email has been verified successfully.</p>
            <Link to={configuration.signInPath} className="inline-block px-4 py-2 text-sm font-medium text-white bg-blue-600 hover:bg-blue-700 rounded-md transition-colors">Sign in now</Link>
          </div>
        )}
      </div>
    </div>
  );
}