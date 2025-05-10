import Card from "@/features/shared/components/ui/Card";
import { CommentForList } from "../type";
import { useState } from "react";
import CommentEditForm from "./CommentEditForm";
import { Button } from "@/features/shared/components/ui/Button";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/features/shared/components/ui/Dialog";
import { trpc } from "@/router";
import { useToast } from "@/features/shared/hooks/useToast";
import { UserAvatar } from "@/features/users/components/UserAvatar";
import Link from "@/features/shared/components/ui/Link";

type CommentCardProps = {
  comment: CommentForList;
};
const CommentCard = ({ comment }: CommentCardProps) => {
  const [isEditing, setIsEditing] = useState(false);
  if (isEditing) {
    return <CommentEditForm comment={comment} setIsEditing={setIsEditing} />;
  }
  return (
    <Card className="space-y-4">
      <CommentCardHeader comment={comment} />
      <CommentCardContent comment={comment} />
      <CommentCardButtons setIsEditing={setIsEditing} comment={comment} />
    </Card>
  );
};

export default CommentCard;

type CommentCardHeaderProps = Pick<CommentCardProps, "comment">;
const CommentCardHeader = ({ comment }: CommentCardHeaderProps) => {
  return (
    <div className="flex items-center gap-2">
      <Link to={`/users/$userId`} params={{ userId: comment.user.id }}>
        <UserAvatar user={comment.user} />
      </Link>
      <time className="text-sm text-neutral-600">
        - {new Date(comment.createdAt).toLocaleDateString()}
      </time>
    </div>
  );
};

type CommentCardContentProps = Pick<CommentCardProps, "comment">;
const CommentCardContent = ({ comment }: CommentCardContentProps) => {
  return <div>{comment.content}</div>;
};

type CommentCardButtonsProps = Pick<CommentCardProps, "comment"> & {
  setIsEditing: (isEditing: boolean) => void;
};
const CommentCardButtons = ({
  comment,
  setIsEditing,
}: CommentCardButtonsProps) => {
  const [isDeleteDialogOpen, setIsDeleteDialogOpen] = useState(false);
  const { toast } = useToast();
  const utils = trpc.useUtils();
  const deleteCommentMutation = trpc.comments.delete.useMutation({
    onSuccess: async () => {
      await Promise.all([
        utils.comments.byExperienceId.invalidate({
          experienceId: comment.experienceId,
        }),
        utils.experiences.feed.invalidate({}),
      ]);
      setIsDeleteDialogOpen(false);
      toast({
        title: "Comment deleted",
        description: "Your comment has been deleted successfully.",
      });
    },
    onError: (error) => {
      toast({
        title: "Failed to delete comment",
        description: error.message,
        variant: "destructive",
      });
    },
  });
  return (
    <div className="flex items-center gap-4">
      <Button variant={"link"} onClick={() => setIsEditing(true)}>
        Edit
      </Button>
      <Dialog open={isDeleteDialogOpen} onOpenChange={setIsDeleteDialogOpen}>
        <DialogTrigger asChild>
          <Button variant={"destructive-link"}>Delete</Button>
        </DialogTrigger>
        <DialogContent className="w-1/3">
          <DialogHeader>
            <DialogTitle>Delete Comment</DialogTitle>
            <DialogDescription>
              Are you sure you want to delete this comment? This action cannot
              be undone.
            </DialogDescription>
          </DialogHeader>
          <DialogFooter className="flex justify-end gap-4">
            <Button
              variant={"outline"}
              onClick={() => setIsDeleteDialogOpen(false)}
            >
              Cancel
            </Button>
            <Button
              variant={"destructive"}
              onClick={() => deleteCommentMutation.mutate({ id: comment.id })}
              disabled={deleteCommentMutation.isPending}
            >
              {deleteCommentMutation.isPending ? "Deleting..." : "Delete"}
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </div>
  );
};
