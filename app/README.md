# Resume Viewer Application

## Purpose

This `app` directory contains a lightweight React application that serves as a thin wrapper around the core Resume component developed in the `../lib` directory. Its primary purposes are:

1.  **Showcase on GitHub Pages**: To provide a simple, buildable, and deployable application that demonstrates the functionality and appearance of the Resume component. This allows for easy viewing and sharing via GitHub Pages.
2.  **Reference Implementation**: The built version of this application, specifically its Vite manifest file (`manifest.json`), can be used as a reference by other projects that wish to embed or utilize the Resume component. This allows other projects to dynamically load the component assets.

This application is intentionally kept minimal. Most of the core logic, UI, and schema definitions reside in the `../lib` project.

## Deployment

This application is designed to be built and deployed to GitHub Pages. The build process generates static assets that can be hosted directly.

## Usage as a Reference for Other Projects

Once this `app` is built and deployed (e.g., to GitHub Pages), its Vite-generated `manifest.json` file (typically found at a path like `/.vite/manifest.json` relative to the deployment URL) becomes a key asset for other projects.

This manifest allows another project to dynamically load the Resume component's CSS and JavaScript assets at runtime. Here's how it works, exemplified by the [radleta/resume](https://github.com/radleta/resume) project:

1.  **Manifest URL**: The consuming project's HTML (e.g., `index.html` in `radleta/resume`) includes an element (like a `<div>`) with a `data-vite-manifest` attribute. This attribute's value is the full URL to the `manifest.json` file of the deployed `resume-viewer` application (e.g., `https://resume-viewer.richardadleta.com/.vite/manifest.json`).
2.  **Entry Name**: The same HTML element also includes a `data-vite-name` attribute, specifying the entry point in the manifest to load (typically `"index"`).
3.  **Dynamic Loading Script**: The consuming project includes a JavaScript file (like `assets/js/scripts.js` in `radleta/resume`). This script:
    *   On page load, finds elements with the `data-vite-manifest` and `data-vite-name` attributes.
    *   Fetches the specified `manifest.json` file.
    *   Parses the manifest to find the asset files (CSS and JS) associated with the given entry name.
    *   Dynamically creates `<link>` tags for the CSS files and `<script>` tags for the JavaScript files, appending them to the document's `<head>`. The URLs for these assets are resolved relative to the manifest's location.

This approach allows the `resume-viewer` component to be embedded into any static site or HTML page by simply referencing its deployed build artifacts, without requiring the consuming project to have a complex build setup or install the component as an npm dependency. It effectively turns the deployed `resume-viewer/app` into a micro-frontend that serves the resume component.

## Development

To run this application locally for development:

1.  Ensure dependencies are installed by running `bash build.sh` from the root of the `resume-viewer` repository, or `npm install` from within this `app` directory if you've already built the `lib`.
2.  Start the development server:

    ```bash
    # From the resume-viewer/app/ directory
    npm run dev
    ```

## Future Scope

While currently a very thin wrapper, this `app` directory might, in the future, include:

-   Additional documentation specific to the application's deployment or usage as a showcase.
-   Examples of different configurations or themes for the Resume component.
-   User interface elements or pages that are not part of the core library but are useful for the demonstration.
