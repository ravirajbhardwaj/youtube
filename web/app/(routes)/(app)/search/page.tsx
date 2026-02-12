"use client";

import { useState, useEffect } from "react";
import { useSearchParams, useRouter } from "next/navigation";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Search, Filter, MessageSquare, Play } from "lucide-react";
import { videoAPI, tweetAPI } from "@/lib/api";
import { Video } from "@/types/video";
import { Tweet } from "@/types/tweet";

export default function SearchPage() {
  const searchParams = useSearchParams();
  const router = useRouter();
  const [query, setQuery] = useState(searchParams.get("q") || "");
  const [loading, setLoading] = useState(false);
  const [videos, setVideos] = useState<Video[]>([]);
  const [tweets, setTweets] = useState<Tweet[]>([]);
  const [activeTab, setActiveTab] = useState("videos");
  const [filters, setFilters] = useState<{ sortBy: string; sortOrder: "desc" | "asc" }>({
    sortBy: "relevance",
    sortOrder: "desc",
  });

  useEffect(() => {
    if (query) {
      handleSearch();
    }
  }, [query]);

  const handleSearch = async (e?: React.FormEvent) => {
    if (e) {
      e.preventDefault();
    }

    if (!query.trim()) return;

    setLoading(true);
    try {
      if (activeTab === "videos") {
        const response = await videoAPI.search({
          query,
          page: 1,
          limit: 50,
          sortBy: filters.sortBy as any,
          sortOrder: filters.sortOrder,
        });
        if (response.success && response.data) {
          setVideos(response.data as Video[]);
        }
      } else if (activeTab === "tweets") {
        const response = await tweetAPI.search({
          query,
          page: 1,
          limit: 50,
          sortBy: filters.sortBy as any,
          sortOrder: filters.sortOrder,
        });
        if (response.success && response.data) {
          setTweets(response.data as Tweet[]);
        }
      }
    } catch (error) {
      console.error("Error searching:", error);
    } finally {
      setLoading(false);
    }
  };

  const handleVideoClick = (videoId: string) => {
    router.push(`/watch/${videoId}`);
  };

  const handleFilterChange = (key: string, value: string) => {
    setFilters((prev) => ({ ...prev, [key]: value }));
    handleSearch();
  };

  return (
    <div className="container mx-auto px-2 sm:px-4 py-4 sm:py-8">
      {/* Search Bar */}
      <div className="mb-8">
        <form onSubmit={handleSearch} className="flex gap-3">
          <Input
            type="text"
            placeholder="Search videos, users, or tweets..."
            value={query}
            onChange={(e) => setQuery(e.target.value)}
            className="flex-1"
          />
          <Button type="submit" disabled={loading}>
            <Search className="h-4 w-4 mr-2" />
            {loading ? "Searching..." : "Search"}
          </Button>
        </form>
      </div>

      {/* Filter Options */}
      <div className="flex items-center gap-4 mb-6">
        <div className="flex bg-gray-100 rounded-lg p-1">
          <button
            onClick={() => setActiveTab("videos")}
            className={`px-4 py-2 rounded-md font-medium ${activeTab === "videos"
              ? "bg-white text-blue-600 shadow-sm"
              : "text-gray-600 hover:text-gray-800"
              }`}
          >
            Videos ({videos.length})
          </button>
          <button
            onClick={() => setActiveTab("tweets")}
            className={`px-4 py-2 rounded-md font-medium ${activeTab === "tweets"
              ? "bg-white text-blue-600 shadow-sm"
              : "text-gray-600 hover:text-gray-800"
              }`}
          >
            Tweets ({tweets.length})
          </button>
          <button
            onClick={() => setActiveTab("users")}
            className={`px-4 py-2 rounded-md font-medium ${activeTab === "users"
              ? "bg-white text-blue-600 shadow-sm"
              : "text-gray-600 hover:text-gray-800"
              }`}
          >
            Users (0)
          </button>
        </div>

        <div className="ml-auto flex items-center gap-2">
          <Select
            value={filters.sortBy}
            onChange={(value) => handleFilterChange("sortBy", value)}
          >
            <option value="relevance">Relevance</option>
            <option value="createdAt">Date</option>
            <option value="viewCount">Views</option>
            <option value="likeCount">Likes</option>
          </Select>
          <Select
            value={filters.sortOrder}
            onChange={(value) => handleFilterChange("sortOrder", value)}
          >
            <option value="desc">Descending</option>
            <option value="asc">Ascending</option>
          </Select>
          <Button variant="secondary" size="sm">
            <Filter className="h-4 w-4 mr-2" />
            More Filters
          </Button>
        </div>
      </div>

      {/* Search Results */}
      <div className="min-h-[400px]">
        {loading ? (
          <div className="flex items-center justify-center h-64">
            <div className="text-center">
              <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-500 mx-auto mb-4"></div>
              <p className="text-gray-600">Searching...</p>
            </div>
          </div>
        ) : query ? (
          activeTab === "videos" ? (
            <div className="grid grid-cols-1 sm:grid-cols-[repeat(auto-fill,minmax(250px,1fr))] md:grid-cols-[repeat(auto-fill,minmax(300px,1fr))] gap-4 sm:gap-6">
              {videos.map((video) => (
                <div
                  key={video.id}
                  className="bg-white rounded-lg overflow-hidden shadow-sm hover:shadow-lg transition-shadow cursor-pointer"
                  onClick={() => handleVideoClick(video.id)}
                >
                  <div className="relative">
                    <img
                      src={video.thumbnail}
                      alt={video.title}
                      className="w-full aspect-video object-cover"
                    />
                    <div className="absolute bottom-2 right-2 bg-black bg-opacity-80 text-white px-2 py-1 rounded text-sm">
                      {Math.floor(video.duration / 60)}:
                      {(video.duration % 60).toString().padStart(2, "0")}
                    </div>
                  </div>
                  <div className="p-3 sm:p-4">
                    <h3 className="font-semibold mb-2 line-clamp-2">
                      {video.title}
                    </h3>
                    <p className="text-sm text-gray-600 mb-2">
                      {video.viewCount.toLocaleString()} views •{" "}
                      {new Date(video.createdAt).toLocaleDateString()}
                    </p>
                    <div className="flex items-center gap-2">
                      <img
                        src={video.owner?.avatar}
                        alt={video.owner?.username}
                        className="w-6 h-6 rounded-full"
                      />
                      <span className="text-sm text-gray-600">
                        {video.owner?.fullname}
                      </span>
                    </div>
                  </div>
                </div>
              ))}
              {videos.length === 0 && (
                <div className="col-span-full text-center py-12 text-gray-600">
                  <p>No videos found</p>
                </div>
              )}
            </div>
          ) : activeTab === "tweets" ? (
            <div className="space-y-4">
              {tweets.map((tweet) => (
                <div
                  key={tweet.id}
                  className="bg-white border border-gray-200 rounded-lg p-3 sm:p-4"
                >
                  <div className="flex items-start gap-3">
                    <img
                      src={tweet.user?.avatar}
                      alt={tweet.user?.username}
                      className="w-10 h-10 rounded-full"
                    />
                    <div className="flex-1">
                      <div className="flex items-center gap-2">
                        <span className="font-semibold">
                          {tweet.user?.fullname}
                        </span>
                        <span className="text-gray-600">
                          @{tweet.user?.username}
                        </span>
                        <span className="text-gray-600">
                          {new Date(tweet.createdAt).toLocaleDateString()}
                        </span>
                      </div>
                      <p className="mt-2 text-gray-800">{tweet.content}</p>
                      <div className="flex items-center gap-4 mt-3 text-gray-600">
                        <button className="hover:text-blue-600">
                          <MessageSquare className="h-4 w-4 inline mr-1" />
                          Reply
                        </button>
                        <button className="hover:text-green-600">
                          <Play className="h-4 w-4 inline mr-1" />
                          Retweet
                        </button>
                        <button className="hover:text-red-600">
                          <MessageSquare className="h-4 w-4 inline mr-1" />
                          Like
                        </button>
                        <button className="hover:text-blue-600">
                          <MessageSquare className="h-4 w-4 inline mr-1" />
                          Share
                        </button>
                      </div>
                    </div>
                  </div>
                </div>
              ))}
              {tweets.length === 0 && (
                <div className="text-center py-12 text-gray-600">
                  <p>No tweets found</p>
                </div>
              )}
            </div>
          ) : activeTab === "users" ? (
            <div className="text-center py-12 text-gray-600">
              <p>User search functionality coming soon</p>
            </div>
          ) : null
        ) : (
          <div className="text-center py-16 text-gray-600">
            <p>Enter a search query to find videos, users, or tweets</p>
          </div>
        )}
      </div>
    </div>
  );
}

// Helper component for select inputs
const Select = ({
  value,
  onChange,
  children,
  className = "",
}: {
  value: string;
  onChange: (value: string) => void;
  children: React.ReactNode;
  className?: string;
}) => (
  <select
    value={value}
    onChange={(e) => onChange(e.target.value)}
    className={`px-3 py-2 border border-gray-300 rounded-lg bg-white text-sm ${className}`}
  >
    {children}
  </select>
);
