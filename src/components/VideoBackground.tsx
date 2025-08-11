import React, { useRef, useEffect } from 'react';

const VideoBackground: React.FC = () => {
  const videoRef = useRef<HTMLVideoElement>(null);

  useEffect(() => {
    const video = videoRef.current;
    if (!video) return;

    // Configure video
    video.muted = true;
    video.loop = true;
    video.playsInline = true;
    
    // Try to play the video
    const playVideo = async () => {
      try {
        await video.play();
      } catch (err) {
        console.warn('Video autoplay failed:', err);
      }
    };
    
    playVideo();
    
    return () => {
      if (video) {
        video.pause();
        video.src = '';
      }
    };
  }, []);

  return (
    <video
      ref={videoRef}
      className="fixed top-0 left-0 w-full h-full object-cover z-0"
      style={{ opacity: 0.5 }}
      muted
      loop
      playsInline
    >
      <source src="/videos/BACKGROUND.mp4" type="video/mp4" />
    </video>
  );
};

export default VideoBackground;