import { Button } from "@/features/shared/components/ui/Button";
import Card from "@/features/shared/components/ui/Card";
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormMessage,
} from "@/features/shared/components/ui/Form";
import { TextArea } from "@/features/shared/components/ui/TextArea";
import { useToast } from "@/features/shared/hooks/useToast";
import { trpc } from "@/trpc";
import { Comment } from "@advanced-react/server/database/schema";
import { commentValidationSchema } from "@advanced-react/shared/schema/comment";
import { zodResolver } from "@hookform/resolvers/zod";
import { useForm } from "react-hook-form";
import { z } from "zod";

type CommentEditFormData = z.infer<typeof commentValidationSchema>;

type CommentEditFormProps = {
  comment: Comment;
  setIsEditing: (isEditing: boolean) => void;
};
const CommentEditForm = ({ comment, setIsEditing }: CommentEditFormProps) => {
  const { toast } = useToast();
  const utils = trpc.useUtils();
  const form = useForm<CommentEditFormData>({
    resolver: zodResolver(commentValidationSchema),
    defaultValues: {
      content: comment.content,
    },
  });

  const editCommentMutation = trpc.comments.edit.useMutation({
    onSuccess: async ({ experienceId }) => {
      await utils.comments.byExperienceId.invalidate({
        experienceId: experienceId,
      });
      setIsEditing(false);
      toast({
        title: "Comment edited",
        description: "Your comment has been edited successfully.",
      });
    },
    onError: (error) => {
      toast({
        title: "Failed to edit comment",
        description: error.message,
        variant: "destructive",
      });
    },
  });

  const handleSubmit = form.handleSubmit((data) => {
    editCommentMutation.mutate({
      id: comment.id,
      content: data.content,
    });
  });
  return (
    <Form {...form}>
      <Card>
        <form onSubmit={handleSubmit} className="w-full space-y-4">
          <FormField
            control={form.control}
            name="content"
            render={({ field }) => (
              <FormItem>
                <FormControl>
                  <TextArea placeholder="Edit your comment" {...field} />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />
          <div className="flex gap-4">
            <Button type="submit" disabled={editCommentMutation.isPending}>
              {editCommentMutation.isPending ? "Saving..." : "Save"}
            </Button>
            <Button
              variant={"link"}
              onClick={() => setIsEditing(false)}
              disabled={editCommentMutation.isPending}
            >
              Cancel
            </Button>
          </div>
        </form>
      </Card>
    </Form>
  );
};

export default CommentEditForm;
