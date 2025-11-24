const VideoBackground = () => {
  return (
    <div className="absolute inset-0 z-0">
      <video
        autoPlay
        loop
        muted
        playsInline
        className="w-full h-full object-cover opacity-50 dark:opacity-30"
      >
        <source src="https://cdn.pixabay.com/video/2024/03/31/206294_large.mp4" type="video/mp4" />
      </video>
      <div className="absolute inset-0 bg-gradient-to-br from-background/50 via-background/40 to-background/50" />
    </div>
  );
};

export default VideoBackground;
