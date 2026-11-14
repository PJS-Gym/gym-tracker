"use client";

import { useRouter } from "next/navigation";
import { useState, useTransition } from "react";
import { Button, Sheet } from "@/design-system";
import { setsLabel } from "@/lib/format";
import { deleteWorkout } from "./actions";

/** "Usuń trening", confirmed in a sheet that says what goes. Reports already issued stay as they were. */
export function DeleteWorkout({ id, day, sets }: { id: number; day: string; sets: number }) {
  const router = useRouter();
  const [open, setOpen] = useState(false);
  const [failed, setFailed] = useState(false);
  const [pending, startTransition] = useTransition();

  function confirm() {
    startTransition(async () => {
      const result = await deleteWorkout(id);
      if (!result.ok) {
        setFailed(true);
        return;
      }
      setOpen(false);
      router.replace("/treningi", { transitionTypes: ["nav-back"] });
    });
  }

  return (
    <>
      <Button variant="ghost" icon="trash-2" className="text-fg-danger" onClick={() => setOpen(true)}>
        Usuń trening
      </Button>
      <Sheet open={open} onOpenChange={setOpen} title="Usunąć ten trening?">
        <p className="m-0 text-center text-fg-2">
          Trening z dnia {day} i jego {setsLabel(sets)} znikną z historii i statystyk. Wydane raporty się nie zmienią. Tego nie da się cofnąć.
        </p>
        {failed && (
          <p role="alert" className="m-0 text-center text-body-s font-semibold text-fg-danger">
            Nie udało się usunąć treningu. Spróbuj jeszcze raz.
          </p>
        )}
        <Button variant="danger" size="lg" fullWidth disabled={pending} onClick={confirm}>
          Usuń trening
        </Button>
        <Button variant="tonal" fullWidth onClick={() => setOpen(false)}>
          Zostaw trening
        </Button>
      </Sheet>
    </>
  );
}
