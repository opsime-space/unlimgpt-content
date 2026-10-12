type CopyValue = string | CopyValue[] | { [key: string]: CopyValue };

function leaves(value: CopyValue, path = ""): Map<string, string> {
  if (typeof value === "string") return new Map([[path, value]]);
  const pairs = Array.isArray(value) ? value.map((item, index) => [String(index), item] as const) : Object.entries(value);
  return new Map(pairs.flatMap(([key, child]) => [...leaves(child, path ? `${path}.${key}` : key)]));
}

function placeholders(value: string): string[] {
  return [...new Set([...value.matchAll(/\{([a-zA-Z][a-zA-Z0-9_]*)\}/gu)].map((match) => match[1]))].sort();
}

export function copyParityViolations(en: CopyValue, ru: CopyValue): string[] {
  const english = leaves(en);
  const russian = leaves(ru);
  const violations: string[] = [];
  for (const [key, value] of english) {
    const translated = russian.get(key);
    if (translated === undefined) {
      violations.push(`${key}: missing RU key`);
      continue;
    }
    if (JSON.stringify(placeholders(value)) !== JSON.stringify(placeholders(translated))) {
      violations.push(`${key}: placeholder mismatch`);
    }
    if (value.includes("|") !== translated.includes("|") ||
        (value.includes("|") && (value.split("|").length !== 2 || translated.split("|").length !== 3))) {
      violations.push(`${key}: plural mismatch`);
    }
  }
  for (const key of russian.keys()) if (!english.has(key)) violations.push(`${key}: missing EN key`);
  return violations;
}
