// Core React
import { Suspense, useEffect } from "react";

// Error handling
import { ErrorBoundary } from "react-error-boundary";

// React Router
import {
  Outlet,
  Route,
  RouterProvider,
  createBrowserRouter,
  createRoutesFromElements,
  useLocation,
  Link,
} from "react-router-dom";

// Gadget Auth
import {
  SignedOutOrRedirect,
  SignedOut,
  SignedInOrRedirect,
  SignedIn,
} from "@gadgetinc/react";

// Local imports
import { api } from "../api";
import Index from "../routes/index.jsx";
import ProfilePage from "../routes/profile.jsx";
import SignInPage from "../routes/sign-in.jsx";
import SignUpPage from "../routes/sign-up.jsx";
import ResetPasswordPage from "../routes/reset-password.jsx";
import VerifyEmailPage from "../routes/verify-email.jsx";
import ChangePassword from "../routes/change-password.jsx";
import SignedInPage from "../routes/signed-in.jsx";
import ParkingSpaces from "../routes/parking-spaces.jsx";
import Bookings from "../routes/bookings.jsx";
import NewParkingSpace from "../routes/new-parking-space.jsx";
import NewBooking from "../routes/new-booking.jsx";
import ForgotPassword from "../routes/forgot-password.jsx";
import ChatbotOverlay from "./ChatbotOverlay.jsx";

// Assets
import LogoImage from "../assets/Logo.png";
import ProfileImage from "../assets/Profile.png";
import SignInImage from "../assets/Sign In.png";

const LoadingState = () => (
  <div className="flex items-center justify-center h-screen">
    <div className="animate-spin rounded-full h-16 w-16 border-t-2 border-b-2 border-gray-900"></div>
  </div>
);

const ErrorFallback = ({ error }) => (
  <div className="flex flex-col items-center justify-center h-screen">
    <h2 className="text-2xl font-bold text-red-600 mb-4">Something went wrong</h2>
    <p className="text-gray-600">{error.message}</p>
  </div>
);

const defaultAuthConfig = {
  signInPath: "/sign-in",
  signOutActionApiIdentifier: "signOut",
  defaultRedirectPath: "/parking-spaces",
  ...(window.gadgetConfig?.authentication || {}),
};

const App = () => {
  useEffect(() => {
    document.title = `Home - ${process.env.GADGET_PUBLIC_APP_SLUG} - Gadget`;
  }, []);

  const router = createBrowserRouter(
    createRoutesFromElements(
      <Route path="/" element={<Layout />}> 
        <Route
          index
          element={
            <SignedOutOrRedirect path="/signed-in">
              <Index />
            </SignedOutOrRedirect>
          }
        />
        <Route
          path="signed-in"
          element={
            <SignedInOrRedirect>
              <SignedInPage />
            </SignedInOrRedirect>
          }
        />
        <Route
          path="profile"
          element={
            <SignedInOrRedirect>
              <ProfilePage />
            </SignedInOrRedirect>
          }
        />
        <Route
          path="change-password"
          element={
            <SignedInOrRedirect>
              <ChangePassword />
            </SignedInOrRedirect>
          }
        />
        <Route
          path="forgot-password"
          element={
            <SignedOutOrRedirect>
              <ForgotPassword />
            </SignedOutOrRedirect>
          }
        />
        <Route
          path="sign-in"
          element={
            <SignedOutOrRedirect>
              <SignInPage />
            </SignedOutOrRedirect>
          }
        />
        <Route
          path="sign-up"
          element={
            <SignedOutOrRedirect>
              <SignUpPage />
            </SignedOutOrRedirect>
          }
        />
        <Route path="reset-password" element={<ResetPasswordPage />} />
        <Route path="verify-email" element={<VerifyEmailPage />} />
        <Route path="parking-spaces" element={<ParkingSpaces />} />
        <Route
          path="bookings"
          element={
            <SignedInOrRedirect>
              <Bookings />
            </SignedInOrRedirect>
          }
        />
        <Route
          path="new-parking-space"
          element={
            <SignedInOrRedirect>
              <NewParkingSpace />
            </SignedInOrRedirect>
          }
        />
        <Route
          path="new-booking"
          element={
            <SignedInOrRedirect>
              <NewBooking />
            </SignedInOrRedirect>
          }
        />
      </Route>
    )
  );

  return (
    <ErrorBoundary FallbackComponent={ErrorFallback}>
      <Suspense fallback={<LoadingState />}> 
        <RouterProvider router={router} />
      </Suspense> 
    </ErrorBoundary>
  );
};

 
const Layout = () => {  
  return (
    <>
      <Header />
      <div className="h-[calc(100vh-80px)] mt-20 relative z-0 bg-grid">
        <div className="h-full bg-gradient-radial-custom">
          <div className="font-[system-ui]">
            <Outlet />
          </div>
          <SignedIn>
            <ChatbotOverlay />
          </SignedIn>
        </div>
      </div>
    </>
  );
};

const Header = () => {
  const location = useLocation();

  return (
    <div className="flex bg-[white] w-full h-20 py-[21px] pl-[50px] pr-[49px] justify-between items-center font-[system-ui] fixed top-0 left-0 z-50 text-sm">
      <Link to="/" className="no-underline">
        <img src={LogoImage} alt="PitStop Logo" className="h-[48px] transition-opacity hover:opacity-75" />
      </Link>
      <div className="flex items-center gap-4">
        <SignedIn>
          <Link to="/profile">
            <img src={ProfileImage} alt="Profile" className="h-[36px] transition-opacity hover:opacity-75" />
          </Link>
        </SignedIn>
        <SignedOut>
          {location.pathname === "/" && <Link to="/sign-in" style={{ color: "black" }}>
            <img
              src={SignInImage}
              alt="Sign In"
              className="h-[36px] transition-opacity hover:opacity-75"
            />
          </Link>}
        </SignedOut>
      </div>
    </div>
  );
};

export default App;
