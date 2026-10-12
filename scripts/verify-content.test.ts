import { expect, test } from "bun:test";

test("Content gate rejects missing translations, duplicate paths and malformed metadata", async () => {
  const root = `${Bun.env.TMPDIR ?? "/tmp"}/unlimgpt-content-test-${Bun.randomUUIDv7()}`;
  const script = Bun.fileURLToPath(new URL("verify-content.ts", import.meta.url));
  const page = (path: string, title = "Terms") => `---\ntitle: "${title}"\ndescription: "Legal draft"\ncategory: legal\npath: ${path}\n---\n\nDraft content.\n`;
  const run = () => Bun.$`bun ${script}`.cwd(root).quiet().nothrow();
  try {
    for (const locale of ["en", "ru"] as const) {
      for (const name of ["copy", "developer"] as const) {
        await Bun.write(
          `${root}/content/site/${locale}/${name}.json`,
          Bun.file(new URL(`../content/site/${locale}/${name}.json`, import.meta.url)),
        );
      }
    }
    await Bun.write(`${root}/content/marketing/en/terms.md`, page("/terms"));
    await Bun.write(`${root}/content/marketing/ru/terms.md`, page("/ru/terms"));
    expect((await run()).exitCode).toBe(0);
    const ruCopyPath = `${root}/content/site/ru/copy.json`;
    const ruCopySource = await Bun.file(ruCopyPath).text();
    const ruCopy = JSON.parse(ruCopySource);
    ruCopy.pricing.limits = "До запроса одновременно";
    await Bun.write(ruCopyPath, JSON.stringify(ruCopy));
    expect((await run()).exitCode).not.toBe(0);
    await Bun.write(ruCopyPath, ruCopySource);
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
}, 30_000);
