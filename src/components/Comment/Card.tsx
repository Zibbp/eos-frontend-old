import { Comment } from "@/eos-defs";
import { ActionIcon, createStyles } from "@mantine/core";
import { IconChevronDown, IconThumbUp } from "@tabler/icons";
import dayjs from "dayjs";
import React, { useState } from "react";

const useStyles = createStyles((theme) => ({
  comment: {
    marginTop: "0.25rem",
    marginBottom: "0.25rem",
    width: "100%",
  },
  author: {
    color:
      theme.colorScheme === "dark"
        ? theme.colors.dark[0]
        : theme.colors.dark[9],
    fontWeight: 700,
  },
  authorIsUploader: {
    color: theme.colors.yellow[6],
    fontWeight: 700,
  },
  timestamp: {
    color:
      theme.colorScheme === "dark"
        ? theme.colors.dark[2]
        : theme.colors.gray[7],
    fontSize: "0.9rem",
  },
  message: {
    color:
      theme.colorScheme === "dark"
        ? theme.colors.dark[0]
        : theme.colors.dark[9],
    fontSize: "1rem",
  },
  likeIcon: {
    paddingBottom: "0.4rem",
    color:
      theme.colorScheme === "dark"
        ? theme.colors.dark[0]
        : theme.colors.dark[9],
  },
  likeText: {
    color:
      theme.colorScheme === "dark"
        ? theme.colors.dark[0]
        : theme.colors.dark[9],
    fontSize: "0.9rem",
  },
  reply: {
    marginLeft: "2rem",
  },
  showReplies: {
    display: "flex",
    color: theme.colors.blue[6],
    cursor: "pointer",
    fontSize: "0.9rem",
  },
  replyIcon: {
    paddingBottom: "0.4rem",
    color: theme.colors.blue[6],
  },
}));

const CommentCard = (comment: Comment) => {
  const { classes, cx, theme } = useStyles();
  const [showReplies, setShowReplies] = useState(false);

  const toggleShowReplies = () => {
    setShowReplies(!showReplies);
  };

  return (
    <div className={classes.comment}>
      {comment.author_is_uploader ? (
        <div className={classes.authorIsUploader}>{comment.author}</div>
      ) : (
        <div className={classes.author}>{comment.author}</div>
      )}
      <div className={classes.timestamp}>
        {dayjs(comment.timestamp).format("YYYY/MM/DD")}
      </div>
      <div className={classes.message}>{comment.text}</div>
      <div>
        <span style={{ display: "flex" }}>
          <ActionIcon className={classes.likeIcon} variant="transparent">
            <IconThumbUp size={16} />
          </ActionIcon>
          <span className={classes.likeText}>
            {comment.like_count.toLocaleString()}
          </span>
        </span>
      </div>
      {comment.replies && comment.replies.length > 0 && (
        <div>
          <span
            className={classes.showReplies}
            onClick={() => toggleShowReplies()}
          >
            <ActionIcon className={classes.replyIcon} variant="transparent">
              <IconChevronDown size={16} />
            </ActionIcon>
            <span>Show {comment.replies.length.toLocaleString()} replies</span>
          </span>
          {showReplies && (
            <div>
              {comment.replies.map((reply) => (
                <div key={reply.id} className={classes.reply}>
                  <CommentCard {...reply} />
                </div>
              ))}
            </div>
          )}
        </div>
      )}
    </div>
  );
};

export default CommentCard;
