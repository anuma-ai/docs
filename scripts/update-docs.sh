#!/bin/bash

set -e

DOCS_DIR="src/content/docs"
TUTORIAL_DIR="src/content/tutorial"
SDK_REPO_URL="https://github.com/zeta-chain/ai-sdk.git"
EXAMPLES_REPO_URL="https://github.com/zeta-chain/ai-examples.git"
TEMP_DIR=$(mktemp -d)

echo "Removing existing docs directory..."
rm -rf "$DOCS_DIR"

echo "Removing existing tutorial directory..."
rm -rf "$TUTORIAL_DIR"

echo "Cloning ai-sdk repository..."
git clone --depth 1 "$SDK_REPO_URL" "$TEMP_DIR/ai-sdk"

echo "Cloning ai-examples repository..."
git clone --depth 1 "$EXAMPLES_REPO_URL" "$TEMP_DIR/ai-examples"

echo "Copying docs..."
cp -r "$TEMP_DIR/ai-sdk/docs" "$DOCS_DIR"

echo "Copying tutorial..."
cp -r "$TEMP_DIR/ai-examples/docs/documents" "$TUTORIAL_DIR"

echo "Cleaning up..."
rm -rf "$TEMP_DIR"

echo "Done!"
