import React from 'react';

const VideoBackground = () => {
  return (
    <div className="absolute inset-0 w-full h-full overflow-hidden -z-10">
      <div className="absolute inset-0 bg-black/50 z-10" /> {/* Overlay */}
      <video
        autoPlay
        muted
        loop
        playsInline
        className="absolute inset-0 w-full h-full object-cover"
      >
        <source
          src="https://res.cloudinary.com/didwhe7rc/video/upload/v1737713418/0124_qsg7zm.mp4"
          type="video/mp4"
        />
      </video>
    </div>
  );
};

export default VideoBackground;