import { UseApi } from "../../hooks/useApi";
import { useQuery, useQueryClient } from "@tanstack/react-query";
import React from "react";
import EosLoader from "@/components/layouts/EosLoader";
import { Container, Grid } from "@mantine/core";
import { Channel } from "@/eos-defs";
import ChannelCard from "@/components/Channel/Card";
import { useDocumentTitle } from "@mantine/hooks";

const ChannelsPage = () => {
  useDocumentTitle("Channels - Eos");

  const { isLoading, error, data } = useQuery({
    queryKey: ["channels"],
    queryFn: async () =>
      UseApi({
        method: "GET",
        url: "/api/v1/channels",
      }).then((res) => res.data),
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
      <Container fluid={true} mt={10}>
        <Grid>
          {data.map((channel: Channel) => (
            <Grid.Col key={channel.id} md={6} lg={2}>
              <ChannelCard {...channel} />
            </Grid.Col>
          ))}
        </Grid>
      </Container>
    </div>
  );
};

export default ChannelsPage;
