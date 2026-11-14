import "server-only";
import { auth } from "@clerk/nextjs/server";

/**
 * Calls the FastAPI backend as the signed-in user. The backend checks the Clerk session token
 * on every request and creates the user's record on their first one.
 *
 * Reads the session, so call it inside a <Suspense> boundary (Cache Components).
 */
export async function apiFetch(path: `/${string}`, init: RequestInit = {}): Promise<Response> {
  // The session comes first: while prerendering, Next stops at it and leaves the rest to each
  // request. Checking API_URL before it would fail the build itself wherever API_URL is unset.
  const { getToken } = await auth();
  const baseUrl = process.env.API_URL;
  if (!baseUrl) throw new Error("API_URL is not set. See frontend/.env.example.");

  const token = await getToken();
  const headers = new Headers(init.headers);
  if (token) headers.set("Authorization", `Bearer ${token}`);

  return fetch(`${baseUrl}/api/v1${path}`, { ...init, headers, cache: "no-store" });
}
