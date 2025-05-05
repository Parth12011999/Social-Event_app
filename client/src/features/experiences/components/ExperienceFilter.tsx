import { Button } from "@/features/shared/components/ui/Button";
import Card from "@/features/shared/components/ui/Card";
import { Form, FormControl, FormField, FormItem, FormMessage } from "@/features/shared/components/ui/Form";
import Input from "@/features/shared/components/ui/Input";
import { ExperienceFilterParams } from "@advanced-react/shared/schema/experience";
import { Search } from "lucide-react";
import { useForm } from "react-hook-form";

type ExperienceFilterProps = {
  onFilterChange: (filters: ExperienceFilterParams) => void;
  initialFilters?: ExperienceFilterParams;
};

const ExperienceFilter = ({
  onFilterChange,
  initialFilters,
}: ExperienceFilterProps) => {
  const form = useForm<ExperienceFilterParams>({
    defaultValues: initialFilters,
  });
  const handleSubmit = form.handleSubmit((values) => {
    const filters: ExperienceFilterParams = {};

    if (values.q) filters.q = values.q.trim();
    onFilterChange(filters);
  });

  return (
        <Form {...form}>
          <Card>
            <form className="flex flex-col gap-4" onSubmit={handleSubmit}>
              <FormField
                control={form.control}
                name="q"
                render={({ field }) => (
                  <FormItem className="flex-1">
                    <FormControl>
                      <Input
                        {...field}
                        type="search"
                        value={field.value ?? ""}
                        placeholder="Search experiences..."
                      />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
    
              <Button type="submit" disabled={form.formState.isSubmitting}>
                <Search className="h-4 w-4" />
                Search
              </Button>
            </form>
          </Card>
        </Form>
  )
};
export default ExperienceFilter;
 