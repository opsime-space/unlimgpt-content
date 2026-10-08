import { expect, test } from "bun:test";

test("Content gate rejects missing translations, duplicate paths and malformed metadata", async () => {
  const root = `${Bun.env.TMPDIR ?? "/tmp"}/unlimgpt-content-test-${Bun.randomUUIDv7()}`;
  const script = Bun.fileURLToPath(new URL("verify-content.ts", import.meta.url));
  const page = (path: string, title = "Terms") => `---\ntitle: "${title}"\ndescription: "Legal draft"\ncategory: legal\npath: ${path}\n---\n\nDraft content.\n`;
  const run = () => Bun.$`bun ${script}`.cwd(root).quiet().nothrow();
  try {
    await Bun.write(`${root}/content/marketing/en/terms.md`, page("/terms"));
    await Bun.write(`${root}/content/marketing/ru/terms.md`, page("/ru/terms"));
    expect((await run()).exitCode).toBe(0);
    await Bun.write(`${root}/content/marketing/en/.navigation.yml`, "title: Legal\n");
    expect((await run()).exitCode).not.toBe(0);
    await Bun.write(`${root}/content/marketing/ru/.navigation.yml`, "title: Правила\n");
    expect((await run()).exitCode).toBe(0);
    await Bun.write(`${root}/content/marketing/ru/.navigation.yml`, "title: [broken\n");
    expect((await run()).exitCode).not.toBe(0);
    await Bun.write(`${root}/content/marketing/ru/.navigation.yml`, "title: Правила\n");
    await Bun.write(`${root}/content/marketing/en/privacy.md`, page("/privacy"));
    expect((await run()).exitCode).not.toBe(0);
    await Bun.write(`${root}/content/marketing/ru/privacy.md`, page("/ru/privacy"));
    expect((await run()).exitCode).toBe(0);
    await Bun.write(`${root}/content/marketing/en/privacy.md`, page("/terms"));
    expect((await run()).exitCode).not.toBe(0);
    await Bun.write(`${root}/content/marketing/en/privacy.md`, page("/privacy", ""));
    expect((await run()).exitCode).not.toBe(0);
    await Bun.write(`${root}/content/marketing/en/privacy.md`, page("/ru/privacy"));
    expect((await run()).exitCode).not.toBe(0);
  } finally {
    await Bun.$`rm -rf ${root}`.quiet();
  }
});
