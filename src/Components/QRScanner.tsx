// QRScanner.tsx
import React, { useState } from "react";
import { QrReader } from "react-qr-reader";

const QRScanner: React.FC = () => {
  const [data, setData] = useState("No result");

  return (
    <div>
      <div style={{ width: "100%" }}>
        <QrReader
          onResult={(result, error) => {
            if (!!result) {
              setData(result?.getText());
            }

            if (!!error) {
              console.info(error);
            }
          }}
          constraints={{ facingMode: "environment" }}
        />
      </div>
      <p>{data}</p>
    </div>
  );
};

export default QRScanner;
