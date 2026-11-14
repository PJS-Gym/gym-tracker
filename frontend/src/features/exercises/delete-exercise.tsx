"use client";

import { useRouter } from "next/navigation";
import { useState, useTransition } from "react";
import { Button, Sheet } from "@/design-system";
import { deleteExercise } from "./actions";

/** "Usuń ćwiczenie" at the foot of an own exercise's page, confirmed in a sheet. */
export function DeleteExercise({ id, name, used }: { id: number; name: string; used: boolean }) {
  const router = useRouter();
  const [open, setOpen] = useState(false);
  const [failed, setFailed] = useState(false);
  const [pending, startTransition] = useTransition();

  function confirm() {
    startTransition(async () => {
      const result = await deleteExercise(id);
      if (!result.ok) {
        setFailed(true);
        return;
      }
      setOpen(false);
      router.replace("/cwiczenia", { transitionTypes: ["nav-back"] });
    });
  }

  return (
    <>
      <Button variant="ghost" icon="trash-2" className="text-fg-danger" onClick={() => setOpen(true)}>
        Usuń ćwiczenie
      </Button>
      <Sheet open={open} onOpenChange={setOpen} title="Usunąć to ćwiczenie?">
        <p className="m-0 text-center text-fg-2">
          {used
            ? `„${name}” zniknie z listy i wyszukiwarki. Treningi, w których już jest, dalej je pokażą.`
            : `„${name}” zniknie z listy ćwiczeń. Tego nie da się cofnąć.`}
        </p>
        {failed && (
          <p role="alert" className="m-0 text-center text-body-s font-semibold text-fg-danger">
            Nie udało się usunąć ćwiczenia. Spróbuj jeszcze raz.
          </p>
        )}
        <Button variant="danger" size="lg" fullWidth disabled={pending} onClick={confirm}>
          Usuń ćwiczenie
        </Button>
        <Button variant="tonal" fullWidth onClick={() => setOpen(false)}>
          Zostaw ćwiczenie
        </Button>
      </Sheet>
    </>
  );
}
