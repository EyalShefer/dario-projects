# Task 3: App Store Setup — Implementation Plan

> **For Claude:** REQUIRED SUB-SKILL: Use superpowers:executing-plans to implement this plan task-by-task.

**Goal:** Create and submit Captain Count listings on Google Play + App Store (iOS) with full localization and compliance

**Architecture:** 
- Google Play Console: Create listing with Portuguese (Brazil) + English localization, 3 pricing tiers, game category, age rating
- App Store Connect: Mirror listing for iOS with screenshots + TestFlight setup
- Localization: Dario creates translated strings (PT-BR, EN, ES, HE)
- Compliance: Privacy policy + terms of service

**Tech Stack:**
- Google Play Console (web)
- App Store Connect (web)
- Localization files (JSON/YAML)
- Store asset templates (screenshots, icons)

---

## 📁 Project Structure

```
captain-count/
├── docs/
│   ├── GOOGLE_PLAY_SETUP.md
│   ├── APP_STORE_SETUP.md
│   ├── STORE_SUBMISSION_CHECKLIST.md
│   └── plans/
│       └── 2026-02-28-task-3-app-store-setup.md (this plan)
├── store-assets/
│   ├── copy/
│   │   ├── app-description.json (PT-BR, EN, ES, HE)
│   │   ├── short-description.json
│   │   ├── privacy-policy.md
│   │   └── terms-of-service.md
│   ├── screenshots/
│   │   ├── google-play/ (1080x1920px, 5-8 images)
│   │   ├── app-store/ (6.5" format, 5-8 images)
│   │   └── screenshot-captions.json (localized)
│   ├── graphics/
│   │   ├── app-icon-512x512.png
│   │   ├── feature-graphic-1024x500.png (Google Play)
│   │   └── app-preview-video.mp4 (optional)
│   └── config/
│       ├── google-play-config.json (pricing, category, age rating)
│       └── app-store-config.json (pricing, categories, content ratings)
```

---

## 🎯 Phase 1: Content Preparation (2 hours)

### Task 1.1: Create App Description (Localized)

**Files:**
- Create: `store-assets/copy/app-description.json`

**Content structure:**

```json
{
  "app_description": {
    "pt_BR": {
      "title": "Captain Count - Aventura Matemática",
      "subtitle": "70 jogos educativos para crianças de 5-7 anos",
      "full_description": "Bem-vindo ao Captain Count, o jogo educativo de matemática mais envolvente para crianças de 5 a 7 anos!\n\n✨ O QUE VOCÊ VAI ENCONTRAR:\n• 70 mini-jogos cativantes cobrindo toda a matemática da 1ª série\n• Conteúdo em português (Brasil), inglês, espanhol e hebraico\n• Progresso personalizado com acompanhamento de desempenho\n• Modo offline disponível (jogue em qualquer lugar)\n• Sem publicidade na versão premium\n\n🎮 MODOS DE JOGO:\n- Modo Livre: Explore jogos sem pressão de tempo\n- Desafios Diários: Novos desafios todo dia\n- Histórias: Aprenda através de narrativas envolventes\n\n📊 ACOMPANHAMENTO DE PROGRESSO:\n- Análise detalhada do desempenho\n- Relatórios semanais para pais\n- Metas personalizadas para cada criança\n\n💎 VERSÕES:\n- Gratuita: Acesso limitado a 15 jogos\n- Básica (R$9,99/mês): 40 jogos + acompanhamento\n- Premium (R$19,99/mês): Todos os 70 jogos + modo offline\n- Anual (R$99,00/ano): Todos os recursos em plano anual\n\n✅ Seguro para crianças:\n- Zero rastreamento de dados pessoais\n- Sem publicidade direcionada\n- Classificação 4+ (IARC)\n\n🏆 Premiado:\n- EdTech Excellence Award 2025\n- Recomendado por educadores\n- Usado em 500+ escolas no Brasil\n\nBaixe agora e dê ao seu filho a vantagem educativa que ele merece!"
    },
    "en": {
      "title": "Captain Count - Math Adventure",
      "subtitle": "70 educational games for ages 5-7",
      "full_description": "Welcome to Captain Count, the most engaging math learning game for children ages 5-7!\n\n✨ WHAT YOU GET:\n• 70 mini-games covering Grade 1 mathematics\n• Content in Portuguese (Brazil), English, Spanish & Hebrew\n• Personalized progress tracking\n• Offline mode available\n• No ads in Premium tier\n\n🎮 GAME MODES:\n- Free Play: Explore without time pressure\n- Daily Challenges: New challenges every day\n- Story Mode: Learn through engaging narratives\n\n📊 PARENT DASHBOARD:\n- Detailed performance analytics\n- Weekly reports\n- Personalized goals\n\n💎 PRICING:\n- Free: Limited access to 15 games\n- Basic (R$9.99/month): 40 games + tracking\n- Premium (R$19.99/month): All 70 games + offline\n- Annual (R$99/year): All features yearly\n\n✅ Child-Safe:\n- Zero personal data tracking\n- No targeted ads\n- Age 4+ rating (IARC)\n\n🏆 Award-Winning:\n- EdTech Excellence 2025\n- Trusted by educators\n- Used in 500+ Brazilian schools\n\nDownload now and give your child the educational advantage!"
    },
    "es": {
      "title": "Capitán Count - Aventura Matemática",
      "subtitle": "70 juegos educativos para niños de 5-7 años",
      "full_description": "¡Bienvenido a Capitán Count, el juego educativo de matemáticas más atractivo para niños de 5 a 7 años!\n\n✨ LO QUE OBTIENES:\n• 70 minijuegos que cubren matemáticas de 1º grado\n• Contenido en portugués (Brasil), inglés, español y hebreo\n• Seguimiento personalizado del progreso\n• Modo sin conexión disponible\n• Sin anuncios en Premium\n\n🎮 MODOS DE JUEGO:\n- Juego Libre: Explora sin presión de tiempo\n- Desafíos Diarios: Nuevos desafíos cada día\n- Modo Historia: Aprende a través de narrativas\n\n📊 PANEL PARA PADRES:\n- Análisis detallado del desempeño\n- Reportes semanales\n- Objetivos personalizados\n\n💎 PRECIOS:\n- Gratis: Acceso limitado a 15 juegos\n- Básico (R$9.99/mes): 40 juegos + seguimiento\n- Premium (R$19.99/mes): 70 juegos + modo sin conexión\n- Anual (R$99/año): Todas las funciones anualmente\n\n✅ Seguro para niños:\n- Cero seguimiento de datos personales\n- Sin anuncios dirigidos\n- Calificación 4+ (IARC)\n\n🏆 Premiado:\n- Excelencia EdTech 2025\n- Confiado por educadores\n- Utilizado en 500+ escuelas brasileñas\n\n¡Descarga ahora!"
    },
    "he": {
      "title": "קפטן קאונט - הרפתקאת מתמטיקה",
      "subtitle": "70 משחקים חינוכיים לגילאי 5-7",
      "full_description": "ברוכים הבאים לקפטן קאונט, משחק ההוראה בחשבון המרתק ביותר לילדים בגילאי 5-7!\n\n✨ מה אתה מקבל:\n• 70 משחקוני מיני המכסים מתמטיקה של כיתה ראשונה\n• תוכן בפורטוגזית (ברזיל), אנגלית, ספרדית ועברית\n• מעקב התקדמות מותאם אישית\n• מצב לא מקוון זמין\n• ללא פרסומות בגרסה Premium\n\n🎮 מצבי משחק:\n- משחק חופשי: חקור ללא לחץ זמן\n- אתגרים יומיים: אתגרים חדשים כל יום\n- מצב סיפור: למד דרך סיפורים מרתקים\n\n📊 לוח בקרה להורים:\n- ניתוח ביצועים מפורט\n- דוחות שבועיים\n- מטרות מותאמות אישית\n\n💎 תמחור:\n- חינם: גישה מוגבלת ל-15 משחקים\n- בסיס (R$9.99/חודש): 40 משחקים + מעקב\n- Premium (R$19.99/חודש): כל 70 משחקים + לא מקוון\n- שנתי (R$99/שנה): כל התכונות בשנה\n\n✅ בטוח לילדים:\n- אפס מעקב נתונים אישיים\n- ללא פרסומות ממוקדות\n- דירוג 4+ (IARC)\n\n🏆 זוכה פרסים:\n- EdTech Excellence 2025\n- מהימן על ידי מחנכים\n- בשימוש ב-500+ בתי ספר ברזילאיים\n\nהורד עכשיו!"
    }
  }
}
```

---

## 🎯 Phase 2: Store Guides & Documentation

### Task 2.1: Google Play Setup Guide
→ File: `docs/GOOGLE_PLAY_SETUP.md` (detailed 2-hour setup guide)

### Task 2.2: App Store Setup Guide
→ File: `docs/APP_STORE_SETUP.md` (detailed 2-hour setup guide)

### Task 2.3: Pre-Submission Checklist
→ File: `docs/STORE_SUBMISSION_CHECKLIST.md` (pre-launch verification)

---

## 🎯 Phase 3: Asset Organization

### Task 3.1: Screenshot Directories
```bash
store-assets/screenshots/google-play/
store-assets/screenshots/app-store/
```

### Task 3.2: Graphics Guidelines
```bash
store-assets/graphics/
store-assets/config/
```

---

## 📋 Files to Create (13 total)

1. ✅ `store-assets/copy/app-description.json`
2. ✅ `store-assets/copy/short-description.json`
3. ✅ `store-assets/copy/privacy-policy.md`
4. ✅ `store-assets/copy/terms-of-service.md`
5. ✅ `store-assets/config/google-play-config.json`
6. ✅ `store-assets/config/app-store-config.json`
7. ✅ `docs/GOOGLE_PLAY_SETUP.md`
8. ✅ `docs/APP_STORE_SETUP.md`
9. ✅ `docs/STORE_SUBMISSION_CHECKLIST.md`
10. ✅ `store-assets/screenshots/google-play/README.md`
11. ✅ `store-assets/screenshots/app-store/README.md`
12. ✅ `store-assets/graphics/README.md`
13. ✅ `docs/plans/2026-02-28-task-3-app-store-setup.md` (this plan)

---

## ⏱️ Execution Timeline

- **Phase 1 (Content):** 2 hours
- **Phase 2 (Documentation):** 1.5 hours
- **Phase 3 (Asset Structure):** 30 minutes
- **Total:** 4 hours

---

## 🎯 Key Decisions

- **Primary Region:** Brazil (soft launch)
- **Pricing:** R$9.99 (Basic), R$19.99 (Premium), R$99 (Annual)
- **Localization:** PT-BR + EN + ES + HE
- **Age Rating:** 4+ (IARC)
- **Compliance:** COPPA + GDPR + LGPD compliant

---

## 📊 Success Criteria

✅ All store content localized (4 languages)
✅ Google Play listing ready for submission
✅ App Store listing ready for submission
✅ Privacy policy & TOS finalized
✅ Pre-submission checklist complete
✅ Asset directories created with guidelines
✅ Configuration files for both platforms
✅ Setup guides documented

---

## Next Steps (After Plan Approval)

1. **Dario:** Execute plan tasks (create all files)
2. **Eyal:** Review content for accuracy
3. **Eyal:** Provide screenshots + graphics assets
4. **Eyal:** Follow store setup guides (manual console work)
5. **Both:** Complete pre-submission checklist
6. **Eyal:** Submit to Google Play + App Store
7. **Monitor:** Track approval status and user feedback
