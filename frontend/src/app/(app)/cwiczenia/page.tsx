import type { Metadata } from "next";
import { Suspense } from "react";
import { Screen } from "@/components/screen";
import { HeaderLink } from "@/components/top-bar-link";
import { ExerciseBrowser, ExerciseBrowserPlaceholder } from "@/features/exercises/exercise-browser";
import { filtersFromParams } from "@/features/exercises/search";
import { getCatalogue } from "@/lib/exercises";

export const metadata: Metadata = { title: "Ćwiczenia" };

// The exercise list (#9): search in Polish or English, filters, the member's own exercises (#10).
export default function CwiczeniaPage({ searchParams }: PageProps<"/cwiczenia">) {
  return (
    <Screen
      title="Ćwiczenia"
      subtitle="Szukaj po polsku albo po angielsku."
      width="wide"
      actions={
        <HeaderLink href="/cwiczenia/nowe" icon="plus" quiet>
          Własne ćwiczenie
        </HeaderLink>
      }
    >
      <Suspense fallback={<ExerciseBrowserPlaceholder />}>
        <Browser searchParams={searchParams} />
      </Suspense>
    </Screen>
  );
}

async function Browser({ searchParams }: { searchParams: PageProps<"/cwiczenia">["searchParams"] }) {
  const [catalogue, params] = await Promise.all([getCatalogue(), searchParams]);
  return <ExerciseBrowser catalogue={catalogue} initial={filtersFromParams(params)} />;
}
