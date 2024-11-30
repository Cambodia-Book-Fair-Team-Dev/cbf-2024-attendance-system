import React, { useEffect, useState } from "react";
import { useParams, useNavigate } from "react-router-dom";
import axios from "axios";
import { API_BASE_URL } from "../api/config";
import Compressor from "compressorjs"; // Import Compressor.js

interface Volunteer {
  id: string;
  name: string;
  kh_name: string;
  team: string;
  photo_url: string | null;
}

const VolunteerProfile: React.FC = () => {
  const { id: encodedId } = useParams<{ id: string }>();
  const [volunteer, setVolunteer] = useState<Volunteer | null>(null);
  const [loading, setLoading] = useState<boolean>(true);
  const [newPhoto, setNewPhoto] = useState<File | null>(null);
  const [uploading, setUploading] = useState<boolean>(false);
  const navigate = useNavigate();

  const id = encodedId ? atob(encodedId) : null;

  useEffect(() => {
    const fetchVolunteer = async () => {
      if (!id) {
        console.error("Volunteer ID is undefined");
        setLoading(false);
        return;
      }

      try {
        const response = await axios.get(`${API_BASE_URL}/volunteers/${id}`);
        setVolunteer(response.data);
      } catch (error) {
        console.error("Error fetching volunteer details:", error);
      } finally {
        setLoading(false);
      }
    };

    fetchVolunteer();
  }, [id]);

  const handlePhotoChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files.length > 0) {
      const file = e.target.files[0];

      // Compress the image using Compressor.js
      new Compressor(file, {
        quality: 0.5, // Set quality to 60% (lower quality = higher compression)
        maxWidth: 512, // Resize image to 200px width
        maxHeight: 512, // Resize image to 200px height
        success(result) {
          // Convert the Blob to a File object
          const compressedFile = new File([result], file.name, {
            type: result.type,
          });

          setNewPhoto(compressedFile); // Set the compressed file
        },
        error(err) {
          console.error("Image compression failed:", err);
          alert("Failed to compress image.");
        },
      });
    }
  };

  const handlePhotoUpload = async () => {
    if (!newPhoto) {
      alert("Please select a photo to upload.");
      return;
    }

    const fileSizeMB = newPhoto.size / (1024 * 1024); // Convert bytes to MB
    console.log(`Compressed file size: ${fileSizeMB.toFixed(2)} MB`);

    if (fileSizeMB > 5) {
      alert("File size exceeds 5MB. Please upload a smaller file.");
      return;
    }

    const formData = new FormData();
    formData.append("file", newPhoto);

    const encodedId = id ? encodeURIComponent(id) : '';

    setUploading(true);

    try {
      const response = await axios.post(
        `${API_BASE_URL}/upload-photo/${encodedId}`,
        formData,
        {
          headers: {
            "Content-Type": "multipart/form-data",
          },
        }
      );
      alert("Photo updated successfully!");
      setVolunteer((prev) => ({
        ...prev!,
        photo_url: `/files/${response.data.file_id}`,
      }));
    } catch (error) {
      console.error("Error uploading photo:", error);
      alert("Failed to upload photo.");
    } finally {
      setUploading(false);
    }
  };

  const handleBack = () => {
    navigate("/volunteer");
  };

  if (loading) {
    return (
      <div className="flex justify-center items-center h-screen">
        <p className="text-lg font-semibold text-gray-700">Loading...</p>
      </div>
    );
  }

  if (!volunteer) {
    return (
      <div className="flex justify-center items-center h-screen">
        <p className="text-lg font-semibold text-red-500">
          Volunteer not found.
        </p>
      </div>
    );
  }

  return (
    <div className="w-11/12 sm:w-11/12 md:w-10/12 lg:w-3/4 xl:w-1/3 mx-auto p-6 bg-white shadow-md rounded-md mt-10">
      <h2 className="text-2xl font-bold text-gray-800 mb-6">
        {volunteer.name}'s Profile
      </h2>
      <div className="flex flex-col items-center gap-6">
        <div className="relative group">
          <img
            src={
              volunteer.photo_url
                ? `${API_BASE_URL}${volunteer.photo_url}`
                : "https://i.pinimg.com/originals/f1/0f/f7/f10ff70a7155e5ab666bcdd1b45b726d.jpg"
            }
            alt={volunteer.name}
            className="w-40 h-40 object-cover rounded-full border-2 border-gray-300"
            loading="lazy"
          />
          <label
            htmlFor="file-input"
            className="absolute bottom-0 right-0 bg-blue-500 text-white rounded-full p-2 cursor-pointer opacity-0 group-hover:opacity-100 transition-opacity"
          >
            Upload
          </label>
          <input
            id="file-input"
            type="file"
            accept="image/*"
            onChange={handlePhotoChange}
            className="hidden"
          />
        </div>
        <div>
          <p className="text-3xl text-center mb-2 text-black font-kantumruy">
            {volunteer.kh_name}
          </p>
          <p className="text-xl text-center mb-2 text-black font-poppins">
            {volunteer.name}
          </p>

          <p className="text-lg text-center mb-2 text-black">
            <strong>Team:</strong> {volunteer.team}
          </p>
        </div>
        <button
          onClick={handlePhotoUpload}
          disabled={uploading}
          className={`py-2.5 px-6 text-sm bg-indigo-500 text-white rounded-full cursor-pointer font-semibold text-center shadow-xs transition-all duration-500 hover:bg-indigo-700 mb-8 inline-flex gap-2  ${
            uploading ? "opacity-50 cursor-not-allowed" : ""
          }`}
        >
          {uploading ? "Uploading..." : "Save Photo"}
        </button>
      </div>
      <button
        onClick={handleBack}
        className="mt-6 bg-gray-500 text-white px-4 py-2 rounded-md shadow-md hover:bg-gray-600"
      >
        Back to List
      </button>
    </div>
  );
};

export default VolunteerProfile;
