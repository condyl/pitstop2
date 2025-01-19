import { useState, useRef, useEffect, useCallback } from "react";
import { useNavigate } from "react-router-dom";
import { useAction, useUser } from "@gadgetinc/react";
import { api } from "../api";
import { debounce } from "lodash";
import { Groq } from "groq-sdk";
import { GROQ_API_KEY } from "../config";

// Initialize Groq client
const client = new Groq({
  apiKey: GROQ_API_KEY,
  dangerouslyAllowBrowser: true
});

export default function NewParkingSpace() {
  const navigate = useNavigate();
  const user = useUser();
  const [{ error: createError, fetching }, createParkingSpace] = useAction(api.parkingSpace.create);

  const [title, setTitle] = useState("");
  const [description, setDescription] = useState("");
  const [address, setAddress] = useState("");
  const [latitude, setLatitude] = useState("43.6532");
  const [longitude, setLongitude] = useState("-79.3832");
  const [pricePerHour, setPricePerHour] = useState("");
  const [pricePerDay, setPricePerDay] = useState("");
  const [hasRoof, setHasRoof] = useState(false);
  const [canAccomodateLargeVehicles, setCanAccomodateLargeVehicles] = useState(false);
  const [surfaceType, setSurfaceType] = useState("");
  const [photos, setPhotos] = useState(null);
  const [errors, setErrors] = useState({});
  const [analyzing, setAnalyzing] = useState(false);
  const [imagePreview, setImagePreview] = useState(null);
  const [geocoding, setGeocoding] = useState(false);

  const handleAddressChange = useCallback(
    debounce(async (address) => {
      if (!address) return;
      if (address.length < 5) {
        return;
      }

      setGeocoding(true);
      setErrors((prev) => ({ ...prev, address: null }));

      try {
        const response = await fetch(
          `https://nominatim.openstreetmap.org/search?addressdetails=0&format=json&q=${encodeURIComponent(
            address
          )}`
        );

        if (!response.ok) {
          throw new Error("Geocoding failed");
        }

        const data = await response.json();

        if (data && data.length > 0) {
          setLatitude(data[0].lat);
          setLongitude(data[0].lon);
          //setAddress(data[0].display_name);
        } else {
          setErrors((prev) => ({
            ...prev,
            address: "Could not find location. Please check the address."
          }));
        }
      } catch (error) {
        console.error("Geocoding error:", error);
        setErrors((prev) => ({
          ...prev,
          address: "Error finding location. Please try again."
        }));
      } finally {
        setGeocoding(false);
      }
    }, 1000),
    []
  );

  useEffect(() => {
    window.scrollTo({ top: 0, behavior: 'smooth' });
  }, []);

  const handleImageUpload = async (e) => {
    const file = e.target.files[0];
    if (!file) return;

    setPhotos(file);
    setAnalyzing(true);

    // Create image preview
    const reader = new FileReader();
    reader.onload = () => {
      setImagePreview(reader.result);
    };
    reader.readAsDataURL(file);

    try {
      const reader = new FileReader();
      const imageData = await new Promise((resolve, reject) => {
        reader.onload = () => resolve(reader.result);
        reader.onerror = reject;
        reader.readAsDataURL(file);
      });

      // Call Groq API for image analysis
      const completion = await client.chat.completions.create({
        model: "llama-3.2-90b-vision-preview",
        messages: [
          {
            role: "user",
            content: [
              {
                type: "text",
                text: "I need you to analyse these specific objects in this photo in JSON format. Focus specifically on the parking spot. Do not give the parking spot any type of numeric name (e.g. zone 5) UNLESS there is a clear indication of that number that is relevant to the parking spot. I want you to be positive about the parking spot.  Do not just analyse what you see in the image and respond with that. Do not mention the availability of the parking spot, as this will be the users PERSONAL parking spot.  Do not mention any type of maintenance that needs to be done to the parking spot. Do not mention any visible vehicles in the image, as they will not always be there and do not effect the parking spot itself. Format it like a description for a product listing. dont bring attention to the parking lines. surfaceType (use one from the list, or write your answer if its not on the list): 'asphalt', 'concrete', 'gravel', 'dirt', 'grass', 'other' | description (describe the spot in a few short, overly descriptive sentences): string | title (a short title for the spot): string | canAccomodateLargeVehicles (true/false): boolean | hasRoof (true/false) (if it has any sort of covering, write true, otherwise false): boolean"
              },
              {
                type: "image_url",
                image_url: {
                  url: imageData
                }
              }
            ]
          }
        ],
        temperature: 1,
        max_completion_tokens: 1024,
        top_p: 1,
        stream: false,
        response_format: { type: "json_object" },
        stop: null
      });

      const groqAnalysis = typeof completion.choices[0].message.content === 'string'
        ? JSON.parse(completion.choices[0].message.content)
        : completion.choices[0].message.content;

      // Update form values with AI analysis
      if (groqAnalysis) {
        setSurfaceType(groqAnalysis.surfaceType || "");
        setCanAccomodateLargeVehicles(groqAnalysis.canAccomodateLargeVehicles || false);
        setTitle(groqAnalysis.title || "");
        setDescription(groqAnalysis.description || "");
        setHasRoof(groqAnalysis.hasRoof || false);
      }
    } catch (error) {
      console.error("Error analyzing image:", error);
      setErrors({ ...errors, image: "Failed to analyze image" });
    } finally {
      setAnalyzing(false);
    }
  };

  const validate = () => {
    const newErrors = {};
    if (!title) newErrors.title = "Title is required";
    if (title.length > 100) newErrors.title = "Title must be less than 100 characters";
    if (!latitude) newErrors.latitude = "Latitude is required";
    if (latitude < -90 || latitude > 90) newErrors.latitude = "Latitude must be between -90 and 90";
    if (!longitude) newErrors.longitude = "Longitude is required";
    if (longitude < -180 || longitude > 180) newErrors.longitude = "Longitude must be between -180 and 180";
    if (pricePerHour && pricePerHour < 0) newErrors.pricePerHour = "Price per hour must be positive";
    if (pricePerDay && pricePerDay < 0) newErrors.pricePerDay = "Price per day must be positive";
    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!validate()) return;
    await createParkingSpace({
      title,
      description,
      address,
      latitude: parseFloat(latitude),
      longitude: parseFloat(longitude),
      pricePerHour: pricePerHour ? parseFloat(pricePerHour) : null,
      pricePerDay: pricePerDay ? parseFloat(pricePerDay) : null,
      photos: photos ? { file: photos } : null,
      owner: { _link: user.id },
      hasRoof,
      canAccomodateLargeVehicles,
      surfaceType: surfaceType || null,
    });
    navigate("/signed-in");
  };

  return (
    <div className="min-h-screen bg-gray-50">
      <div className="max-w-2xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="py-4 px-4 border-b border-gray-200 bg-white">
          <h1 className="text-2xl font-bold text-gray-900 mb-4">Create New Parking Space</h1>
          <button
            onClick={() => navigate("/signed-in")}
            className="inline-flex items-center px-4 py-2 rounded-md text-sm font-medium text-gray-700 bg-gray-100 hover:bg-gray-200 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-gray-500 transition-colors"
          >
            <span className="mr-2">&larr;</span> Back
          </button>
        </div>


        <div className="bg-white shadow-sm rounded-lg border border-gray-200 p-6 mb-8">
          <div className="flex flex-col items-center justify-center border-2 border-dashed border-gray-300 rounded-lg p-6 bg-gray-50">
            <input
              type="file"
              onChange={handleImageUpload}
              accept="image/*"
              className="hidden"
              id="parking-space-photo"
              disabled={analyzing}
            />
            <label
              htmlFor="parking-space-photo"
              className={`inline-flex items-center px-4 py-2 rounded-md text-sm font-medium ${analyzing
                ? 'bg-gray-100 text-gray-500 cursor-not-allowed'
                : 'bg-blue-600 text-white hover:bg-blue-700 cursor-pointer'
                } focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500 transition-colors`}
            >
              {analyzing ? (
                <>
                  <svg className="animate-spin -ml-1 mr-3 h-5 w-5 text-gray-500" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                    <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                    <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                  </svg>
                  Analyzing Image...
                </>
              ) : (
                <>Upload Parking Space Photo</>
              )}
            </label>
            <p className="text-sm text-gray-500 mt-2">
              Supported formats: JPG, PNG
            </p>
          </div>

          {errors.image && <p className="text-red-500 text-sm mt-1">{errors.image}</p>}

          {/* Image Preview */}
          {imagePreview && (
            <div className="mt-4">
              <p className="text-sm font-medium mb-2">Preview:</p>
              <div className="relative w-full h-48 bg-gray-100 rounded overflow-hidden">
                <img
                  src={imagePreview}
                  alt="Parking space preview"
                  className="w-full h-full object-contain"
                />
              </div>
            </div>
          )}
        </div>


        <div className="bg-white shadow-sm rounded-lg border border-gray-200 p-6">
          <form onSubmit={handleSubmit} className="space-y-6">


            <div>
              <label className="block text-sm font-medium mb-1">Title *</label>
              <input
                type="text"
                value={title}
                onChange={(e) => setTitle(e.target.value)}
                className="w-full p-2 border rounded focus:ring-blue-500 focus:border-blue-500"
              />
              {errors.title && <p className="text-red-500 text-sm mt-1">{errors.title}</p>}
            </div>

            <div>
              <label className="block text-sm font-medium mb-1">Description</label>
              <textarea
                value={description}
                onChange={(e) => setDescription(e.target.value)}
                className="w-full p-2 border rounded focus:ring-blue-500 focus:border-blue-500"
                rows="3"
              />
            </div>

            <div>
              <label className="block text-sm font-medium mb-1">Address</label>
              <input
                type="text"
                value={address}
                onChange={(e) => {
                  setAddress(e.target.value);
                  handleAddressChange(e.target.value);
                }}
                className={`w-full p-2 border rounded focus:ring-blue-500 focus:border-blue-500 transition-colors ${geocoding ? 'bg-gray-50' : ''
                  }`}
                placeholder="Enter address"
                disabled={geocoding}
              />
              {errors.address && <p className="text-red-500 text-sm mt-1">{errors.address}</p>}
              {errors.latitude && <p className="text-red-500 text-sm mt-1">{errors.latitude}</p>}
              {errors.longitude && <p className="text-red-500 text-sm mt-1">{errors.longitude}</p>}
            </div>

            <div className="grid grid-cols-2 gap-4">
              <div>
                <label className="block text-sm font-medium mb-1">Price per Hour</label>
                <input
                  type="number"
                  value={pricePerHour}
                  onChange={(e) => setPricePerHour(e.target.value)}
                  step="0.01"
                  min="0"
                  className="w-full p-2 border rounded focus:ring-blue-500 focus:border-blue-500"
                />
                {errors.pricePerHour && <p className="text-red-500 text-sm mt-1">{errors.pricePerHour}</p>}
              </div>

              <div>
                <label className="block text-sm font-medium mb-1">Price per Day</label>
                <input
                  type="number"
                  value={pricePerDay}
                  onChange={(e) => setPricePerDay(e.target.value)}
                  step="0.01"
                  min="0"
                  className="w-full p-2 border rounded focus:ring-blue-500 focus:border-blue-500"
                />
                {errors.pricePerDay && <p className="text-red-500 text-sm mt-1">{errors.pricePerDay}</p>}
              </div>
            </div>

            <div className="space-y-4">
              <div>
                <label className="block text-sm font-medium mb-1">Surface Type</label>
                <input
                  type="text"
                  value={surfaceType}
                  onChange={(e) => setSurfaceType(e.target.value)}
                  className="w-full p-2 border rounded focus:ring-blue-500 focus:border-blue-500"
                  placeholder="e.g. Concrete, Asphalt, Gravel"
                />
              </div>

              <div className="flex items-center">
                <input
                  type="checkbox"
                  checked={hasRoof}
                  onChange={(e) => setHasRoof(e.target.checked)}
                  className="h-4 w-4 text-blue-600 focus:ring-blue-500 border-gray-300 rounded"
                />
                <label className="ml-2 block text-sm text-gray-900">Has Roof</label>
              </div>

              <div className="flex items-center">
                <input
                  type="checkbox"
                  checked={canAccomodateLargeVehicles}
                  onChange={(e) => setCanAccomodateLargeVehicles(e.target.checked)}
                  className="h-4 w-4 text-blue-600 focus:ring-blue-500 border-gray-300 rounded"
                />
                <label className="ml-2 block text-sm text-gray-900">Can Accommodate Large Vehicles</label>
              </div>

              {createError && (
                <div className="text-red-500 text-sm mt-2">
                  Error creating parking space: {createError.message}
                </div>
              )}

              <div className="mt-6">
                <button
                  type="submit"
                  disabled={fetching}
                  className="w-full bg-blue-600 text-white py-2 px-4 rounded hover:bg-blue-700 disabled:opacity-50"
                >
                  {fetching ? "Creating..." : "Create Parking Space"}
                </button>
              </div>
            </div>
          </form>
        </div>
      </div>
    </div>
  );
}
