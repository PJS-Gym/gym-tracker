import { ClerkProvider } from "@clerk/nextjs";
import type { Metadata, Viewport } from "next";
import { THEME_SCRIPT } from "@/features/theme/theme";
import { uiPreview } from "@/lib/ui-preview";
import "./globals.css";

export const metadata: Metadata = {
  title: {
    default: "Gym Tracker",
    template: "%s · Gym Tracker",
  },
  description: "Zapisuj treningi i co tydzień dostawaj raport z postępów.",
};

export const viewport: Viewport = {
  themeColor: [
    { media: "(prefers-color-scheme: light)", color: "#FBF6F7" },
    { media: "(prefers-color-scheme: dark)", color: "#140B0F" },
  ],
  viewportFit: "cover",
};

export default function RootLayout({ children }: LayoutProps<"/">) {
  return (
    // The theme script sets data-theme before React hydrates, so <html> differs on purpose.
    <html lang="pl" className="h-full" suppressHydrationWarning>
      <head>
        <script dangerouslySetInnerHTML={{ __html: THEME_SCRIPT }} />
      </head>
      <body className="min-h-full">
        {uiPreview ? (
          children
        ) : (
          // Clerk v7: the provider goes inside <body>, not around <html>.
          <ClerkProvider
            signInUrl="/sign-in"
            // Sign-up starts with onboarding; its last step opens /sign-up.
            signUpUrl="/onboarding"
          >
            {children}
          </ClerkProvider>
        )}
      </body>
    </html>
  );
}
