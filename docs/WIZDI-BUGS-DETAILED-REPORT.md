# Wizdi AI Studio — Detailed Bug Report for Code Review

**Prepared:** 2026-03-01  
**Project:** ai-lms-system  
**Tasks:** 1-4 (Bug Fixes)  
**Status:** Ready for Claude Code Review

---

## Executive Summary

This report documents 12 identified bugs in Wizdi AI Studio, organized by priority and severity. Each bug includes:
- Exact file location
- Current code snippet
- Problem description
- Risk analysis
- Proposed fix with implementation steps
- Testing requirements

**Total Estimated Effort:** 12 hours  
**Critical Path:** Bugs 3.2 + 2.1 (3 hours) must be fixed first

---

## Bug Registry

---

### 🔴 PRIORITY 1: CRITICAL — FIX IMMEDIATELY

---

## Bug 3.2: Missing Firestore Composite Index

**Severity:** CRITICAL  
**Impact:** Live session queries may fail or timeout in production  
**File:** `src/services/liveSessionService.ts`

### Current State
```typescript
// TODO: Add proper index and query
// TODO: Add proper Firestore index
```

### Problem
Firestore queries without proper composite indexes are slow and can fail at scale. This is a production blocker.

### Risk Analysis
- **Probability:** HIGH (will fail with real data)
- **Severity:** CRITICAL (queries fail)
- **Impact Scope:** All live session features
- **Side Effects:** None (indexes are non-breaking)

### Investigation Required
1. Find the actual query in `liveSessionService.ts` that needs indexing
2. Check Firestore console logs for "Missing Index" errors
3. Identify which fields are being queried

### Proposed Fix
```typescript
// Step 1: Identify query pattern (search the file)
// Example (you'll need to find the actual query):
// db.collection('liveSessions')
//   .where('userId', '==', userId)
//   .where('status', '==', 'active')
//   .orderBy('createdAt', 'desc')

// Step 2: Deploy index
firebase deploy --only firestore:indexes

// Step 3: Update comment
// ✅ Firestore composite index deployed
// Query: userId + status + createdAt
```

### Implementation Checklist
- [ ] Open `src/services/liveSessionService.ts`
- [ ] Find all Firestore queries (search for `.where()` and `.orderBy()`)
- [ ] Check Firestore console for "Missing Index" warnings
- [ ] Create `firestore.indexes.json` if needed (or use console UI)
- [ ] Deploy: `firebase deploy --only firestore:indexes`
- [ ] Test: Run live session queries, verify they return quickly
- [ ] Verify console logs show no index warnings

### Testing
```typescript
// Test query performance
const sessions = await db.collection('liveSessions')
  .where('userId', '==', userId)
  .where('status', '==', 'active')
  .orderBy('createdAt', 'desc')
  .limit(10)
  .get();

// Should return in <100ms with proper index
```

---

## Bug 2.1: No Timeout for Cloud Function Calls

**Severity:** CRITICAL  
**Impact:** Uploads can hang indefinitely  
**File:** `src/components/referenceExams/ReferenceExamUpload.tsx`

### Current Code
```typescript
const handleUpload = async () => {
  setUploading(true);
  setError(null);
  setUploadProgress('מעלה קובץ...');

  try {
    // 1. Upload file to Firebase Storage
    const timestamp = Date.now();
    const storagePath = `reference-exams/${currentUser?.uid}/${timestamp}_${file.name}`;
    const storageRef = ref(storage, storagePath);

    await uploadBytes(storageRef, file);
    const fileUrl = await getDownloadURL(storageRef);

    setUploadProgress('מחלץ DNA מהמבחן...');

    // 2. Call Cloud Function to process
    const uploadReferenceExam = httpsCallable(functions, 'uploadReferenceExam');
    const result = await uploadReferenceExam({
      fileUrl,
      storagePath,
      // ... no timeout
    });

    const response = result.data as UploadResponse;
    setUploadResult(response);
    setUploadProgress('');
  } catch (err: any) {
    console.error('Upload failed:', err);
    setError(err.message || 'שגיאה בהעלאת הקובץ');
    setUploadProgress('');
  } finally {
    setUploading(false);
  }
};
```

### Problem
`httpsCallable()` has no timeout. If Cloud Function hangs or crashes, user sees infinite loading state.

### Risk Analysis
- **Probability:** MEDIUM (network issues, slow servers)
- **Severity:** CRITICAL (UX broken, user frustrated)
- **Impact Scope:** All file uploads
- **Side Effects:** None (timeout is standard practice)

### Proposed Fix
```typescript
// Create a helper function with timeout
function callWithTimeout<T>(
  callable: HttpsCallable<any, any>,
  data: any,
  timeoutMs: number = 60000
): Promise<T> {
  return new Promise((resolve, reject) => {
    const timeoutId = setTimeout(() => {
      reject(new Error(`Request timeout after ${timeoutMs}ms`));
    }, timeoutMs);

    callable(data)
      .then((result) => {
        clearTimeout(timeoutId);
        resolve(result.data as T);
      })
      .catch((error) => {
        clearTimeout(timeoutId);
        reject(error);
      });
  });
}

// Use in handleUpload:
const result = await callWithTimeout<UploadResponse>(
  uploadReferenceExam,
  {
    fileUrl,
    storagePath,
    // ... other params
  },
  60000 // 60 second timeout
);
```

### Implementation Checklist
- [ ] Create timeout helper function
- [ ] Update `handleUpload()` to use timeout wrapper
- [ ] Handle timeout error case: show "Retry" button instead of generic error
- [ ] Test with simulated slow network (Chrome DevTools throttling)
- [ ] Verify timeout message is user-friendly (Hebrew text)
- [ ] Test with Cloud Function responding after timeout (verify clean error)

### Testing
```typescript
// Test 1: Timeout occurs
// Use Chrome DevTools > Network > Throttle to "Slow 3G"
// Try upload, should timeout after 60s and show "Retry" button

// Test 2: Success before timeout
// Normal network, verify upload completes normally

// Test 3: Cloud Function error during upload
// Mock Cloud Function to throw error
// Verify error message displays properly
```

---

### 🟠 PRIORITY 2: HIGH — FIX NEXT

---

## Bug 3.1: Incomplete Optimistic Update Rollback

**Severity:** HIGH  
**Impact:** Stale UI state if event update fails  
**File:** `src/services/eventService.ts`

### Current Code
```typescript
// TODO: Revert optimistic update if needed
```

### Problem
Optimistic updates update the UI immediately, then sync to server. If sync fails, UI shows stale data and user doesn't know there's an error.

### Risk Analysis
- **Probability:** MEDIUM (network failures happen)
- **Severity:** HIGH (data inconsistency)
- **Impact Scope:** All event create/update operations
- **Side Effects:** May need to add error tracking

### Investigation Required
1. Find where optimistic updates happen (likely in event creation/update)
2. Identify which state is being optimistically updated
3. Find where the server call happens

### Proposed Fix Pattern
```typescript
// Bad pattern (current):
const updateEventOptimistic = (eventId: string, updates: any) => {
  // Update UI immediately
  setEvents(prev => prev.map(e => 
    e.id === eventId ? { ...e, ...updates } : e
  ));

  // Call server (no error handling)
  updateEventServer(eventId, updates);
};

// Good pattern (proposed):
const updateEventOptimistic = async (eventId: string, updates: any) => {
  // Save previous state
  const previousEvents = events;

  // Update UI immediately
  setEvents(prev => prev.map(e => 
    e.id === eventId ? { ...e, ...updates } : e
  ));

  try {
    // Call server
    await updateEventServer(eventId, updates);
    // Success - state is correct
  } catch (err) {
    // Revert on error
    setEvents(previousEvents);
    showErrorToast('שגיאה בעדכון האירוע. אנא נסה שנית.');
  }
};
```

### Implementation Checklist
- [ ] Find `eventService.ts` and locate optimistic update code
- [ ] Identify all places where events state is updated
- [ ] Save previous state before optimistic update
- [ ] Wrap server call in try-catch
- [ ] Revert state on error
- [ ] Show error toast to user
- [ ] Test with network failure simulation

### Testing
```typescript
// Test 1: Normal update succeeds
// Update event, verify changes persist

// Test 2: Network failure during update
// Mock server to throw error
// Verify UI reverts to previous state
// Verify error message shows to user

// Test 3: Partial success (some updates work, some fail)
// Mock server to fail specific field updates
// Verify only failed fields revert
```

---

## Bug 2.2: No Retry Logic for Failed Uploads

**Severity:** HIGH  
**Impact:** Users must completely restart upload after network failure  
**File:** `src/components/referenceExams/ReferenceExamUpload.tsx`

### Current Code
```typescript
catch (err: any) {
  console.error('Upload failed:', err);
  setError(err.message || 'שגיאה בהעלאת הקובץ');
  setUploadProgress('');
} finally {
  setUploading(false);
}
```

### Problem
Upload fails → Error message → User must:
1. Select file again
2. Select metadata again
3. Click upload again

No "Retry" button to retry with same file.

### Risk Analysis
- **Probability:** MEDIUM (network failures)
- **Severity:** MEDIUM (user frustration, not data loss)
- **Impact Scope:** File upload feature
- **Side Effects:** Adds new UI state (retry count, retry button)

### Proposed Fix
```typescript
// Add state for retry logic
const [retryCount, setRetryCount] = useState(0);
const MAX_RETRIES = 3;

const handleUpload = async () => {
  if (!file) {
    setError('יש לבחור קובץ');
    return;
  }

  setUploading(true);
  setError(null);
  setUploadProgress('מעלה קובץ...');

  try {
    // Upload logic...
    const result = await callWithTimeout<UploadResponse>(
      uploadReferenceExam,
      { fileUrl, storagePath, /* ... */ },
      60000
    );

    // Success
    setUploadResult(result);
    setRetryCount(0); // Reset retry counter
    
  } catch (err: any) {
    console.error('Upload failed:', err);
    
    // Check if we should allow retry
    if (retryCount < MAX_RETRIES && isNetworkError(err)) {
      setError(`שגיאת רשת. נא לחכות וקליקו על "חזור על הניסיון" או נסו שוב עוד כמה רגעים.`);
      // Don't reset file state - allow retry
    } else {
      setError(err.message || 'שגיאה בהעלאת הקובץ');
      // Reset file for new attempt
      setFile(null);
    }
  } finally {
    setUploading(false);
  }
};

const handleRetry = () => {
  setRetryCount(prev => prev + 1);
  handleUpload();
};

// Helper to detect network errors
const isNetworkError = (err: any): boolean => {
  return err.code === 'unavailable' || 
         err.message?.includes('timeout') ||
         err.message?.includes('network');
};
```

### UI Update
```jsx
{error && (
  <div className="bg-red-50 border border-red-200 rounded p-4">
    <p className="text-red-700">{error}</p>
    {retryCount < MAX_RETRIES && isNetworkError(error) && (
      <button
        onClick={handleRetry}
        className="mt-2 px-4 py-2 bg-red-600 text-white rounded hover:bg-red-700"
      >
        חזור על הניסיון ({retryCount + 1}/{MAX_RETRIES})
      </button>
    )}
  </div>
)}
```

### Implementation Checklist
- [ ] Add `retryCount` state
- [ ] Create `isNetworkError()` helper
- [ ] Create `handleRetry()` function
- [ ] Update error handling to preserve file on retry
- [ ] Add "Retry" button to UI
- [ ] Test with network throttling/disconnection
- [ ] Verify retry counter resets on success

### Testing
```typescript
// Test 1: Network failure + retry succeeds
// Throttle network, start upload, let it fail
// Click "Retry", verify upload completes

// Test 2: Multiple failures then success
// Fail 2 times, succeed on 3rd attempt
// Verify upload completes and counter resets

// Test 3: Max retries exceeded
// Fail 4 times, verify "Retry" button disappears
// User must start over
```

---

### 🟡 PRIORITY 3: MEDIUM — FIX IF TIME PERMITS

---

## Bug 1.1: Hardcoded Hebrew Labels in ReferenceExamUpload

**Severity:** MEDIUM  
**File:** `src/components/referenceExams/ReferenceExamUpload.tsx`

### Current Code
```typescript
const EXAM_TYPES = [
  { value: 'unit_exam', label: 'מבחן יחידה / סיכום פרק' },
  { value: 'midterm', label: 'מבחן אמצע' },
  { value: 'final', label: 'מבחן מסכם' },
  { value: 'quiz', label: 'בוחן קצר' },
];

const GRADES = ['א', 'ב', 'ג', 'ד', 'ה', 'ו', 'ז', 'ח', 'ט', 'י', 'יא', 'יב'];

const SUBJECTS = [
  { value: 'math', label: 'מתמטיקה' },
  { value: 'hebrew', label: 'עברית' },
  { value: 'english', label: 'אנגלית' },
  { value: 'science', label: 'מדעים' },
  { value: 'history', label: 'היסטוריה' },
  { value: 'other', label: 'אחר' },
];
```

### Problem
Labels are hardcoded. If app needs English version, these won't translate. Also scattered across components instead of centralized.

### Risk Analysis
- **Probability:** LOW (isolated constants)
- **Severity:** MEDIUM (UX issue if i18n needed)
- **Impact Scope:** Only this component
- **Side Effects:** None if i18n system already exists

### Proposed Fix
1. Create centralized `src/locales/examConstants.ts`:
```typescript
export const examConstants = {
  examTypes: [
    { value: 'unit_exam', labelKey: 'exam.type.unit' },
    { value: 'midterm', labelKey: 'exam.type.midterm' },
    { value: 'final', labelKey: 'exam.type.final' },
    { value: 'quiz', labelKey: 'exam.type.quiz' },
  ],
  subjects: [
    { value: 'math', labelKey: 'subject.math' },
    { value: 'hebrew', labelKey: 'subject.hebrew' },
    { value: 'english', labelKey: 'subject.english' },
    { value: 'science', labelKey: 'subject.science' },
    { value: 'history', labelKey: 'subject.history' },
    { value: 'other', labelKey: 'subject.other' },
  ],
};
```

2. Update component to use i18n:
```typescript
const examTypes = examConstants.examTypes.map(type => ({
  ...type,
  label: t(type.labelKey)
}));
```

3. Add translations to i18n config (if using react-i18next):
```json
{
  "en": {
    "exam": {
      "type": {
        "unit": "Unit Exam / Chapter Summary",
        "midterm": "Midterm Exam",
        "final": "Final Exam",
        "quiz": "Quick Quiz"
      }
    },
    "subject": {
      "math": "Mathematics",
      "hebrew": "Hebrew",
      "english": "English",
      "science": "Science",
      "history": "History",
      "other": "Other"
    }
  },
  "he": {
    "exam": {
      "type": {
        "unit": "מבחן יחידה / סיכום פרק",
        "midterm": "מבחן אמצע",
        "final": "מבחן מסכם",
        "quiz": "בוחן קצר"
      }
    },
    "subject": {
      "math": "מתמטיקה",
      "hebrew": "עברית",
      "english": "אנגלית",
      "science": "מדעים",
      "history": "היסטוריה",
      "other": "אחר"
    }
  }
}
```

### Implementation Checklist
- [ ] Check if i18n system already exists in project
- [ ] Create `src/locales/examConstants.ts`
- [ ] Create/update i18n translation files
- [ ] Update ReferenceExamUpload to use i18n
- [ ] Test: Verify both English and Hebrew labels render
- [ ] Test: Language switching works if app supports it

### Estimated Effort
- If i18n exists: 1 hour
- If i18n doesn't exist: 2 hours

---

## Bug 1.2: Inline Error Messages Without i18n

**Severity:** MEDIUM  
**File:** `src/components/referenceExams/ReferenceExamUpload.tsx`

### Current Code
```typescript
setError('יש לבחור קובץ PDF בלבד');
setError('יש לבחור קובץ');
setError('יש לבחור ספר לימוד');
setUploadProgress('מעלה קובץ...');
setUploadProgress('מחלץ DNA מהמבחן...');
```

### Problem
Hardcoded strings scattered in code. Can't translate. Inconsistent if similar messages appear elsewhere.

### Proposed Fix
Create centralized error messages config:
```typescript
// src/locales/examMessages.ts
export const examMessages = {
  errors: {
    selectPdfOnly: 'exam.upload.error.selectPdfOnly',
    selectFile: 'exam.upload.error.selectFile',
    selectTextbook: 'exam.upload.error.selectTextbook',
    uploadFailed: 'exam.upload.error.uploadFailed',
  },
  progress: {
    uploadingFile: 'exam.upload.progress.uploadingFile',
    extractingDna: 'exam.upload.progress.extractingDna',
  }
};

// In component:
setError(t(examMessages.errors.selectPdfOnly));
setUploadProgress(t(examMessages.progress.uploadingFile));
```

### Implementation Checklist
- [ ] Create error/progress message keys
- [ ] Add to i18n translation files
- [ ] Update component to use `t()` helper
- [ ] Verify all messages are translated
- [ ] Test in both languages

### Estimated Effort: 1 hour

---

## Bug 1.3: Subject/Grade Constants Without i18n

**Severity:** MEDIUM  
**File:** `src/components/referenceExams/ReferenceExamUpload.tsx`

### Problem
Same as Bug 1.1 — hardcoded constants, not translatable.

### Proposed Fix
Same as Bug 1.1 — move to `examConstants.ts` and use i18n.

### Note
This is part of Bug 1.1 fix if done together.

---

## Bug 1.4: Missing ARIA Labels & Accessibility

**Severity:** MEDIUM  
**File:** `src/components/referenceExams/ReferenceExamUpload.tsx` + similar components

### Current Code
```jsx
<select value={subject} onChange={(e) => setSubject(e.target.value)}>
  {/* No aria-label or label element */}
</select>

<input type="file" accept=".pdf" onChange={handleFileChange} />
```

### Problem
Screen readers can't identify form fields. No accessibility for vision-impaired users.

### Proposed Fix
```jsx
<div>
  <label htmlFor="subject-select" className="block text-sm font-medium text-gray-700 mb-1">
    מקצוע
  </label>
  <select
    id="subject-select"
    value={subject}
    onChange={(e) => setSubject(e.target.value)}
    aria-label="בחר מקצוע"
    aria-describedby="subject-help"
  >
    {/* options */}
  </select>
  <p id="subject-help" className="text-xs text-gray-500 mt-1">
    בחר את המקצוע של המבחן
  </p>
</div>

<div>
  <label htmlFor="file-input" className="block text-sm font-medium text-gray-700 mb-1">
    קובץ PDF של המבחן
  </label>
  <input
    id="file-input"
    type="file"
    accept=".pdf"
    onChange={handleFileChange}
    aria-label="בחר קובץ PDF"
    aria-describedby="file-help"
  />
  <p id="file-help" className="text-xs text-gray-500 mt-1">
    בחר קובץ PDF בגודל עד 50MB
  </p>
</div>
```

### Implementation Checklist
- [ ] Add `<label>` elements for all inputs
- [ ] Add `id` attributes to all form fields
- [ ] Add `aria-label` and `aria-describedby` to inputs
- [ ] Create `aria-describedby` text with helpful hints
- [ ] Test with screen reader (NVDA, JAWS, or VoiceOver)
- [ ] Run accessibility audit (axe DevTools)

### Estimated Effort: 1.5 hours

---

## Bug 2.3: No File Size Validation

**Severity:** LOW  
**File:** `src/components/referenceExams/ReferenceExamUpload.tsx`

### Current Code
```typescript
if (selectedFile.type !== 'application/pdf') {
  setError('יש לבחור קובץ PDF בלבד');
  return;
}
// No size check
```

### Problem
User can select 500MB PDF. Upload will fail or be very slow. No feedback.

### Proposed Fix
```typescript
const MAX_FILE_SIZE_MB = 50;

const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
  const selectedFile = e.target.files?.[0];
  if (selectedFile) {
    // Check file type
    if (selectedFile.type !== 'application/pdf') {
      setError('יש לבחור קובץ PDF בלבד');
      return;
    }

    // Check file size
    const fileSizeMb = selectedFile.size / (1024 * 1024);
    if (fileSizeMb > MAX_FILE_SIZE_MB) {
      setError(`גודל הקובץ חייב להיות קטן מ-${MAX_FILE_SIZE_MB}MB. גודל הקובץ שלך: ${fileSizeMb.toFixed(2)}MB`);
      return;
    }

    setFile(selectedFile);
    setError(null);
    setUploadResult(null);
  }
};
```

### UI Update (already mostly done):
```jsx
{file && (
  <p className="mt-1 text-sm text-gray-500">
    נבחר: {file.name} ({(file.size / 1024 / 1024).toFixed(2)}MB)
    {file.size > MAX_FILE_SIZE_MB * 1024 * 1024 && (
      <span className="text-red-600"> - קובץ גדול מדי!</span>
    )}
  </p>
)}
```

### Implementation Checklist
- [ ] Define MAX_FILE_SIZE_MB constant
- [ ] Add size check to `handleFileChange()`
- [ ] Show error message if size exceeded
- [ ] Test with files >50MB
- [ ] Verify error message is user-friendly

### Estimated Effort: 0.5 hours

---

## Bug 3.3: Debug Logging in Production Code

**Severity:** LOW  
**File:** `src/services/ai/smartCreationServiceV2.ts` (multiple locations)

### Current Code
```typescript
console.log('🔍 [DEBUG] userMessage:', userMessage);
console.log('🔍 [DEBUG] effectiveContentMode:', effectiveContentMode);
console.log('🔍 [DEBUG] contentTypeAmbiguity result:', contentTypeAmbiguity);
console.log('🔍 [DEBUG WIZARD CHECK] capability.execution.type:', capability?.execution?.type);
console.log('🔍 [DEBUG WIZARD CHECK] context.confirmedWizard:', context.confirmedWizard);
```

### Problem
Debug logs pollute browser console, may leak sensitive data, slightly impact performance.

### Proposed Fix
1. Search for all `console.log()` with 🔍 or [DEBUG] prefix
2. Remove or replace with proper logging (if production logging exists)
3. Keep only critical error logs

```typescript
// Remove debug logs completely
// console.log('🔍 [DEBUG] userMessage:', userMessage);

// OR replace with conditional logging
if (process.env.NODE_ENV === 'development') {
  console.log('🔍 [DEBUG] userMessage:', userMessage);
}
```

### Implementation Checklist
- [ ] Search for all `console.log()` with emoji/DEBUG prefix
- [ ] Check if production logging system exists (e.g., Sentry)
- [ ] Remove or gate debug logs
- [ ] Keep only error logs
- [ ] Test: Console is clean, no spam

### Estimated Effort: 0.5 hours

---

## Bug 4.1: Debug Override State in SequentialCoursePlayer

**Severity:** LOW  
**File:** `src/components/SequentialCoursePlayer.tsx`

### Current Code
```typescript
const [forceExam, setForceExam] = useState(false); // DEBUG: Override mode
```

### Problem
Test/debug state left in production. Could be exploited to bypass normal flow.

### Proposed Fix
1. Search for all uses of `forceExam` in the file
2. If only used for testing:
   - Remove the state
   - Remove conditional logic that uses it
3. If used for legitimate testing:
   - Move to separate test component
   - Gate behind `process.env.NODE_ENV === 'test'`

```typescript
// Option 1: Remove completely
// const [forceExam, setForceExam] = useState(false); // REMOVED

// Option 2: Gate behind test environment
const [forceExam, setForceExam] = useState(
  process.env.NODE_ENV === 'test' ? false : undefined
);

// And use:
if (process.env.NODE_ENV === 'test' && forceExam) {
  // Only in test environment
}
```

### Implementation Checklist
- [ ] Search for all uses of `forceExam` in file
- [ ] Understand what it does
- [ ] Remove or gate behind `NODE_ENV` check
- [ ] Test: SequentialCoursePlayer works normally
- [ ] Verify no console errors

### Estimated Effort: 0.5 hours

---

## Bug 4.2: Debug Overlay Code in SequentialCoursePlayer

**Severity:** LOW  
**File:** `src/components/SequentialCoursePlayer.tsx`

### Current Code
```typescript
// --- DEBUG OVERLAY: Record BKT snapshot ---
// --- ADAPTIVE DEBUG: BKT snapshot & event log for debug overlay ---
// DEBUG: Track render count
```

### Problem
Debug overlay code left in production. Takes bundle size, may interfere with normal rendering.

### Proposed Fix
1. Search for all DEBUG OVERLAY and DEBUG: comments
2. Extract to separate dev-only component
3. Import only in development mode

```typescript
// Create new file: SequentialCoursePlayerDebug.tsx
export function DebugOverlay({ bktSnapshot, eventLog }) {
  return (
    <div className="debug-overlay">
      {/* Debug overlay UI */}
    </div>
  );
}

// In SequentialCoursePlayer.tsx:
const renderDebugOverlay = process.env.NODE_ENV === 'development' && (
  <DebugOverlay bktSnapshot={bktSnapshot} eventLog={eventLog} />
);

// Only render in JSX if development
return (
  <>
    {/* Normal component */}
    {renderDebugOverlay}
  </>
);
```

### Implementation Checklist
- [ ] Find all DEBUG OVERLAY sections
- [ ] Create `SequentialCoursePlayerDebug.tsx`
- [ ] Move debug code to new component
- [ ] Gate import behind `NODE_ENV === 'development'`
- [ ] Test: Normal course player works, no visual changes
- [ ] Test in production build: debug overlay not included

### Estimated Effort: 1 hour

---

## Implementation Priority Matrix

| Bug ID | Name | Priority | Effort | Blocking? | Start |
|--------|------|----------|--------|-----------|-------|
| 3.2 | Missing Firestore Index | 1 | 1.5h | YES | Day 1 |
| 2.1 | Upload Timeout | 1 | 1.5h | YES | Day 1 |
| 3.1 | Optimistic Update | 2 | 2h | NO | Day 2 |
| 2.2 | Retry Logic | 2 | 1.5h | NO | Day 2 |
| 1.1 | Hardcoded Labels | 3 | 1-2h | NO | Day 2-3 |
| 1.2 | Error Messages i18n | 3 | 1h | NO | Day 2-3 |
| 1.3 | Constants i18n | 3 | 0h | NO | Part of 1.1 |
| 1.4 | ARIA Labels | 3 | 1.5h | NO | Day 3 |
| 2.3 | File Size Validation | 3 | 0.5h | NO | Day 3 |
| 3.3 | Debug Logging | 3 | 0.5h | NO | Day 3 |
| 4.1 | Debug Override State | 3 | 0.5h | NO | Day 3 |
| 4.2 | Debug Overlay | 3 | 1h | NO | Day 3 |

**Total:** 12 hours across 3 days

---

## Questions for Eyal

1. **i18n System:** Does an i18n system already exist in the project (react-i18next, etc.)? Or do I need to create one?
2. **File Size Limit:** What max file size should uploads allow? (proposing 50MB)
3. **Testing:** Are there existing unit tests for these components? Should I add tests for the fixes?
4. **Debug Code:** Should debug code be completely removed or moved to test utilities?
5. **Timeline:** Prefer all 12 hours in one push, or spread over 3 days?

---

## Next Steps (Awaiting Your Review)

1. Review this analysis
2. Answer the 5 questions above
3. Prioritize: Should I implement Priority 1 bugs now, or wait for your input?
4. Once approved, I'll create detailed implementation plans for Priority 1 bugs

---

**Document prepared for Claude Code review.**  
**Copy this entire content into Claude Code editor for analysis and approval.**
