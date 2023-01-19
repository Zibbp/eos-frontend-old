import { Video } from "@/eos-defs";
import useEventBus from "@/hooks/useEventBus";
import { createStyles } from "@mantine/core";
import React, { useEffect } from "react";
import { timestampToSeconds } from "@/utils/utils";

const useStyles = createStyles((theme) => ({
  title: {
    fontSize: "1rem",
    lineHeight: "1.75rem",
    fontWeight: 500,
  },
  description: {
    whiteSpace: "pre-wrap",
    marginTop: "0.5rem",
    "& a": {
      color: theme.colors.blue[6],
    },
    "& span": {
      color: theme.colors.blue[6],
      cursor: "pointer",
    },
  },
}));

const VideoDescription = (video: Video) => {
  const { classes, cx, theme } = useStyles();
  const [description, setDescription] = React.useState<string>("");
  const eventBus = useEventBus();

  useEffect(() => {
    const linkRegex = /([^\S]|^)(((https?\:\/\/)|(www\.))(\S+))/gi;
    const timestampRegex = /(?:(?:([01]?\d):)?([0-5]?\d))?:([0-5]?\d)/gi;

    const formatLinks = video.description.replace(
      linkRegex,
      "$1<a href='$2' target='_blank' >$2</a>"
    );
    const formatTimestamps = formatLinks.replace(
      timestampRegex,
      "$1<span>$&</span>"
    );

    setDescription(formatTimestamps);
  }, [video, setDescription]);

  const clickHandler = (e) => {
    const target = e.target.closest("span");
    if (target && e.currentTarget.contains(target)) {
      eventBus.emit("toTimestamp", timestampToSeconds(target.innerText));
    }
  };

  return (
    <div>
      <div
        onClick={(e) => clickHandler(e)}
        className={classes.description}
        dangerouslySetInnerHTML={{ __html: description }}
      />
    </div>
  );
};

export default VideoDescription;
