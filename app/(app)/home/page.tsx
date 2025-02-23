/* eslint-disable @typescript-eslint/no-unused-vars */
"use client";

import VideoCard from "@/components/VideoCard";
import axios from "axios";
import React, { useCallback, useEffect, useState } from "react";
import { toast } from "react-toastify";

interface Video {
  id: string;
  title: string;
  description: string;
  originalSize: string;
  publicId: string;
  compressedSize: string;
  duration: number;
  createdAt: Date;
  updatedAt: Date;
}

const Home = () => {
  const [videos, setVideos] = useState<Video[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | unknown>(null);

  const fetchVideos = useCallback(async () => {
    try {
      setLoading(true);
      const response = await axios.get("/api/videos");

      //the Array.isArray is a function that checks if the response.data is an array or not
      if (Array.isArray(response.data)) {
        setVideos(response.data);
      } else {
        toast.error("Unexpected response format");
      }
    } catch (error) {
      setError(error);
      toast.error("error in fetching videos");
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    fetchVideos();
  }, [fetchVideos]);

  const handleDownload = useCallback((url: string, title: string) => {
    //then we are creating a link by the anchor tag <a></a>
    const link = document.createElement("a");
    //<a href = {url}> </a>
    link.href = url;
    link.setAttribute("download", `${title}.mp4`);
    link.setAttribute("target", "_blank");
    //we are appending the link(<a></a>) to the body
    document.body.appendChild(link);
    //we are simulating a click on the link
    link.click();
    //we are removing the link
    document.body.removeChild(link);
  }, []);

  const handleRemove = useCallback(
    async (videoId: string) => {
      setVideos(videos.filter((video) => video.id !== videoId));
    },
    [videos]
  );

  if (loading) {
    return (
      <div className="flex flex-wrap justify-between gap-4">
        <div className="flex w-96 flex-col gap-4">
          <div className="skeleton h-72 w-full"></div>
          <div className="skeleton h-4 w-28"></div>
          <div className="skeleton h-4 w-full"></div>
          <div className="skeleton h-4 w-full"></div>
        </div>
        <div className="flex w-96 flex-col gap-4">
          <div className="skeleton h-72 w-full"></div>
          <div className="skeleton h-4 w-28"></div>
          <div className="skeleton h-4 w-full"></div>
          <div className="skeleton h-4 w-full"></div>
        </div>
        <div className="flex w-96 flex-col gap-4">
          <div className="skeleton h-72 w-full"></div>
          <div className="skeleton h-4 w-28"></div>
          <div className="skeleton h-4 w-full"></div>
          <div className="skeleton h-4 w-full"></div>
        </div>
        <div className="flex w-96 flex-col gap-4">
          <div className="skeleton h-72 w-full"></div>
          <div className="skeleton h-4 w-28"></div>
          <div className="skeleton h-4 w-full"></div>
          <div className="skeleton h-4 w-full"></div>
        </div>
        <div className="flex w-96 flex-col gap-4">
          <div className="skeleton h-72 w-full"></div>
          <div className="skeleton h-4 w-28"></div>
          <div className="skeleton h-4 w-full"></div>
          <div className="skeleton h-4 w-full"></div>
        </div>
        <div className="flex w-96 flex-col gap-4">
          <div className="skeleton h-72 w-full"></div>
          <div className="skeleton h-4 w-28"></div>
          <div className="skeleton h-4 w-full"></div>
          <div className="skeleton h-4 w-full"></div>
        </div>
      </div>
    );
  }

  return (
    <div className="container mx-auto p-4">
      <h1 className="text-2xl font-bold mb-4">Videos</h1>
      {videos.length === 0 ? (
        <div className="text-center text-lg text-gray-500">
          No videos found.
        </div>
      ) : (
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
          {videos.map((video) => (
            <VideoCard
              key={video.id}
              video={video}
              onDownload={handleDownload}
              onRemove={handleRemove}
            />
          ))}
        </div>
      )}
    </div>
  );
};

export default Home;
