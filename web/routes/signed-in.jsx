import { useState, useId } from "react";
import bannerImage from "../assets/Banner.png";
 

export default function PitstopLayout() {
  const [where, setWhere] = useState("");
  const [startDate, setStartDate] = useState("");
  const [startTime, setStartTime] = useState("");
  const [endDate, setEndDate] = useState("");
  const [endTime, setEndTime] = useState("");

  const whereId = useId();
  const startDateId = useId();
  const startTimeId = useId();
  const endDateId = useId();
  const endTimeId = useId();

  const handleSearch = () => {
    if (!startDate || !startTime || !endDate || !endTime || !where) {
      alert("Please fill out all fields.");
      return;
    }

    const start = new Date(`${startDate}T${startTime}`);
    const end = new Date(`${endDate}T${endTime}`);

    if (end <= start) {
      alert("End Date/Time must be after Start Date/Time.");
      return;
    }

    const diffInHours = (end - start) / (1000 * 60 * 60);
    alert(
      `Location: ${where}\nStart Date: ${startDate}\nStart Time: ${startTime}\nEnd Date: ${endDate}\nEnd Time: ${endTime}\nDuration (rounded): ${Math.ceil(
        diffInHours
      )} hours`
    );
  };

  return (
    <div className="w-full bg-gray-100 text-gray-800 min-h-screen">
      {/* Banner */}
      <div className="relative h-screen">
        <div className="absolute inset-0">
          <img
            src={bannerImage}
            alt="Pitstop banner"
            className="w-full h-full object-cover"
          />
        </div>
        <div
          className="absolute bottom-[82px] inset-x-0 text-center text-white text-4xl cursor-pointer z-[1]"
          onClick={() =>
            window.scrollTo({
              top: window.innerHeight - 14,
              behavior: "smooth",
            })
          }
        >
          &#x2193;
        </div>
      </div>

      {/* Search Section */}
      <div className="w-full bg-gray-100">
        <div className="max-w-7xl mx-auto p-5">
          <h2 className="text-4xl font-bold text-gray-800 text-center mb-5">Find your spot...</h2>
          <div className="overflow-x-auto">
            <div className="grid grid-cols-5 gap-2 min-w-max">
              <div className="flex flex-col">
                <label htmlFor={whereId} className="mb-2 text-sm font-medium text-gray-700">
                  Location
                </label>
                <input
                  id={whereId}
                  type="text"
                  placeholder="Where"
                  value={where}
                  onChange={(e) => setWhere(e.target.value)}
                  className="p-3 border border-gray-300 rounded-xl text-sm outline-none"
                />
              </div>
              <div className="flex flex-col">
                <label htmlFor={startDateId} className="mb-2 text-sm font-medium text-gray-700">
                  Start Date
                </label>
                <input
                  id={startDateId}
                  type="date"
                  min={new Date().toISOString().split("T")[0]}
                  value={startDate}
                  onChange={(e) => setStartDate(e.target.value)}
                  className="p-3 border border-gray-300 rounded-xl text-sm outline-none"
                />
              </div>
              <div className="flex flex-col">
                <label htmlFor={startTimeId} className="mb-2 text-sm font-medium text-gray-700">
                  Start Time
                </label>
                <input
                  id={startTimeId}
                  type="time"
                  step="300"
                  min="00:00"
                  max="23:55"
                  value={startTime}
                  onChange={(e) => setStartTime(e.target.value)}
                  className="p-3 border border-gray-300 rounded-xl text-sm outline-none"
                />
              </div>
              <div className="flex flex-col">
                <label htmlFor={endDateId} className="mb-2 text-sm font-medium text-gray-700">
                  End Date
                </label>
                <input
                  id={endDateId}
                  type="date"
                  min={startDate}
                  value={endDate}
                  onChange={(e) => setEndDate(e.target.value)}
                  className="p-3 border border-gray-300 rounded-xl text-sm outline-none"
                />
              </div>
              <div className="flex flex-col">
                <label htmlFor={endTimeId} className="mb-2 text-sm font-medium text-gray-700">
                  End Time
                </label>
                <input
                  id={endTimeId}
                  type="time"
                  step="300"
                  min="00:00"
                  max="23:55"
                  value={endTime}
                  onChange={(e) => setEndTime(e.target.value)}
                  className="p-3 border border-gray-300 rounded-xl text-sm outline-none"
                />
              </div>
            </div>
          </div>
          <div className="flex justify-center mt-6">
            <button
              onClick={handleSearch}
              className="px-6 py-3 bg-blue-500 text-white font-bold rounded-xl shadow hover:bg-blue-600 transition"
            >
              SEARCH
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}
