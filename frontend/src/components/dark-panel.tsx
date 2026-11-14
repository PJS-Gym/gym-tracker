import type { ComponentProps, ElementType, ReactNode } from "react";

type Props<T extends ElementType> = { as?: T; children: ReactNode; className?: string } & Omit<ComponentProps<T>, "as" | "children" | "className">;

/**
 * The design system's dark theme in a rounded, grained panel on the plum gradient with a pink bloom: the one focal
 * object of a screen (a workout's totals, an exercise's progress). Text and data colours follow
 * the dark tokens inside it.
 */
export function DarkPanel<T extends ElementType = "section">({ as, children, className = "", ...rest }: Props<T>) {
  const Tag = (as ?? "section") as ElementType;
  return (
    <Tag
      data-theme="dark"
      {...rest}
      className={`grain relative isolate overflow-hidden rounded-[28px] p-5 text-fg sm:p-7 ${className}`}
      style={{ background: "var(--hero)" }}
    >
      {children}
    </Tag>
  );
}
