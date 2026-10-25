import Project from "@/lib/models/Project";

/**
 * Generates a unique, URL-safe slug from title and category.
 * If the slug already exists, it appends sequential counters (e.g., -1, -2).
 * 
 * @param title The project title.
 * @param category The project category.
 * @param excludeProjectId Optional project ID to exclude (e.g. during updates).
 */
export async function generateUniqueSlug(
  title: string,
  category: string,
  excludeProjectId?: string
): Promise<string> {
  const baseSlug = `${title} ${category}`
    .toLowerCase()
    .trim()
    .replace(/[^a-z0-9\s-]/g, "") // remove special characters
    .replace(/\s+/g, "-") // replace spaces with hyphens
    .replace(/-+/g, "-") // remove duplicate hyphens
    .replace(/^-+|-+$/g, ""); // remove leading/trailing hyphens

  let slug = baseSlug;
  let counter = 1;

  while (true) {
    const query: any = { slug };
    if (excludeProjectId) {
      query._id = { $ne: excludeProjectId };
    }
    const existing = await Project.findOne(query);
    if (!existing) {
      break;
    }
    slug = `${baseSlug}-${counter}`;
    counter++;
  }

  return slug;
}
