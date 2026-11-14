import type { Metadata } from "next";
import Link from "next/link";
import { connection } from "next/server";
import { Suspense } from "react";
import { Screen } from "@/components/screen";
import { HeaderLink, LINK_BUTTON } from "@/components/top-bar-link";
import { EmptyState, Icon } from "@/design-system";
import { WorkoutHistory, WorkoutHistoryPlaceholder } from "@/features/workouts/workout-history";
import { todayInWarsaw } from "@/lib/format";
import { getWorkouts } from "@/lib/workouts";

export const metadata: Metadata = { title: "Treningi" };

// The workout history (#12), newest first, 20 at a time.
export default function TreningiPage() {
  return (
    <Screen
      title="Treningi"
      subtitle="Cała historia, od najnowszego."
      width="wide"
      actions={
        <HeaderLink href="/treningi/nowy" icon="plus">
          Nowy trening
        </HeaderLink>
      }
    >
      <Suspense fallback={<WorkoutHistoryPlaceholder />}>
        <History />
      </Suspense>
    </Screen>
  );
}

async function History() {
  const first = await getWorkouts();
  await connection();
  if (first.items.length === 0) {
    return (
      <EmptyState
        title="Czas na pierwszy trening"
        body="Zapisz serie z dzisiejszego treningu, a tutaj zbierze się cała twoja historia."
        action={
          <Link href="/treningi/nowy" transitionTypes={["nav-forward"]} className={LINK_BUTTON.primary}>
            <Icon name="plus" size={20} />
            Nowy trening
          </Link>
        }
      />
    );
  }
  return <WorkoutHistory first={first} today={todayInWarsaw()} />;
}
