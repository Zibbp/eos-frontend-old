import { Channel } from "@/eos-defs";
import { Card, createStyles, Title } from "@mantine/core";
import getConfig from "next/config";
import Image from "next/image";
import Link from "next/link";
import React from "react";

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

  return (
    <Link href={"/channels/" + channel.name} className={classes.link}>
      <Card p="md" radius="md" className={classes.card}>
        <Card.Section className={classes.imageSection}>
          <Image
            src={publicRuntimeConfig.CDN_URL + channel.image_path}
            alt={channel.name}
            width={200}
            height={200}
            priority
            className={classes.image}
          />
        </Card.Section>
        <Title mt="xs" order={2} align="center" className={classes.title}>
          {channel.name}
        </Title>
      </Card>
    </Link>
  );
};

export default ChannelCard;
