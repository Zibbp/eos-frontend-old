import VideoComments from "@/components/Video/Comments";
import VideoDescription from "@/components/Video/Description";
import VideoHeader from "@/components/Video/Header";
import VideoPlayer from "@/components/Video/Player";
import VideoSideBar from "@/components/Video/SideBar";
import { Video } from "@/eos-defs";
import { UseApi } from "@/hooks/useApi";
import { createStyles, Grid } from "@mantine/core";
import { useDocumentTitle } from "@mantine/hooks";
import {
  dehydrate,
  DehydratedState,
  QueryClient,
  useQuery,
  useQueryClient,
} from "@tanstack/react-query";
import Error from "next/error";
import React from "react";

const useStyles = createStyles((theme) => ({
  videoContainer: {
    marginTop: "0.5rem",
    marginLeft: "auto",
    marginRight: "auto",
    maxWidth: "90%",

    // Media query with value from theme
    [`@media (max-width: ${theme.breakpoints.xl}px)`]: {
      maxWidth: "100%",
    },
  },
  description: {
    marginTop: "2rem",
  },
}));

interface VideoProps {
  videoId: string;
  dehydratedState: DehydratedState;
}

async function fetchVideo(videoId: string) {
  return UseApi({ method: "GET", url: `/api/v1/videos/${videoId}` }).then(
    (res) => res?.data
  );
}

export async function getServerSideProps(context: any) {
  const { videoId } = context.query;
  const queryClient = new QueryClient();
  await queryClient.prefetchQuery(["video", videoId], () =>
    fetchVideo(videoId)
  );

  return {
    props: {
      videoId: videoId,
      dehydratedState: dehydrate(queryClient),
    },
  };
}

const VideoPage = (props: VideoProps) => {
  const { classes, cx, theme } = useStyles();

  useDocumentTitle(`Watch - Eos`);

  const { data } = useQuery({
    queryKey: ["video", props.videoId],
    queryFn: () => fetchVideo(props.videoId),
  });

  useDocumentTitle(`${data?.title} - Eos`);

  if (!data) {
    return <Error statusCode={404} />;
  }

  return (
    <div className={classes.videoContainer}>
      <Grid columns={12} gutter={0}>
        <Grid.Col span="auto">
          <VideoPlayer {...data} />
          <VideoHeader {...data} />
          <div className={classes.description}>
            <VideoDescription {...data} />
          </div>
          {data.comment_count && data.comment_count > 0 ? (
            <div>
              <VideoComments {...data} />
            </div>
          ) : (
            <div>
              <p>No comments</p>
            </div>
          )}
        </Grid.Col>
        {/* TODO: Check if side bar is enabled */}
        <Grid.Col span={2}>
          <VideoSideBar {...data} />
        </Grid.Col>
      </Grid>
    </div>
  );
};

export default VideoPage;
