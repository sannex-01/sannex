import { cn } from "@/lib/utils";

interface VideoBackgroundProps {
  fixed?: boolean;
  className?: string;
  videoClassName?: string;
  overlayClassName?: string;
}

const VideoBackground = ({
  fixed = false,
  className,
  videoClassName,
  overlayClassName,
}: VideoBackgroundProps) => {
  return (
    <div className={cn(fixed ? "fixed inset-0 z-0" : "absolute inset-0 z-0", className)}>
      <video
        autoPlay
        loop
        muted
        playsInline
        className={cn("h-full w-full object-cover object-center opacity-50 dark:opacity-30", videoClassName)}
      >
        <source src="https://cdn.pixabay.com/video/2024/03/31/206294_large.mp4" type="video/mp4" />
      </video>
      <div
        className={cn(
          "absolute inset-0 bg-gradient-to-br from-background/50 via-background/40 to-background/50",
          overlayClassName,
        )}
      />
    </div>
  );
};

export default VideoBackground;
