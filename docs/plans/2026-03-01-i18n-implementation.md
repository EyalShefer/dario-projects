# i18n Implementation Plan

> **For Claude:** REQUIRED SUB-SKILL: Use superpowers:executing-plans to implement this plan task-by-task.

**Goal:** Implement lightweight i18n system (Hebrew + English) using JSON files and custom hook, fixing Bugs 1.1 & 1.2.

**Architecture:** Simple JSON translation files (no dependencies) with custom React hook that reads from files based on environment variable set at build time.

**Tech Stack:** React, TypeScript, JSON (no new npm packages)

---

## Task 1: Create Translation Files (Hebrew)

**Files:**
- Create: `src/locales/he.json`

**Step 1: Create directory and file**

```bash
mkdir -p src/locales
touch src/locales/he.json
```

**Step 2: Write Hebrew translations (he.json)**

```json
{
  "exam": {
    "upload": {
      "title": "העלאת מבחן ייחוס",
      "description": "העלה מבחן קיים (מהמדריך למורה או ממשרד החינוך) והמערכת תחלץ את ה-DNA שלו - מבנה, סוגי שאלות, רמות קושי.\nבהמשך, המערכת תשתמש ב-DNA הזה כתבנית ליצירת מבחנים חדשים.",
      "selectPdfFile": "קובץ PDF של המבחן",
      "selectedFile": "נבחר",
      "fileSizeMB": "MB",
      "selectSubject": "מקצוע",
      "selectGrade": "כיתה",
      "gradePrefix": "כיתה",
      "selectExamType": "סוג המבחן",
      "source": "מקור (אופציונלי)",
      "sourcePlaceholder": "מדריך למורה, משרד החינוך...",
      "year": "שנה (אופציונלי)",
      "yearPlaceholder": "2024",
      "uploadButton": "העלה וחלץ DNA",
      "processing": "מעבד...",
      "selectTextbook": "בחר ספר לימוד",
      "selectChapters": "בחר פרקים",
      "chapterPrefix": "פרק",
      "selectedChapters": "נבחרו: פרקים",
      "fileSizeError": "גודל הקובץ חייב להיות קטן מ-50MB. גודל הקובץ שלך:",
      "error": {
        "selectPdfOnly": "יש לבחור קובץ PDF בלבד",
        "selectFile": "יש לבחור קובץ",
        "selectTextbook": "יש לבחור ספר לימוד",
        "selectChapters": "יש לבחור לפחות פרק אחד",
        "uploadFailed": "שגיאה בהעלאת הקובץ",
        "networkRetry": "שגיאת רשת. אנא נסה שוב עוד כמה רגעים או לחץ על \"חזור על הניסיון\".\n(ניסיון"
      },
      "progress": {
        "uploadingFile": "מעלה קובץ...",
        "extractingDna": "מחלץ DNA מהמבחן..."
      }
    },
    "subject": {
      "label": "מקצוע",
      "math": "מתמטיקה",
      "hebrew": "עברית",
      "english": "אנגלית",
      "science": "מדעים",
      "history": "היסטוריה",
      "other": "אחר"
    },
    "examTypes": {
      "unitExam": "מבחן יחידה / סיכום פרק",
      "midterm": "מבחן אמצע",
      "final": "מבחן מסכם",
      "quiz": "בוחן קצר"
    },
    "accessibility": {
      "selectFile": "בחר קובץ PDF של מבחן",
      "fileHelp": "קובץ PDF בגודל עד 50MB",
      "selectSubject": "בחר מקצוע",
      "subjectHelp": "בחר את המקצוע של המבחן",
      "selectGrade": "בחר כיתה",
      "gradeHelp": "בחר את הכיתה"
    }
  }
}
```

**Step 3: Verify file is valid JSON**

```bash
cat src/locales/he.json | python3 -m json.tool > /dev/null
```

Expected: No error (valid JSON)

**Step 4: Commit**

```bash
git add src/locales/he.json
git commit -m "feat: add Hebrew translation strings for exam upload"
```

---

## Task 2: Create Translation Files (English)

**Files:**
- Create: `src/locales/en.json`

**Step 1: Write English translations (en.json)**

```json
{
  "exam": {
    "upload": {
      "title": "Reference Exam Upload",
      "description": "Upload an existing exam (from teacher guide or Ministry of Education) and the system will extract its DNA - structure, question types, difficulty levels.\nLater, the system will use this DNA as a template to create new exams.",
      "selectPdfFile": "Exam PDF File",
      "selectedFile": "Selected",
      "fileSizeMB": "MB",
      "selectSubject": "Subject",
      "selectGrade": "Grade",
      "gradePrefix": "Grade",
      "selectExamType": "Exam Type",
      "source": "Source (Optional)",
      "sourcePlaceholder": "Teacher guide, Ministry of Education...",
      "year": "Year (Optional)",
      "yearPlaceholder": "2024",
      "uploadButton": "Upload and Extract DNA",
      "processing": "Processing...",
      "selectTextbook": "Select textbook",
      "selectChapters": "Select chapters",
      "chapterPrefix": "Chapter",
      "selectedChapters": "Selected: Chapters",
      "fileSizeError": "File size must be less than 50MB. Your file size:",
      "error": {
        "selectPdfOnly": "Please select a PDF file only",
        "selectFile": "Please select a file",
        "selectTextbook": "Please select a textbook",
        "selectChapters": "Please select at least one chapter",
        "uploadFailed": "Upload failed",
        "networkRetry": "Network error. Please wait a moment and try again, or click \"Retry\".\n(Attempt"
      },
      "progress": {
        "uploadingFile": "Uploading file...",
        "extractingDna": "Extracting DNA from exam..."
      }
    },
    "subject": {
      "label": "Subject",
      "math": "Mathematics",
      "hebrew": "Hebrew",
      "english": "English",
      "science": "Science",
      "history": "History",
      "other": "Other"
    },
    "examTypes": {
      "unitExam": "Unit Exam / Chapter Summary",
      "midterm": "Midterm Exam",
      "final": "Final Exam",
      "quiz": "Quick Quiz"
    },
    "accessibility": {
      "selectFile": "Select an exam PDF file",
      "fileHelp": "PDF file up to 50MB",
      "selectSubject": "Select subject",
      "subjectHelp": "Choose the exam subject",
      "selectGrade": "Select grade",
      "gradeHelp": "Choose the grade level"
    }
  }
}
```

**Step 2: Verify file is valid JSON**

```bash
cat src/locales/en.json | python3 -m json.tool > /dev/null
```

Expected: No error

**Step 3: Commit**

```bash
git add src/locales/en.json
git commit -m "feat: add English translation strings for exam upload"
```

---

## Task 3: Create Custom useTranslation Hook

**Files:**
- Create: `src/locales/useTranslation.ts`

**Step 1: Write the hook**

```typescript
// src/locales/useTranslation.ts

import heTranslations from './he.json';
import enTranslations from './en.json';

type TranslationKey = string;

// Read language from environment variable (default: 'he')
const LANGUAGE = (process.env.REACT_APP_LANGUAGE || 'he') as 'he' | 'en';

const translations: Record<'he' | 'en', Record<string, any>> = {
  he: heTranslations,
  en: enTranslations,
};

/**
 * Custom hook for translations
 * Usage: const { t } = useTranslation();
 *        <h1>{t('exam.upload.title')}</h1>
 */
export function useTranslation() {
  const t = (key: TranslationKey, defaultValue?: string): string => {
    const keys = key.split('.');
    let value: any = translations[LANGUAGE];

    // Navigate through nested keys
    for (const k of keys) {
      value = value?.[k];
      if (value === undefined) {
        break;
      }
    }

    // Return translation, default value, or key name as fallback
    if (typeof value === 'string') {
      return value;
    }

    if (defaultValue !== undefined) {
      return defaultValue;
    }

    // Fallback: return key name (helps identify missing translations)
    console.warn(`[i18n] Missing translation: ${key}`);
    return key;
  };

  return { t };
}

/**
 * Get current language
 */
export function getCurrentLanguage(): 'he' | 'en' {
  return LANGUAGE;
}
```

**Step 2: Verify TypeScript compiles**

```bash
npx tsc --noEmit src/locales/useTranslation.ts
```

Expected: No errors

**Step 3: Commit**

```bash
git add src/locales/useTranslation.ts
git commit -m "feat: add useTranslation custom hook for i18n"
```

---

## Task 4: Update ReferenceExamUpload to Use Translations

**Files:**
- Modify: `src/components/referenceExams/ReferenceExamUpload.tsx`

**Step 1: Add import at top of file**

```typescript
// After existing imports, add:
import { useTranslation } from '../../locales/useTranslation';
```

**Step 2: Add hook call in component**

```typescript
export default function ReferenceExamUpload({ onUploadComplete }: ReferenceExamUploadProps) {
  const { currentUser } = useAuth();
  const { t } = useTranslation();  // ← Add this line

  // ... rest of component
}
```

**Step 3: Replace hardcoded strings with translations**

Replace each hardcoded string with `t('key')`:

**Example replacements:**

Before:
```typescript
const EXAM_TYPES = [
  { value: 'unit_exam', label: 'מבחן יחידה / סיכום פרק' },
];
```

After:
```typescript
const EXAM_TYPES = [
  { value: 'unit_exam', label: t('exam.examTypes.unitExam') },
  { value: 'midterm', label: t('exam.examTypes.midterm') },
  { value: 'final', label: t('exam.examTypes.final') },
  { value: 'quiz', label: t('exam.examTypes.quiz') },
];
```

Before:
```typescript
<h2 className="text-xl font-semibold mb-4">העלאת מבחן ייחוס</h2>
```

After:
```typescript
<h2 className="text-xl font-semibold mb-4">{t('exam.upload.title')}</h2>
```

Before:
```typescript
<label className="block text-sm font-medium text-gray-700 mb-1">מקצוע</label>
```

After:
```typescript
<label htmlFor="subject-select" className="block text-sm font-medium text-gray-700 mb-1">
  {t('exam.subject.label')}
</label>
```

**All hardcoded strings to replace:**
- `'העלאת מבחן ייחוס'` → `t('exam.upload.title')`
- `'העלה מבחן קיים...'` (description) → `t('exam.upload.description')`
- `'קובץ PDF של המבחן'` → `t('exam.upload.selectPdfFile')`
- `'מקצוע'` → `t('exam.subject.label')`
- `'כיתה'` → `t('exam.upload.selectGrade')`
- All exam types (unit, midterm, final, quiz)
- All subject names (Math, Hebrew, English, etc.)
- All error messages
- All progress messages
- All ARIA labels

**Step 4: Update ARIA labels**

```typescript
// Before
<input aria-label="בחר קובץ PDF של מבחן" />

// After
<input aria-label={t('exam.accessibility.selectFile')} />
```

**Step 5: Update file size error message**

```typescript
// Before
const fileSizeMb = selectedFile.size / (1024 * 1024);
if (fileSizeMb > MAX_FILE_SIZE_MB) {
  setError(
    `גודל הקובץ חייב להיות קטן מ-${MAX_FILE_SIZE_MB}MB. ` +
    `גודל הקובץ שלך: ${fileSizeMb.toFixed(2)}MB`
  );
}

// After
const fileSizeMb = selectedFile.size / (1024 * 1024);
if (fileSizeMb > MAX_FILE_SIZE_MB) {
  setError(
    `${t('exam.upload.fileSizeError')} ${fileSizeMb.toFixed(2)}${t('exam.upload.fileSizeMB')}`
  );
}
```

**Step 6: Verify component compiles**

```bash
npx tsc --noEmit src/components/referenceExams/ReferenceExamUpload.tsx
```

Expected: No errors

**Step 7: Commit**

```bash
git add src/components/referenceExams/ReferenceExamUpload.tsx
git commit -m "feat: use translations in ReferenceExamUpload component

Replace all hardcoded Hebrew/English strings with translation keys.
Fixes Bugs 1.1 and 1.2 (hardcoded labels without i18n)."
```

---

## Task 5: Test Hebrew Build (Default)

**Step 1: Build with Hebrew (default)**

```bash
npm run build
```

Expected: Build succeeds, no errors

**Step 2: Verify Hebrew strings appear**

Open dev tools → Look for one of these values in HTML:
- `"העלאת מבחן ייחוס"` (upload title)
- `"מקצוע"` (subject label)
- `"קובץ PDF של המבחן"` (file input label)

Expected: Hebrew text visible

**Step 3: Commit (if not already)**

```bash
git add -A
git commit -m "test: verify Hebrew build works correctly"
```

---

## Task 6: Test English Build

**Step 1: Build with English**

```bash
rm -rf build
REACT_APP_LANGUAGE=en npm run build
```

Expected: Build succeeds, no errors

**Step 2: Verify English strings appear**

Open dev tools → Look for one of these values in HTML:
- `"Reference Exam Upload"` (upload title)
- `"Subject"` (subject label)
- `"Exam PDF File"` (file input label)

Expected: English text visible

**Step 3: Commit**

```bash
git add -A
git commit -m "test: verify English build works correctly"
```

---

## Task 7: Verify No Missing Translations

**Step 1: Run both builds with missing key test**

Add a test component that uses non-existent key:

```typescript
const { t } = useTranslation();
t('nonexistent.key');
```

**Step 2: Check browser console**

Expected: Warning message: `[i18n] Missing translation: nonexistent.key`

**Step 3: Verify fallback works**

```typescript
t('nonexistent.key', 'Default Text');
```

Expected: Returns `'Default Text'` (not the key name)

**Step 4: Remove test code and commit**

```bash
git add -A
git commit -m "test: verify translation fallback behavior works"
```

---

## Task 8: Final Verification & Documentation

**Step 1: Verify all commits**

```bash
git log --oneline | head -10
```

Expected: 5-6 commits related to i18n

**Step 2: Update README (optional)**

Add section to project README:

```markdown
## Internationalization (i18n)

This project supports Hebrew (default) and English.

**To build in different language:**

```bash
# Hebrew (default)
npm run build

# English
REACT_APP_LANGUAGE=en npm run build
```

**To add new translations:**
1. Add keys to `src/locales/he.json`
2. Add keys to `src/locales/en.json`
3. Use in component: `const { t } = useTranslation(); t('key.path')`
```

**Step 3: Final commit**

```bash
git add -A
git commit -m "docs: add i18n documentation"
```

**Step 4: Verify all files are committed**

```bash
git status
```

Expected: Working directory clean

---

## Summary

**Files Created:**
- ✅ `src/locales/he.json` — Hebrew translations
- ✅ `src/locales/en.json` — English translations
- ✅ `src/locales/useTranslation.ts` — Custom hook

**Files Modified:**
- ✅ `src/components/referenceExams/ReferenceExamUpload.tsx` — Use translations

**Bugs Fixed:**
- ✅ Bug 1.1: Hardcoded Hebrew labels
- ✅ Bug 1.2: Error messages without translation

**Tests Verified:**
- ✅ Hebrew build works
- ✅ English build works
- ✅ Missing translation fallback works

**Commits:** ~6-7 commits to GitHub

---

## Execution Handoff

Plan complete and saved to `docs/plans/2026-03-01-i18n-implementation.md`.

Two execution options:

**1. Subagent-Driven (this session)** - I dispatch fresh subagent per task, review between tasks, fast iteration

**2. Parallel Session (separate)** - Open new session with executing-plans, batch execution with checkpoints

Which approach?
