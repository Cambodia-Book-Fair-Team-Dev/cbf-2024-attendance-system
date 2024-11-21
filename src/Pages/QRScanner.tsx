import { useState } from "react";
import { Scanner } from "@yudiel/react-qr-scanner";
import { useDropzone } from "react-dropzone";
import jsQR from "jsqr";
import { API_BASE_URL } from "../api/config";
import ArrowBackIcon from "@mui/icons-material/ArrowBack";

interface Volunteer {
  id: string;
  name: string;
  team: string;
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
          team: data.team,
        });
        setAttendanceStatus(data.attendance_status);
        showToast("Volunteer scanned successfully!", "success");
      } else {
        showToast(data.detail || "Error scanning volunteer", "error");
      }
    } catch (error) {
      setLoading(false);
      console.error("Error parsing scanned data:", error);
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
      const response = await fetch(endpoint, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(
          action === "checkmeal"
            ? { volunteer_id: volunteer.id, meal_type: mealType }
            : action === "checkout"
            ? { volunteer_id: volunteer.id, returning, note }
            : { volunteer_id: volunteer.id }
        ),
      });

      if (!response.ok) {
        const errorData = await response.json();
        showToast(errorData.detail || "Error performing action", "error");
        setLoading(false);
        return;
      }

      setLoading(false);

      if (action === "checkmeal" && mealType) {
        showToast(`${mealType} meal checked successfully!`, "success");
        setAttendanceStatus((prevStatus) => ({
          ...prevStatus,
          meals: { ...prevStatus.meals, [mealType]: true },
        }));
      } else if (action === "checkin") {
        handleBack();
      } else if (action === "checkout") {
        showToast("Check-out successful!", "success");
        setTimeout(() => {
          handleBack();
        }, 2000);
      }
    } catch (error) {
      setLoading(false);
      console.error("Error:", error);
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
    <div className="relative bg-white border-2 border-gray-300 p-3 w-96 flex flex-col items-center justify-center rounded-lg shadow-lg mt-14 mx-auto">
      {toast && (
        <div
          className={`fixed bottom-5 left-1/2 transform -translate-x-1/2 p-2 bg-${
            toast.type === "success" ? "blue-500" : "red-500"
          } text-white rounded shadow-lg z-50`}
        >
          {toast.message}
        </div>
      )}
      {loading && (
        <div className="border-4 border-gray-200 border-t-4 border-t-blue-500 rounded-full w-8 h-8 animate-spin my-2 mx-auto"></div>
      )}
      {!volunteer ? (
        <>
          <h1 className="text-2xl text-gray-800 mb-5">Scan Volunteer Card</h1>
          <Scanner
            onScan={(result) => result && handleScan(result[0]?.rawValue || "")}
          />
          <div
            {...getRootProps()}
            className="border-2 border-dashed border-blue-500 rounded-lg p-5 text-center mt-5 cursor-pointer bg-blue-50 transition-all duration-300 hover:bg-blue-100 hover:border-blue-700"
          >
            <input {...getInputProps()} />
            <p className="text-gray-600">
              Drag & drop an image with a QR code here, or{" "}
              <span className="underline cursor-pointer">
                click to select a file
              </span>
            </p>
          </div>
        </>
      ) : (
        <>
          <div className="relative w-full flex items-center justify-between mb-5">
            <ArrowBackIcon
              className="absolute top-2 left-2 text-gray-800 cursor-pointer transition-all duration-300 hover:text-blue-500 hover:scale-110"
              onClick={handleBack}
              aria-label="Go back to scan page"
            />
            <h2 className="text-xl font-bold text-center text-black-800 w-full">
              Volunteer Information
            </h2>
          </div>
          <div className="flex flex-col items-center">
            <h3 className="text-lg text-gray-800">Name: {volunteer.name}</h3>
            <h3 className="text-lg text-gray-800">Team: {volunteer.team}</h3>
          </div>
          {!attendanceStatus.checked_in ? (
            <button
              className="px-4 py-2 text-white bg-blue-500 rounded-lg transition-all duration-300 hover:bg-blue-700 mt-2"
              onClick={() => handleAction("checkin")}
            >
              Check-In
            </button>
          ) : (
            <>
              <button
                className="px-4 py-2 text-white bg-blue-500 rounded-lg transition-all duration-300 hover:bg-blue-700 mt-2"
                onClick={() => setShowMealOptions(true)}
              >
                Check Meal
              </button>
              <button
                className="px-4 py-2 text-white bg-blue-500 rounded-lg transition-all duration-300 hover:bg-blue-700 mt-2"
                onClick={() => {
                  setShowReturnConfirmation(true);
                }}
              >
                Check-Out
              </button>
              {attendanceStatus.checked_out && attendanceStatus.returning && (
                <button
                  className="px-4 py-2 text-white bg-blue-500 rounded-lg transition-all duration-300 hover:bg-blue-700 mt-2"
                  onClick={() => handleAction("checkin")}
                >
                  Check-In Again
                </button>
              )}
            </>
          )}
          {showMealOptions && (
            <div className="flex flex-col items-center mt-5">
              <button
                className="px-4 py-2 text-white bg-blue-500 rounded-lg transition-all duration-300 hover:bg-blue-700 mt-2"
                onClick={() => handleAction("checkmeal", "breakfast")}
                disabled={attendanceStatus.meals.breakfast}
              >
                Breakfast
              </button>
              <button
                className="px-4 py-2 text-white bg-blue-500 rounded-lg transition-all duration-300 hover:bg-blue-700 mt-2"
                onClick={() => handleAction("checkmeal", "lunch")}
                disabled={attendanceStatus.meals.lunch}
              >
                Lunch
              </button>
              <button
                className="px-4 py-2 text-white bg-blue-500 rounded-lg transition-all duration-300 hover:bg-blue-700 mt-2"
                onClick={() => handleAction("checkmeal", "dinner")}
                disabled={attendanceStatus.meals.dinner}
              >
                Dinner
              </button>
            </div>
          )}
          {showReturnConfirmation && (
            <div className="fixed top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 bg-white p-5 rounded-lg shadow-lg z-50">
              <h3 className="text-lg text-gray-800 mb-3">
                Will you return today?
              </h3>
              <button
                className="px-4 py-2 text-white bg-blue-500 rounded-lg transition-all duration-300 hover:bg-blue-700 mt-2"
                onClick={() => {
                  setReturning(true);
                  setShowReturnConfirmation(false);
                }}
              >
                Yes
              </button>
              <button
                className="px-4 py-2 text-white bg-blue-500 rounded-lg transition-all duration-300 hover:bg-blue-700 mt-2"
                onClick={() => {
                  setReturning(false);
                  handleCheckout();
                }}
              >
                No
              </button>
            </div>
          )}
          {returning && (
            <div className="mt-5 p-3 border border-blue-500 bg-blue-100 rounded-lg">
              <textarea
                className="w-full p-2 border border-gray-300 rounded-lg"
                placeholder="Add a note for your return"
                value={returnNote}
                onChange={(e) => setReturnNote(e.target.value)}
              />
              <button
                className="px-4 py-2 text-white bg-blue-500 rounded-lg transition-all duration-300 hover:bg-blue-700 mt-2"
                onClick={handleCheckout}
              >
                Submit
              </button>
            </div>
          )}
        </>
      )}
    </div>
  );
};

export default QRScanner;
