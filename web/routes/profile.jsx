import { useUser, useSignOut, useAction } from "@gadgetinc/react";
import { api } from "../api";
import userIcon from "../assets/default-user-icon.svg";
import { useState } from "react";
import { Link } from "react-router-dom";
import { ReactLogo } from "../components";

export default function () {
  const user = useUser(api);
  const signOut = useSignOut();
  const [selectedFile, setSelectedFile] = useState(null);
  const [{ fetching: updating }, updateUser] = useAction(api.user.update);

  const handleFileChange = async (event) => {
    const file = event.target.files[0];
    if (file) {
      try {
        await updateUser({
          id: user.id,
          googleImageUrl: null,
          photos: { file },
        });
      } catch (error) {
        console.error("Error uploading file:", error);
      }
    }
    setSelectedFile(null);
  };

  return user ? (
    <div className="min-h-screen bg-[#f2f4f7] p-8">
      <div className="max-w-4xl mx-auto">
        <div className="bg-white rounded-xl shadow-lg p-8 mb-8">
          <h1 className="text-2xl font-bold mb-6 text-center">Profile Details</h1>
          <div className="flex flex-col items-center mb-8">
            <div className="relative group">
              <img
                className="rounded-full w-32 h-32 object-cover border-4 border-gray-200"
                src={user.googleImageUrl ?? userIcon}
                alt="Profile"
              />
              {!user.googleImageUrl && (
                <div className="mt-4 text-center">
                  <input
                    type="file"
                    accept="image/*"
                    onChange={handleFileChange}
                    className="hidden"
                    id="profile-upload"
                  />
                  <label
                    htmlFor="profile-upload"
                  id="profile-upload"
                    className="cursor-pointer bg-[#274598] text-white px-4 py-2 rounded hover:bg-[#1d3470] transition-colors"
                    htmlFor="profile-upload"
                  >
                    {updating ? "Uploading..." : "Upload Photo"}
                  </label>
                </div>
              )}
            </div>
            <div className="grid grid-cols-2 gap-4 w-full max-w-2xl mt-8">
              <div className="text-right font-semibold">User ID:</div>
              <div>{user.id}</div>
              <div className="text-right font-semibold">Name:</div>
              <div>{user.firstName} {user.lastName}</div>
              <div className="text-right font-semibold">Email:</div>
              <div>
                <a href={`mailto:${user.email}`} className="text-blue-600 hover:underline">
                  {user.email}
                </a>
              </div>
              <div className="text-right font-semibold">Member Since:</div>
              <div>{new Date(user.createdAt).toLocaleDateString()}</div>
            </div>
          </div>
        </div>
        <div className="bg-white rounded-xl shadow-lg p-8">
          <h2 className="text-xl font-bold mb-6">Actions</h2>
          <div className="grid gap-4">
          <Link to="/parking-spaces" className="text-[#0000ee]">
            <button className="bg-[#274598] text-white px-4 py-2 rounded hover:bg-[#1d3470] transition-colors w-full text-center">
              View All Parking Spaces
            </button>
          </Link>
          <Link to="/bookings" className="text-[#0000ee]">
            <button className="bg-[#274598] text-white px-4 py-2 rounded hover:bg-[#1d3470] transition-colors w-full text-center">
              View Bookings
            </button>
          </Link>
          <Link to="/new-parking-space" className="text-[#0000ee]">
            <button className="bg-[#274598] text-white px-4 py-2 rounded hover:bg-[#1d3470] transition-colors w-full text-center">
              Add Parking Space
            </button>
          </Link>
          <Link to="/change-password" className="text-[#0000ee]">
            <button className="bg-[#274598] text-white px-4 py-2 rounded hover:bg-[#1d3470] transition-colors w-full text-center">
              Change Password
            </button>
          </Link>
          <button 
            onClick={signOut} 
            className="bg-[#274598] text-white px-4 py-2 rounded hover:bg-[#1d3470] transition-colors w-full"
          >
            Sign Out
          </button>
          </div>
        </div>
      </div>
    </div>
  ) : null;
}
