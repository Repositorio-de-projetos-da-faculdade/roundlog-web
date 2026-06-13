import { describe, expect, it } from "vitest";
import { isValidFamilyToken } from "../../src/lib/api/family";

describe("isValidFamilyToken (PWA)", () => {
  it("aceita formato válido", () => {
    expect(isValidFamilyToken("a".repeat(16))).toBe(true);
    expect(isValidFamilyToken("token_ABC-123" + "x".repeat(10))).toBe(true);
  });

  it("rejeita path traversal e curtos", () => {
    expect(isValidFamilyToken("../etc/passwd")).toBe(false);
    expect(isValidFamilyToken("a".repeat(15))).toBe(false);
    expect(isValidFamilyToken("")).toBe(false);
  });
});
