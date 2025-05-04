import { Experience, User } from "@advanced-react/server/database/schema";

type ExperienceWithUser = Experience & {
  user: User;
};

type ExperienceWithCommentCounts = Experience & {
  commentsCount: number;
};

export type ExperienceForList = ExperienceWithUser &
  ExperienceWithCommentCounts;
