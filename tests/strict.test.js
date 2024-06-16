import fs from "fs/promises";

import { describe, it } from "node:test";
import assert from "node:assert";

import { createStrictHTMLEntityNameChecker } from "../mod.js";

describe("strict", () => {
  // describe("All legal entity names can be correctly checked", async () => {
  //   const names = (await fs.readFile("raw-data/html-entities-strict.txt"))
  //     .toString()
  //     .split("\n");
  //   // const names = ["zopf"];
  //   for (const [i, name] of names.entries()) {
  //     it(`case ${i + 1}: ${name}`, () => {
  //       const checker = createStrictHTMLEntityNameChecker();
  //       for (const char of name) {
  //         assert.equal(checker.expectChar(char), true);
  //       }
  //       assert.equal(checker.expectEnd(), true);
  //     });
  //   }
  // });

  describe("`Checker::expectChar`", () => {
    describe("This method will return `false` if an input character cannot lead to a legal entity name", () => {
      it("case 1", () => {
        const checker = createStrictHTMLEntityNameChecker();
        assert.equal(checker.expectChar("?"), false);
      });
      it("case 2", () => {
        const checker = createStrictHTMLEntityNameChecker();
        assert.equal(checker.expectChar("a"), true);
        assert.equal(checker.expectChar("?"), false);
      });
    });
  });

  describe("`Checker::expectEnd`", () => {
    describe("This method will return `false` if the end is not yet reached", () => {
      it("case 1", () => {
        const checker = createStrictHTMLEntityNameChecker();
        assert.equal(checker.expectEnd(), false);
      });
      it("case 2", () => {
        const checker = createStrictHTMLEntityNameChecker();
        assert.equal(checker.expectChar("a"), true);
        assert.equal(checker.expectEnd(), false);
      });
    });
  });
});
