"use client";

import React, { useEffect, useRef, useState } from "react";

const VIDEO_PATH = "/videos/bg-video.mp4";
const VIDEO_DURATION = 54; // seconds
const FADE_DURATION = 5; // seconds

const Background = () => {
  const video1Ref = useRef<HTMLVideoElement>(null);
  const video2Ref = useRef<HTMLVideoElement>(null);
  const [activeVideo, setActiveVideo] = useState<1 | 2>(1);

  useEffect(() => {
    const v1 = video1Ref.current!;
    const v2 = video2Ref.current!;

    // Start video1
    v1.play();

    let fadeTimeout: NodeJS.Timeout;
    let switchTimeout: NodeJS.Timeout;

    const scheduleNextFade = () => {
      // Time when to start fading and start next video
      fadeTimeout = setTimeout(() => {
        const fadingOut = activeVideo === 1 ? v1 : v2;
        const fadingIn = activeVideo === 1 ? v2 : v1;

        // Start next video and fade in
        fadingIn.currentTime = 0;
        fadingIn.play();
        setActiveVideo(activeVideo === 1 ? 2 : 1);
      }, (VIDEO_DURATION - FADE_DURATION) * 1000);

      // Time to stop the previous video after fade
      switchTimeout = setTimeout(() => {
        const oldVideo = activeVideo === 1 ? v1 : v2;
        oldVideo.pause();
        oldVideo.currentTime = 0;
      }, VIDEO_DURATION * 1000);
    };

    scheduleNextFade();

    return () => {
      clearTimeout(fadeTimeout);
      clearTimeout(switchTimeout);
    };
  }, [activeVideo]);

  const commonClasses =
    "absolute top-0 left-0 w-full h-full object-cover transition-opacity duration-[5000ms] ease-in-out scale-x-[-1]";

  return (
    <>
      <video
        ref={video1Ref}
        className={`${commonClasses} ${
          activeVideo === 1 ? "opacity-100" : "opacity-0"
        }`}
        muted
        playsInline
      >
        <source src={VIDEO_PATH} type="video/mp4" />
      </video>

      <video
        ref={video2Ref}
        className={`${commonClasses} ${
          activeVideo === 2 ? "opacity-100" : "opacity-0"
        }`}
        muted
        playsInline
      >
        <source src={VIDEO_PATH} type="video/mp4" />
      </video>
    </>
  );
};

export default Background;
