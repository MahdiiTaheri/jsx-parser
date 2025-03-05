import { parseJSXToJSON } from "../src/parser/index";
import { readFileSync } from "fs";

const testCases = ["simple", "nested", "invalid"];

describe("Parser", () => {
  for (const testCase of testCases) {
    const inputPath = `test/cases/${testCase}/input.jsx`;
    const expectedPath = `test/cases/${testCase}/expected.json`;

    test(`Should correctly parse ${testCase} case`, () => {
      if (testCase === "invalid") {
        // Test error handling for invalid input
        expect(() => parseJSXToJSON(readFileSync(inputPath, "utf8"))).toThrow(
          "Unexpected token"
        );
      } else {
        const input = readFileSync(inputPath, "utf8");
        const expected = JSON.parse(readFileSync(expectedPath, "utf8"));
        const result = parseJSXToJSON(input);

        expect(result).toEqual(expected);
      }
    });
  }
});
