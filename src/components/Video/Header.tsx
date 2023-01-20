import { Video } from "@/eos-defs";
import {
  ActionIcon,
  Avatar,
  Button,
  createStyles,
  Tooltip,
} from "@mantine/core";
import { useScrollIntoView } from "@mantine/hooks";
import { IconThumbDown, IconThumbUp } from "@tabler/icons";
import dayjs from "dayjs";
import getConfig from "next/config";
import Link from "next/link";
import React, { useState } from "react";

const useStyles = createStyles((theme) => ({
  title: {
    marginTop: "1rem",
    fontSize: "1.25rem",
    lineHeight: "1.75rem",
    fontWeight: 500,
  },
  bottom: {
    display: "flex",
    alignItems: "center",
    marginTop: "0.5rem",
  },
  channel: {
    lineHeight: "1.25rem",
    marginLeft: "0.25rem",
    marginTop: "0.3rem",
    fontWeight: 700,
    color:
      theme.colorScheme === "dark"
        ? theme.colors.dark[0]
        : theme.colors.dark[9],
  },
  spacer: {
    lineHeight: "1.25rem",
    marginLeft: "0.25rem",
    marginRight: "0.25rem",
    fontWeight: 700,
    color:
      theme.colorScheme === "dark"
        ? theme.colors.dark[0]
        : theme.colors.dark[9],
  },
  right: {
    marginLeft: "auto",
    display: "flex",
  },
  likeIcon: {
    paddingBottom: "0.4rem",
    color:
      theme.colorScheme === "dark"
        ? theme.colors.dark[0]
        : theme.colors.dark[9],
  },
  infoButton: {
    paddingTop: "0.1rem",
    marginLeft: "-0.4rem",
  },
  infoBold: {
    fontWeight: 700,
  },
  infoTitle: {
    marginTop: "0.5rem",
    fontWeight: 700,
    fontSize: "1.25rem",
  },
}));

const VideoHeader = (video: Video) => {
  const { publicRuntimeConfig } = getConfig();
  const { classes, cx, theme } = useStyles();
  const [showInfo, setShowInfo] = useState(false);
  const { scrollIntoView, targetRef } = useScrollIntoView<HTMLDivElement>();

  const toggleInfo = () => {
    setShowInfo(!showInfo);
    if (!showInfo) {
      scrollIntoView({ alignment: "center" });
    }
  };

  return (
    <div>
      <div className={classes.title}>{video.title}</div>
      <div className={classes.bottom}>
        <Link
          href={`/channels/${video.edges.channel.name}`}
          style={{ display: "flex" }}
        >
          <Avatar
            src={`${publicRuntimeConfig.CDN_URL}${video.edges.channel.image_path}`}
            alt={video.edges.channel.name}
            radius="xl"
            size={32}
          />
          <div className={classes.channel}>{video.edges.channel.name}</div>
        </Link>
        <div className={classes.spacer}>•</div>
        <div> {dayjs(video.upload_date).format("YYYY/MM/DD")}</div>
        <div className={classes.spacer}>•</div>
        <div>{video.view_count.toLocaleString()} views</div>
        <div className={classes.spacer}>•</div>
        <Tooltip label="More information">
          <Button
            variant="subtle"
            color="dark"
            size="sm"
            compact
            className={classes.infoButton}
            onClick={toggleInfo}
          >
            Information
          </Button>
        </Tooltip>

        {/* Right */}
        <div className={classes.right}>
          {video.like_count && (
            <span style={{ display: "flex" }}>
              <ActionIcon className={classes.likeIcon} variant="transparent">
                <IconThumbUp size={20} />
              </ActionIcon>
              {video.like_count.toLocaleString()}
            </span>
          )}
          {video.dislike_count && (
            <span style={{ display: "flex", marginLeft: "0.25rem" }}>
              <ActionIcon className={classes.likeIcon} variant="transparent">
                <IconThumbDown size={20} />
              </ActionIcon>
              {video.dislike_count.toLocaleString()}
            </span>
          )}
        </div>
      </div>
      {showInfo && (
        <div>
          <div className={classes.infoTitle}>Information</div>
          <div>
            <span className={classes.infoBold}>Format:</span> {video.format}
          </div>
          <div>
            <span className={classes.infoBold}>Resolution:</span>{" "}
            {video.resolution}
          </div>
          <div>
            <span className={classes.infoBold}>FPS:</span> {video.fps}
          </div>
          <div>
            <span className={classes.infoBold}>Audio:</span> {video.audio_codec}{" "}
            @ {video.abr} kbps
          </div>
          <div>
            <span className={classes.infoBold}>Video:</span> {video.video_codec}{" "}
            @ {video.vbr} kbps
          </div>
          <div>
            <span className={classes.infoBold}>Original Upload Date:</span>{" "}
            {video.upload_date}
          </div>
          <div>
            <span className={classes.infoBold}>Import Date:</span>{" "}
            {video.created_at}
          </div>
        </div>
      )}
      <div ref={targetRef}></div>
    </div>
  );
};

export default VideoHeader;
