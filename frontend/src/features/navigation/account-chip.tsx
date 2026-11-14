import Link from "next/link";
import { getProfile } from "@/lib/profile";
import { SignOutIconButton } from "./sign-out";

/** The side menu's foot: who is signed in, a way into Ustawienia, and signing out. Reads the session. */
export async function AccountChip() {
  const profile = await getProfile();
  const name = profile.display_name?.trim() || "Twoje konto";

  return (
    <div className="card flex items-center gap-2 rounded-[18px] p-1.5 pl-2">
      <Link
        href="/ustawienia"
        className="pjs-i flex min-w-0 flex-1 items-center gap-3 rounded-[12px] p-1 text-fg no-underline hover:no-underline"
      >
        <span
          aria-hidden="true"
          className="grain relative flex size-9 shrink-0 items-center justify-center overflow-hidden rounded-full text-body-s font-extrabold text-white"
          style={{ background: "var(--hero)" }}
        >
          {name.charAt(0).toUpperCase()}
        </span>
        <span className="grid min-w-0 leading-tight">
          <span className="truncate text-body-s font-bold">{name}</span>
          <span className="truncate text-caption text-fg-2">Profil i ustawienia</span>
        </span>
      </Link>
      <SignOutIconButton />
    </div>
  );
}

export function AccountChipPlaceholder() {
  return <span aria-hidden="true" className="placeholder-block block h-[60px] rounded-[18px]" />;
}
