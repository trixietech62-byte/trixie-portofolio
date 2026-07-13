import { beforeEach, describe, expect, it, vi } from "vitest";
import { sendContactEmail } from "./contact";

describe("sendContactEmail", () => {
  beforeEach(() => {
    vi.restoreAllMocks();
  });

  it("uses a mailto fallback when no delivery service is configured", async () => {
    const openSpy = vi.spyOn(window, "open").mockReturnValue(window);

    const result = await sendContactEmail({
      name: "Ada",
      email: "ada@example.com",
      topic: "Hello",
      message: "Hi there",
    });

    expect(result.success).toBe(true);
    expect(openSpy).toHaveBeenCalledWith(
      expect.stringContaining("mailto:trixietech17@gmail.com"),
      "_blank",
      "noopener,noreferrer"
    );
  });
});
