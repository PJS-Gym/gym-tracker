import type { Metadata } from "next";
import { Suspense } from "react";
import { Screen } from "@/components/screen";
import { StartContent, StartPlaceholder } from "@/features/home/start-content";

export const metadata: Metadata = { title: "Start" };

// The greeting is the screen's heading, so Start has no top bar.
export default function StartPage() {
  return (
    <Screen title="Start" header={false} width="wide">
      <Suspense fallback={<StartPlaceholder />}>
        <StartContent />
      </Suspense>
    </Screen>
  );
}
