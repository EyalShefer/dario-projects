#!/bin/bash
# Auto-push projects to GitHub dario-projects repo

source /data/.openclaw/workspace/.secrets/github-token.sh

REPO_PATH="/tmp/dario-projects"
PROJECTS_SOURCE="/data/.openclaw/workspace/public/projects"

cd "$REPO_PATH" || exit

# Copy latest projects
cp -r "$PROJECTS_SOURCE"/* projects/

# Commit and push
git add .
git commit -m "Auto-update: $(date '+%Y-%m-%d %H:%M:%S')" || exit 0
git push https://$GITHUB_TOKEN@github.com/EyalShefer/dario-projects.git main

echo "✓ Projects pushed to GitHub"
