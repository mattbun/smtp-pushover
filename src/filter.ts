export function shouldIgnore(subject: string): boolean {
  const raw = process.env.IGNORE_SUBJECT_REGEX;
  if (!raw) return false;
  let re: RegExp;
  try {
    re = new RegExp(raw.trim(), "i");
  } catch {
    console.warn(`Invalid IGNORE_SUBJECT_REGEX: ${raw}`);
    return false;
  }
  return re.test(subject);
}
