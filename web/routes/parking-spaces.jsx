import { useState, useMemo } from "react";
import { useFindMany } from "@gadgetinc/react";
import { Link } from "react-router-dom";
import { api } from "../api";
import gradient from "../assets/gradient.png";

const ITEMS_PER_PAGE = 25;

function SearchFilters({ onSearchChange, onSortChange, sortBy }) {
  return (
    <div className="mb-6 flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
      <input
        type="text"
        placeholder="Search by title or address..."
        className="w-full sm:w-64 rounded-lg border border-gray-300 bg-white/80 px-4 py-2 focus:border-blue-500 focus:outline-none"
        onChange={(e) => onSearchChange(e.target.value)}
      />
      <div className="flex gap-4">
        <select
          value={sortBy}
          onChange={(e) => onSortChange(e.target.value)}
          className="rounded-lg border border-gray-300 bg-white/80 px-4 py-2 focus:border-blue-500 focus:outline-none"
        >
          <option value="newest">Newest First</option>
          <option value="priceAsc">Price: Low to High</option>
          <option value="priceDesc">Price: High to Low</option>
          <option value="surfaceAsc">Surface Type A-Z</option>
          <option value="surfaceDesc">Surface Type Z-A</option>
        </select>
      </div>
    </div>
  );
}

function ParkingSpaceCard({ space }) {
  const [imageKey, setImageKey] = useState(0);

  console.log('Parking space photos:', space.id, space.photos);

  const refreshImage = async () => {
    try {
      const refreshedSpace = await api.parkingSpace.findOne(space.id);
      if (refreshedSpace?.photos?.[0]?.url) {
        setImageKey(prev => prev + 1);
      }
    } catch (error) {
      console.error('Failed to refresh image URL:', error);
    }
  };

  return (
    <div className="flex flex-col overflow-hidden rounded-lg border border-gray-200 bg-white shadow-md transition-all duration-200 hover:shadow-lg">
      <div className="relative h-48">
        <div className="h-full w-full">
          {space.photos?.url ? (
            <img
              key={imageKey}
              src={space.photos.url}
              alt={space.title}
              className="h-full w-full object-cover"
              onError={async (e) => {
                console.error('Image failed to load:', space.photos.url);
                e.target.onerror = null;
                await refreshImage();
              }}
            />
          ) : (
            <div className="flex h-full w-full items-center justify-center bg-gray-100">
              <span className="text-gray-400">No image available</span>
            </div>
          )}
        </div>
        {!space.availability && 
          <div className="absolute right-2 top-2 rounded-full bg-red-500 px-3 py-1 text-sm text-white">Not Available</div>
        }
      </div>
      <div className="flex flex-1 flex-col p-4">
        <h3 className="mb-2 text-lg font-semibold text-gray-900">{space.title}</h3>
        <p className="mb-4 text-sm text-gray-600">{space.address}</p>
        <div className="mb-4 grid grid-cols-2 gap-2 text-sm">
          <div className="flex items-center gap-2">
            <span className="text-gray-600">Surface:</span>
            <span className="font-medium">{space.surfaceType}</span>
          </div>
          <div className="flex items-center gap-2">
            <span className="text-gray-600">Roof:</span>
            <span className="font-medium">{space.hasRoof ? "☂ Yes" : "No"}</span>
          </div>
          <div className="flex items-center gap-2">
            <span className="text-gray-600">Large Vehicles:</span>
            <span className="font-medium">{space.canAccomodateLargeVehicles ? "✓ Yes" : "No"}</span>
          </div>
          {space.dimensions && typeof space.dimensions === 'object' && (
            <div className="col-span-2 flex items-center gap-2">
              <span className="text-gray-600">Dimensions:</span>
              <span className="font-medium">
                {space.dimensions.length}L x {space.dimensions.width}W x {space.dimensions.height}H
              </span>
            </div>
          )}
        </div>
        <div className="mt-auto space-y-2">
          <div className="flex justify-between text-sm">
            <span className="text-gray-600">Per Hour:</span>
            <span className="font-medium">${space.pricePerHour}</span>
          </div>
          <div className="flex justify-between text-sm">
            <span className="text-gray-600">Per Day:</span>
            <span className="font-medium">${space.pricePerDay}</span>
          </div>
          {space.availability && (
            <Link
              to={`/new-booking?spaceId=${space.id}`}
              className="mt-4 block w-full rounded-lg bg-blue-600 px-4 py-2 text-center text-sm font-semibold text-white transition-colors duration-200 hover:bg-blue-700"
            >
              Book Now
            </Link>
          )}
        </div>
      </div>
    </div>
  );
}

function ParkingSpaceGrid({ spaces, loading }) {
  if (loading) {
    return (
      <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
        {[...Array(6)].map((_, i) => (
          <div
            key={i}
            className="h-96 animate-pulse rounded-lg bg-gray-200"
          ></div>
        ))}
      </div>
    );
  }

  return (
    <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-3">      
      {spaces.map((space) => (
        <ParkingSpaceCard key={space.id} space={space} />
      ))}
    </div>
  );
}

export default function ParkingSpaces() {
  const [searchTerm, setSearchTerm] = useState("");
  const [sortBy, setSortBy] = useState("newest");
  const [cursor, setCursor] = useState(null);

  const options = useMemo(() => {
    const filter = searchTerm
      ? {
          OR: [
            { title: { contains: searchTerm } },
            { address: { contains: searchTerm } },
          ],
        }
      : {};

    const sort = {
      newest: { createdAt: "Descending" },
      priceAsc: { pricePerHour: "Ascending" },
      priceDesc: { pricePerHour: "Descending" },
      surfaceAsc: { surfaceType: "Ascending" },
      surfaceDesc: { surfaceType: "Descending" }
    }[sortBy];

    return {
      filter,
      sort,
      first: ITEMS_PER_PAGE,
      after: cursor,
      select: {
        id: true,
        title: true,
        address: true,
        availability: true,
        pricePerHour: true,
        pricePerDay: true,
        photos: {
          url: true
        },
        description: true,
        dimensions: true,
        hasRoof: true,
        latitude: true,
        canAccomodateLargeVehicles: true,
        longitude: true,
        surfaceType: true,
        owner: {
          id: true,
          firstName: true,
          lastName: true,
          email: true
        }
      }
    };
  }, [searchTerm, sortBy, cursor]);

  const [{ data, fetching, error }] = useFindMany(api.parkingSpace, options);

  if (error) {
    return (
      <div className="p-4 text-center text-red-600">
        Error loading parking spaces: {error.message}
      </div>
    );
  }

  return (
    <main 
      className="min-h-screen bg-cover bg-center bg-fixed"
      style={{ backgroundImage: `url(${gradient})` }}
    >
      <div className="container relative z-10 mx-auto max-w-5xl px-4 py-8">
        <div className="mb-8">
          <h1 className="mb-2 text-3xl font-bold text-gray-900">
            Available Parking Spaces
          </h1>
          <p className="text-gray-600">
            Find and book parking spaces in your area
          </p>
        </div>

        <SearchFilters
          onSearchChange={setSearchTerm}
          onSortChange={setSortBy}
          sortBy={sortBy}
        />

        <ParkingSpaceGrid spaces={data || []} loading={fetching} />

        {data?.hasNextPage && (
          <button
            onClick={() => setCursor(data.endCursor)}
            className="mt-8 rounded-lg bg-blue-600 px-6 py-2 text-sm font-semibold text-white transition-colors duration-200 hover:bg-blue-700"
          >
            Load More
          </button>
        )}
      </div>
    </main>
  );
}
