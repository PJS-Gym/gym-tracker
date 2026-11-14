import type { Metadata } from "next";
import { Screen } from "@/components/screen";

export const metadata: Metadata = { title: "Start" };

// Start's content (last workout, this week) arrives with the Start screen.
export default function StartPage() {
  return <Screen title="Start" />;
}
