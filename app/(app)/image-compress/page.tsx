"use client";

import { filesize } from "filesize";
import { CldImage } from "next-cloudinary";
import React, { useCallback, useEffect, useRef, useState } from "react";
import { toast } from "react-toastify";

const ImageCompress = () => {
  const [uploadedImage, setUploadedImage] = useState<string | null>(null);
  const [isUploading, setIsUploading] = useState(false);
  const [isTransfering, setIsTransfering] = useState(false);
  const imageRef = useRef<HTMLImageElement>(null);
  const [selectedFormat, setSelectedFormat] = useState("png");
  const [width, setWidth] = useState(0);
  const [height, setHeight] = useState(0);

  useEffect(() => {
    if (uploadedImage) {
      setIsTransfering(true);
    }
  }, [uploadedImage]);

  const handleFileChange = async (
    event: React.ChangeEvent<HTMLInputElement>
  ) => {
    const file = event.target.files?.[0];
    if (!file) return;
    setIsUploading(true);

    const formData = new FormData();
    formData.append("file", file);

    try {
      const response = await fetch("/api/image-compress", {
        method: "POST",
        body: formData,
      });

      if (!response.ok) {
        toast.error("Failed to upload image");
        throw new Error(`Failed to upload image: ${response.statusText}`);
      }

      const data = await response.json();

      setUploadedImage(data.publicId);
      setWidth(data.width);
      setHeight(data.height);
      toast.success("Image uploaded successfully");
    } catch (error) {
      console.error(error);
      toast.error("Failed to upload image. Please try again.");
    } finally {
      setIsUploading(false);
    }
  };

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

  // const formatFileSize = useCallback((size: number) => {
  //   return filesize(size);
  // }, []);

  // const compressionPercentage = Math.round(
  //   (1 - Number(video.compressedSize) / Number(video.originalSize)) * 100
  // );

  return (
    <div className="container mx-auto p-4 max-w-4xl">
      <h1 className="text-3xl font-bold mb-6 text-center"> Image compressor</h1>

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
              <div className="mt-6 relative">
                <h3 className="text-lg font-semibold mb-2">Preview:</h3>
                <div className="flex justify-center">
                  {isTransfering && (
                    <div className="absolute inset-0 flex items-center justify-center bg-base-100 bg-opacity-50 z-10">
                      <span className="loading loading-spinner loading-lg"></span>
                    </div>
                  )}

                  <CldImage
                    src={uploadedImage}
                    width={width}
                    height={height}
                    sizes="100vw"
                    alt="Transfered Image"
                    gravity="auto"
                    ref={imageRef}
                    onLoad={() => setIsTransfering(false)}
                  />
                </div>
              </div>

              <div className="flex justify-between mt-6">
                <div>
                  <label htmlFor="format">Select Format</label>
                  <select
                    className="select select-bordered w-full"
                    value={selectedFormat}
                    onChange={(e) => setSelectedFormat(e.target.value)}
                  >
                    <option value="jpeg">JPEG</option>
                    <option value="png">PNG</option>
                    <option value="webp">WEBP</option>
                  </select>
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

export default ImageCompress;
