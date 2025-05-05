import CommentSection from "@/features/comments/component/CommentSection";
import { ExperienceDetails } from "@/features/experiences/components/ExperienceDetails";
import { isTRPCClientError, trpc } from "@/router";
import { createFileRoute, notFound } from "@tanstack/react-router";
import { z } from "zod";

export const Route = createFileRoute("/experiences/$experienceId/")({
  params: {
    parse: (params) => ({
      experienceId: z.coerce.number().parse(params.experienceId),
    }),
  },
  component: ExperiencePage,
  loader: async ({ params, context: { trpcQueryUtils } }) => {
    try {
      await trpcQueryUtils.experiences.byId.ensureData({
        id: params.experienceId,
      });
    } catch (error) {
      if (isTRPCClientError(error) && error.data?.code === "NOT_FOUND") {
        // Handle the error here, e.g., redirect to a 404 page
        throw notFound();
      }
      throw error; // Rethrow the error if it's not a TRPCClientError
    }
  },
});

function ExperiencePage() {
  const { experienceId } = Route.useParams();
  const [experience] = trpc.experiences.byId.useSuspenseQuery({
    id: experienceId,
  });
  return (
    <div className="space-y-4 pb-20">
      <ExperienceDetails experience={experience} />
      <CommentSection
        experienceId={experienceId}
        commentsCount={experience.commentsCount}
      />
    </div>
  );
}
