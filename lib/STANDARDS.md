# Coding Standards

* React components should follow the following these standards:
  * Use PascalCase for component names (e.g., `MyComponent`).
  * Use camelCase for props and state variables (e.g., `myProp`, `myState`).
  * Hooks should be prefixed with `use` (e.g., `useMyHook`). They should be in a file called `MyHook.ts`.
  * UI components should be postfixed with `UI` (e.g., `MyComponentUI`). They should be in a file called `MyComponentUI.tsx`.
  * Folders should be organized by business domain or feature, not by type of component (e.g., `userProfile`, `dashboard`).
    * Use `index.ts` files to re-export components from a folder. This allows for cleaner imports.
  * Contexts should be postfixed with `Context` (e.g., `MyContext`). They should be in a file called `MyContext.tsx`.
  * Models and types not directly related to a component should be in a file postfixed with `Model` (e.g., `MyModel`). They should be in a file called `MyModel.ts`.