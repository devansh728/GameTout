import { useState, useMemo } from "react";
import { extractYouTubeId } from "@/utils/mediaUtils";

interface VideoPreviewCardProps {
  /** The YouTube embed URL or regular YouTube URL */
  videoUrl?: string | null;
  /** Fallback thumbnail image URL */
  thumbnailUrl?: string;
  /** Alt text for the image */
  alt?: string;
  /** Additional CSS classes for the container */
  className?: string;
  /** Classes for the image/video element */
  mediaClassName?: string;
  /** Overlay content (e.g., gradients, badges) */
  children?: React.ReactNode;
  /** Loading attribute for the image */
  loading?: "lazy" | "eager";
}

/**
 * VideoPreviewCard - A component that shows a thumbnail and plays video on hover
 * 
 * Behavior:
 * - Shows thumbnail by default
 * - On mouseEnter: Loads YouTube iframe with autoplay, muted, no controls
 * - On mouseLeave: Removes iframe and shows thumbnail instantly
 * - Priority: YouTube video > thumbnail image
 */
export const VideoPreviewCard = ({
  videoUrl,
  thumbnailUrl,
  alt = "Video preview",
  className = "",
  mediaClassName = "",
  children,
  loading = "lazy",
}: VideoPreviewCardProps) => {
  const [isPlaying, setIsPlaying] = useState(false);

  // Extract YouTube video ID from URL
  const videoId = useMemo(() => {
    if (!videoUrl) return null;
    return extractYouTubeId(videoUrl);
  }, [videoUrl]);

  // Generate YouTube thumbnail if we have a video ID but no thumbnail
  const displayThumbnail = useMemo(() => {
    if (thumbnailUrl) return thumbnailUrl;
    if (videoId) return `https://img.youtube.com/vi/${videoId}/maxresdefault.jpg`;
    return "";
  }, [thumbnailUrl, videoId]);

  // YouTube embed URL with autoplay params
  const embedUrl = useMemo(() => {
    if (!videoId) return null;
    const params = new URLSearchParams({
      autoplay: "1",
      mute: "1",
      controls: "0",
      rel: "0",
      modestbranding: "1",
      showinfo: "0",
      loop: "1",
      playlist: videoId, // Required for loop to work
    });
    return `https://www.youtube.com/embed/${videoId}?${params.toString()}`;
  }, [videoId]);

  const handleMouseEnter = () => {
    if (videoId) {
      setIsPlaying(true);
    }
  };

  const handleMouseLeave = () => {
    setIsPlaying(false);
  };

  return (
    <div
      className={`relative overflow-hidden ${className}`}
      onMouseEnter={handleMouseEnter}
      onMouseLeave={handleMouseLeave}
    >
      {/* Thumbnail (shown when not playing) */}
      {!isPlaying && (
        <img
          src={displayThumbnail}
          alt={alt}
          className={`w-full h-full object-cover ${mediaClassName}`}
          loading={loading}
        />
      )}

      {/* YouTube Iframe (shown on hover when video is available) */}
      {isPlaying && embedUrl && (
        <iframe
          src={embedUrl}
          title={alt}
          className={`w-full h-full object-cover ${mediaClassName}`}
          allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
          style={{ pointerEvents: "none" }}
        />
      )}

      {/* Overlay content (gradients, badges, play buttons, etc.) */}
      {children}
    </div>
  );
};

export default VideoPreviewCard;
