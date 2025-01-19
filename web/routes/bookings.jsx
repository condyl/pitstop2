import { useFindMany, useUser } from "@gadgetinc/react";
import { api } from "../api";
import { Link } from "react-router-dom";
import gradient from "../assets/gradient.png";

function formatDate(dateString) {
  return new Date(dateString).toLocaleString();
}

function BookingCard({ booking }) {
  return (
    <div className="bg-white rounded-lg shadow-md hover:shadow-lg transition-shadow duration-200 p-6">
      <div className="flex justify-between items-start mb-4">
        <div>
          <h3 className="text-lg font-semibold">{booking.parkingSpace.title}</h3>
          <p className="text-gray-600">{booking.parkingSpace.address}</p>
        </div>
        {booking.parkingSpace.photos?.[0]?.url && (
          <img
            src={booking.parkingSpace.photos[0].url}
            alt={booking.parkingSpace.title}
            className="w-24 h-24 object-cover rounded-lg"
          />
        )}
      </div>

      <div className="space-y-2">
        <div className="grid grid-cols-2 gap-4">
          <div>
            <span className="text-gray-600">Start:</span>
            <span className="ml-2">{formatDate(booking.startDate)}</span>
          </div>
          <div>
            <span className="text-gray-600">End:</span>
            <span className="ml-2">{formatDate(booking.endDate)}</span>
          </div>
        </div>

        <div className="grid grid-cols-2 gap-4">
          <div>
            <span className="text-gray-600">Price per Hour:</span>
            <span className="ml-2">${booking.parkingSpace.pricePerHour}</span>
          </div>
          <div>
            <span className="text-gray-600">Price per Day:</span>
            <span className="ml-2">${booking.parkingSpace.pricePerDay}</span>
          </div>
        </div>
      </div>
    </div>
  );
}

export default function Bookings() {
  const user = useUser();

  const [{ data: bookings, fetching, error }] = useFindMany(api.booking, {
    select: {
      id: true,
      startDate: true,
      endDate: true,
      parkingSpace: {
        id: true,
        title: true,
        address: true,
        pricePerHour: true,
        pricePerDay: true,
        photos: {
          url: true
        }
      }
    }
  });

  if (!user) {
    return (
      <main className="min-h-screen" style={{ backgroundImage: `url(${gradient})`, backgroundSize: 'cover' }}>
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
          <div className="bg-white rounded-lg shadow-md p-8">
            <div className="text-center">
              <p className="text-gray-600 mb-4">Please sign in to view your bookings</p>
              <Link to="/sign-in" className="inline-block bg-blue-600 text-white px-6 py-2 rounded-lg hover:bg-blue-700 transition-all duration-200 no-underline">
                Sign In
              </Link>
            </div>
          </div>
        </div>
      </main>
    );
  }

  if (error) {
    return (
      <main className="min-h-screen" style={{ backgroundImage: `url(${gradient})`, backgroundSize: 'cover' }}>
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
          <div className="bg-white rounded-lg shadow-md p-8">
            <div className="text-red-500">Error loading bookings: {error.message}</div>
          </div>
        </div>
      </main>
    );
  }

  return (
    <main className="min-h-screen" style={{ backgroundImage: `url(${gradient})`, backgroundSize: 'cover' }}>
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
        <div className="bg-white rounded-lg shadow-md p-8">
          <div className="mb-6">
            <h1 className="text-2xl font-bold mb-2">My Bookings</h1>
            <Link to="/parking-spaces" className="inline-block bg-blue-600 text-white px-4 py-2 rounded-lg hover:bg-blue-700 transition-all duration-200 no-underline">
              Browse Parking Spaces
            </Link>
          </div>

          {fetching ? (
            <div className="space-y-4">
              {[...Array(3)].map((_, i) => (
                <div key={i} className="animate-pulse bg-gray-100 h-48 rounded-lg"></div>
              ))}
            </div>
          ) : bookings?.length > 0 ? (
            <div className="space-y-4">
              {bookings.map((booking) => (
                <BookingCard key={booking.id} booking={booking} />
              ))}
            </div>
          ) : (
            <div className="text-center py-12">
              <p className="text-gray-600 mb-4">You don't have any bookings yet</p>
              <Link
                to="/parking-spaces"
                className="inline-block bg-blue-600 text-white px-6 py-2 rounded-lg hover:bg-blue-700 transition-all duration-200 no-underline"
              >
                Find Parking Spaces
              </Link>
            </div>
          )}
        </div>
      </div>
    </main>
  );
}
