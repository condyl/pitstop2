import { useState, useId } from "react";
import bannerImage from "../assets/Banner.png";

 
const TORONTO_COORDS = { lat: 43.6532, lng: -79.3832 };
   
  
  
import PropTypes from "prop-types";
 
export default function Index({ redirectPath }) {
  const [where, setWhere] = useState("");
  const [mapCenter, setMapCenter] = useState(TORONTO_COORDS);
  const [startDate, setStartDate] = useState("");
  const [startTime, setStartTime] = useState("");
  const [endDate, setEndDate] = useState("");
  const [endTime, setEndTime] = useState("");

  // Generate unique IDs for form fields
  const whereId = useId();
  const startDateId = useId();
  const startTimeId = useId();
  const endDateId = useId();
  const endTimeId = useId();

  // Generate array of time options in 15-minute intervals
  const timeOptions = Array.from({ length: 96 }, (_, i) => {
    const hours = Math.floor(i / 4).toString().padStart(2, "0");
    const minutes = ((i % 4) * 15).toString().padStart(2, "0");
    return `${hours}:${minutes}`;
  });

  const roundTimeToNearest15Minutes = (timeString) => {
    if (!timeString) return "";
    
    const [hours, minutes] = timeString.split(":");
    const totalMinutes = parseInt(minutes);
    const roundedMinutes = Math.round(totalMinutes / 15) * 15;
    
    const finalMinutes = roundedMinutes === 60 ? 0 : roundedMinutes;
    const finalHours = roundedMinutes === 60 ? (parseInt(hours) + 1) % 24 : parseInt(hours);
    
    return `${String(finalHours).padStart(2, "0")}:${String(finalMinutes).padStart(2, "0")}`;
  };  

  const handleSearch = async () => {
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

    const duration = end - start;
    
    // Additional geocode and search logic can be implemented here if needed

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
          <h2 className="text-3xl font-bold text-center text-gray-800 mb-5 leading-relaxed">Find your spot...</h2>
          <div className="space-y-6">
            <div className="overflow-x-auto">
              <div className="grid grid-cols-5 gap-4 min-w-max">
                <div className="flex flex-col">
                  <label htmlFor={whereId} className="text-sm font-medium text-gray-700 mb-1">
                    Location
                  </label>
                  <input
                    id={whereId}
                    type="text"
                    placeholder="Where"
                    value={where}
                    onChange={(e) => setWhere(e.target.value)}
                    className="w-full p-3 border border-gray-300 rounded-xl text-sm outline-none"
                  />
                </div>
                <div className="flex flex-col">
                  <label htmlFor={startDateId} className="text-sm font-medium text-gray-700 mb-1">
                    Start Date
                  </label>
                  <input
                    id={startDateId}
                    type="date"
                    min={new Date().toISOString().split("T")[0]}
                    value={startDate}
                    onChange={(e) => setStartDate(e.target.value)}
                    className="w-full p-3 border border-gray-300 rounded-xl text-sm outline-none"
                  />
                </div>
                <div className="flex flex-col">
                  <label htmlFor={startTimeId} className="text-sm font-medium text-gray-700 mb-1">
                    Start Time
                  </label>
                  <input
                    type="time"
                    id={startTimeId}
                    list="timeOptions"
                    step="900"
                    value={startTime}
                    onChange={(e) => setStartTime(roundTimeToNearest15Minutes(e.target.value))}
                    className="w-full p-3 border border-gray-300 rounded-xl text-sm outline-none"
                  />
                </div>
                <div className="flex flex-col">
                  <label htmlFor={endDateId} className="text-sm font-medium text-gray-700 mb-1">
                    End Date
                  </label>
                  <input
                    id={endDateId}
                    type="date"
                    min={startDate}
                    value={endDate}
                    onChange={(e) => setEndDate(e.target.value)}
                    className="w-full p-3 border border-gray-300 rounded-xl text-sm outline-none"
                  />
                </div>
                <div className="flex flex-col">
                  <label htmlFor={endTimeId} className="text-sm font-medium text-gray-700 mb-1">
                    End Time
                  </label>
                  <input
                    type="time"
                    id={endTimeId}
                    list="timeOptions"
                    step="900"
                    value={endTime}
                    onChange={(e) => setEndTime(roundTimeToNearest15Minutes(e.target.value))}
                    className="w-full p-3 border border-gray-300 rounded-xl text-sm outline-none"
                  />
                </div>
              </div>
            </div>
            {/* Time option datalists */}
            <datalist id="timeOptions">
              {timeOptions.map(time => (
                <option key={time} value={time}>
                  {time}
                </option>
              ))}
            </datalist>
            <div className="flex justify-center mt-6">
              <button
                onClick={handleSearch}
                className="px-6 py-3 bg-blue-500 text-white font-bold rounded-xl shadow hover:bg-blue-600 transition"
              >
                SEARCH
              </button>
            </div>
            {/* OpenStreetMap */}
            <div className="mt-8 rounded-xl overflow-hidden border border-gray-300 shadow-sm">
              <div className="relative w-full" style={{ height: "450px" }}>
                <iframe
                  className="absolute inset-0 w-full h-full"
                  frameBorder="0"
                  scrolling="no"
                  marginHeight="0"
                  marginWidth="0"
                  src={`https://www.openstreetmap.org/export/embed.html?bbox=${TORONTO_COORDS.lng - 0.1},${
                    TORONTO_COORDS.lat - 0.1},${TORONTO_COORDS.lng + 0.1},${TORONTO_COORDS.lat + 0.1}&layer=mapnik`}
                  style={{ filter: "contrast(1.1) brightness(1.1)" }}
                />
              </div>
            </div>
           </div>
        </div>
      </div>
    </div>
  );
}
 
Index.propTypes = {
  redirectPath: PropTypes.string.isRequired
};

Index.defaultProps = {
  redirectPath: "/signed-in"
};
