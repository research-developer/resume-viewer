# Resume Viewer Library

## Purpose

This directory contains the shared library for the Resume Viewer project. It houses reusable components, utility functions, and the core schema definitions used by the main application. The primary goal of this library is to encapsulate common functionalities and data structures, promoting modularity and code reusability across the project.

## Key Features and Components

The library includes several key pieces of functionality:

- **Schema System**: A comprehensive, Zod-based schema system for defining and extending the [JSON Resume schema](https://jsonresume.org/schema/). This allows for strong typing and validation of resume data.
  - Base schemas adhere to the JSON Resume v1.0.0 specification.
  - Extended schemas provide custom fields and structures tailored for the Resume Viewer application.
- **Utility Functions**: A collection of helper functions and classes for common tasks, such as color manipulation, fluent iterable data structures, Gravatar integration, identity management, and JSON serialization/deserialization.
- **React Components and Hooks**: Reusable UI components (like for Gravatar display) and custom React hooks for managing and accessing resume data within applications.
- **Core Entry Point**: `index.ts` serves as the main export point for the library's public API.

## Schema Documentation

For a detailed explanation of the resume schema, including base and extended definitions, please refer to the [Schema Documentation](./src/schema/README.md).

## Development

The library is built and managed alongside the main `app` and `resume-viewer` project. It can also be developed and tested independently.

### Prerequisites

- Node.js (LTS version recommended)
- npm (comes with Node.js)

### Installation and Building

Dependencies for the library are installed as part of the main project's setup using the root `build.sh` script. If you are working solely within the `lib` directory, you can also install its dependencies and build it directly:

```bash
# From the lib/ directory
npm install
npm run build
```

## Graph Query API Quickstart

The library includes a lightweight graph layer with seed data, a natural-language (NL) query compiler, and scoring helpers.

Example (TypeScript):

```ts
import { loadNodesFromJson, loadTriplesFromNdjson } from "./src/graph/Loader";
import { query, top_nodes, exporter } from "./src/graph/API";
import fs from "node:fs";
import path from "node:path";

const dataDir = path.join(__dirname, "./data");
const nodes = loadNodesFromJson(fs.readFileSync(path.join(dataDir, "nodes.json"), "utf8"));
const triples = loadTriplesFromNdjson(fs.readFileSync(path.join(dataDir, "triples.ndjson"), "utf8"));

// NL queries: tokens s:, p:, o:, tag:, category:, type:, linked:, limit:, offset:
const results = query("type:Project tag:agentic linked:preston", triples);

// Top base nodes for a subject with scoring + recency tiebreak
const top = top_nodes("person.preston", triples, 5);

// Export helpers
const nodesJson = exporter.nodesJson(nodes);
const triplesNdjson = exporter.triplesNdjson(triples);
```

See `src/graph/API.ts` and `PLANS.md` for design notes and supported tokens.

### Local Development

The library includes its own Vite development server, allowing for standalone testing and development of its components. This is particularly useful for building and verifying the library as an encapsulated web component.

To start the library's development server:

```bash
# From the lib/ directory
npm run dev
```

This will typically make the library available for testing in a browser (e.g., at `http://localhost:5173`).

### Packaging as a Web Component

This library is designed to be a self-contained web component. After building (using `npm run build` in the `lib` directory), it can be packaged (e.g., for publication to npm) and then installed as a dependency in other projects. This allows for easy integration of its UI components and functionalities.

## Project Structure

```text
lib/
├── data/               # Contains raw data, like JSON Resume samples
│   └── jsonresume/
├── src/                # Source code for the library
│   ├── schema/         # Zod schema definitions for JSON Resume
│   │   └── README.md   # Detailed schema documentation
│   ├── index.ts        # Main export for the library
│   └── main.tsx        # Entry point for the Vite development server (testing/building the component)
├── eslint.config.js    # ESLint configuration
├── index.html          # Likely for testing or isolated component viewing
├── package.json        # NPM package manifest for the library
├── README.md           # This file
├── STANDARDS.md        # Coding standards for the library
├── tsconfig.app.json   # TypeScript configuration for applications using the lib
├── tsconfig.json       # Base TypeScript configuration
├── tsconfig.node.json  # TypeScript configuration for Node.js environments
└── vite.config.ts      # Vite configuration for the library
```

This library is integral to the Resume Viewer application, providing foundational elements and shared logic.
