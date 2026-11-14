import type { Metadata } from "next";
import Link from "next/link";
import { Screen } from "@/components/screen";
import { Icon } from "@/design-system";

export const metadata: Metadata = { title: "Raporty" };

// The list of weekly reports comes with #20. Until then the screen says where the numbers live now.
export default function RaportyPage() {
  return (
    <Screen title="Raporty" subtitle="Twoje tygodnie, jeden po drugim.">
      <section className="card grid justify-items-start gap-5 p-6 sm:p-8">
        <span className="flex size-12 items-center justify-center rounded-[14px] bg-[var(--accent-soft)] text-[var(--text-on-accent-soft)]">
          <Icon name="calendar-days" size={24} />
        </span>
        <div className="grid gap-2">
          <h2 className="m-0 text-title-m font-extrabold">Raporty tygodniowe pojawią się tutaj</h2>
          <p className="m-0 max-w-[48ch] text-fg-2">
            Na razie liczby z tego i poprzednich tygodni znajdziesz w Podsumowaniu.
          </p>
        </div>
        <Link
          href="/podsumowanie"
          className="pjs-i pjs-press flex h-11 items-center gap-2 rounded-full bg-surface-raised pr-4 pl-5 text-body-s font-bold text-fg no-underline hover:no-underline"
        >
          Otwórz Podsumowanie
          <Icon name="chevron-right" size={18} />
        </Link>
      </section>
    </Screen>
  );
}
