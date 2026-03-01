# דריו — Master Project Dashboard

**Live Dashboard:** [https://EyalShefer.github.io/dario-projects/](https://EyalShefer.github.io/dario-projects/)

**Status:** 🟢 Live

---

## Projects

- **Captain Count** — Math education game for K-2 grades (Brazil-first)
- **Wizdi AI Studio** — AI LMS with lesson creation & student/teacher modes
- **Dario System** — Autonomous task execution & memory management

---

## Dashboard Features

- ✅ Real-time project tracking
- ✅ Task management with logs & timestamps
- ✅ Auto-refresh every 30 seconds
- ✅ Dark mode, responsive design, Hebrew RTL support

---

## Local Development

```bash
# Start local server
cd /data/.openclaw/workspace/public
python3 -m http.server 8080

# Open dashboard
http://localhost:8080/projects/dashboard.html
```

---

## Internationalization (i18n)

This project supports **Hebrew** (default) and **English** with a lightweight translation system.

**To build in different languages:**

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

**Documentation:** See [docs/I18N.md](docs/I18N.md) for complete i18n guide.

---

## GitHub

- **Repository:** https://github.com/eyalshefer/dario-projects
- **Branch:** master
- **Last Updated:** 2026-03-01

---

## Dashboard Direct Link

If GitHub Pages is having issues:
- **Local:** http://localhost:8080/projects/dashboard.html
- **Direct File:** https://raw.githubusercontent.com/eyalshefer/dario-projects/master/projects/dashboard.html
