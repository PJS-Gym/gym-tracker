import type { Metadata } from "next";
import { Suspense } from "react";
import { Screen } from "@/components/screen";
import { RangePicker } from "@/features/summary/range-picker";
import { SummaryContent, SummaryPlaceholder } from "@/features/summary/summary-content";

export const metadata: Metadata = { title: "Podsumowanie" };

// The live version of the weekly report: counted on request, no comparisons and no text (#14).
export default function PodsumowaniePage({ searchParams }: PageProps<"/podsumowanie">) {
  return (
    <Screen title="Podsumowanie" subtitle="Ile pracy dostała każda partia.">
      <Suspense>
        <RangePicker />
      </Suspense>
      <Suspense fallback={<SummaryPlaceholder />}>
        <SummaryContent searchParams={searchParams} />
      </Suspense>
    </Screen>
  );
}
