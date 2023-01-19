import { Video } from "@/eos-defs";
import { UseApi } from "@/hooks/useApi";
import { createStyles } from "@mantine/core";
import { useQuery } from "@tanstack/react-query";
import React from "react";
import EosLoader from "../layouts/EosLoader";
import VideoCard from "./Card";
import VideoVerticalCard from "./VerticalCard";

const useStyles = createStyles((theme) => ({
  verticalBar: {
    paddingLeft: "1rem",
  },
  cardItem: {
    marginBottom: "0.5rem",
  },
}));

const VideoSideBar = (video: Video) => {
  const { classes, cx, theme } = useStyles();

  const { isLoading, error, data } = useQuery({
    queryKey: ["channels"],
    queryFn: async () =>
      UseApi({
        method: "GET",
        url: "/api/v1/videos/random?number=10",
      }).then((res) => res.data),
    refetchOnWindowFocus: false,
  });

  if (error) return <div>failed to load</div>;
  if (isLoading)
    return (
      <div>
        <EosLoader />
      </div>
    );

  return (
    <div>
      <div className={classes.verticalBar}>
        {data.map((video: Video) => (
          <div key={video.id} className={classes.cardItem}>
            <VideoCard {...video} />
          </div>
        ))}
      </div>
    </div>
  );
};

export default VideoSideBar;
