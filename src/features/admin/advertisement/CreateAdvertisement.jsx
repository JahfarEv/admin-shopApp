import React, { useState } from "react";
import AdminLayout from "../../../components/layout/AdminLayout";

const CreateAdvertisement = () => {
  const [title, setTitle] = useState("");
  const [image, setImage] = useState(null);
  const [imagePreview, setImagePreview] = useState(null);
  const [message, setMessage] = useState("");
  const [isLoading, setIsLoading] = useState(false);

  const handleImageChange = (e) => {
    const file = e.target.files[0];
    if (file) {
      setImage(file);
      // Create image preview
      const reader = new FileReader();
      reader.onloadend = () => {
        setImagePreview(reader.result);
      };
      reader.readAsDataURL(file);
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setIsLoading(true);

    if (!title || !image) {
      setMessage("Please provide title and image.");
      setIsLoading(false);
      return;
    }

    try {
      const formData = new FormData();
      formData.append("title", title);
      formData.append("image", image);

      const res = await fetch("https://shop-app-backend-k0a2.onrender.com/adminDashboard/advertisement", {
        method: "POST",
        body: formData,
      });

      const data = await res.json();

      if (res.ok) {
        setMessage("✅ Advertisement created successfully!");
        setTitle("");
        setImage(null);
        setImagePreview(null);
        // Clear file input
        document.getElementById("file-input").value = "";
      } else {
        setMessage(`❌ Error: ${data.error}`);
      }
    } catch (error) {
      console.error(error);
      setMessage("❌ Something went wrong");
    } finally {
      setIsLoading(false);
    }
  };

  const clearForm = () => {
    setTitle("");
    setImage(null);
    setImagePreview(null);
    setMessage("");
    document.getElementById("file-input").value = "";
  };

  return (
    <AdminLayout>
      <div className="min-h-screen  py-8 px-4">
        <div className="max-w-2xl mx-auto">
          {/* Header Section */}
          <div className="text-center mb-8">
            <h1 className="text-3xl font-bold text-gray-200 mb-2">
              Create Advertisement
            </h1>
            <p className="text-gray-300">
              Upload engaging content to promote your products
            </p>
          </div>

          {/* Form Card */}
          <div className="bg-white rounded-2xl shadow-xl p-8 transition-all duration-300 hover:shadow-2xl">
            <form onSubmit={handleSubmit} className="space-y-6">
              {/* Title Input */}
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Advertisement Title *
                </label>
                <input
                  type="text"
                  placeholder="Enter a compelling title..."
                  className="w-full border-2 border-gray-200 p-4 rounded-xl focus:border-blue-500 focus:ring-2 focus:ring-blue-200 transition-all duration-200"
                  value={title}
                  onChange={(e) => setTitle(e.target.value)}
                />
              </div>

              {/* Image Upload Section */}
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Advertisement Image *
                </label>
                
                {/* Image Preview */}
                {imagePreview && (
                  <div className="mb-4 text-center">
                    <div className="relative inline-block">
                      <img
                        src={imagePreview}
                        alt="Preview"
                        className="max-w-full h-48 object-cover rounded-lg shadow-md border-2 border-gray-200"
                      />
                      <button
                        type="button"
                        onClick={() => {
                          setImagePreview(null);
                          setImage(null);
                          document.getElementById("file-input").value = "";
                        }}
                        className="absolute -top-2 -right-2 bg-red-500 text-white rounded-full w-6 h-6 flex items-center justify-center hover:bg-red-600 transition-colors"
                      >
                        ×
                      </button>
                    </div>
                  </div>
                )}

                {/* File Input */}
                <div className="border-2 border-dashed border-gray-300 rounded-2xl p-6 text-center hover:border-blue-400 transition-colors duration-200">
                  <input
                    id="file-input"
                    type="file"
                    accept="image/*"
                    className="hidden"
                    onChange={handleImageChange}
                  />
                  <label
                    htmlFor="file-input"
                    className="cursor-pointer block"
                  >
                    <div className="flex flex-col items-center justify-center">
                      <svg
                        className="w-12 h-12 text-gray-400 mb-3"
                        fill="none"
                        stroke="currentColor"
                        viewBox="0 0 24 24"
                      >
                        <path
                          strokeLinecap="round"
                          strokeLinejoin="round"
                          strokeWidth={2}
                          d="M4 16l4.586-4.586a2 2 0 012.828 0L16 16m-2-2l1.586-1.586a2 2 0 012.828 0L20 14m-6-6h.01M6 20h12a2 2 0 002-2V6a2 2 0 00-2-2H6a2 2 0 00-2 2v12a2 2 0 002 2z"
                        />
                      </svg>
                      <span className="text-gray-600 font-medium">
                        {image ? "Change Image" : "Click to upload image"}
                      </span>
                      <span className="text-sm text-gray-500 mt-1">
                        PNG, JPG, JPEG up to 10MB
                      </span>
                    </div>
                  </label>
                </div>
              </div>

              {/* Action Buttons */}
              <div className="flex gap-4 pt-4">
                <button
                  type="button"
                  onClick={clearForm}
                  className="flex-1 bg-gray-200 text-gray-800 py-3 px-6 rounded-xl font-medium hover:bg-gray-300 transition-colors duration-200"
                >
                  Clear
                </button>
                <button
                  type="submit"
                  disabled={isLoading}
                  className="flex-1 bg-gradient-to-r from-blue-600 to-indigo-600 text-white py-3 px-6 rounded-xl font-medium hover:from-blue-700 hover:to-indigo-700 transition-all duration-200 disabled:opacity-50 disabled:cursor-not-allowed"
                >
                  {isLoading ? (
                    <span className="flex items-center justify-center">
                      <svg className="animate-spin -ml-1 mr-3 h-5 w-5 text-white" fill="none" viewBox="0 0 24 24">
                        <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                        <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                      </svg>
                      Creating...
                    </span>
                  ) : (
                    "Create Advertisement"
                  )}
                </button>
              </div>
            </form>

            {/* Message Display */}
            {message && (
              <div className={`mt-6 p-4 rounded-xl text-center font-medium ${
                message.includes("✅") 
                  ? "bg-green-100 text-green-700 border border-green-200" 
                  : "bg-red-100 text-red-700 border border-red-200"
              }`}>
                {message}
              </div>
            )}
          </div>

          {/* Help Text */}
          <div className="text-center mt-6 text-sm text-gray-300">
            <p>Supported formats: PNG, JPG, JPEG | Max size: 10MB</p>
          </div>
        </div>
      </div>
    </AdminLayout>
  );
};

export default CreateAdvertisement;