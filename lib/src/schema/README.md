# Schema

This folder defines the Zod-based schema structure for the resume system used in this project. It is organized to clearly separate the standard [JSON Resume v1.0.0 schema](https://jsonresume.org/schema/) from project-specific extensions.

## Structure

```

schema/
├── base/         # Schemas that match the official JSON Resume v1.0.0 spec exactly
├── extensions/   # Custom extensions layered on top of the base schemas
└── index.ts      # Entry point exporting the final extended schemas

````

## Principles

- **Base Schemas** (`base/`):  
  Faithfully replicate the structure and constraints defined in [/lib/data/jsonresume/v1.0.0/schema.json](../../data/jsonresume/v1.0.0/schema.json). These are intended to mirror the standard without modification.

- **Extended Schemas** (`extensions/`):  
  Extend the base schemas using Zod's `.extend()` or `.merge()` to introduce custom fields needed by the application (e.g. internal `id` fields, timestamps, etc).  
  - All additions must be clearly marked with comments like:
    ```ts
    id: z.string().default(() => generateRandomId("work-")), // Extended: Internal ID
    ```

- **Index File**:  
  The `index.ts` file exports the composed schemas used throughout the app. Consumers should import from here to ensure they get the extended versions.

## Adding a New Field

1. Find or create the appropriate base schema in `base/`.
2. Create or update the corresponding extended schema in `extensions/`.
3. Use `.extend()` to add new fields, and annotate them clearly.
4. Update `index.ts` if needed.
5. Document your change in `/lib/src/STANDARDS.md`.

## Related

- 📄 [STANDARDS.md](../STANDARDS.md): Project-wide schema conventions and documentation practices.
- 📄 JSON Resume Schema: [`/lib/data/jsonresume/v1.0.0/schema.json`](../../data/jsonresume/v1.0.0/schema.json)
