# Resume Viewer

## Purpose

Resume Viewer is a prototype web application designed to showcase my professional web development skills. It consists of a core component library (`lib/`) and a lightweight application (`app/`) for demonstration and deployment. It highlights my expertise in:

- **Coding**: Proficient in React, Tailwind CSS, HTML, and CSS.
- **UX Design**: Focused on creating intuitive user experiences with thoughtful information flow and interaction design.
- **Data Analysis**: Demonstrates the ability to analyze and present data effectively.

This project serves as a public portfolio piece for potential employers, showcasing my ability to build modern, responsive, and dynamic web applications. While the project is functional, it is a work in progress and represents the initial stages of development over the past few weeks.

The project can be viewed live at: [https://resume-viewer.richardadleta.com](https://resume-viewer.richardadleta.com)

## Features

- **Modern Web Technologies**: Built with React and Tailwind CSS for a responsive and dynamic user experience.
- **Core Component Library**: The `lib/` directory contains a shareable and packagable web component.
- **Showcase Application**: The `app/` directory provides a thin wrapper to demonstrate the component and deploy it to GitHub Pages.
- **Reference Implementation**: The deployed `app` serves as a reference, allowing other projects to consume the Resume component via its Vite manifest.
- **Customizable Deployment**: Parameterized builds for deployment to different environments, including GitHub Pages.
- **Public Showcase**: Demonstrates coding, UX, and data analysis skills for hiring purposes.
- **Restrictive Licensing**: Available for personal use with limitations on commercial use.

## Schema Documentation

This project includes a Zod-based schema system to define and extend the [JSON Resume schema](https://jsonresume.org/schema/). The schema is organized into base schemas (matching the JSON Resume v1.0.0 spec) and extended schemas (customized for this project). For detailed information, see the [Schema Documentation](./lib/src/schema/README.md).

## Related Projects

This repository has inspired the creation of a thin template repository designed to host JSON resumes as static sites. The template dynamically references the output of the latest version of Resume Viewer to display resumes, by fetching its Vite manifest (`manifest.json`) and loading the necessary assets at runtime. This allows for a decoupled way to use the Resume Viewer component.

- Live Example: [https://resume.richardadleta.com](https://resume.richardadleta.com)
- Repository: [https://github.com/radleta/resume](https://github.com/radleta/resume)

## Getting Started

### Prerequisites

- Node.js (LTS version recommended)
- npm (comes with Node.js)
- Bash (for running the `build.sh` script)

### Installation

1. Clone the repository:

   ```bash
   git clone https://github.com/radleta/resume-viewer.git
   cd resume-viewer
   ```

2. Install dependencies for both the library and the app:

   ```bash
   bash build.sh
   ```

### Development

The primary development server for the showcase application is run from the `app` directory:

```bash
cd app
npm run dev
```

The application will be available at `http://localhost:3000`.

The core component library in `lib/` has its own independent development server and build process for focused component development and packaging. See `lib/README.md` for more details.

### Building for Production

To build the application for production:

```bash
BASE_URL=/custom-base/ bash build.sh
```

The production-ready files will be located in the `app/dist` directory.

### Deployment

This project is configured to deploy to GitHub Pages using a GitHub Actions workflow. Push changes to the `main` branch to trigger the deployment.

### Branching Model

- `main` is the active trunk branch. Feature branches are merged directly into `main`.
- `dev` is deprecated and mirrors `main` for backwards compatibility; do not target `dev` for new work.

## Project Structure

```text
resume-viewer/
├── app/                # Frontend application (see app/README.md for details)
├── lib/                # Shared library/core component (see lib/README.md for details)
├── build.sh            # Build script
├── .github/workflows/  # GitHub Actions workflows
├── README.md           # Project documentation
└── SPEC.md             # Project specifications
```

## License

This project is available for personal use with restrictive licensing to limit commercial use. See the `LICENSE` file for more details.

## Additional Documentation

- [Project Specifications](SPEC.md): Detailed project goals and requirements.

## Contact

For questions or feedback, please reach out via [radleta@gmail.com](mailto:radleta@gmail.com).
