"use client";

import React, { useEffect, useRef, useState } from "react";
import { CldImage } from "next-cloudinary";
import { toast } from "react-toastify";
import { CheckIcon } from "lucide-react";

const socialFormats = {
  "Linkedin Profile (1:1)": {
    width: 1080,
    height: 1080,
    aspectRatio: "1:1",
  },
  "Instagram Portrait (4:5)": {
    width: 1080,
    height: 1350,
    aspectRatio: "4:5",
  },
  "Twitter Post (16:9)": {
    width: 1200,
    height: 675,
    aspectRatio: "16:9",
  },
  "Linkedin CoverImage (4:1)": {
    width: 1584,
    height: 396,
    aspectRatio: "4:1",
  },
  "Twitter Header (3:1)": {
    width: 1500,
    height: 500,
    aspectRatio: "3:1",
  },
  "Facebook Cover (205:78)": {
    width: 820,
    height: 312,
    aspectRatio: "205:78",
  },
};

type SocialShareFormat = keyof typeof socialFormats;

const SocialShare = () => {
  const [uploadedImage, setUploadedImage] = useState<string | null>(null);
  const [selectedFormat, setSelectedFormat] = useState<SocialShareFormat>(
    "Linkedin Profile (1:1)"
  );
  const [isUploading, setIsUploading] = useState(false);
  const [isTransfering, setIsTransfering] = useState(false);
  const [removeBackground, setRemoveBackground] = useState(false);
  const [fillBackground, setFillBackground] = useState(false);
  const [restoreImage, setRestoreImage] = useState(false);
  //this image reference is used to handle the downloading part
  const imageRef = useRef<HTMLImageElement>(null);

  useEffect(() => {
    if (uploadedImage) {
      setIsTransfering(true);
    }
  }, [
    selectedFormat,
    uploadedImage,
    removeBackground,
    fillBackground,
    restoreImage,
  ]);

  // This function will be called when the user selects a file to upload
  const handleFileChange = async (
    event: React.ChangeEvent<HTMLInputElement>
  ) => {
    const file = event.target.files?.[0];
    if (!file) return;
    setIsUploading(true);

    const formData = new FormData();
    formData.append("file", file);

    try {
      const response = await fetch("/api/image-upload", {
        method: "POST",
        body: formData,
      });

      if (!response.ok) {
        toast.error("Failed to upload image");
        throw new Error(`Failed to upload image: ${response.statusText}`);
      }

      const data = await response.json();
      setUploadedImage(data.publicId);
      toast.success("Image uploaded successfully");
    } catch (error) {
      console.error(error);
      toast.error("Failed to upload image. Please try again.");
    } finally {
      setIsUploading(false);
    }
  };

  // This function will be called when the user clicks the "Download" button
  const handleDownload = () => {
    if (!imageRef.current) return;

    fetch(imageRef.current.src)
      .then((Response) => Response.blob())
      .then((blob) => {
        //we are trying to control the blob by creating a URL out of it
        const url = window.URL.createObjectURL(blob);
        //then we are creating a link by the anchor tag <a></a>
        const link = document.createElement("a");
        //<a href = {url}> </a>
        link.href = url;
        //<a href = {url} download = "image.png"> </a>
        link.download = `${selectedFormat
          .replace(/\s+/g, "_")
          .toLowerCase()}.png`;
        //we are appending the link(<a></a>) to the body
        document.body.appendChild(link);
        //we are simulating a click on the link
        link.click();
        //we are removing the link
        document.body.removeChild(link);
        //we are revoking the URL
        window.URL.revokeObjectURL(url);
        //we are removing the link
        document.body.removeChild(link);
      });
  };

  const handleRemoveBg = async () => {
    setRemoveBackground(!removeBackground);
  };

  const handleEnhanceImage = async () => {
    setRestoreImage(!restoreImage);
  };

  const handleFillBg = async () => {
    setFillBackground(!fillBackground);
  };

  return (
    <div className="container mx-auto p-4 max-w-4xl">
      <h1 className="text-3xl font-bold mb-6 text-center">
        {" "}
        Social Media Image Creator
      </h1>

      <div className="card">
        <div className="card-body">
          <h2 className="card-title mb-4">Upload an Image</h2>
          <div className="form-control">
            <label className="label">
              <span className="label-text">Choose an Image file</span>
            </label>
            <input
              type="file"
              className="file-input file-input-bordered file-input-primary w-full"
              onChange={handleFileChange}
            />
          </div>

          {isUploading && (
            <div className="mt-4">
              <progress className="progress progress-primary w-full"></progress>
            </div>
          )}

          {uploadedImage && (
            <div className="mt-6">
              <h2 className="card-title mb-4">Select Social Media Format</h2>
              <div className="form-control">
                <select
                  className="select select-bordered w-full"
                  value={selectedFormat}
                  onChange={(e) =>
                    setSelectedFormat(e.target.value as SocialShareFormat)
                  }
                >
                  {Object.keys(socialFormats).map((format: string) => (
                    <option key={format} value={format} className="text-md">
                      {format}
                    </option>
                  ))}
                </select>
              </div>

              <div className="mt-6 relative">
                <h3 className="text-lg font-semibold mb-2">Preview:</h3>
                <div className="flex justify-center">
                  {isTransfering && (
                    <div className="absolute inset-0 flex items-center justify-center bg-base-100 bg-opacity-50 z-10">
                      <span className="loading loading-spinner loading-lg"></span>
                    </div>
                  )}

                  {removeBackground && (
                    <CldImage
                      width={socialFormats[selectedFormat].width}
                      height={socialFormats[selectedFormat].height}
                      src={uploadedImage}
                      sizes="100vw"
                      removeBackground
                      alt="Transfered Image"
                      crop={"fill"}
                      aspectRatio={socialFormats[selectedFormat].aspectRatio}
                      gravity="auto"
                      ref={imageRef}
                      onLoad={() => setIsTransfering(false)}
                    />
                  )}

                  {fillBackground && (
                    <CldImage
                      width={socialFormats[selectedFormat].width}
                      height={socialFormats[selectedFormat].height}
                      src={uploadedImage}
                      sizes="100vw"
                      fillBackground
                      alt="Transfered Image"
                      crop={"fill"}
                      aspectRatio={socialFormats[selectedFormat].aspectRatio}
                      gravity="auto"
                      ref={imageRef}
                      onLoad={() => setIsTransfering(false)}
                    />
                  )}

                  {restoreImage && (
                    <CldImage
                      width={socialFormats[selectedFormat].width}
                      height={socialFormats[selectedFormat].height}
                      src={uploadedImage}
                      sizes="100vw"
                      restore
                      alt="Transfered Image"
                      crop={"fill"}
                      aspectRatio={socialFormats[selectedFormat].aspectRatio}
                      gravity="auto"
                      ref={imageRef}
                      onLoad={() => setIsTransfering(false)}
                    />
                  )}

                  {!removeBackground && !restoreImage && !fillBackground && (
                    <CldImage
                      width={socialFormats[selectedFormat].width}
                      height={socialFormats[selectedFormat].height}
                      src={uploadedImage}
                      sizes="100vw"
                      alt="Transfered Image"
                      crop={"fill"}
                      aspectRatio={socialFormats[selectedFormat].aspectRatio}
                      gravity="auto"
                      ref={imageRef}
                      onLoad={() => setIsTransfering(false)}
                    />
                  )}
                </div>
              </div>

              <div className="grid grid-cols-4 gap-4 mt-6">
                <div>
                  <button
                    className="btn btn-outline btn-info grid grid-cols-2"
                    onClick={handleRemoveBg}
                  >
                    <span className="w-36">Remove Background</span>
                    {removeBackground && <CheckIcon className="ml-16" />}
                  </button>
                </div>
                <div>
                  <button
                    className="btn btn-outline btn-secondary grid grid-cols-2"
                    onClick={handleEnhanceImage}
                  >
                    <span className="w-36">Enhance Image</span>
                    {restoreImage && <CheckIcon className="ml-16" />}
                  </button>
                </div>
                <div>
                  <button
                    className="btn btn-outline btn-accent grid grid-cols-2"
                    onClick={handleFillBg}
                  >
                    <span className="w-36">Fill Background</span>
                    {fillBackground && <CheckIcon className="ml-16" />}
                  </button>
                </div>
                <div>
                  <button className="btn btn-primary" onClick={handleDownload}>
                    Download for {selectedFormat}{" "}
                  </button>
                </div>
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default SocialShare;
