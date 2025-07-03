export function shouldIgnore(subject: string): boolean {
  const pattern = process.env.IGNORE_SUBJECT_REGEX;
  if (!pattern) return false;
  const re = new RegExp(pattern, "i");
  return re.test(subject);
}
