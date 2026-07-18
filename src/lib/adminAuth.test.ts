import { describe, expect, it } from "vitest";
import { getSupabaseAuthErrorMessage } from "./adminAuth";

describe("admin auth helpers", () => {
  it("returns a user-friendly message for Supabase auth failures", () => {
    const message = getSupabaseAuthErrorMessage({ message: "Invalid login credentials" } as Error);

    expect(message).toContain("Unable to sign in");
    expect(message).toContain("Supabase");
  });
});
