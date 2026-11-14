"use client";

import { useEffect } from "react";
import { Button, EmptyState, Wordmark } from "@/design-system";

// Catches failures below the root layout, such as the backend being unreachable when a screen loads.
export default function Error({ error, retry }: { error: unknown; retry: () => void }) {
  useEffect(() => {
    console.error(error);
  }, [error]);

  return (
    <main className="mx-auto grid w-full max-w-[560px] gap-6 px-gutter py-10">
      <Wordmark size="s" as="p" />
      <EmptyState
        as="h1"
        title="Nie udało się wczytać danych"
        body="Sprawdź połączenie i spróbuj ponownie."
        action={<Button onClick={retry}>Spróbuj ponownie</Button>}
      />
    </main>
  );
}
