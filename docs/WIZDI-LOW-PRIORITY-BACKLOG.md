# Wizdi AI Studio — Low Priority Bug Backlog

**Date:** 2026-03-01  
**Status:** Backlog (not critical, nice-to-have improvements)  
**Total Effort:** ~5.5 hours

These are improvements that make the app better but don't block core functionality.

---

## Backlog Items

### 1. Cleanup: Remove Debug Code from Production

**Effort:** 1.5 hours total

#### 1.1: Remove Debug Override in SequentialCoursePlayer
**Impact:** Code cleanliness  
**File:** `src/components/SequentialCoursePlayer.tsx`

**Current:** Test variable left in code
```typescript
const [forceExam, setForceExam] = useState(false); // DEBUG: Override mode
```

**What it means for users:** 
- None (invisible to users, but bad for code health)
- Someone could abuse this to skip normal workflow

**Fix:**
- Remove `forceExam` state variable
- Remove any logic that uses it
- Test: Course player still works normally

---

#### 1.2: Move Debug Overlay to Dev-Only Component
**Impact:** Code cleanliness, smaller bundle  
**File:** `src/components/SequentialCoursePlayer.tsx`

**Current:** Debug overlay code left in production
```typescript
// --- DEBUG OVERLAY: Record BKT snapshot ---
// --- ADAPTIVE DEBUG: BKT snapshot & event log for debug overlay ---
```

**What it means for users:**
- Takes up space in code/bundle
- Clutters component logic
- May interfere with performance monitoring

**Fix:**
- Create `SequentialCoursePlayerDebug.tsx`
- Move all debug code there
- Only import in development mode
- Test: Normal course player works, no visual changes

---

#### 1.3: Clean Up Debug Logging Spam
**Impact:** Code cleanliness, console readability  
**File:** `src/services/ai/smartCreationServiceV2.ts`

**Current:** Debug logs everywhere
```typescript
console.log('🔍 [DEBUG] userMessage:', userMessage);
console.log('🔍 [DEBUG WIZARD CHECK] capability.execution.type:', ..);
```

**What it means for users:**
- Browser console is cluttered for developers
- May leak sensitive data (AI prompts, user inputs)
- Slight performance impact

**Fix:**
- Remove all `console.log()` with 🔍 or [DEBUG] prefix
- Keep only critical error logs
- Test: Console is clean

---

### 2. UX Improvements: Labels & Accessibility

**Effort:** 2 hours total

#### 2.1: Add Missing Accessibility Labels
**Impact:** Better for vision-impaired users  
**File:** `src/components/referenceExams/ReferenceExamUpload.tsx`

**Current:** Form inputs lack labels
```jsx
<input type="file" accept=".pdf" onChange={handleFileChange} />
<select value={subject} onChange={(e) => setSubject(e.target.value)}>
```

**What it means for users:**
- Screen readers can't identify form fields
- Vision-impaired users can't use the feature
- Accessibility compliance (WCAG 2.1)

**Fix:**
- Add `<label>` elements for all inputs
- Add `aria-label` and `aria-describedby` attributes
- Add helpful hint text (aria-describedby content)
- Test: Use screen reader (VoiceOver, NVDA) to verify

---

#### 2.2: Centralize and Translate UI Labels
**Impact:** Better internationalization  
**Files:** `src/components/referenceExams/ReferenceExamUpload.tsx` + others

**Current:** Labels hardcoded in Hebrew
```typescript
const EXAM_TYPES = [
  { value: 'unit_exam', label: 'מבחן יחידה / סיכום פרק' },
  { value: 'midterm', label: 'מבחן אמצע' },
];
const SUBJECTS = [
  { value: 'math', label: 'מתמטיקה' },
  { value: 'english', label: 'אנגלית' },
];
```

**What it means for users:**
- If app adds English version, labels won't translate
- If you hire English-speaking teachers, they see Hebrew
- Harder to add new languages later

**Fix:**
1. Create `src/locales/examConstants.ts` with i18n keys
2. Create translation files (English + Hebrew)
3. Update component to use i18n helpers
4. Test: Both English and Hebrew labels render

**Note:** Only do this if i18n system exists in project. If not, creates new work.

---

#### 2.3: Translate Error Messages & Progress Text
**Impact:** Consistent internationalization  
**File:** `src/components/referenceExams/ReferenceExamUpload.tsx`

**Current:** Hardcoded error messages
```typescript
setError('יש לבחור קובץ PDF בלבד');
setError('יש לבחור קובץ');
setUploadProgress('מעלה קובץ...');
```

**What it means for users:**
- Same problem as 2.2 — can't translate
- Messages scattered through code (hard to maintain)

**Fix:**
1. Create centralized error/progress message keys
2. Add to translation files
3. Update component to use i18n helpers
4. Test: All messages display in both languages

---

### 3. Robustness: Better Error Handling

**Effort:** 0.5 hours

#### 3.1: Validate File Size Before Upload
**Impact:** Better user experience  
**File:** `src/components/referenceExams/ReferenceExamUpload.tsx`

**Current:** No file size validation
```typescript
const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
  const selectedFile = e.target.files?.[0];
  if (selectedFile.type !== 'application/pdf') {
    setError('יש לבחור קובץ PDF בלבד');
  }
  // No size check
}
```

**What it means for users:**
- User selects 500MB PDF file
- Clicks upload
- Upload fails after 5 minutes → frustration
- No warning before they start

**Fix:**
1. Check file size (propose: max 50MB)
2. Show error immediately if too large
3. Show file size in UI alongside filename
4. Test: Try uploading files >50MB, verify error shows

---

## Timeline & Dependencies

### Can Start Immediately
- 1.1: Remove forceExam debug state
- 1.3: Clean up console logs
- 3.1: Add file size validation

### Requires Decision First
- 1.2: Move debug overlay (need to understand what it displays)
- 2.1: Add ARIA labels (good to do, straightforward)
- 2.2-2.3: i18n translations (only if i18n system exists)

---

## Questions for You

1. **Priority 3.2 (getSessionByCode fix):** Should I still apply this, or skip it for now since the live teaching feature isn't actively used?

2. **i18n system:** Does the project already have react-i18next or similar? Or should we skip 2.2-2.3 for now?

3. **Timeline:** When would you want these low-priority fixes? (this month, next quarter, etc.)

---

## Summary

**High-value, low-effort fixes (do first):**
- 1.3: Remove debug logging (30 min, makes console clean)
- 3.1: File size validation (30 min, improves UX)

**Medium-value, medium-effort (do next):**
- 1.1: Remove debug state (30 min, code cleanliness)
- 2.1: Add ARIA labels (1.5 hours, accessibility)

**Lower priority (skip if busy):**
- 1.2: Move debug overlay (1 hour, depends on what it does)
- 2.2-2.3: i18n labels (2 hours, only if you want multi-language support)

---

**Ready to implement any of these when you give the go-ahead.**
