/**
 * Generates a SHA-256 hash of the provided string
 * Uses Web Crypto API for proper cryptographic hashing
 */
async function sha256(input: string): Promise<string> {
  const encoder = new TextEncoder();
  const data = encoder.encode(input.trim().toLowerCase());

  // Use the Web Crypto API to generate a proper SHA-256 hash
  const hashBuffer = await crypto.subtle.digest("SHA-256", data);

  // Convert the hash buffer to a hex string
  const hashArray = Array.from(new Uint8Array(hashBuffer));
  const hashHex = hashArray
    .map((b) => b.toString(16).padStart(2, "0"))
    .join("");

  return hashHex;
}

/**
 * Generates a Gravatar URL from an email address
 * @param email The email address to generate a Gravatar for
 * @param size The size of the image in pixels
 * @param defaultImage The default image to use if no Gravatar is found
 * @returns The Gravatar URL
 */
export async function getGravatarUrl(
  email?: string,
  size: number = 200,
  defaultImage: string = "identicon"
): Promise<string> {
  if (!email) {
    // Return a default avatar if no email is provided
    return `https://www.gravatar.com/avatar/000000000000000000000000000000000000000000000000000000.jpg?s=${size}&d=${defaultImage}`;
  }

  const hash = await sha256(email.trim().toLowerCase());
  return `https://www.gravatar.com/avatar/${hash}.jpg?s=${size}&d=${defaultImage}`;
}

/**
 * Extracts initials from a name
 * @param name The full name
 * @returns Initials (up to 2 characters)
 */
export function getInitials(name?: string): string {
  if (!name) return "?";

  const parts = name.trim().split(/\s+/);
  if (parts.length === 1) {
    return parts[0].charAt(0).toUpperCase();
  }

  return (parts[0].charAt(0) + parts[parts.length - 1].charAt(0)).toUpperCase();
}
