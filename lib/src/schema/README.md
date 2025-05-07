# Schema

This folder defines the Zod-based schema structure for the resume system used in this project. It is organized to clearly separate the standard [JSON Resume v1.0.0 schema](https://jsonresume.org/schema/) from project-specific extensions.

## Structure

```
schema/
├── base/         # Schemas that match the official JSON Resume v1.0.0 spec exactly
├── extensions/   # Custom extensions layered on top of the base schemas
└── index.ts      # Entry point exporting the final extended schemas
```

## Principles

- **Base Schemas** (`base/`):  
  Faithfully replicate the structure and constraints defined in [/lib/data/jsonresume/v1.0.0/schema.json](../../data/jsonresume/v1.0.0/schema.json). These are intended to mirror the standard without modification.

- **Extended Schemas** (`extensions/`):  
  Extend the base schemas using Zod's `.extend()` or `.merge()` to introduce custom fields needed by the application (e.g., internal `id` fields, timestamps, etc).  
  - All additions are clearly marked with comments in the code, e.g.:
    ```ts
    id: z.string().default(() => generateRandomId("work-")), // Extended: Internal ID
    ```

- **Index File**:  
  The `index.ts` file exports the composed schemas used throughout the app. Consumers should import from here to ensure they get the extended versions.

## Differences Between Base and Extended Schemas

The extended schemas build upon the base schemas to add functionality specific to this project. Below is a summary of the key differences:

| **Schema**       | **Key Changes**                                                                 |
|-------------------|--------------------------------------------------------------------------------|
| **Work**          | Adds `id` (internal ID), `skills`, `references`, and `location` as objects.    |
| **Volunteer**     | Adds `id` (internal ID) and makes `summary` required.                          |
| **Skill**         | Adds `id` (internal ID) and `startDate`/`endDate` for date range.              |
| **Reference**     | Adds `id` (internal ID) and `date` as a coerced date.                          |
| **Basics**        | Adds `id` (internal ID) and extends `location` and `profiles` with custom schemas. |
| **Award**         | Adds `id` (internal ID).                                                       |
| **Certificate**   | Adds `id` (internal ID).                                                       |
| **Project**       | Adds `id` (internal ID) and coerces `startDate`/`endDate` to dates.            |
| **Location**      | Adds `id` (internal ID) and allows `location` to be a string or object.        |

### Why Extend the Schemas?

The extensions are designed to:
- Add internal fields (e.g., `id`) for better UI and database integration.
- Enforce stricter validation where needed (e.g., making `summary` required for `Volunteer`).
- Support additional functionality, such as date ranges or nested objects.

#### Detailed Reasoning for Key Changes

1. **Skills, References, and Location in Work Schema**:
   - **Skills**:  
     The addition of `skills` at the job level allows for more granular detail about the specific skills used in each position. This is particularly useful for:
       - **Data Mining**: Users can associate skills with specific jobs, enabling better analysis of skill usage across roles.
       - **Display Enhancements**: Individual skills can be displayed per job, which is critical for roles requiring unique skill sets.
       - **Optionality**: While not required, this feature adds depth to the schema without enforcing unnecessary constraints.
   - **Start and End Dates for Skills**:  
     Adding optional `startDate` and `endDate` fields to skills enables:
       - **Time Calculations**: Users can calculate how long a skill was actively used in a job.
       - **Skill Gaps**: It becomes possible to show that a skill may not have been used throughout the entire duration of a job.
       - **Flexibility**: These fields are optional, so users can include them only when relevant.
   - **References**:  
     Adding references at the job level provides context for specific roles, enhancing the ability to validate or elaborate on work experience.
   - **Location as an Object**:  
     Extending `location` to be an object (instead of a string) allows for richer data, such as city and country codes, which can be used for filtering or regional analysis.

2. **Skill Hierarchy**:
   - The base schema includes `keywords` for skills, which has been extended to support a hierarchy:
     - **Parent-Child Relationships**: Skills can have a parent (e.g., "Coding Skills") and children (e.g., "C#", "TypeScript", "JavaScript").
     - **Rollups**: This structure allows for rollups, where child skills are grouped under their parent for better organization and display.
     - **Matching by Name**: When a skill matches by name, it is treated as a child, enabling dynamic hierarchy building.

#### Example Use Case for Skill Hierarchy

- **Parent Skill**: "Coding Skills"
  - **Child Skills**: "C#", "TypeScript", "JavaScript"
- This hierarchy allows users to see a high-level summary of coding skills while also drilling down into specific languages.

### Example: Work Schema

The following example demonstrates how the `Work` schema is extended:

```ts
// Base Schema (matches JSON Resume spec)
{
  name: "Facebook",
  location: "Menlo Park, CA",
  position: "Software Engineer",
  startDate: "2020-01",
  endDate: "2022-12"
}

// Extended Schema (adds project-specific fields)
{
  id: "work-12345", // Internal ID for UI behavior
  name: "Facebook",
  location: {
    id: "loc-67890", // Extended: Location as an object
    city: "Menlo Park",
    countryCode: "US"
  },
  position: "Software Engineer",
  skills: ["React", "TypeScript"], // Extended: Skills array
  references: [
    {
      id: "ref-11111", // Extended: Reference with internal ID
      name: "John Doe",
      reference: "Great team player."
    }
  ]
}
```

For the full implementation, see the [Work Schema](./extensions/work.ts).

## Adding a New Field

1. Find or create the appropriate base schema in `base/`.
2. Create or update the corresponding extended schema in `extensions/`.
3. Use `.extend()` to add new fields, and annotate them clearly in the code.
4. Update `index.ts` if needed.
5. Document your change in `/lib/src/STANDARDS.md`.

## Related

- 📄 [STANDARDS.md](../STANDARDS.md): Project-wide schema conventions and documentation practices.
- 📄 JSON Resume Schema: [`/lib/data/jsonresume/v1.0.0/schema.json`](../../data/jsonresume/v1.0.0/schema.json)