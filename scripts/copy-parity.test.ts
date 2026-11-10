import { expect, test } from "bun:test";
import { copyParityViolations } from "./copy-parity";

test("public copy rejects missing, changed placeholders and plural syntax", () => {
  expect(copyParityViolations({ title: "Hello {name}" }, { title: "Привет {name}" })).toEqual([]);
  expect(copyParityViolations({ title: "Hello {name}" }, { title: "Привет" })).toContain("title: placeholder mismatch");
  expect(copyParityViolations({ title: "One {n} | Many {n}" }, { title: "Один {n}" })).toContain("title: plural mismatch");
  expect(copyParityViolations({ title: "Hi", info: "Info" }, { title: "Привет" })).toContain("info: missing RU key");
});
