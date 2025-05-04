import Spinner from "@/features/shared/components/ui/Spinner";
import { CommentForList } from "../type";
import CommentCard from "./CommentCard";

type CommentListProps = {
  comments: CommentForList[];
  isLoading: boolean;
  noCommentsMessage?: string;
};

const CommentList = ({
  comments,
  isLoading,
  noCommentsMessage = "No comments found",
}: CommentListProps) => {
  return (
    <div className="space-y-4">
      {comments.map((comment) => (
        <CommentCard key={comment.id} comment={comment} />
      ))}
      {isLoading && (
        <div className="flex justify-center">
          <Spinner />
        </div>
      )}
      {!isLoading && comments.length === 0 && (
        <div className="flex justify-center">{noCommentsMessage}</div>
      )}
    </div>
  );
};

export default CommentList;
