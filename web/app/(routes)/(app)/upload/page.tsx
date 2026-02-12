"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Label } from "@/components/ui/label";
import { videoAPI } from "@/lib/api";

export default function UploadPage() {
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [formData, setFormData] = useState({
    title: "",
    description: "",
    thumbnail: "",
    duration: 0,
    isPublished: true,
  });
  const [videoFile, setVideoFile] = useState<File | null>(null);
  const [thumbnailFile, setThumbnailFile] = useState<File | null>(null);

  const router = useRouter();

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!videoFile) {
      setError("Please select a video file");
      return;
    }

    setLoading(true);
    setError(null);

    try {
      const response = await videoAPI.create({
        ...formData,
        videoFile,
        thumbnail: thumbnailFile || undefined,
      });

      if (response.success && response.data) {
        router.push(`/watch/${response.data.id}`);
      } else {
        setError(response.error || "Upload failed");
      }
    } catch (error) {
      setError("Upload failed");
    } finally {
      setLoading(false);
    }
  };

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      if (e.target.id === "videoFile") {
        setVideoFile(file);
      } else if (e.target.id === "thumbnailFile") {
        setThumbnailFile(file);
      }
    }
  };

  return (
    <div className="container mx-auto px-2 sm:px-4 py-4 sm:py-8 max-w-4xl">
      <h1 className="text-2xl sm:text-3xl font-bold mb-4 sm:mb-8">Upload Video</h1>

      {error && (
        <div className="mb-6 p-3 bg-red-100 border border-red-400 text-red-700 rounded">
          {error}
        </div>
      )}

      <form onSubmit={handleSubmit} className="space-y-6">
        {/* Video File */}
        <div className="grid gap-3">
          <Label htmlFor="videoFile">Video File</Label>
          <Input
            id="videoFile"
            type="file"
            accept="video/*"
            onChange={handleFileChange}
            required
          />
          {videoFile && (
            <p className="text-sm text-green-600">
              Selected: {videoFile.name} (
              {(videoFile.size / 1024 / 1024).toFixed(2)} MB)
            </p>
          )}
        </div>

        {/* Thumbnail File */}
        <div className="grid gap-3">
          <Label htmlFor="thumbnailFile">Thumbnail (Optional)</Label>
          <Input
            id="thumbnailFile"
            type="file"
            accept="image/*"
            onChange={handleFileChange}
          />
          {thumbnailFile && (
            <p className="text-sm text-green-600">
              Selected: {thumbnailFile.name} (
              {(thumbnailFile.size / 1024 / 1024).toFixed(2)} MB)
            </p>
          )}
        </div>

        {/* Title */}
        <div className="grid gap-3">
          <Label htmlFor="title">Title *</Label>
          <Input
            id="title"
            type="text"
            value={formData.title}
            onChange={(e) =>
              setFormData({ ...formData, title: e.target.value })
            }
            placeholder="Enter video title"
            required
          />
        </div>

        {/* Description */}
        <div className="grid gap-3">
          <Label htmlFor="description">Description</Label>
          <Textarea
            id="description"
            value={formData.description}
            onChange={(e) =>
              setFormData({ ...formData, description: e.target.value })
            }
            placeholder="Enter video description"
            rows={4}
          />
        </div>

        {/* Duration */}
        <div className="grid gap-3">
          <Label htmlFor="duration">Duration (seconds)</Label>
          <Input
            id="duration"
            type="number"
            value={formData.duration}
            onChange={(e) =>
              setFormData({
                ...formData,
                duration: parseInt(e.target.value) || 0,
              })
            }
            placeholder="Enter video duration"
          />
        </div>

        {/* Published Status */}
        <div className="flex items-center gap-3">
          <input
            type="checkbox"
            id="isPublished"
            checked={formData.isPublished}
            onChange={(e) =>
              setFormData({ ...formData, isPublished: e.target.checked })
            }
            className="w-4 h-4"
          />
          <Label htmlFor="isPublished">Publish immediately</Label>
        </div>

        {/* Submit Button */}
        <div className="flex gap-3">
          <Button
            type="submit"
            disabled={loading}
            className="bg-blue-600 text-white hover:bg-blue-700"
          >
            {loading ? "Uploading..." : "Upload Video"}
          </Button>
          <Button
            type="button"
            onClick={() => router.push("/home")}
            variant="secondary"
          >
            Cancel
          </Button>
        </div>
      </form>

      {/* Upload Guidelines */}
      <div className="mt-8 p-4 bg-gray-100 rounded-lg">
        <h3 className="font-semibold mb-2">Upload Guidelines:</h3>
        <ul className="text-sm text-gray-600 space-y-1">
          <li>• Supported video formats: MP4, AVI, MOV, MKV</li>
          <li>• Maximum file size: 500 MB</li>
          <li>• Recommended thumbnail size: 1280x720 pixels</li>
          <li>• Maximum thumbnail size: 10 MB</li>
          <li>• Title should not exceed 100 characters</li>
          <li>• Description should not exceed 5000 characters</li>
        </ul>
      </div>
    </div>
  );
}
