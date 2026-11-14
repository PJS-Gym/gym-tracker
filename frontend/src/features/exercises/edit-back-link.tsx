import { BackLink } from "@/components/top-bar-link";

/** Back from editing to the exercise's own page. */
export async function EditBackLink({ params }: { params: Promise<{ id: string }> }) {
  const { id } = await params;
  return <BackLink href={`/cwiczenia/${encodeURIComponent(id)}`} label="Wróć do ćwiczenia" text="Ćwiczenie" />;
}
