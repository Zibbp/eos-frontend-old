export interface Channel {
  id: string;
  name: string;
  description: string;
  image_path: string;
  created_at: string;
  updated_at: string;
}

export interface Video {
  id: string;
  title: string;
  description: string;
  upload_date: string;
  uploader: string;
  duration: number;
  view_count: number;
  like_count: number;
  dislike_count: number;
  format: string;
  width: number;
  height: number;
  resolution: string;
  fps: number;
  audio_codec: string;
  video_codec: string;
  abr: number;
  vbr: number;
  epoch: number;
  comment_count: number;
  tags: string;
  categories: string;
  video_path: string;
  thumbnail_path: string;
  json_path: string;
  caption_path: string;
  path: string;
  created_at: string;
  updated_at: string;
  edges: {
    channel: Channel;
    chapters: Chapters;
  };
}

export interface Chapter {
  id: string;
  title: string;
  start_time: number;
  end_time: number;
}

export interface Chapters {
  chapters: Chapter[];
}

export interface Comment {
  id: string;
  text: string;
  timestamp: string;
  like_count: number;
  is_favorited: boolean;
  author: string;
  author_id: string;
  author_thumbnail: string;
  author_is_uploader: string;
  parent: string;
  replies: Comment[];
}
