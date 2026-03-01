#!/bin/bash
# Night Task Runner with Logging
# Executes scheduled tasks and logs results to task-logs/

WORKSPACE="/data/.openclaw/workspace"
TASK_LOG_DIR="$WORKSPACE/task-logs"
LOG_DATE=$(date +%Y-%m-%d)
TASK_LOG="$TASK_LOG_DIR/$LOG_DATE.md"

# Create task log if doesn't exist
if [ ! -f "$TASK_LOG" ]; then
  cat > "$TASK_LOG" << 'EOF'
# Task Log — {{ DATE }} (Night Run)

{{ TASKS }}

---
## Summary
Night tasks completed. See details above.
EOF
fi

# Function: Log task result
log_task() {
  local task_name="$1"
  local status="$2"
  local output_files="$3"
  local decisions="$4"
  local next_steps="$5"

  cat >> "$TASK_LOG" << EOF

## Task: $task_name

**Status:** $status  
**Time:** $(date '+%H:%M %Z')  

### Output Files
$output_files

### Decisions Made
$decisions

### Next Steps
$next_steps

---
EOF
  
  echo "[$(date '+%H:%M:%S')] Task logged: $task_name"
}

# Log start
echo "[$(date '+%H:%M:%S')] Night task run started at $LOG_DATE"
echo "Task log: $TASK_LOG"

# TODO: Add specific night tasks here
# Example:
# log_task "Landing Page" "✅ Complete" \
#   "- /projects/wizdi-international/landing-page-india.html" \
#   "- Dual language (Hindi/English)" \
#   "1. Review design\n2. Test mobile\n3. Deploy"

echo "[$(date '+%H:%M:%S')] Night task run complete. Check $TASK_LOG"
