import { describe, expect, it } from "vitest";
import { isValidFamilyToken } from "../../src/lib/api/family";

describe("isValidFamilyToken", () => {
  it("aceita alfanumérico + _ - de 16-128 chars", () => {
    expect(isValidFamilyToken("a".repeat(16))).toBe(true);
    expect(isValidFamilyToken("abc_DEF-123" + "x".repeat(10))).toBe(true);
    expect(isValidFamilyToken("Z".repeat(128))).toBe(true);
  });

  it("rejeita comprimento fora do range", () => {
    expect(isValidFamilyToken("a".repeat(15))).toBe(false);
    expect(isValidFamilyToken("a".repeat(129))).toBe(false);
    expect(isValidFamilyToken("")).toBe(false);
  });

  it("rejeita caracteres especiais e path traversal", () => {
    expect(isValidFamilyToken("../../etc/passwd")).toBe(false);
    expect(isValidFamilyToken("token com espaco aqui muito longo")).toBe(false);
    expect(isValidFamilyToken("token/with/slash" + "x".repeat(10))).toBe(false);
    expect(isValidFamilyToken("<script>" + "x".repeat(10))).toBe(false);
  });
});
