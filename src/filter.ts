export function shouldIgnore(subject: string): boolean {
  const raw = process.env.IGNORE_SUBJECT_REGEX;
  if (!raw) return false;

  const trimmed = raw.trim();

  // simple DOS guard: don’t allow crazy‐long patterns
  if (trimmed.length > 100) {
    console.warn(`IGNORE_SUBJECT_REGEX too long, ignoring filter`);
    return false;
  }

  let re: RegExp;
  try {
    re = new RegExp(trimmed, "i");
  } catch {
    console.warn(`Invalid IGNORE_SUBJECT_REGEX: ${raw}`);
    return false;
  }
  return re.test(subject);
}
