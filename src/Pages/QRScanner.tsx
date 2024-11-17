// QRScanner.tsx
import React, { useEffect, useState } from "react";
import { Html5QrcodeScanner } from "html5-qrcode";
import "./QRScanner.css";

const QRScanner: React.FC = () => {
  const [data, setData] = useState("No result");

  useEffect(() => {
    const scanner = new Html5QrcodeScanner(
      "qr-reader",
      { fps: 20, qrbox: 250 },
      false
    );

    scanner.render(
      (decodedText, _decodedResult) => {
        setData(decodedText);
      },
      (error) => {
        console.warn(`QR Code no longer in front of camera. Error = ${error}`);
      }
    );

    return () => {
      scanner.clear().catch((error) => {
        console.error("Failed to clear scanner. Error: ", error);
      });
    };
  }, []);

  return (
    <div className="qr-scanner-container">
      <div id="qr-reader" className="qr-scanner"></div>
      <p>{data}</p>
    </div>
  );
};

export default QRScanner;
