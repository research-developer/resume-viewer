/**
 * This function checks if the value is a JSON serializable object and calls its json method if it exists.
 * @param key The key of the object being serialized
 * @param value The value of the object being serialized
 * @returns Returns the JSON serializable object or the value as is
 * @example
 * // Use jsonable as a replacer function in JSON.stringify
 * const json = JSON.stringify(data, jsonable, 2);
 */
export function jsonable(_: string, value: any): any {
  // Check if the value is a JSON serializable object
  if (value && typeof value === "object" && typeof value.json === "function") {
    return value.json(); // Call the json method of the object
  }
  return value; // Return the value as is
}
