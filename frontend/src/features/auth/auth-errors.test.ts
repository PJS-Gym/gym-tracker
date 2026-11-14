import { describe, expect, test } from "bun:test";
import { describeAuthError, isEmail, safeRedirect } from "./auth-errors";

const clerkError = (code: string, paramName?: string) => ({ errors: [{ code, meta: { paramName } }] });
const ORIGIN = "https://app.example";

describe("describeAuthError", () => {
  test("attaches known errors to their field", () => {
    expect(describeAuthError(clerkError("form_password_incorrect")).field).toBe("password");
    expect(describeAuthError(clerkError("form_identifier_exists")).field).toBe("email");
    expect(describeAuthError(clerkError("form_code_incorrect")).field).toBe("code");
  });

  test("uses the parameter name for format errors", () => {
    expect(describeAuthError(clerkError("form_param_format_invalid", "email_address")).field).toBe("email");
    expect(describeAuthError(clerkError("form_param_nil", "password")).field).toBe("password");
  });

  test("falls back to a Polish message for anything unknown", () => {
    for (const error of [clerkError("something_new"), new Error("Network down"), null, undefined, {}]) {
      const problem = describeAuthError(error);
      expect(problem.field).toBeNull();
      expect(problem.message).toContain("Spróbuj ponownie".toLowerCase());
    }
  });

  test("is not fooled by object property names", () => {
    expect(describeAuthError(clerkError("constructor")).field).toBeNull();
  });
});

describe("safeRedirect", () => {
  test("keeps a page of this app", () => {
    expect(safeRedirect("/cialo?a=1#b", ORIGIN)).toBe("/cialo?a=1#b");
    expect(safeRedirect(`${ORIGIN}/cialo`, ORIGIN)).toBe("/cialo");
  });

  test("refuses other sites, however they are written", () => {
    for (const value of ["https://evil.example/x", "//evil.example/x", "/\\evil.example/x", "javascript:alert(1)"]) {
      expect(safeRedirect(value, ORIGIN)).toBe("/");
    }
  });

  test("uses the fallback when there is nothing to return to", () => {
    expect(safeRedirect(null, ORIGIN, "/start")).toBe("/start");
    expect(safeRedirect("", ORIGIN)).toBe("/");
  });
});

test("isEmail needs a name, an at sign and a domain", () => {
  expect(isEmail(" ola@przyklad.pl ")).toBe(true);
  expect(isEmail("ola@przyklad")).toBe(false);
  expect(isEmail("ola")).toBe(false);
});
