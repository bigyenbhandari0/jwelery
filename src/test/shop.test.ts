import { describe, expect, it } from "vitest";
import { getProduct, restoreBag } from "@/lib/shop";

describe("saved shopping bag", () => {
  it("recovers from malformed or non-array saved data", () => {
    for (const value of ["broken", "null", "{}", '"text"']) expect(restoreBag(value)).toEqual([]);
  });
  it("rejects invalid products, sizes and quantities", () => {
    const items = [
      { id: "coeur", size: "6", qty: 2 },
      { id: "missing", size: "6", qty: 1 },
      { id: "constructor", size: "6", qty: 1 },
      { id: "coeur", size: "99", qty: 1 },
      { id: "coeur", size: "5", qty: -1 },
      { id: "coeur", size: "5", qty: "2" },
      null,
    ];
    expect(restoreBag(JSON.stringify(items))).toEqual([{ id: "coeur", size: "6", qty: 2 }]);
    expect(getProduct("__proto__")).toBeUndefined();
  });
  it("merges duplicate lines and limits restored quantities", () => {
    expect(restoreBag(JSON.stringify([
      { id: "coeur", size: "6", qty: 7 },
      { id: "coeur", size: "6", qty: 8 },
      { id: "coeur", size: "7", qty: 100 },
    ]))).toEqual([
      { id: "coeur", size: "6", qty: 9 },
      { id: "coeur", size: "7", qty: 9 },
    ]);
  });
});
