# Resume Viewer

## Overview

Resume Viewer is a web application designed to present resumes in a concise and visually appealing format. It serves as a showcase of development skills, including coding, UX design, and data analysis. The project is hosted on GitHub Pages for easy access and sharing.

## Features

- **React and Tailwind CSS**: Built with modern web technologies for a responsive and dynamic user experience.
- **Customizable Base URL**: Parameterized builds allow deployment to different environments, such as GitHub Pages.
- **Public Showcase**: Demonstrates coding, UX, and data analysis skills for hiring purposes.
- **Restrictive Licensing**: Available for personal use with limitations on commercial use.

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

To start the development server:
```bash
cd app
npm run dev
```

The application will be available at `http://localhost:3000`.

### Building for Production

To build the application for production:
```bash
BASE_URL=/custom-base/ bash build.sh
```

The production-ready files will be located in the `app/dist` directory.

### Deployment

This project is configured to deploy to GitHub Pages using a GitHub Actions workflow. Push changes to the `main` branch to trigger the deployment.

## Project Structure

```
resume-viewer/
├── app/                # Frontend application
├── lib/                # Shared library
├── build.sh            # Build script
├── .github/workflows/  # GitHub Actions workflows
├── README.md           # Project documentation
└── SPEC.md             # Project specifications
```

## License

This project is available for personal use with restrictive licensing to limit commercial use. See the `LICENSE` file for more details.

## Goals

- Present resumes in a digestible format.
- Showcase development skills for hiring purposes.
- Host the project publicly on GitHub Pages.

## Contact

For questions or feedback, please reach out via [radleta@gmail.com].
