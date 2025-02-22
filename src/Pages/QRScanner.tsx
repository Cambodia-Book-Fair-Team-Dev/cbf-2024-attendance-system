import { useState } from "react";
import { Scanner } from "@yudiel/react-qr-scanner";
import { useDropzone } from "react-dropzone";
import jsQR from "jsqr";
import axios from "axios";
import { API_BASE_URL } from "../api/config";
import ArrowBackIcon from "@mui/icons-material/ArrowBack";

interface Volunteer {
  id: string;
  name: string;
  team: string;
  kh_name: string;
  photo_url: string | null;
}

type EndpointKey = "checkin" | "checkout" | "checkmeal" | "confirmReturn";

const endpointMap: Record<EndpointKey, string> = {
  checkin: `${API_BASE_URL}/checkin`,
  checkout: `${API_BASE_URL}/checkout`,
  checkmeal: `${API_BASE_URL}/checkmeal`,
  confirmReturn: `${API_BASE_URL}/confirm-return`,
};

const QRScanner = () => {
  const [volunteer, setVolunteer] = useState<Volunteer | null>(null);
  const [attendanceStatus, setAttendanceStatus] = useState({
    checked_in: false,
    checked_out: false,
    note: null,
    returning: false,
    meals: {
      breakfast: false,
      lunch: false,
      dinner: false,
    },
  });
  const [showMealOptions, setShowMealOptions] = useState(false);
  const [showReturnConfirmation, setShowReturnConfirmation] = useState(false);
  const [returning, setReturning] = useState(false);
  const [returnNote, setReturnNote] = useState("");
  const [toast, setToast] = useState<{
    message: string;
    type: "success" | "error";
  } | null>(null);
  const [loading, setLoading] = useState<boolean>(false);

  const showToast = (message: string, type: "success" | "error") => {
    setToast({ message, type });
    setTimeout(() => setToast(null), 3000);
  };

  const handleScan = async (scannedData: string) => {
    try {
      const volunteerData = JSON.parse(scannedData);
      setLoading(true);
      const response = await fetch(`${API_BASE_URL}/scan`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(volunteerData),
      });

      const data = await response.json();
      setLoading(false);

      if (response.ok) {
        setVolunteer({
          id: data.id,
          name: data.name,
          kh_name: data.kh_name,
          team: data.team,
          photo_url: data.photo_url,
        });
        setAttendanceStatus(data.attendance_status);
        showToast("Volunteer scanned successfully!", "success");
      } else {
        showToast(data.detail || "Error scanning volunteer", "error");
      }
    } catch {
      setLoading(false);
      showToast("Invalid QR code format.", "error");
    }
  };

  const handleAction = async (
    action: EndpointKey,
    mealType?: string,
    returning?: boolean,
    note?: string
  ) => {
    const endpoint = endpointMap[action];
    if (!endpoint || !volunteer) return;

    try {
      setLoading(true);
      const response = await axios.post(
        endpoint,
        action === "checkmeal"
          ? { volunteer_id: volunteer.id, meal_type: mealType }
          : action === "checkout"
          ? { volunteer_id: volunteer.id, returning, note }
          : { volunteer_id: volunteer.id }
      );

      const data = response.data;
      setLoading(false);

      if (action === "checkmeal" && mealType) {
        showToast(`${mealType} meal checked successfully!`, "success");
        setAttendanceStatus((prevStatus) => ({
          ...prevStatus,
          meals: { ...prevStatus.meals, [mealType]: true },
        }));
        handleBack();
      } else if (action === "checkin") {
        setAttendanceStatus(data.attendance_status);
        showToast("Check-in successful!", "success");
        handleBack();
      } else if (action === "checkout") {
        showToast("Check-out successful!", "success");
        setTimeout(() => {
          handleBack();
        }, 2000);
      }
    } catch {
      setLoading(false);
      showToast("An error occurred. Please try again.", "error");
    }
  };

  const handleCheckout = async () => {
    if (!returning) {
      await handleAction("checkout", undefined, false);
    } else {
      await handleAction("checkout", undefined, true, returnNote);
    }
    setShowReturnConfirmation(false);
    setReturnNote("");
  };

  const handleBack = () => {
    setVolunteer(null);
    setAttendanceStatus({
      checked_in: false,
      checked_out: false,
      note: null,
      returning: false,
      meals: {
        breakfast: false,
        lunch: false,
        dinner: false,
      },
    });
    setShowMealOptions(false);
  };

  const { getRootProps, getInputProps } = useDropzone({
    accept: { "image/*": [] },
    multiple: false,
    onDrop: (acceptedFiles) => {
      const file = acceptedFiles[0];
      const reader = new FileReader();

      reader.onload = (event) => {
        const img = new Image();
        img.onload = () => {
          const canvas = document.createElement("canvas");
          const context = canvas.getContext("2d");

          if (context) {
            canvas.width = img.width;
            canvas.height = img.height;
            context.drawImage(img, 0, 0, img.width, img.height);

            const imageData = context.getImageData(
              0,
              0,
              canvas.width,
              canvas.height
            );
            const code = jsQR(imageData.data, canvas.width, canvas.height);

            if (code) {
              handleScan(code.data);
              showToast(
                "QR code successfully scanned from the image!",
                "success"
              );
            } else {
              showToast("Unable to decode QR code from the image.", "error");
            }
          }
        };
        img.src = event.target?.result as string;
      };

      reader.readAsDataURL(file);
    },
  });

  return (
    <div className="min-h-screen bg-gray-100 flex items-start justify-center p-6 mt-6">
      <div className="relative bg-white border-2 border-gray-300 p-3 w-11/12 sm:w-11/12 md:w-10/12 lg:w-3/4 xl:w-1/3 flex flex-col items-center justify-center rounded-lg shadow-lg mx-auto">
        {toast && (
          <div
            className={`fixed bottom-5 left-1/2 transform -translate-x-1/2 p-3 ${
              toast.type === "success" ? "bg-green-500" : "bg-red-500"
            } text-white rounded-lg shadow-lg z-50 transition-opacity duration-300`}
          >
            {toast.message}
          </div>
        )}
        {loading && (
          <div className="flex justify-center items-center">
            <div className="animate-spin rounded-full h-10 w-10 border-b-2 border-blue-500"></div>
          </div>
        )}
        {!volunteer ? (
          <>
            <h1 className="text-2xl font-bold text-gray-800 mb-6 text-center font-kantumruy">
              ស្គែនកាតអ្នកស្ម័គ្រចិត្ត
            </h1>
            <div className="mb-6">
              <Scanner
                onScan={(result) =>
                  result && handleScan(result[0]?.rawValue || "")
                }
                classNames={{ container: "w-full" }}
              />
            </div>
            <div
              {...getRootProps()}
              className="border-2 border-dashed border-blue-500 rounded-lg p-6 text-center cursor-pointer bg-blue-50 transition-all duration-300 hover:bg-blue-100 hover:border-blue-700"
            >
              <input {...getInputProps()} />
              <p className="text-gray-600">
                Drag & drop an image with a QR code here, or{" "}
                <span className="text-blue-500 underline">
                  click to select a file
                </span>
              </p>
            </div>
          </>
        ) : (
          <>
            <div className="relative w-full flex items-center justify-center mb-6">
              <button
                onClick={handleBack}
                className="absolute left-0 top-1/2 transform -translate-y-1/2 text-gray-500 hover:text-gray-700 transition-colors duration-300"
                aria-label="Go back to scan page"
              >
                <ArrowBackIcon />
              </button>
              <h2 className="text-2xl font-bold text-gray-800">
                Volunteer Information
              </h2>
            </div>

            <div className="flex flex-col items-center mb-6">
              <img
                src={
                  volunteer.photo_url
                    ? `${API_BASE_URL}${volunteer.photo_url}`
                    : "https://i.pinimg.com/originals/f1/0f/f7/f10ff70a7155e5ab666bcdd1b45b726d.jpg"
                }
                alt={volunteer.name}
                className="w-32 h-32 object-cover rounded-full border-4 border-blue-500 mb-4"
              />
              <h3 className="text-2xl font-bold text-gray-800 font-kantumruy mb-1">
                {volunteer.kh_name}
              </h3>
              <h3 className="text-xl text-gray-600 mb-1">{volunteer.name}</h3>
              <h3 className="text-lg text-gray-500">Team: {volunteer.team}</h3>
            </div>

            <div className="space-y-4">
              {!attendanceStatus.checked_in ? (
                <button
                  className="w-full py-2 px-4 bg-blue-500 text-white rounded-lg transition-all duration-300 hover:bg-blue-600 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-opacity-50"
                  onClick={() => handleAction("checkin")}
                >
                  Check-In
                </button>
              ) : (
                <>
                  <button
                    className="w-full py-2 px-4 bg-green-500 text-white rounded-lg transition-all duration-300 hover:bg-green-600 focus:outline-none focus:ring-2 focus:ring-green-500 focus:ring-opacity-50"
                    onClick={() => setShowMealOptions(true)}
                  >
                    Check Meal
                  </button>
                  <button
                    className="w-full py-2 px-4 bg-red-500 text-white rounded-lg transition-all duration-300 hover:bg-red-600 focus:outline-none focus:ring-2 focus:ring-red-500 focus:ring-opacity-50"
                    onClick={() => setShowReturnConfirmation(true)}
                  >
                    Check-Out
                  </button>
                  {attendanceStatus.checked_out &&
                    attendanceStatus.returning && (
                      <button
                        className="w-full py-2 px-4 bg-blue-500 text-white rounded-lg transition-all duration-300 hover:bg-blue-600 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-opacity-50"
                        onClick={() => handleAction("checkin")}
                      >
                        Check-In Again
                      </button>
                    )}
                </>
              )}
            </div>

            {showMealOptions && (
              <div className="mt-6 space-y-3">
                <h3 className="text-xl font-semibold text-gray-800 mb-3">
                  Check Meal
                </h3>
                {["breakfast", "lunch", "dinner"].map((meal) => (
                  <button
                    key={meal}
                    className={`w-full py-2 px-4 rounded-lg transition-all duration-300 ${
                      attendanceStatus.meals[
                        meal as keyof typeof attendanceStatus.meals
                      ]
                        ? "bg-gray-300 text-gray-500 cursor-not-allowed"
                        : "bg-blue-500 text-white hover:bg-blue-600 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-opacity-50"
                    }`}
                    onClick={() => handleAction("checkmeal", meal)}
                    disabled={
                      attendanceStatus.meals[
                        meal as keyof typeof attendanceStatus.meals
                      ]
                    }
                  >
                    {meal.charAt(0).toUpperCase() + meal.slice(1)}
                  </button>
                ))}
              </div>
            )}
          </>
        )}
      </div>

      {showReturnConfirmation && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
          <div className="bg-white p-6 rounded-lg shadow-xl">
            <div className="flex items-center justify-between mb-4">
              <button
                onClick={() => setShowReturnConfirmation(false)}
                className="text-gray-500 hover:text-gray-700 transition-colors"
              >
                <ArrowBackIcon />
              </button>
              <h3 className="text-xl font-semibold text-gray-800">
                Will you return today?
              </h3>
            </div>
            <div className="flex space-x-4">
              <button
                className="flex-1 py-2 px-4 bg-green-500 text-white rounded-lg transition-all duration-300 hover:bg-green-600 focus:outline-none focus:ring-2 focus:ring-green-500 focus:ring-opacity-50"
                onClick={() => {
                  setReturning(true);
                  setShowReturnConfirmation(false);
                }}
              >
                Yes
              </button>
              <button
                className="flex-1 py-2 px-4 bg-red-500 text-white rounded-lg transition-all duration-300 hover:bg-red-600 focus:outline-none focus:ring-2 focus:ring-red-500 focus:ring-opacity-50"
                onClick={() => {
                  setReturning(false);
                  handleCheckout();
                }}
              >
                No
              </button>
            </div>
          </div>
        </div>
      )}

      {returning && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
          <div className="bg-white p-6 rounded-lg shadow-xl w-full max-w-md">
            <div className="flex items-center justify-between mb-4">
              <button
                onClick={() => setReturning(false)}
                className="text-gray-500 hover:text-gray-700 transition-colors"
              >
                <ArrowBackIcon />
              </button>
              <h3 className="text-xl font-semibold text-gray-800">
                Add a note for your return
              </h3>
            </div>
            <textarea
              className="w-full p-2 border border-gray-300 rounded-lg mb-4 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-opacity-50"
              placeholder="Add a note for your return"
              value={returnNote}
              onChange={(e) => setReturnNote(e.target.value)}
              rows={4}
            />
            <button
              className="w-full py-2 px-4 bg-blue-500 text-white rounded-lg transition-all duration-300 hover:bg-blue-600 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-opacity-50"
              onClick={handleCheckout}
            >
              Submit
            </button>
          </div>
        </div>
      )}
    </div>
  );
};

export default QRScanner;
