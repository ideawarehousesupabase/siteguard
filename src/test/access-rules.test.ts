import { describe, expect, it } from "vitest";
import { evaluateAccess } from "@/data/mock";

describe("Gatehouse access rules", () => {
  it("escalates James Carter because crane competency is expired", () => {
    const { checks, failed } = evaluateAccess("WORKER001");
    expect(checks.map((c) => [c.label, c.pass])).toEqual([
      ["Identity", true], ["Site Induction", true], ["Insurance", true], ["Crane Operator Competency", false],
    ]);
    expect(failed.map((f) => f.label)).toEqual(["Crane Operator Competency"]);
  });

  it("passes Sarah Green with all valid documents", () => {
    expect(evaluateAccess("WORKER002").failed).toHaveLength(0);
  });
});
