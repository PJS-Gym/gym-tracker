/**
 * UI preview: `NEXT_PUBLIC_UI_PREVIEW=1 bun dev` runs the app without Clerk, so the screens can be
 * clicked through without keys or an account. Only honoured by `next dev`: a production build always
 * requires sign-in, whatever the variable says.
 */
export const uiPreview = process.env.NODE_ENV === "development" && process.env.NEXT_PUBLIC_UI_PREVIEW === "1";
