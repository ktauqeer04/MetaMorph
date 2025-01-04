"use client";
import { Video } from "@/types";
import React, { useCallback, useEffect, useState } from "react";
import VideoCard from "@/components/videoCard";
import axios from "axios";

function Home() {
  const [videos, setVideos] = useState<Video[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>("");

  const fetchVideos = useCallback(async () => {
    try {
      const response = await axios.get("/api/videos");
      if (Array.isArray(response.data)) {
        setVideos(response.data);
      } else {
        throw new Error(`Unexpected response format`);
      }
    } catch (error) {
      console.error(error);
      setError("Unable to fetch Videos");
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    fetchVideos();
  }, [fetchVideos]);

  const handleDownload = useCallback((url: string, title: string) => {
    const link = document.createElement("a");
    link.href = url;
    link.setAttribute("download", `${title}.mp4`);
    link.setAttribute("target", "_blank");
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  }, []);

  return (
    <div className="flex h-screen bg-gray-900 text-white">
      {/* Main Content */}
      <main className="flex-1 p-8">
        <h1 className="text-3xl font-semibold text-center mb-6">Videos</h1>
        {loading ? (
          <div className="flex items-center justify-center h-64 text-gray-400">Loading...</div>
        ) : error ? (
          <div className="flex items-center justify-center h-64 text-red-500">{error}</div>
        ) : videos.length === 0 ? (
          <div className="flex items-center justify-center h-64 text-gray-400">
            No videos available
          </div>
        ) : (
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
            {videos.map((video) => (
              <VideoCard key={video.id} video={video} onDownload={handleDownload} />
            ))}
          </div>
        )}
      </main>
    </div>
  );
}

export default Home;
