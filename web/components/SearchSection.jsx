import { useState } from "react";
import { useAuth } from "@gadgetinc/react";

export default function SearchSection({ onSearch, defaultLocation = "" }) {
  const { isSignedIn } = useAuth();
  const [location, setLocation] = useState(defaultLocation);
  const [startDateTime, setStartDateTime] = useState("");
  const [endDateTime, setEndDateTime] = useState("");
  const [errors, setErrors] = useState({});

  const validateForm = () => {
    const newErrors = {};

    if (!location.trim()) {
      newErrors.location = "Location is required";
    }

    if (!startDateTime) {
      newErrors.startDateTime = "Start date and time is required";
    }

    if (!endDateTime) {
      newErrors.endDateTime = "End date and time is required";
    }

    if (startDateTime && endDateTime) {
      const start = new Date(startDateTime);
      const end = new Date(endDateTime);

      if (end <= start) {
        newErrors.endDateTime = "End date/time must be after start date/time";
      }
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = (e) => {
    e.preventDefault();

    if (validateForm()) {
      onSearch({
        location,
        startDateTime,
        endDateTime
      });
    }
  };

  return (
    <div className="w-full max-w-4xl mx-auto p-6 bg-white rounded-lg shadow-md">
      <form onSubmit={handleSubmit} className="space-y-6">
        <div>
          <label 
            htmlFor="location" 
            className="block text-sm font-medium text-gray-700 mb-1"
          >
            Location
          </label>
          <input
            type="text"
            id="location"
            value={location}
            onChange={(e) => setLocation(e.target.value)}
            className="w-full px-4 py-2 border border-gray-300 rounded-md focus:ring-blue-500 focus:border-blue-500"
            placeholder="Enter location"
          />
          {errors.location && (
            <p className="mt-1 text-sm text-red-600">{errors.location}</p>
          )}
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div>
            <label 
              htmlFor="startDateTime" 
              className="block text-sm font-medium text-gray-700 mb-1"
            >
              Start Date & Time
            </label>
            <input
              type="datetime-local"
              id="startDateTime"
              value={startDateTime}
              onChange={(e) => setStartDateTime(e.target.value)}
              className="w-full px-4 py-2 border border-gray-300 rounded-md focus:ring-blue-500 focus:border-blue-500"
            />
            {errors.startDateTime && (
              <p className="mt-1 text-sm text-red-600">{errors.startDateTime}</p>
            )}
          </div>

          <div>
            <label 
              htmlFor="endDateTime" 
              className="block text-sm font-medium text-gray-700 mb-1"
            >
              End Date & Time
            </label>
            <input
              type="datetime-local"
              id="endDateTime"
              value={endDateTime}
              onChange={(e) => setEndDateTime(e.target.value)}
              className="w-full px-4 py-2 border border-gray-300 rounded-md focus:ring-blue-500 focus:border-blue-500"
            />
            {errors.endDateTime && (
              <p className="mt-1 text-sm text-red-600">{errors.endDateTime}</p>
            )}
          </div>
        </div>

        <button type="submit" className="w-full bg-blue-600 text-white py-2 px-4 rounded-md hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2">
          Search Available Spaces
        </button>
      </form>
    </div>
  );
}