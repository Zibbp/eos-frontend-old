import { Comment, Video } from "@/eos-defs";
import { UseApi } from "@/hooks/useApi";
import {
  ActionIcon,
  Center,
  createStyles,
  Group,
  NumberInput,
  NumberInputHandlers,
  Pagination,
} from "@mantine/core";
import { useQuery } from "@tanstack/react-query";
import React, { useRef, useState } from "react";
import CommentCard from "../Comment/Card";
import EosLoader from "../layouts/EosLoader";

async function getComments(videoId: string, page: number, limit: number) {
  return UseApi({
    method: "GET",
    url: `/api/v1/comments?limit=${limit}&offset=${
      (page - 1) * limit
    }&video_id=${videoId}`,
  }).then((res) => res.data);
}

const useStyles = createStyles((theme) => ({
  title: {
    fontSize: "1.1rem",
    lineHeight: "1.75rem",
    fontWeight: 500,
    marginTop: "1rem",
  },
}));

const VideoComments = (video: Video) => {
  const { classes, cx, theme } = useStyles();

  const [activePage, setPage] = useState(1);
  const [limit, setLimit] = useState(10);
  const handlers = useRef<NumberInputHandlers>();

  // React Query
  const { isLoading, error, data } = useQuery({
    queryKey: ["channel-vods", video.id, activePage, limit],
    queryFn: () => getComments(video.id, activePage, limit),
    refetchOnWindowFocus: false,
  });

  if (error) return <div>failed to load</div>;

  return (
    <div>
      <div className={classes.title}>
        {video.comment_count.toLocaleString()} Comments
      </div>
      <div>
        {isLoading ? (
          <EosLoader />
        ) : (
          <div>
            {data.data.length > 0 ? (
              <div>
                {data.data.map((comment: Comment) => {
                  return <CommentCard key={comment.id} {...comment} />;
                })}
              </div>
            ) : (
              <div>No comments</div>
            )}
            <Center mt={5}>
              <div>
                <Pagination
                  page={activePage}
                  onChange={setPage}
                  total={data.pages}
                  color="red"
                  mb={10}
                />
              </div>
            </Center>
          </div>
        )}
      </div>
    </div>
  );
};

export default VideoComments;
