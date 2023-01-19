import { Chapter, Video } from "@/eos-defs";
import useEventBus from "@/hooks/useEventBus";
import { createStyles } from "@mantine/core";
import getConfig from "next/config";
import React, { useEffect, useRef, useState } from "react";
import videojs, { VideoJsPlayer } from "video.js";
import VideoJS from "./VideoJS";

const useStyles = createStyles((theme) => ({
  playerContainer: {
    height: "calc(100vh - 11rem) !important",
    maxHeight: "calc(100vh - 11rem) !important",
    width: "auto",
  },
}));

const VideoPlayer = (video: Video) => {
  const { publicRuntimeConfig } = getConfig();
  const { classes, cx, theme } = useStyles();
  const playerRef = useRef(null);
  const eventBus = useEventBus();

  const [playerReady, setPlayerReady] = useState(false);
  const [videoJsOptions, setVideoJsOptions] = useState({});

  useEffect(() => {
    console.log(
      `${publicRuntimeConfig.CDN_URL}${encodeURIComponent(video.video_path)}`
    );

    const options = {
      autoplay: false,
      controls: true,
      playbackRates: [0.5, 1, 1.5, 2, 2.5],
      sources: [
        {
          src: `${publicRuntimeConfig.CDN_URL}${encodeURIComponent(
            video.video_path
          )}`,
          type: "video/webm",
        },
      ],
      tracks: [],
      plugins: {
        hotkeys: {
          seekStep: 20,
          volumeStep: 0.1,
          enableVolumeScroll: false,
          enableHoverScroll: true,
          enableModifiersForNumbers: false,
        },
      },
    };

    if (video.thumbnail_path) {
      options.poster = `${publicRuntimeConfig.CDN_URL}${encodeURIComponent(
        video.thumbnail_path
      )}`;
    }

    if (video.caption_path) {
      options.tracks.push({
        src: `${publicRuntimeConfig.CDN_URL}${encodeURIComponent(
          video.caption_path
        )}`,
        kind: "captions",
        srclang: "en",
        label: "Eos Captions",
      });
    }

    if (video.edges.chapters) {
    }

    setVideoJsOptions(options);

    setPlayerReady(true);
  }, [video, publicRuntimeConfig.CDN_URL]);

  const handlePlayerReady = (player) => {
    playerRef.current = player;

    // Volume
    const localVolume = localStorage.getItem("eos-volume");
    if (localVolume) {
      player.volume(localVolume);
    }

    player.on("volumechange", () => {
      localStorage.setItem("eos-volume", player.volume());
    });

    player.on("play", () => {
      player.bigPlayButton.hide();
    });

    player.on("pause", () => {
      player.bigPlayButton.show();
    });

    eventBus.on("toTimestamp", (time: number) => {
      player.currentTime(time);
      // Scroll to top of page
      window.scrollTo(0, 0);
    });
  };

  return (
    <div>
      <div></div>
      <div className={classes.playerContainer}>
        {playerReady && (
          <VideoJS options={videoJsOptions} onReady={handlePlayerReady} />
        )}
      </div>
    </div>
  );
};

export default VideoPlayer;
