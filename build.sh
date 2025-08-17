#!/bin/bash

# Fail fast and treat unset vars as errors; safer word splitting
set -euo pipefail
IFS=$'\n\t'

# Bash script to build the application
# Usage: bash ./build.sh

# Check for the app and lib directories
if [ ! -d "app" ]; then
  echo "Please run this script from the root directory of the project."
  exit 1
fi
if [ ! -d "lib" ]; then
  echo "Please run this script from the root directory of the project."
  exit 1
fi

# Switch to lib directory
cd lib

# Clean up previous builds
echo "Cleaning up previous packages..."
rm -f ./*.tgz 2>/dev/null || true

# Installing dependencies for the library
echo "Installing library dependencies..."
npm ci
if [ $? -ne 0 ]; then
  echo "Failed to install library dependencies."
  exit 1
fi
echo "Library dependencies installed successfully."

# Build the library
echo "Building and packing the library..."
npm pack
if [ $? -ne 0 ]; then
  echo "Failed to build and pack the library."
  exit 1
fi
echo "Library built and packaged successfully."

# Find the latest version of the library as a tarball
LIB_TARBALL=$(ls -t *.tgz | head -n 1)
if [ -z "$LIB_TARBALL" ]; then
  echo "No tarball found in the lib directory."
  exit 1
fi
echo "Using library tarball: $LIB_TARBALL"

# Switch to app directory
cd ../app

# Clean up previous builds
echo "Cleaning up previous builds..."
rm -rf ./node_modules/resume-viewer || true

# Install the library tarball
echo "Installing the library tarball..."
npm install ../lib/$LIB_TARBALL
if [ $? -ne 0 ]; then
  echo "Failed to install the library tarball."
  exit 1
fi
echo "Library tarball installed successfully."

# Install other dependencies
echo "Installing other dependencies..."
npm ci
if [ $? -ne 0 ]; then
  echo "Failed to install other dependencies."
  exit 1
fi
echo "All dependencies installed successfully."

# Build the application
echo "Building the application..."
BASE_URL=${BASE_URL:-/} npm run build
if [ $? -ne 0 ]; then
  echo "Failed to build the application."
  exit 1
fi
echo "Application built successfully."
echo "Build process completed successfully."