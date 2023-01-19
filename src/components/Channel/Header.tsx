import { Channel } from "@/eos-defs";
import { Center, createStyles, Title } from "@mantine/core";

const useStyles = createStyles((theme) => ({
  header: {
    width: "100%",
    height: 75,
  },
  center: {
    width: "100%",
    height: 75,
  },
}));

export const ChannelHeader = (channel: Channel) => {
  const { classes, cx, theme } = useStyles();
  return (
    <div className={classes.header}>
      <Center className={classes.center}>
        <Title order={1}>{channel.name}</Title>
      </Center>
    </div>
  );
};
