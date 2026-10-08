import { parseMarkdown } from "@nuxtjs/mdc/runtime";
import { parse } from "yaml";
import { z } from "zod/v4";
import { contentSchemas } from "../schemas/content.schema";

const files = [...new Set([
  ...new Bun.Glob("**/*.{md,json,yml}").scanSync({ cwd: "content", onlyFiles: true }),
  ...new Bun.Glob("**/.navigation.yml").scanSync({ cwd: "content", onlyFiles: true }),
])].sort();
if (files.length === 0) throw new Error("Content is empty");
const paths = new Set<string>();
const locales = new Map<string, Set<string>>();
const navigationSchema = z.object({
  title: z.string().min(1),
  navigation: z.object({ group: z.object({ title: z.string().min(1), path: z.string().startsWith("/") }) }).optional(),
});
for (const file of files) {
  const [section, locale, ...parts] = file.split("/");
  if (!["docs", "marketing", "site"].includes(section ?? "") || !["en", "ru"].includes(locale ?? "")) {
    throw new Error(`Unexpected Content path: ${file}`);
  }
  const pair = `${section}/${parts.join("/")}`;
  const pairLocales = locales.get(pair) ?? new Set<string>();
  pairLocales.add(locale!);
  locales.set(pair, pairLocales);
  const source = await Bun.file(`content/${file}`).text();
  if (file.endsWith(".yml")) {
    if (parts.at(-1) !== ".navigation.yml") throw new Error(`Unexpected YAML file: ${file}`);
    const data = navigationSchema.parse(parse(source));
    const path = data.navigation?.group.path;
    if (path && (locale === "ru") !== path.startsWith("/ru/")) throw new Error(`Navigation locale mismatch: ${file}`);
    continue;
  }
  const parsed = file.endsWith(".md") ? await parseMarkdown(source) : null;
  const data = parsed ? { ...parsed.data, rawbody: source } : JSON.parse(source);
  const schema = contentSchemas[section === "docs" ? "documentation" : section === "marketing" ? "marketing" : "site"];
  const result = schema.safeParse(data);
  if (!result.success) throw new Error(`${file}: ${result.error.message}`);
  if (parsed && data.path) {
    if (typeof data.path !== "string" || !data.path.startsWith("/") || paths.has(data.path)) {
      throw new Error(`Invalid or duplicate page path: ${file}`);
    }
    const russianPath = data.path === "/ru" || data.path.startsWith("/ru/");
    if ((locale === "ru") !== russianPath) throw new Error(`Page locale mismatch: ${file}`);
    paths.add(data.path);
  }
}
for (const [path, pair] of locales) {
  if (pair.size !== 2) throw new Error(`Missing RU/EN counterpart: ${path}`);
}
console.log(`Content validation passed: ${files.length} files, ${paths.size} explicit page paths, RU/EN parity.`);
