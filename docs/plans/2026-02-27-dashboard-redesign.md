# Dashboard Redesign — Project & Task Tracking

**Date:** 2026-02-27  
**Owner:** Eyal (יוני)  
**Target:** https://eyalshefer.github.io/dario-projects/

---

## Goals

**What users see:**
1. **Main dashboard** — All projects in a clean table (Project Name, Status, Progress %, Last Updated)
2. **Drill-down** — Click project → see all tasks with timestamps, logs, status
3. **Task details** — Each task shows: what happened, when, who did it, current status
4. **Auto-update** — Data refreshes without page reload (every 30 seconds)
5. **Design** — Modern, professional, responsive (desktop + mobile)

---

## Data Structure

**New JSON format** — Will replace current tracking.json

```
projects/
├── captain-count/
│   ├── project.json (metadata: name, status, progress, updated_at)
│   └── tasks/
│       ├── 1-analytics.json (task: name, status, started_at, completed_at, logs[])
│       ├── 2-payment.json
│       └── ...
├── wizdi-ai-studio/
│   ├── project.json
│   └── tasks/
│       └── ...
└── dario-system/
    ├── project.json
    └── tasks/
        └── ...
```

**Task log entry example:**
```json
{
  "timestamp": "2026-02-27T22:50:00Z",
  "status": "completed",
  "message": "Firebase config templates created",
  "duration_minutes": 30,
  "artifacts": ["firebase-config.json", "ANALYTICS_SETUP.md"],
  "next_step": "Manual console setup (Firebase, GA4, Stripe)"
}
```

---

## Implementation Tasks

### Phase 1: Data Structure (30 min)

**1.1** Create JSON schema for projects + tasks  
**1.2** Migrate current captain-count tracking.json → new schema  
**1.3** Create initial project.json for all 3 projects (Captain Count, Wizdi AI, Dario System)  
**1.4** Test: Verify JSON is valid + loads without errors

### Phase 2: Dashboard HTML/CSS (1.5 hours)

**2.1** Create index.html with:
  - Header (branding, last updated)
  - Projects table (name, status badge, progress bar, last updated, "View" button)
  - Empty project detail panel (hidden by default)

**2.2** Add CSS:
  - Grid layout (left: projects table, right: detail panel)
  - Responsive (mobile: stacked layout)
  - Color scheme (status badges: green/yellow/red)
  - Smooth transitions

**2.3** Test: Open in browser, check responsive design

### Phase 3: JavaScript — Load & Display (1 hour)

**3.1** Write JS function: `loadProjects()` — fetch all project.json files, combine into array

**3.2** Write JS function: `renderProjectsTable()` — display projects in table with click handlers

**3.3** Write JS function: `showProjectDetails(projectId)` — load tasks.json, render task list + logs

**3.4** Test: Click on project → detail panel appears with tasks

### Phase 4: Task Details & Logs (1 hour)

**4.1** Write JS function: `renderTaskLogs(tasks)` — show each task as expandable card
  - Card header: Task name, status badge, progress %
  - Card body (collapsed): Last log entry + timestamp
  - Card body (expanded): Full log history, artifacts

**4.2** Add expand/collapse functionality with smooth animations

**4.3** Test: Click task → logs expand, shows all updates

### Phase 5: Auto-Update (30 min)

**5.1** Write `autoRefresh()` function — fetch data every 30 seconds

**5.2** Only update DOM if data changed (avoid flicker)

**5.3** Show "Last updated: X seconds ago" indicator

**5.4** Test: Change a task log → dashboard updates automatically

### Phase 6: Polish & Deploy (30 min)

**6.1** Add loading spinner while fetching data

**6.2** Error handling (missing files, network errors) → show friendly messages

**6.3** Test on desktop + mobile

**6.4** Push to GitHub → verify https://eyalshefer.github.io/dario-projects/ shows new dashboard

---

## Total Time: ~4.5 hours

---

## Questions Before I Start

1. **Color scheme** — Dark mode? Light? (I'll do modern dark by default)
2. **Auto-refresh frequency** — Every 30 seconds? (Can be changed)
3. **Should old data show** — All projects (Captain Count, Wizdi, Dario System), or just Captain Count?
4. **Deployment trigger** — Manual push to GitHub, or auto-sync from workspace?

תן לי אור ירוק ואני אתחיל.
