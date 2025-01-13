import dayjs from "dayjs";
import React, { useCallback, useState } from "react";
import relativeTime from "dayjs/plugin/relativeTime";
import { Video } from "@prisma/client";
import { getCldImageUrl } from "next-cloudinary";

dayjs.extend(relativeTime);

interface VideoCardProps {
  video: Video;
  onDownload: (url: string, title: string) => void;
}

//React.FC<VideoCardProps> defines that this method will return a React Functional Component of VideoCardProps type
const VideoCard: React.FC<VideoCardProps> = ({ video, onDownload }) => {
  const [isHovered, setIsHovered] = useState(false);
  const [previewError, setPreviewError] = useState(false);

  //the getCldImageUrl() gives the thumbnail url of the video
  const getThumbnailUrl = useCallback((publicId: string) => {
    return getCldImageUrl({
      src: publicId,
      width: 1920,
      height: 1080,
      crop: "fill",
      gravity: "auto",
      format: "jpg",
      quality: "auto",
      assetType: "video",
    });
  }, []);

  return <div></div>;
};

export default VideoCard;
