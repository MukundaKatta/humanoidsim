import { describe, it, expect } from "vitest";
import { Humanoidsim } from "../src/core.js";
describe("Humanoidsim", () => {
  it("init", () => { expect(new Humanoidsim().getStats().ops).toBe(0); });
  it("op", async () => { const c = new Humanoidsim(); await c.learn(); expect(c.getStats().ops).toBe(1); });
  it("reset", async () => { const c = new Humanoidsim(); await c.learn(); c.reset(); expect(c.getStats().ops).toBe(0); });
});
