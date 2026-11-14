export type Destination = {
  id: string;
  label: string;
  href: string;
  /** Icon name from the design system registry. */
  icon: string;
  /** Where it sits in the side menu and in "Więcej". */
  group: "trening" | "postepy" | "konto";
  /** Shown in the phone's bottom bar, around the "Nowy trening" button. The rest sit under "Więcej". */
  inTabBar: boolean;
  /** One line under the label in "Więcej", saying what the screen answers. */
  hint?: string;
};

export const GROUPS: { id: Destination["group"]; label: string }[] = [
  { id: "trening", label: "Trening" },
  { id: "postepy", label: "Postępy" },
  { id: "konto", label: "Konto" },
];

// Order is the order in the side menu. The phone's bar holds Start and Treningi, the "Nowy trening"
// button in the middle, then Ćwiczenia and "Więcej": the progress screens are one tap further.
export const DESTINATIONS: Destination[] = [
  { id: "start", label: "Start", href: "/", icon: "house", group: "trening", inTabBar: true },
  { id: "treningi", label: "Treningi", href: "/treningi", icon: "dumbbell", group: "trening", inTabBar: true },
  { id: "cwiczenia", label: "Ćwiczenia", href: "/cwiczenia", icon: "clipboard-list", group: "trening", inTabBar: true },
  {
    id: "podsumowanie",
    label: "Podsumowanie",
    href: "/podsumowanie",
    icon: "chart-no-axes-column",
    group: "postepy",
    inTabBar: false,
    hint: "Które partie pracowały najwięcej",
  },
  {
    id: "raporty",
    label: "Raporty",
    href: "/raporty",
    icon: "calendar-days",
    group: "postepy",
    inTabBar: false,
    hint: "Twoje tygodnie, jeden po drugim",
  },
  { id: "cialo", label: "Ciało", href: "/cialo", icon: "user", group: "postepy", inTabBar: false, hint: "Masa i obwody z pomiarów" },
  {
    id: "ustawienia",
    label: "Ustawienia",
    href: "/ustawienia",
    icon: "settings",
    group: "konto",
    inTabBar: false,
    hint: "Profil, powiadomienia i motyw",
  },
];

/** The logger is a destination of its own: the bar's middle button lights up while it is open. */
export const NEW_WORKOUT_HREF = "/treningi/nowy";

export function activeDestination(pathname: string): Destination | undefined {
  if (pathname === NEW_WORKOUT_HREF) return undefined;
  return DESTINATIONS.find((d) =>
    d.href === "/" ? pathname === "/" : pathname === d.href || pathname.startsWith(`${d.href}/`),
  );
}
