#!/bin/bash

# Get today's date in YYYY-MM-DD format
TODAY=$(date +%Y-%m-%d)

# Define paths
MEMORY_DIR="/data/.openclaw/workspace/memory"
MEMORY_FILE="$MEMORY_DIR/$TODAY.md"
TEMPLATE_FILE="/data/.openclaw/workspace/resources/templates/daily-note.md"

# Create memory directory if it doesn't exist
mkdir -p "$MEMORY_DIR"

# Check if daily note already exists
if [ -f "$MEMORY_FILE" ]; then
    echo "Daily note already exists: $MEMORY_FILE"
    exit 0
fi

# Check if template exists
if [ ! -f "$TEMPLATE_FILE" ]; then
    echo "Template file not found: $TEMPLATE_FILE"
    exit 1
fi

# Create daily note from template
cp "$TEMPLATE_FILE" "$MEMORY_FILE"

# Replace YYYY-MM-DD with actual date
sed -i "s/YYYY-MM-DD/$TODAY/g" "$MEMORY_FILE"

echo "Daily note created: $MEMORY_FILE"
exit 0
