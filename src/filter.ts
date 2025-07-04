import escapeStringRegexp from 'escape-string-regexp';

export function shouldIgnore(subject: string): boolean {
  const raw = process.env.IGNORE_SUBJECT_REGEX;
  if (!raw) return false;

  const trimmed = raw.trim();

  if (trimmed.length > 100) {
    console.warn(`IGNORE_SUBJECT_REGEX too long, ignoring filter`);
    return false;
  }

  let re: RegExp;
  try {
    const safePattern = escapeStringRegexp(trimmed);
    re = new RegExp(safePattern, "i");
  } catch {
    console.warn(`Invalid IGNORE_SUBJECT_REGEX: ${raw}`);
    return false;
  }

  return re.test(subject);
}
