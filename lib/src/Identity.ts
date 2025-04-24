// Utility function to generate a consistent hash from an object
export function generateHashId(obj: Record<string, any>): string {
  // Remove id field if it exists to avoid circular references
  const { id, ...rest } = obj;

  // Create a string from the object's values
  const str = JSON.stringify(rest);

  // Simple hash function (djb2 algorithm)
  let hash = 5381;
  for (let i = 0; i < str.length; i++) {
    hash = (hash << 5) + hash + str.charCodeAt(i);
  }

  // Convert to a string and ensure it's positive
  return (hash >>> 0).toString(16);
}

// Utility to ensure all elements have IDs
export function ensureIds<T extends Record<string, any>>(
  items: T[]
): (T & { id: string })[] {
  return items.map((item) => ({
    ...item,
    id: item.id || generateHashId(item),
  }));
}

// Utility to generate a unique ID for an object
export function generateUniqueId<T extends Record<string, any>>(
  obj: T,
  existingIds: Set<string>
): string {
  let id = generateHashId(obj);
  let counter = 1;

  // Ensure the ID is unique
  while (existingIds.has(id)) {
    id = `${id}-${counter}`;
    counter++;
  }

  return id;
}

/**
 * Generates a random ID suitable for React components
 * @param prefix Optional prefix for the ID
 * @returns A random string ID
 */
export function generateRandomId(prefix: string = ""): string {
  // Use crypto.randomUUID() if available (modern browsers)
  if (
    typeof window !== "undefined" &&
    window.crypto &&
    window.crypto.randomUUID
  ) {
    return `${prefix}${window.crypto.randomUUID()}`;
  }

  // Fallback for older browsers or server-side rendering
  const randomPart =
    Math.random().toString(36).substring(2, 15) +
    Math.random().toString(36).substring(2, 15);

  return `${prefix}${randomPart}`;
}

/**
 * Creates a function that generates sequential IDs with a prefix
 * Useful for stable IDs in React component lists
 * @param prefix Prefix for the generated IDs
 * @returns A function that generates sequential IDs
 */
export function createIdGenerator(prefix: string = "id-"): () => string {
  let counter = 0;
  return () => `${prefix}${counter++}`;
}

/**
 * Hook-ready random ID generator for React components
 * @param prefix Optional prefix for the ID
 * @returns A stable random ID
 *
 * Usage example:
 * const id = useRandomId('button-');
 */
export function useRandomId(prefix: string = ""): string {
  // This is a placeholder - in React, you would use useRef or useState
  // to maintain the ID between renders
  return generateRandomId(prefix);
}
