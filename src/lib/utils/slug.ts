export function generateSlug(name: string): string {
  return name
    .toLowerCase()
    .replace(/[äöü]/g, (char) => ({ ä: "ae", ö: "oe", ü: "ue" }[char] || char))
    .replace(/[^a-z0-9]+/g, "-")
    .replace(/^-|-$/g, "")
    .substring(0, 50);
}

export async function ensureUniqueSlug(
  baseSlug: string,
  checkExists: (slug: string) => Promise<boolean>
): Promise<string> {
  let slug = baseSlug;
  let counter = 1;

  while (await checkExists(slug)) {
    slug = `${baseSlug}-${counter}`;
    counter++;
  }

  return slug;
}
