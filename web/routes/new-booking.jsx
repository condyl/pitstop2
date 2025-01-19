import { useState, useEffect } from "react";
import { useNavigate, useSearchParams, Link } from "react-router-dom";
import { useAction, useFindOne, useUser } from "@gadgetinc/react";
import { api } from "../api";
import gradient from "../assets/gradient.png";

function calculatePrice(startDate, endDate, pricePerHour, pricePerDay) {
  if (!startDate || !endDate || (!pricePerHour && !pricePerDay)) return null;

  const start = new Date(startDate + "T09:00:00");
  const end = new Date(endDate + "T17:00:00");
  const diffHours = (end - start) / (1000 * 60 * 60);
  const diffDays = Math.ceil(diffHours / 24);

  // If booking is less than a day, use hourly rate
  if (diffHours <= 24 && pricePerHour) {
    return diffHours * pricePerHour;
  }
  // Otherwise use daily rate if available, or fallback to hourly
  return pricePerDay ? diffDays * pricePerDay : diffHours * pricePerHour;
}

export default function NewBooking() {
  const navigate = useNavigate();
  const user = useUser();
  const [searchParams] = useSearchParams();
  const spaceId = searchParams.get("spaceId");

  // Redirect if no spaceId is provided
  useEffect(() => {
    if (!spaceId) {
      navigate("/parking-spaces", { replace: true });
    }
  }, [spaceId, navigate]);

  const [startDate, setStartDate] = useState(new Date().toISOString().split('T')[0]);
  const [endDate, setEndDate] = useState(new Date().toISOString().split('T')[0]);
  const [error, setError] = useState("");

  // Only fetch parking space if spaceId exists
  const [{ data: parkingSpace, error: fetchError, fetching: fetchingSpace }] = useFindOne(
    api.parkingSpace,
    spaceId,
    {
      select: {
        id: true,
        title: true,
        address: true,
        pricePerHour: true,
        pricePerDay: true,
        availability: true,
        photos: {
          url: true
        }
      },
      enabled: !!spaceId
    }
  );

  const [{ error: bookingError, fetching: creatingBooking }, createBooking] = useAction(api.booking.create);

  useEffect(() => {
    // Check if space became unavailable
    if (parkingSpace && !parkingSpace.availability) {
      setError("This parking space is no longer available");
    }
  }, [parkingSpace]);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError("");

    if (!user) {
      setError("Please sign in to make a booking");
      return;
    }

    if (!startDate || !endDate) {
      setError("Please select both start and end dates");
      return;
    }

    if (!parkingSpace?.availability) {
      setError("This parking space is no longer available");
      return;
    }

    try {
      const startDateTime = new Date(startDate + "T09:00:00");
      const endDateTime = new Date(endDate + "T17:00:00");
      const now = new Date();

      if (isNaN(startDateTime.getTime()) || isNaN(endDateTime.getTime())) {
        setError("Invalid date format");
        return;
      }

      if (startDateTime < now) {
        setError("Start date must be in the future");
        return;
      }

      if (endDateTime <= startDateTime) {
        setError("End date must be after start date");
        return;
      }

      await createBooking({
        parkingSpace: { _link: spaceId },
        startDate: startDateTime.toISOString(),
        endDate: endDateTime.toISOString(),
        user: { _link: user.id }
      });
      navigate("/bookings");
    } catch (err) {
      console.error("Booking error:", err);
      setError(err.message || "Failed to create booking");
    }
  };

  // Format current date for min attribute
  const currentDate = new Date().toISOString().split('T')[0];

  // Calculate estimated price
  const estimatedPrice = calculatePrice(
    startDate,
    endDate,
    parkingSpace?.pricePerHour,
    parkingSpace?.pricePerDay
  );

  // Show loading state while redirecting
  if (!spaceId) {
    return (
      <main className="min-h-screen bg-cover bg-center" style={{ backgroundImage: `url(${gradient})` }}>
        <div>Redirecting to parking spaces...</div>
      </main>
    );
  }

  if (fetchError) {
    return (
      <main className="min-h-screen bg-cover bg-center" style={{ backgroundImage: `url(${gradient})` }}>
        <div className="text-red-500">Error loading parking space: {fetchError.message}</div>
        <Link to="/parking-spaces" className="text-blue-600 hover:underline block mt-4">
          &larr; Back to Parking Spaces
        </Link>
      </main>
    );
  }

  if (fetchingSpace) {
    return (
      <main className="min-h-screen bg-cover bg-center" style={{ backgroundImage: `url(${gradient})` }}>
        <div className="animate-pulse">
          <div className="h-8 bg-gray-200 rounded w-3/4 mb-4"></div>
          <div className="h-4 bg-gray-200 rounded w-1/2 mb-6"></div>
          <div className="space-y-4">
            <div className="h-40 bg-gray-200 rounded"></div>
            <div className="h-12 bg-gray-200 rounded"></div>
            <div className="h-12 bg-gray-200 rounded"></div>
          </div>
        </div>
      </main>
    );
  }

  if (!parkingSpace) {
    return (
      <main className="min-h-screen bg-cover bg-center" style={{ backgroundImage: `url(${gradient})` }}>
        <div>Loading...</div>
      </main>
    );
  }

  return (
    <main className="min-h-screen bg-cover bg-center py-12" style={{ backgroundImage: `url(${gradient})` }}>
      <div className="mb-6">
        <h1 className="text-2xl font-bold mb-2">Book Parking Space</h1>
        <Link to="/parking-spaces" className="text-blue-600 hover:underline">&larr; Back to Parking Spaces</Link>
      </div>

      <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-6 mb-6">
        <h2 className="text-xl font-semibold mb-4">{parkingSpace.title}</h2>
        <p className="text-gray-600 mb-4">{parkingSpace.address}</p>
        
        {parkingSpace.photos?.[0]?.url && (
          <img
            src={parkingSpace.photos[0].url}
            alt={parkingSpace.title}
            className="w-full h-48 object-cover rounded-lg mb-4"
          />
        )}

        <div className="grid grid-cols-2 gap-4 mb-4">
          <div>
            <span className="text-gray-600">Price per Hour:</span>
            <span className="font-medium ml-2">${parkingSpace.pricePerHour}</span>
          </div>
          <div>
            <span className="text-gray-600">Price per Day:</span>
            <span className="font-medium ml-2">${parkingSpace.pricePerDay}</span>
          </div>
        </div>

        {!parkingSpace.availability && (
          <div className="bg-red-50 border border-red-200 rounded-lg p-4 mb-4">
            <p className="text-red-600">This parking space is no longer available</p>
          </div>
        )}
      </div>

      <form onSubmit={handleSubmit} className="max-w-md mx-auto bg-white p-8 rounded-lg shadow-md space-y-6">
        <div className="grid grid-cols-2 gap-4">
          <div>
            <label className="block text-sm font-medium mb-1">Start Date (9 AM)</label>
            <input
              type="date"
              value={startDate}
              onChange={e => setStartDate(e.target.value)}
              className="w-full p-2 border rounded focus:ring-blue-500 focus:border-blue-500 bg-gray-50"
              min={currentDate}
              disabled={!parkingSpace.availability}
            />
          </div>

          <div>
            <label className="block text-sm font-medium mb-1">End Date (5 PM)</label>
            <input
              type="date"
              value={endDate}
              onChange={e => setEndDate(e.target.value)}
              className="w-full p-2 border rounded focus:ring-blue-500 focus:border-blue-500 bg-gray-50"
              min={startDate || currentDate}
              disabled={!parkingSpace.availability}
            />
          </div>
        </div>

        {estimatedPrice !== null && parkingSpace.availability && (
          <div className="bg-blue-50 border border-blue-200 rounded-lg p-4">
            <p className="text-blue-600">
              Estimated Price: <span className="font-semibold">${estimatedPrice.toFixed(2)}</span>
            </p>
            <p className="text-sm text-blue-500 mt-1">
              Note: All bookings are from 9 AM to 5 PM in the local time zone
            </p>
          </div>
        )}

        {(error || bookingError) && (
          <div className="text-red-500 text-sm">
            {error || bookingError?.message}
          </div>
        )}

        <button
          type="submit"
          disabled={creatingBooking || !parkingSpace.availability || !startDate || !endDate}
          className="w-full bg-gradient-to-r from-blue-600 to-blue-800 text-white py-3 px-4 rounded-lg font-medium hover:from-blue-700 hover:to-blue-900 disabled:opacity-50 transition duration-200"
        >
          {creatingBooking ? "Creating Booking..." : "Book Now"}
        </button>
      </form>
    </main>
  );
}