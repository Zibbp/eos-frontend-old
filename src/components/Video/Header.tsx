import { Video } from "@/eos-defs";
import { ActionIcon, Avatar, createStyles } from "@mantine/core";
import { IconThumbDown, IconThumbDownOff, IconThumbUp } from "@tabler/icons";
import dayjs from "dayjs";
import getConfig from "next/config";
import Link from "next/link";
import React from "react";

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
}));

const VideoHeader = (video: Video) => {
  const { publicRuntimeConfig } = getConfig();
  const { classes, cx, theme } = useStyles();

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
    </div>
  );
};

export default VideoHeader;
