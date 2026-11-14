import type { Metadata } from "next";
import { Wordmark } from "@/design-system";

export const metadata: Metadata = { title: "Raport tygodniowy" };

// Public weekly report, open without signing in. The address is /r/<report id>; ticket #23
// fills it in from the report snapshot.
export default function PublicReportPage() {
  return (
    <main className="mx-auto grid w-full max-w-3xl grid-cols-[minmax(0,1fr)] gap-6 px-gutter py-6">
      <Wordmark size="s" as="p" />
      <h1 className="m-0 text-title-l font-bold">Raport tygodniowy</h1>
    </main>
  );
}
