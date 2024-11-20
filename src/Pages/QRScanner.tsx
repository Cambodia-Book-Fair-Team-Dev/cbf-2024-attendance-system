import { useState } from "react";
import { Scanner } from "@yudiel/react-qr-scanner";
import { useDropzone } from "react-dropzone";
import jsQR from "jsqr";
import "./QRScanner.css";
import { API_BASE_URL } from "../api/config";
import ArrowBackIcon from "@mui/icons-material/ArrowBack"; // Import Material UI back icon

interface Volunteer {
  id: string;
  name: string;
  team: string;
}

// Define valid action keys as a union type
type EndpointKey = "checkin" | "checkout" | "checkmeal" | "confirmReturn";

// Define the endpoint map with specific keys
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
  });
  const [showMealOptions, setShowMealOptions] = useState(false);
  const [showReturnConfirmation, setShowReturnConfirmation] = useState(false);
  const [returnNote, setReturnNote] = useState("");
  const [toast, setToast] = useState<{
    message: string;
    type: "success" | "error";
  } | null>(null);
  const [loading, setLoading] = useState<boolean>(false); // Loader state

  // Show toast notifications
  const showToast = (message: string, type: "success" | "error") => {
    setToast({ message, type });
    setTimeout(() => setToast(null), 3000);
  };

  // Handle QR code scan
  const handleScan = async (scannedData: string) => {
    try {
      const volunteerData = JSON.parse(scannedData);
      setLoading(true); // Start loader
      const response = await fetch(`${API_BASE_URL}/scan`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(volunteerData),
      });

      const data = await response.json();
      setLoading(false); // Stop loader

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
      setLoading(false); // Stop loader on error
      console.error("Error parsing scanned data:", error);
      showToast("Invalid QR code format.", "error");
    }
  };

  // Handle actions like Check-In, Check-Out, and Check Meal
  const handleAction = async (action: EndpointKey, mealType?: string) => {
    const endpoint = endpointMap[action];
    if (!endpoint || !volunteer) return;

    try {
      setLoading(true); // Start loader
      const response = await fetch(endpoint, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(
          action === "checkmeal"
            ? { volunteer_id: volunteer.id, meal_type: mealType }
            : { volunteer_id: volunteer.id, note: returnNote }
        ),
      });

      const data = await response.json();
      setLoading(false); // Stop loader

      if (response.ok) {
        showToast(data.message, "success");
        if (action === "checkin")
          setAttendanceStatus((prev) => ({ ...prev, checked_in: true }));
        if (action === "checkout") setShowReturnConfirmation(true);
      } else {
        showToast(data.detail || "Error performing action", "error");
      }
    } catch (error) {
      setLoading(false); // Stop loader on error
      console.error("Error:", error);
      showToast("An error occurred. Please try again.", "error");
    }
  };

  // Reset state when Back icon is clicked
  const handleBack = () => {
    setVolunteer(null); // Clear volunteer data
    setAttendanceStatus({
      checked_in: false,
      checked_out: false,
      note: null,
      returning: false,
    });
    setShowMealOptions(false);
    setShowReturnConfirmation(false);
    setReturnNote("");
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
    <div className="qr-scanner-container">
      {toast && <div className={`toast ${toast.type}`}>{toast.message}</div>}
      {loading && <div className="loader">Loading...</div>}{" "}
      {/* Display loader */}
      {!volunteer ? (
        <>
          <h1>Scan Volunteer Card</h1>
          <Scanner
            onScan={(result) => result && handleScan(result[0]?.rawValue || "")}
          />
          <div {...getRootProps()} className="dropzone">
            <input {...getInputProps()} />
            <p>
              Drag & drop an image with a QR code here, or{" "}
              <span style={{ textDecoration: "underline", cursor: "pointer" }}>
                click to select a file
              </span>
            </p>
          </div>
        </>
      ) : (
        <>
          <div className="volunteer-header">
            <ArrowBackIcon
              className="back-icon"
              onClick={handleBack}
              aria-label="Go back to scan page"
            />
            <h2>Volunteer Information</h2>
          </div>

          <h3>Name: {volunteer.name}</h3>
          <h3>Team: {volunteer.team}</h3>

          {!attendanceStatus.checked_in && (
            <button onClick={() => handleAction("checkin")}>Check-In</button>
          )}

          {attendanceStatus.checked_in && !attendanceStatus.checked_out && (
            <>
              <button onClick={() => setShowMealOptions(true)}>
                Check Meal
              </button>
              <button onClick={() => handleAction("checkout")}>
                Check-Out
              </button>
            </>
          )}

          {showMealOptions && (
            <div className="meal-options">
              <button onClick={() => handleAction("checkmeal", "breakfast")}>
                Breakfast
              </button>
              <button onClick={() => handleAction("checkmeal", "lunch")}>
                Lunch
              </button>
              <button onClick={() => handleAction("checkmeal", "dinner")}>
                Dinner
              </button>
            </div>
          )}

          {showReturnConfirmation && (
            <div className="return-confirmation">
              <p>Will you return today?</p>
              <button
                onClick={() => {
                  setShowReturnConfirmation(false);
                  setAttendanceStatus((prev) => ({ ...prev, returning: true }));
                }}
              >
                Yes
              </button>
              <button onClick={handleBack}>No</button>
            </div>
          )}

          {attendanceStatus.returning && (
            <div className="return-note">
              <textarea
                placeholder="Add a note for your return"
                value={returnNote}
                onChange={(e) => setReturnNote(e.target.value)}
              />
              <button onClick={() => handleAction("checkin")}>
                Re-Check-In
              </button>
            </div>
          )}
        </>
      )}
    </div>
  );
};

export default QRScanner;
