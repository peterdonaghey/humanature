import {useState} from "react";

interface BannerUploadProps {
  currentBanner?: string;
  onBannerChange: (url: string | undefined) => void;
  disabled?: boolean;
  cleanupPrevious?: boolean; // Whether to delete the previous banner from S3 when uploading a new one
}

export function BannerUpload({
  currentBanner,
  onBannerChange,
  disabled = false,
  cleanupPrevious = false,
}: BannerUploadProps) {
  const [isUploading, setIsUploading] = useState(false);

  const handleBannerUpload = async (
    event: React.ChangeEvent<HTMLInputElement>
  ) => {
    const file = event.target.files?.[0];
    if (!file) return;

    // Validate file type
    if (!file.type.startsWith("image/")) {
      alert("Please select an image file");
      return;
    }

    // Validate file size (max 5MB)
    if (file.size > 5 * 1024 * 1024) {
      alert("File size must be less than 5MB");
      return;
    }

    const previousBanner = currentBanner;

    try {
      setIsUploading(true);
      const formData = new FormData();
      formData.append("file", file);

      const response = await fetch("/upload-file", {
        method: "POST",
        body: formData,
      });

      if (!response.ok) {
        throw new Error("Upload failed");
      }

      const {url} = await response.json();
      onBannerChange(url);

      // If cleanup is enabled and there was a previous banner, delete it from S3
      if (cleanupPrevious && previousBanner) {
        try {
          await fetch("/api/delete-file", {
            method: "POST",
            headers: {
              "Content-Type": "application/json",
            },
            body: JSON.stringify({fileUrl: previousBanner}),
          });
          console.log("Previous banner deleted from S3");
        } catch (error) {
          console.error("Failed to delete previous banner:", error);
          // Don't show error to user, just log it
        }
      }
    } catch (error) {
      console.error("Error uploading banner:", error);
      alert("Failed to upload banner. Please try again.");
    } finally {
      setIsUploading(false);
    }
  };

  const handleRemoveBanner = () => {
    onBannerChange(undefined);
  };

  return (
    <div className="space-y-4">
      <div>
        <div className="block text-sm font-medium text-gray-700 mb-2">
          Project Banner
        </div>
        <p className="text-sm text-gray-500 mb-4">
          Upload an image to use as the project banner. Recommended size:
          1200x400px. Max size: 5MB.
        </p>
      </div>

      {currentBanner && (
        <div className="relative">
          <img
            src={currentBanner}
            alt="Current banner"
            className="w-full h-32 object-cover rounded-lg border border-gray-200"
          />
          <button
            type="button"
            onClick={handleRemoveBanner}
            disabled={disabled || isUploading}
            className="absolute top-2 right-2 bg-red-500 hover:bg-red-600 text-white p-1 rounded-full disabled:opacity-50 disabled:cursor-not-allowed"
          >
            <svg
              className="h-4 w-4"
              fill="none"
              stroke="currentColor"
              viewBox="0 0 24 24"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth={2}
                d="M6 18L18 6M6 6l12 12"
              />
            </svg>
          </button>
        </div>
      )}

      <div className="flex items-center space-x-4">
        <input
          type="file"
          id="banner-upload"
          accept="image/*"
          onChange={handleBannerUpload}
          disabled={disabled || isUploading}
          className="hidden"
        />
        <label
          htmlFor="banner-upload"
          className={`inline-flex items-center px-4 py-2 border border-gray-300 rounded-lg text-sm font-medium cursor-pointer transition-colors ${
            disabled || isUploading
              ? "bg-gray-100 text-gray-400 cursor-not-allowed"
              : "bg-white text-gray-700 hover:bg-gray-50"
          }`}
        >
          {isUploading ? (
            <span className="flex items-center">
              <svg
                className="animate-spin -ml-1 mr-3 h-4 w-4"
                xmlns="http://www.w3.org/2000/svg"
                fill="none"
                viewBox="0 0 24 24"
              >
                <circle
                  className="opacity-25"
                  cx="12"
                  cy="12"
                  r="10"
                  stroke="currentColor"
                  strokeWidth="4"
                ></circle>
                <path
                  className="opacity-75"
                  fill="currentColor"
                  d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"
                ></path>
              </svg>
              Uploading...
            </span>
          ) : (
            <>
              <svg
                className="h-4 w-4 mr-2"
                fill="none"
                stroke="currentColor"
                viewBox="0 0 24 24"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={2}
                  d="M12 4v16m8-8H4"
                />
              </svg>
              {currentBanner ? "Change Banner" : "Upload Banner"}
            </>
          )}
        </label>

        {currentBanner && !isUploading && (
          <button
            type="button"
            onClick={handleRemoveBanner}
            disabled={disabled}
            className="text-red-600 hover:text-red-700 text-sm font-medium disabled:opacity-50 disabled:cursor-not-allowed"
          >
            Remove Banner
          </button>
        )}
      </div>
    </div>
  );
}
