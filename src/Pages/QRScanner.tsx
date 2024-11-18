import { useState } from "react";
import { Scanner } from "@yudiel/react-qr-scanner";
import { useDropzone } from "react-dropzone";
import jsQR from "jsqr";
import "./QRScanner.css";
import { API_BASE_URL } from "../api/config";

interface Volunteer {
  id: string;
  name: string;
  team: string;
}

const QRScanner = () => {
  const [volunteer, setVolunteer] = useState<Volunteer | null>(null);
  const [action, setAction] = useState<string>("");
  const [loading, setLoading] = useState<boolean>(false);
  const [error, setError] = useState<string | null>(null);

  const handleScan = async (scannedData: string) => {
    try {
      const volunteerData = JSON.parse(scannedData);

      const response = await fetch(`${API_BASE_URL}/scan`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(volunteerData),
      });

      const data = await response.json();

      if (response.ok) {
        setVolunteer(data);
      } else {
        alert(data.detail || "Error scanning volunteer");
      }
    } catch (error) {
      console.error("Error parsing scanned data:", error);
      alert("Invalid QR code format.");
    }
  };

  const handleAction = async () => {
    const endpoint = {
      checkin: `${API_BASE_URL}/checkin`,
      checkout: `${API_BASE_URL}/checkout`,
      checkmeal: `${API_BASE_URL}/checkmeal`,
    }[action];

    if (!endpoint || !volunteer) return;

    try {
      setLoading(true);
      const response = await fetch(endpoint, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ volunteer_id: volunteer.id }),
      });
      const data = await response.json();
      setLoading(false);

      if (response.ok) {
        alert(data.message);
        setVolunteer(null);
        setAction("");
      } else {
        alert(data.detail || "Error performing action");
      }
    } catch (error) {
      setLoading(false);
      console.error("Error:", error);
      alert("An error occurred while performing the action. Please try again.");
    }
  };

  const onDrop = (acceptedFiles: File[]) => {
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
          } else {
            setError("Unable to decode QR code.");
          }
        }
      };
      img.src = event.target?.result as string;
    };

    reader.readAsDataURL(file);
  };

  const { getRootProps, getInputProps } = useDropzone({
    accept: { "image/*": [] },
    onDrop,
  });

  return (
    <div className="qr-scanner-container">
      {!volunteer ? (
        <>
          <h1>Scan Volunteer Card</h1>
          <Scanner
            onScan={(result) => {
              if (result) handleScan(result[0]?.rawValue || "");
            }}
          />
          <hr /> {}
          <div {...getRootProps()} className="dropzone">
            <input {...getInputProps()} />
            <p>Drag & drop an image here, or click to select a file</p>
          </div>
          {error && <p className="error">{error}</p>}
          {loading && <p>Loading...</p>}
        </>
      ) : (
        <>
          <h2>
            Welcome, {volunteer.name} from Team {volunteer.team}
          </h2>
          <button onClick={() => setAction("checkin")}>Check-In</button>
          <button onClick={() => setAction("checkout")}>Check-Out</button>
          <button onClick={() => setAction("checkmeal")}>Check Meal</button>
        </>
      )}
      {action && volunteer && (
        <div className="modal">
          <h3>
            Confirm {action} for {volunteer.name}?
          </h3>
          <button onClick={handleAction}>Confirm</button>
          <button onClick={() => setAction("")}>Cancel</button>
        </div>
      )}
    </div>
  );
};

export default QRScanner;
