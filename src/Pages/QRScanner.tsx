import { useState } from "react";
import { Scanner } from "@yudiel/react-qr-scanner";
import { useDropzone } from "react-dropzone";
import jsQR from "jsqr";
import "./QRScanner.css";
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
    <div className="qr-scanner-container">
      {toast && <div className={`toast ${toast.type}`}>{toast.message}</div>}
      {loading && <div className="loader">Loading...</div>}
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
          {!attendanceStatus.checked_in ? (
            <button onClick={() => handleAction("checkin")}>Check-In</button>
          ) : (
            <>
              <button onClick={() => setShowMealOptions(true)}>
                Check Meal
              </button>
              <button
                onClick={() => {
                  setShowReturnConfirmation(true);
                }}
              >
                Check-Out
              </button>
              {attendanceStatus.checked_out && attendanceStatus.returning && (
                <button onClick={() => handleAction("checkin")}>
                  Check-In Again
                </button>
              )}
            </>
          )}
          {showMealOptions && (
            <div className="meal-options">
              <button
                onClick={() => handleAction("checkmeal", "breakfast")}
                disabled={attendanceStatus.meals.breakfast}
              >
                Breakfast
              </button>
              <button
                onClick={() => handleAction("checkmeal", "lunch")}
                disabled={attendanceStatus.meals.lunch}
              >
                Lunch
              </button>
              <button
                onClick={() => handleAction("checkmeal", "dinner")}
                disabled={attendanceStatus.meals.dinner}
              >
                Dinner
              </button>
            </div>
          )}
          {showReturnConfirmation && (
            <div className="modal">
              <h3>Will you return today?</h3>
              <button
                onClick={() => {
                  setReturning(true);
                  setShowReturnConfirmation(false);
                }}
              >
                Yes
              </button>
              <button
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
            <div className="return-note">
              <textarea
                placeholder="Add a note for your return"
                value={returnNote}
                onChange={(e) => setReturnNote(e.target.value)}
              />
              <button onClick={handleCheckout}>Submit</button>
            </div>
          )}
        </>
      )}
    </div>
  );
};

export default QRScanner;
