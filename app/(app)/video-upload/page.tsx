"use client";

import axios from "axios";
//import { useRouter } from "next/navigation";
import React, { useState } from "react";
import { toast } from "react-toastify";

const VideoUpload = () => {
  const [file, setFile] = useState<File | null>(null);
  const [title, setTitle] = useState("");
  const [description, setDescription] = useState("");
  const [isUploading, setIsUploading] = useState(false);

  //const router = useRouter();

  //max file size is 70mb
  const MAX_FILE_SIZE = 70 * 1024 * 1024;

  const handleSubmit = async (event: React.FormEvent) => {
    event.preventDefault();
    if (!file) return;

    if (file.size > MAX_FILE_SIZE) {
      toast.warning("File size is too large");
      return;
    }

    setIsUploading(true);

    const formData = new FormData();
    formData.append("file", file);
    formData.append("title", title);
    formData.append("description", description);
    formData.append("originalSize", file.size.toString());

    try {
      const response = await axios.post("/api/video-upload", formData);
      console.log(response);

      if (response.status !== 200 && response.data === null) {
        toast.error("Failed to upload video");
        throw new Error(`Failed to upload video: ${response.statusText}`);
      }

      toast.success("Video uploaded successfully");
    } catch (error) {
      console.log(error);
    } finally {
      setIsUploading(false);
    }
  };
  return (
    <div className="container mx-auto p-4">
      <h1 className="text-2xl font-bold mb-4">Upload Video</h1>
      <form onSubmit={handleSubmit} className="space-y-4">
        <div>
          <label className="label">
            <span className="label-text">Title</span>
          </label>
          <input
            type="text"
            value={title}
            onChange={(e) => setTitle(e.target.value)}
            className="input input-bordered w-full"
            required
          />
        </div>
        <div>
          <label className="label">
            <span className="label-text">Description</span>
          </label>
          <textarea
            value={description}
            onChange={(e) => setDescription(e.target.value)}
            className="textarea textarea-bordered w-full"
            required
          />
        </div>
        <div>
          <label className="label">
            <span className="label-text">Video File</span>
          </label>
          <input
            type="file"
            accept="video/*"
            onChange={(e) => setFile(e.target.files?.[0] || null)}
            className="file-input file-input-bordered w-full"
            required
          />
        </div>

        <button
          type="submit"
          className="btn btn-primary"
          disabled={isUploading}
        >
          {isUploading ? "Uploading..." : "Uploade Video"}
        </button>
      </form>
    </div>
  );
};

export default VideoUpload;
