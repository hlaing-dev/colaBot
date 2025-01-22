import { useEffect, useRef } from "react";
import Artplayer from "artplayer";
import Hls from "hls.js"; // Import HLS.js for handling m3u8 streams
import lozad from "lozad"; // Import lozad library for lazy loading
import indicator from "../indicator.svg";
import vod_loader from "../vod_loader.gif";

const SearchPlayer = ({
  src,
  thumbnail,
  onPlay,
  mute,
  rotate,
}: {
  src: any;
  thumbnail: any;
  onPlay?: () => void; // Add an optional onPlay callback
  mute: any;
  rotate: any;
}) => {
  const playerContainerRef = useRef(null);
  const artPlayerInstanceRef = useRef<Artplayer | null>(null);

  useEffect(() => {
    if (playerContainerRef.current) {
      // Initialize Lozad for lazy loading
      let observer = lozad(playerContainerRef.current, {
        rootMargin: "200px 0px", // Adjust rootMargin as needed
        threshold: 0.1, // Adjust threshold as needed
        loaded: function (el: any) {
          if (!artPlayerInstanceRef.current) {
            // Initialize Artplayer with m3u8 support
            Artplayer.MOBILE_DBCLICK_PLAY = false;
            Artplayer.MOBILE_CLICK_PLAY = true;
            artPlayerInstanceRef.current = new Artplayer({
              autoOrientation: true,
              container: el,
              url: src,
              volume: 0.5,
              muted: mute,
              autoplay: true,
              fullscreenWeb: true,
              moreVideoAttr: {
                playsInline: true,
                preload: "metadata",
              },
              flip: true,
              aspectRatio: true,
              fullscreen: false,
              theme: "#d53ff0",
              customType: {
                m3u8: (videoElement, url) => {
                  if (Hls.isSupported()) {
                    const hls = new Hls();
                    hls.loadSource(url);
                    hls.attachMedia(videoElement);
                  } else if (
                    videoElement.canPlayType("application/vnd.apple.mpegurl")
                  ) {
                    videoElement.src = url;
                  }
                },
              },
              icons: {
                loading: `<img width="100" height="100" src=${vod_loader}>`,
                state: `<img width="50" height="50" src=${indicator}>`,
              },
            });

            // Trigger the onPlay callback when playback starts
            artPlayerInstanceRef.current.on("play", () => {
              if (onPlay) onPlay();
            });
          }
        },
      });

      // Start observing for lazy loading
      observer.observe();

      // Handle visibility and autoplay using IntersectionObserver
      const handleIntersection = (entries: any) => {
        entries.forEach((entry: any) => {
          if (entry.isIntersecting) {
            artPlayerInstanceRef.current?.play();
          } else {
            artPlayerInstanceRef.current?.pause();
          }
        });
      };

      const intersectionObserver = new IntersectionObserver(
        handleIntersection,
        {
          rootMargin: "200px 0px",
          threshold: 0.1,
        }
      );

      intersectionObserver.observe(playerContainerRef.current);

      // return () => {
      //   // Clean up the Artplayer instance and observers
      //   if (artPlayerInstanceRef.current) {
      //     artPlayerInstanceRef.current.destroy();
      //     artPlayerInstanceRef.current = null;
      //   }
      //   // Safely clean up IntersectionObserver
      //   if (intersectionObserver) intersectionObserver.disconnect();

      //   // Safely clean up lozad observer
      //   if (observer && observer.observe) {
      //     observer.observe = () => {};
      //   }
      // };

      return () => {
        // Clean up the Artplayer instance and observers
        if (artPlayerInstanceRef.current) {
          artPlayerInstanceRef.current.destroy();
          artPlayerInstanceRef.current = null;
        }
        // Safely clean up IntersectionObserver
        if (intersectionObserver) intersectionObserver.disconnect();

        // // Safely clean up lozad observer
        // if (observer && observer.observe) {
        //   observer.disconnect();
        // }
        // Use lozad's custom API for cleanup
        // if (observer) {
        //   observer = null; // Safely nullify; lozad has no explicit `disconnect`
        // }
      };
    }
  }, [src, thumbnail]);

  useEffect(() => {
    // Update the mute state if the prop changes
    if (artPlayerInstanceRef.current) {
      artPlayerInstanceRef.current.muted = mute;
    }
  }, [mute]); // This effect runs whenever `mute` changes
  useEffect(() => {
    if (artPlayerInstanceRef.current) {
      artPlayerInstanceRef.current.fullscreenWeb = rotate;
    }
  }, [rotate]); // This effect runs whenever `mute` changes

  return <div ref={playerContainerRef} className="video_player w-full" />;
};

export default SearchPlayer;
