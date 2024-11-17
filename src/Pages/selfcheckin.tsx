import React, { useEffect } from "react";

const SelfCheckin: React.FC = () => {
  useEffect(() => {
    const displayMessage = (message: string) => {
      const selfCheckin = document.getElementById("self-checkin");
      if (selfCheckin) {
        selfCheckin.innerHTML = message;
        selfCheckin.style.fontSize = "1.5em";

        setTimeout(() => {
          selfCheckin.innerHTML =
            '<img id="logo" src="./public/cbflogo.png" alt="CBF Logo" /> CBF 2024 Attendance Self Check-In';
          selfCheckin.style.fontSize = "2em";
        }, 5000);
      }
    };

    const submitForm = () => {
      const jsonInput = (
        document.getElementById("json-input") as HTMLInputElement
      ).value;
      let formData;

      try {
        formData = JSON.parse(jsonInput);
      } catch (error) {
        displayMessage("Invalid JSON format");
        return;
      }

      fetch("/api/self_checkins", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(formData),
      })
        .then((response) => response.json())
        .then((data) => {
          if (data.success) {
            displayMessage(
              `<div id="details">Name: ${data.volunteer.name}<br>Team: ${data.volunteer.team}<br>Check-in: ${data.volunteer.check_in_time}</div>`
            );
          } else {
            displayMessage(data.message);
          }
        })
        .catch((error) => {
          displayMessage("Error: " + error);
        });
    };

    document.addEventListener("keydown", function (event) {
      const jsonInput = document.getElementById(
        "json-input"
      ) as HTMLInputElement;

      if (event.key === "Enter") {
        event.preventDefault();
        submitForm();
        jsonInput.value = ""; // Clear the input field after submission
      } else if (event.key !== "Shift" && event.key !== "CapsLock") {
        jsonInput.value += event.key;
      }
    });
  }, []);

  return (
    <div>
      <style>
        {`
          body {
            display: flex;
            align-items: center;
            justify-content: center;
            height: 100vh;
            font-family: Arial, sans-serif;
            text-align: center;
          }
          #photo {
            width: 100px;
            height: 100px;
            margin-bottom: 20px;
          }
          #checkin-form,
          #response {
            display: none;
          }
          #self-checkin {
            font-size: 2em;
            font-weight: bold;
            display: flex;
            flex-direction: column;
            align-items: center;
            justify-content: center;
          }
          #logo {
            width: 250px;
            height: 250px;
            margin-bottom: 20px;
          }
          #details {
            font-size: 1.5em;
          }
        `}
      </style>
      <div id="self-checkin">
        <img id="logo" src="static/assets/cbflogo.png" alt="CBF Logo" />
        CBF 2024 Attendance Self Check-In
      </div>

      <form id="checkin-form">
        <input type="text" id="json-input" name="json-input" required />
      </form>
    </div>
  );
};

export default SelfCheckin;
