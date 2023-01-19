import { Video } from "@/eos-defs";
import { Badge, Card, Tooltip, Text, createStyles } from "@mantine/core";
import getConfig from "next/config";
import Link from "next/link";
import Image from "next/image";
import React, { useEffect, useState } from "react";
import dayjs from "dayjs";
import duration from "dayjs/plugin/duration";
import { useHover } from "@mantine/hooks";
dayjs.extend(duration);

const useStyles = createStyles((theme) => ({
  card: {
    backgroundColor: "transparent",
    textDecoration: "none",
    borderRadius: theme.radius.md,
  },
  dateBadge: {
    position: "absolute",
    top: "5px",
    right: "5px",
    pointerEvents: "none",
    backgroundColor: "rgba(0, 0, 0, 0.6)",
  },
  durationBadge: {
    position: "absolute",
    top: "5px",
    left: "5px",
    pointerEvents: "none",
    backgroundColor: "rgba(0, 0, 0, 0.6)",
    borderRadius: theme.radius.md,
  },
  processingOverlay: {
    backgroundColor: "rgba(0, 0, 0, 0.4)",
    position: "absolute",
    width: "100%",
    height: "100%",
    top: 0,
    zIndex: 2,
    borderRadius: theme.radius.sm,
  },
  processingContent: {
    margin: 0,
    position: "absolute",
    top: "50%",
    transform: "translateY(-50%)",
  },
  processingText: {
    color: theme.white,
  },
  progressBar: {
    marginTop: "-0.3rem",
  },
  watchedIcon: {
    position: "absolute",
    top: "2px",
    right: "2px",
  },
  typeBadge: {},
  videoTitle: {
    color:
      theme.colorScheme === "dark"
        ? theme.colors.gray[2]
        : theme.colors.dark[8],
    fontFamily: `Inter, ${theme.fontFamily}`,
    fontWeight: 600,
  },
  infoBar: {
    display: "flex",
  },
  infoBarRight: {
    marginLeft: "auto",
    order: 2,
  },
  infoBarText: {
    fontFamily: `Inter, ${theme.fontFamily}`,
    fontWeight: 400,
    fontSize: "15px",
  },
  badgeText: {
    fontFamily: `Inter, ${theme.fontFamily}`,
    fontWeight: 400,
  },
  outerImage: {
    display: "inline-block",
    overflow: "hidden",
  },
  image: {
    width: "100%",
    height: "auto",
    objectFit: "cover",
    transition: "transform 200ms ease-out",
    borderRadius: theme.radius.md,
  },
  placeHolderImage: {
    width: "100%",
    height: "auto",
    borderRadius: theme.radius.md,
  },
  imageHover: {
    display: "block",
    borderRadius: theme.radius.md,
    transform: "scale(1.05)",
    transformOrigin: "50% 50%",
  },
  link: {
    textDecoration: "none",
  },
  hovered: {},
}));

const numFormatter = (num) => {
  if (num > 999 && num < 1000000) {
    return (num / 1000).toFixed(0) + "K"; // convert to K for number from > 1000 < 1 million
  } else if (num > 1000000) {
    return (num / 1000000).toFixed(1) + "M"; // convert to M for number from > 1 million
  } else if (num < 900) {
    return num; // if value < 1000, nothing to do
  }
};

const VideoCard = (video: Video) => {
  const { publicRuntimeConfig } = getConfig();
  const { classes, cx, theme } = useStyles();
  const { hovered, ref } = useHover();
  const [imageLoaded, setImageLoaded] = useState(false);

  const preloadImage = (url) => {
    const image = new window.Image();
    image.src = url;
  };

  const handleImageLoaded = () => {
    setImageLoaded(true);
  };

  const imageStyle = !imageLoaded ? { display: "none" } : {};

  useEffect(() => {
    preloadImage(
      `${publicRuntimeConfig.CDN_URL}${encodeURIComponent(
        video.thumbnail_path
      )}`
    );
  }, [video.thumbnail_path, publicRuntimeConfig.CDN_URL]);

  return (
    <div ref={ref}>
      <Link href={"/videos/" + video.id} className={classes.link}>
        <Card className={classes.card} p={0} radius={0}>
          <Card.Section>
            <div
              className={`${hovered ? classes.hovered : ""} ${
                classes.outerImage
              }`}
            >
              {!imageLoaded && (
                // eslint-disable-next-line @next/next/no-img-element
                <img
                  src="/images/eos-thumbnail.webp"
                  className={classes.placeHolderImage}
                  alt={video.title}
                />
              )}
              {/* eslint-disable-next-line @next/next/no-img-element */}
              <img
                src={`${publicRuntimeConfig.CDN_URL}${encodeURIComponent(
                  video.thumbnail_path
                )}`}
                onLoad={() => {
                  handleImageLoaded();
                }}
                className={`${classes.image} ${
                  hovered ? classes.imageHover : ""
                }`}
                alt={video.title}
                style={imageStyle}
                width={1280}
                height={720}
              />
            </div>
          </Card.Section>

          <Badge py={0} px={5} className={classes.durationBadge} radius="xs">
            <Text className={classes.badgeText} color="gray.2" mt={1}>
              {dayjs
                .duration(video.duration, "seconds")
                .format("HH:mm:ss")
                .replace(/^00:/, "")}
            </Text>
          </Badge>

          <Text lineClamp={2} weight={500}>
            <Tooltip
              inline
              openDelay={500}
              closeDelay={100}
              multiline
              label={video.title}
              className={classes.videoTitle}
            >
              <span>{video.title}</span>
            </Tooltip>
          </Text>

          <div className={classes.infoBar}>
            <Tooltip
              label={`Uploaded At ${new Date(
                video.upload_date
              ).toLocaleString()}`}
            >
              <Text className={classes.infoBarText}>
                {dayjs(video.upload_date).format("YYYY/MM/DD")}
              </Text>
            </Tooltip>
            <div className={classes.infoBarRight}>
              <Tooltip label={`${video.view_count.toLocaleString()} Views`}>
                <Text>{numFormatter(video.view_count)} views</Text>
              </Tooltip>
            </div>
          </div>
        </Card>
      </Link>
    </div>
  );
};

export default VideoCard;
