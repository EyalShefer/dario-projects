# Wizdi AI Studio - Tasks 1-4: Bug Fixes & UX Refinement

**Start Date:** 2026-03-01  
**Status:** Planning Phase (Code Analysis In Progress)  
**Dependencies:** None (can start immediately)

---

## Task 1: UX Text Labels & Navigation (Est. 3 hours)

### Problem
- UI text inconsistencies across lesson builder, quiz engine, dashboard
- Menu navigation unclear (deep nesting, ambiguous labels)
- Missing translation keys or inconsistent i18n structure

### Analysis
- codebase has 1960+ references to i18n/labels
- Likely using react-i18next or similar structure
- Need to audit:
  - `src/i18n/` directory for translation files
  - Component references to labels
  - Missing translations

### Implementation
1. **Audit Phase:**
   - Map all UI text strings
   - Identify missing/inconsistent labels
   - List navigation menu structure

2. **Refactor Phase:**
   - Standardize label naming convention
   - Create translation audit report
   - Fix menu navigation hierarchy

3. **Testing:**
   - Verify all UI text renders correctly
   - Test RTL (Hebrew) display
   - Check menu navigation flow

### Deliverables
- UI text audit report
- Updated translation keys
- Navigation hierarchy documentation

---

## Task 2: File Upload System (Est. 4 hours)

### Problem
- File upload timeouts
- Size validation issues
- Missing error handling
- No progress indicators

### Analysis
**Need to find:**
- Upload service (`activityMediaService.ts`?)
- Firebase Storage integration
- Form components handling file input
- Error handling patterns

### Implementation
1. **Issue Identification:**
   - Root cause analysis (timeout, size limits, validation)
   - Error scenarios mapping

2. **Fix Implementation:**
   - Increase timeout settings
   - Add proper size validation
   - Progress indicator UI
   - Graceful error handling

3. **Testing:**
   - Test various file sizes
   - Network timeout scenarios
   - Error message clarity

### Deliverables
- Updated upload service
- Progress indicator component
- Error handling guide

---

## Task 3: Image Handling (Est. 3 hours)

### Problem
- Aspect ratio issues
- Missing loading states
- Lazy loading problems
- Poor responsive scaling

### Analysis
**Need to find:**
- Image display components
- Lazy loading implementation
- CSS styling for responsive images

### Implementation
1. **Image Component Audit:**
   - Identify all image display locations
   - Check lazy loading setup
   - Test responsive breakpoints

2. **Fixes:**
   - Aspect ratio containers
   - Loading skeleton/spinner
   - Proper lazy loading
   - Responsive image sizing

3. **Testing:**
   - Various image sizes/formats
   - Responsive layout
   - Loading state visibility

### Deliverables
- Updated image components
- Responsive image guidelines
- Loading state patterns

---

## Task 4: Dashboard Analytics (Est. 4 hours)

### Problem
- Student progress tracking missing/incomplete
- Teacher insights not functional
- Pedagogical audit integration pending

### Analysis
**Need to find:**
- Dashboard component (`Dashboard.tsx`?)
- Analytics data structures
- Firestore queries for student/teacher data
- Visualization components

### Implementation
1. **Data Structure Review:**
   - Map student progress schema
   - Teacher performance metrics
   - Pedagogical audit fields

2. **Feature Implementation:**
   - Student progress tracking UI
   - Teacher performance insights
   - Adva's pedagogical feedback integration

3. **Testing:**
   - Data accuracy
   - Real-time updates
   - Permission handling

### Deliverables
- Analytics dashboard UI
- Data query services
- Pedagogical integration guide

---

## Next Steps

1. **Code Deep Dive** (Current)
   - Clone repo ✅
   - Audit file structure
   - Identify exact pain points

2. **Detailed Planning** (Next)
   - Create per-task implementation details
   - Identify affected files
   - Estimate actual hours

3. **Implementation** (Ready to Start)
   - Start with Task 1 (quickest win)
   - Follow with Task 2, 3, 4

---

## Notes

- All work done via GitHub feature branches
- Tests required before staging deploy
- Adva's feedback integration via QA Chat (Tasks 5-8, now complete)
- Production deploy requires Adva approval (via Chat)
