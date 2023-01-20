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
  TextInput,
} from "@mantine/core";
import { useDocumentTitle } from "@mantine/hooks";
import { IconSearch } from "@tabler/icons";
import { useQuery } from "@tanstack/react-query";
import React, { useEffect, useRef, useState } from "react";

const SearchPage = (props) => {
  const [searchTerm, setSearchTerm] = useState("");
  const [displaySearchTerm, setDisplaySearchTerm] = useState("");
  const [page, setPage] = useState(1);
  const [limit, setLimit] = useState(24);
  const handlers = useRef<NumberInputHandlers>();

  useDocumentTitle("Ganymede - Search");

  useEffect(() => {
    if (props.q && props.q.length > 0) {
      setDisplaySearchTerm(props.q);
      setSearchTerm(props.q);
    }
  }, []);

  const { isLoading, error, data } = useQuery({
    queryKey: ["search", searchTerm, page, limit],
    queryFn: () => {
      if (searchTerm != "") {
        return UseApi({
          method: "GET",
          url: `/api/v1/videos/search?q=${searchTerm}&limit=${limit}&offset=${
            (page - 1) * limit
          }`,
        }).then((res) => {
          return res?.data;
        });
      }
    },
  });

  return (
    <div>
      <Container size="xl" px="xl" fluid={true}>
        <Center mt={10}>
          <TextInput
            placeholder="Search"
            value={displaySearchTerm}
            onChange={(e) => setDisplaySearchTerm(e.currentTarget.value)}
            style={{ width: "35%" }}
            icon={<IconSearch size={16} stroke={1.5} />}
            onKeyUp={(e) => {
              if (e.key === "Enter") {
                setSearchTerm(displaySearchTerm);
              }
            }}
          />
        </Center>

        {isLoading && <EosLoader />}
        {!isLoading && data && (
          <div>
            <div>
              <Grid mt={10}>
                {data.data.map((video: Video) => (
                  <Grid.Col key={video.id} md={6} lg={2} xl={2}>
                    <VideoCard {...video} />
                  </Grid.Col>
                ))}
              </Grid>
            </div>
            <Center mt={5}>
              <div>
                <Pagination
                  page={page}
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
          </div>
        )}
      </Container>
    </div>
  );
};

export async function getServerSideProps(context: any) {
  const { q } = context.query;
  return {
    props: {
      q: q || null,
    },
  };
}

export default SearchPage;
