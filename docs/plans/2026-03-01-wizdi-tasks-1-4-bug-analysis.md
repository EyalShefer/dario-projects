# Wizdi AI Studio — Tasks 1-4 Bug Analysis & Fix Proposals

**Date:** 2026-03-01  
**Analysis Scope:** Proactive code review (not yet QA-reported)  
**Project:** ai-lms-system (TypeScript + React + Firebase)

---

## Summary

Tasks 1-4 cover bug fixes in four categories:
1. **UX Labels & i18n** — Hardcoded strings, missing translations
2. **File Upload** — Timeouts, error handling, progress tracking
3. **Service Dependencies** — TODOs, incomplete error handling, debug code
4. **Page Structure** — Debug overrides, test code in production

This analysis identifies 12 actionable bugs with risk assessment and fix proposals.

---

## Bug Catalog

### Category 1: UX Labels & i18n (4 bugs)

#### Bug 1.1: Hardcoded Hebrew in ReferenceExamUpload
**Location:** `src/components/referenceExams/ReferenceExamUpload.tsx`  
**Impact:** High (visible to users, poor translations if multi-language)

**Current Code:**
```typescript
const EXAM_TYPES = [
  { value: 'unit_exam', label: 'מבחן יחידה / סיכום פרק' },
  { value: 'midterm', label: 'מבחן אמצע' },
  { value: 'final', label: 'מבחן מסכם' },
];
```

**Problem:** Labels are hardcoded as Hebrew strings. If app needs English version, these won't translate.

**Risk of Fix:** 
- **Probability:** Low (isolated constant)
- **Severity:** Low (only affects label definitions)
- **Mitigation:** Move to i18n config file, test English/Hebrew rendering

**Proposed Fix:**
1. Create `src/locales/examLabels.ts` with i18n structure
2. Replace inline constants with i18n keys
3. Update component to use i18n hook
4. Test: Verify both Hebrew and English labels render correctly

**Estimated Effort:** 1.5 hours

---

#### Bug 1.2: Inline Error Messages in ReferenceExamUpload
**Location:** `src/components/referenceExams/ReferenceExamUpload.tsx` (multiple)

**Current Code:**
```typescript
setError('יש לבחור קובץ PDF בלבד');
setError('יש לבחור קובץ');
setError('יש לבחור ספר לימוד');
setUploadProgress('מעלה קובץ...');
```

**Problem:** Error/progress messages are inline Hebrew strings, not using i18n system.

**Risk of Fix:** 
- **Probability:** Very Low (isolated strings)
- **Severity:** Low (doesn't affect logic)

**Proposed Fix:**
1. Create error message keys in i18n
2. Replace inline strings with `t('exam.upload.selectPdf')` pattern
3. Test: All error messages display correctly

**Estimated Effort:** 1 hour

---

#### Bug 1.3: Subject/Grade Constants Without i18n
**Location:** `src/components/referenceExams/ReferenceExamUpload.tsx`

**Current Code:**
```typescript
const SUBJECTS = [
  { value: 'math', label: 'מתמטיקה' },
  { value: 'hebrew', label: 'עברית' },
];
```

**Problem:** Subject and grade labels hardcoded, not translatable.

**Risk of Fix:** Low (isolated constants)

**Proposed Fix:**
1. Move to i18n config
2. Update component to fetch from i18n
3. Test: Grade and subject labels render in English/Hebrew

**Estimated Effort:** 1 hour

---

#### Bug 1.4: Missing ARIA Labels & Accessibility Text
**Location:** All form inputs in ReferenceExamUpload and similar components

**Problem:** Input fields lack proper labels for screen readers, no `aria-label` attributes.

**Risk of Fix:** Low (accessibility enhancement, no logic changes)

**Proposed Fix:**
1. Add `aria-label` and `aria-describedby` to all inputs
2. Add explicit `<label>` elements for form fields
3. Test: Screen reader test (NVDA/JAWS simulation or actual test)

**Estimated Effort:** 1.5 hours

---

### Category 2: File Upload Issues (3 bugs)

#### Bug 2.1: No Timeout Configuration for Upload
**Location:** `src/components/referenceExams/ReferenceExamUpload.tsx` → `handleUpload()`

**Current Code:**
```typescript
const result = await uploadReferenceExam({
  fileUrl,
  storagePath,
  // ... no timeout specified
});
```

**Problem:** Upload can hang indefinitely if Cloud Function doesn't respond.

**Risk of Fix:**
- **Probability:** Low (affects only timeout edge case)
- **Severity:** High (user experience - stuck upload)
- **Mitigation:** Add timeout, test with slow network simulation

**Proposed Fix:**
1. Add timeout wrapper to Cloud Function call
2. Set timeout to 60 seconds (configurable)
3. Handle timeout errors gracefully (show retry button)
4. Test: Simulate slow network, verify timeout triggers

**Estimated Effort:** 1.5 hours

---

#### Bug 2.2: Missing Retry Logic for Failed Uploads
**Location:** `src/components/referenceExams/ReferenceExamUpload.tsx`

**Current Code:**
```typescript
try {
  await uploadReferenceExam({...});
  // success
} catch (err: any) {
  setError(err.message || 'שגיאה בהעלאת הקובץ');
}
```

**Problem:** Upload fails permanently on network error. User must manually retry entire process.

**Risk of Fix:**
- **Probability:** Very Low (adds new UI state)
- **Severity:** Medium (user annoyance, not data loss)
- **Mitigation:** Add "Retry" button, test with network interruption

**Proposed Fix:**
1. Add retry count state (max 3 attempts)
2. Show "Retry" button on error instead of just error message
3. Preserve file and metadata during retry
4. Test: Simulate network failure, verify retry works

**Estimated Effort:** 1.5 hours

---

#### Bug 2.3: No File Size Validation
**Location:** `src/components/referenceExams/ReferenceExamUpload.tsx` → `handleFileChange()`

**Current Code:**
```typescript
const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
  const selectedFile = e.target.files?.[0];
  if (selectedFile) {
    if (selectedFile.type !== 'application/pdf') {
      setError('יש לבחור קובץ PDF בלבד');
      return;
    }
    // ... no size check
```

**Problem:** User can select 500MB PDF files. Upload will fail or be very slow.

**Risk of Fix:**
- **Probability:** Very Low (adds validation)
- **Severity:** Low (prevents user frustration)

**Proposed Fix:**
1. Add max file size check (e.g., 50MB)
2. Show error message if exceeded
3. Display file size in UI (already done: `{(file.size / 1024 / 1024).toFixed(2)} MB`)
4. Test: Try uploading files >50MB, verify error shows

**Estimated Effort:** 0.5 hours

---

### Category 3: Service Dependencies & TODOs (3 bugs)

#### Bug 3.1: Incomplete Optimistic Update in eventService
**Location:** `src/services/eventService.ts`

**Current Code:**
```typescript
// TODO: Revert optimistic update if needed
```

**Problem:** Code comment indicates incomplete error handling. If an event update fails, optimistic UI update is not reverted.

**Risk of Fix:**
- **Probability:** Medium (affects all event updates)
- **Severity:** Medium (user sees stale state if update fails)
- **Mitigation:** Comprehensive testing of event service with network failures

**Proposed Fix:**
1. Find where optimistic update happens (likely in event creation/update)
2. Add try-catch wrapper
3. On error: revert UI state to previous value
4. Test: Simulate network failure during event update, verify revert works

**Estimated Effort:** 2 hours

---

#### Bug 3.2: Missing Firestore Index in liveSessionService
**Location:** `src/services/liveSessionService.ts`

**Current Code:**
```typescript
// TODO: Add proper index and query
// TODO: Add proper Firestore index
```

**Problem:** Query may fail or be slow without composite index. Will cause runtime errors in production.

**Risk of Fix:**
- **Probability:** High (affects live session queries)
- **Severity:** High (queries fail or timeout)
- **Mitigation:** Deploy Firestore index before fix, test query performance

**Proposed Fix:**
1. Identify the query that needs indexing (find the actual query code)
2. Check Firestore console for "Missing Index" errors in logs
3. Deploy composite index via `firebase deploy --only firestore:indexes`
4. Update comment to reflect index is deployed
5. Test: Query live sessions, verify results return quickly

**Estimated Effort:** 1.5 hours

---

#### Bug 3.3: Debug Logging Left in Production Code
**Location:** `src/services/ai/smartCreationServiceV2.ts` (multiple)

**Current Code:**
```typescript
console.log('🔍 [DEBUG] userMessage:', userMessage);
console.log('🔍 [DEBUG] effectiveContentMode:', effectiveContentMode);
console.log('🔍 [DEBUG WIZARD CHECK] capability.execution.type:', capability?.execution?.type);
```

**Problem:** Debug logs pollute console, may leak sensitive data in production, slow performance slightly.

**Risk of Fix:**
- **Probability:** Very Low (only removes logs)
- **Severity:** Low (no logic changes)
- **Mitigation:** Use search to verify no logs are critical for error tracking

**Proposed Fix:**
1. Search for all `console.log()` calls with 🔍 or [DEBUG] prefix
2. Remove or replace with proper logging service (if exists)
3. Keep only essential error logs
4. Test: Verify console is clean, no debug spam

**Estimated Effort:** 0.5 hours

---

### Category 4: Page Structure & Debug Code (2 bugs)

#### Bug 4.1: Debug Override in SequentialCoursePlayer
**Location:** `src/components/SequentialCoursePlayer.tsx`

**Current Code:**
```typescript
const [forceExam, setForceExam] = useState(false); // DEBUG: Override mode
```

**Problem:** Test/debug state variable left in production code. Could be exploited to bypass normal flow.

**Risk of Fix:**
- **Probability:** Very Low (removing state)
- **Severity:** Low (not a security issue, just code cleanliness)
- **Mitigation:** Verify `forceExam` isn't used elsewhere before removing

**Proposed Fix:**
1. Search for all uses of `forceExam` in file
2. If only used for debug: remove the state and any conditional logic
3. If used for testing: move to test environment only
4. Test: SequentialCoursePlayer still works normally

**Estimated Effort:** 0.5 hours

---

#### Bug 4.2: Debug Overlay Recording in SequentialCoursePlayer
**Location:** `src/components/SequentialCoursePlayer.tsx` (multiple locations)

**Current Code:**
```typescript
// --- DEBUG OVERLAY: Record BKT snapshot ---
// --- ADAPTIVE DEBUG: BKT snapshot & event log for debug overlay ---
```

**Problem:** Debug overlay code left in production. Takes up bundle size and may interfere with normal rendering.

**Risk of Fix:**
- **Probability:** Low (isolated debug code)
- **Severity:** Low (no logic changes)
- **Mitigation:** Verify debug code doesn't affect normal flow

**Proposed Fix:**
1. Find all `DEBUG OVERLAY` and `DEBUG: Track render count` sections
2. Move to separate `SequentialCoursePlayerDebug.tsx` component
3. Only import/use in development mode
4. Test: Normal course player flow works, no visual changes

**Estimated Effort:** 1 hour

---

## Priority & Implementation Plan

### **Priority 1 (Critical)** — Fix First
- Bug 3.2 (Missing Firestore Index) — High severity
- Bug 2.1 (Upload Timeout) — High severity

### **Priority 2 (High)** — Fix Next
- Bug 3.1 (Incomplete Optimistic Update) — Medium-high severity
- Bug 2.2 (No Retry Logic) — Medium severity

### **Priority 3 (Medium)** — Nice to Have
- Bug 1.1-1.4 (UX Labels & i18n) — Medium severity, good UX
- Bug 2.3 (File Size Validation) — Low severity
- Bug 3.3 (Debug Logging) — Low severity
- Bug 4.1-4.2 (Debug Code) — Low severity

### **Total Estimated Effort**
- Priority 1: 3 hours
- Priority 2: 3.5 hours
- Priority 3: 5.5 hours
- **Total: 12 hours** (spread over 2-3 days)

---

## Next Steps

1. **Eyal Review:** Review this analysis, confirm priorities
2. **Approval Gate:** Flag any risky fixes for explicit approval
3. **Code Examination:** Deep-dive into actual code for Priority 1 bugs
4. **Implementation Plan:** Create detailed fix steps once approved

---

## Questions for Eyal

1. Should i18n system already exist, or do I need to create it?
2. What's the max file size for upload? (proposing 50MB)
3. Are there existing tests for these components?
4. Should debug code be completely removed or moved to test suite?
