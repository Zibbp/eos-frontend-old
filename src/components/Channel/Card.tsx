import { Channel } from "@/eos-defs";
import { Card, createStyles, Title } from "@mantine/core";
import getConfig from "next/config";
import Link from "next/link";
import React, { useEffect, useState } from "react";

const useStyles = createStyles((theme) => ({
  card: {
    transition: "transform 150ms ease, box-shadow 150ms ease",

    "&:hover": {
      boxShadow: theme.shadows.md,
      transform: "scale(1.05)",
    },
  },
  imageSection: {},
  image: {
    width: "100%",
    objectFit: "cover",
  },
  placeHolderImage: {
    width: "100%",
    objectFit: "cover",
    borderRadius: theme.radius.md,
  },
  title: {
    textDecoration: "none",
  },
  link: {
    textDecoration: "none",
  },
}));

const ChannelCard = (channel: Channel) => {
  const { publicRuntimeConfig } = getConfig();
  const { classes, theme } = useStyles();

  const [imageLoaded, setImageLoaded] = useState(false);

  const preloadImage = (url: string) => {
    const image = new window.Image();
    image.src = url;
  };

  const handleImageLoaded = () => {
    setImageLoaded(true);
  };

  const imageStyle = !imageLoaded ? { display: "none" } : {};

  useEffect(() => {
    preloadImage(
      `${publicRuntimeConfig.CDN_URL}${encodeURIComponent(channel.image_path)}`
    );
  }, [channel.image_path, publicRuntimeConfig.CDN_URL]);

  return (
    <Link href={"/channels/" + channel.name} className={classes.link}>
      <Card p="md" radius="md" className={classes.card}>
        <Card.Section className={classes.imageSection}>
          {!imageLoaded && (
            // eslint-disable-next-line @next/next/no-img-element
            <img
              src="/images/eos-thumbnail.webp"
              className={classes.placeHolderImage}
              alt={channel.name}
              width={200}
              height={200}
            />
          )}
          {/* eslint-disable-next-line @next/next/no-img-element */}
          <img
            src={`${publicRuntimeConfig.CDN_URL}${encodeURIComponent(
              channel.image_path
            )}`}
            onLoad={() => {
              handleImageLoaded();
            }}
            className={`${classes.image}`}
            alt={channel.name}
            style={imageStyle}
            width={200}
            height={200}
          />
          {/* <Image
            src={publicRuntimeConfig.CDN_URL + channel.image_path}
            alt={channel.name}
            width={200}
            height={200}
            priority
            className={classes.image}
          /> */}
        </Card.Section>
        <Title mt="xs" order={2} align="center" className={classes.title}>
          {channel.name}
        </Title>
      </Card>
    </Link>
  );
};

export default ChannelCard;
