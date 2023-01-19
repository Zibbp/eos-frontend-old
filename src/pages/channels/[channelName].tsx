import { ChannelHeader } from "@/components/Channel/Header";
import EosLoader from "@/components/layouts/EosLoader";
import VideoCard from "@/components/Video/Card";
import { Video } from "@/eos-defs";
import { UseApi } from "@/hooks/useApi";
import {
  ActionIcon,
  Center,
  Container,
  Grid,
  Group,
  NumberInput,
  NumberInputHandlers,
  Pagination,
} from "@mantine/core";
import { useDocumentTitle } from "@mantine/hooks";
import { useQuery, useQueryClient } from "@tanstack/react-query";
import React, { useRef, useState } from "react";

async function getVideos(channelId: string, page: number, limit: number) {
  return UseApi({
    method: "GET",
    url: `/api/v1/videos?limit=${limit}&offset=${
      (page - 1) * limit
    }&channel_id=${channelId}`,
  }).then((res) => res.data);
}

const ChannelPage = (props: any) => {
  const [activePage, setPage] = useState(1);
  const [limit, setLimit] = useState(24);
  const handlers = useRef<NumberInputHandlers>();

  useDocumentTitle(`${props.channel.name} - Eos`);

  // React Query
  const { isLoading, error, data } = useQuery({
    queryKey: ["channel-vods", props.channel.id, activePage, limit],
    queryFn: () => getVideos(props.channel.id, activePage, limit),
  });

  if (error) return <div>failed to load</div>;

  return (
    <div>
      <div>
        <ChannelHeader {...props.channel} />
      </div>
      {isLoading ? (
        <EosLoader />
      ) : (
        <div>
          {data.data.length > 0 ? (
            <Container size="xl" px="xl" fluid={true}>
              <div>
                <Grid>
                  {data.data.map((video: Video) => {
                    return (
                      <Grid.Col key={video.id} md={6} lg={2}>
                        <VideoCard {...video} />
                      </Grid.Col>
                    );
                  })}
                </Grid>
              </div>
              <Center mt={5}>
                <div>
                  <Pagination
                    page={activePage}
                    onChange={setPage}
                    total={data.pages}
                    color="red"
                  />
                  <Center mt={5} mb={20}>
                    <Group spacing={5}>
                      <ActionIcon
                        size={33}
                        variant="default"
                        onClick={() => handlers.current.decrement()}
                      >
                        –
                      </ActionIcon>

                      <NumberInput
                        hideControls
                        value={limit}
                        onChange={setLimit}
                        handlersRef={handlers}
                        max={120}
                        min={24}
                        step={24}
                        styles={{ input: { width: 54, textAlign: "center" } }}
                      />

                      <ActionIcon
                        size={33}
                        variant="default"
                        onClick={() => handlers.current.increment()}
                      >
                        +
                      </ActionIcon>
                    </Group>
                  </Center>
                </div>
              </Center>
            </Container>
          ) : (
            <div>No videos found</div>
          )}
        </div>
      )}
    </div>
  );
};

export async function getServerSideProps(context: any) {
  const { channelName } = context.query;
  try {
    const res = await UseApi({
      method: "GET",
      url: `/api/v1/channels/name/${channelName}`,
    });
    const channel = res.data;
    return {
      props: {
        channel,
      },
    };
  } catch (error) {
    console.log("error: ", error);
    return {
      notFound: true,
    };
  }
}

export default ChannelPage;
function useStyles(): { classes: any; cx: any; theme: any } {
  throw new Error("Function not implemented.");
}
