#!/bin/bash
set -e

# Nightly Memory Sync: Runs at 2:00 AM
# Reviews daily notes, logs sync status

LOG="/data/.openclaw/workspace/logs/nightly-sync.log"
mkdir -p /data/.openclaw/workspace/logs

{
  echo "=== Nightly Memory Sync $(date) ==="
  
  # Step 1: Create today's daily note if missing
  /data/.openclaw/workspace/scripts/create-daily-note.sh || true
  
  # Step 2: Check last synced date
  LAST_SYNC_FILE="/data/.openclaw/workspace/.last-sync"
  if [ -f "$LAST_SYNC_FILE" ]; then
      LAST_SYNC=$(cat "$LAST_SYNC_FILE")
  else
      LAST_SYNC="2026-01-01"
  fi
  
  echo "Last sync: $LAST_SYNC"
  
  # Step 3: Find recent daily notes since last sync
  MEMORY_DIR="/data/.openclaw/workspace/memory"
  NOTES_FOUND=0
  
  find "$MEMORY_DIR" -name "*.md" -newermt "$LAST_SYNC" | sort | while read NOTE; do
    echo "Found unprocessed note: $NOTE"
    NOTES_FOUND=$((NOTES_FOUND + 1))
  done
  
  echo "Notes to process: $NOTES_FOUND"
  
  # Step 4: Check for task-logs and include in daily notes
  TASK_LOG_DIR="/data/.openclaw/workspace/task-logs"
  TODAY=$(date +%Y-%m-%d)
  TASK_LOG="$TASK_LOG_DIR/$TODAY.md"
  
  if [ -f "$TASK_LOG" ]; then
    echo "Found task log: $TASK_LOG"
    echo "Task log content will be reviewed in daily notes update"
  else
    echo "No task log found for today"
  fi
  
  # Step 5: Update last sync timestamp
  date +%Y-%m-%d > "$LAST_SYNC_FILE"
  
  echo "Sync complete: $(date)"
} | tee -a "$LOG"
