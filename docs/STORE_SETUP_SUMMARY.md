# Store Setup Summary — Captain Count

**Quick reference for setting up Captain Count on Google Play and App Store.**

---

## 📁 Files in This Guide

| Document | Purpose | Time | For Whom |
|----------|---------|------|----------|
| **GOOGLE_PLAY_SETUP.md** | Step-by-step Google Play submission | 2-3 hrs | App Store team |
| **APP_STORE_SETUP.md** | Step-by-step App Store submission | 2-3 hrs | iOS team |
| **STORE_SUBMISSION_CHECKLIST.md** | Pre-launch verification | 1 hr | QA/Product |
| **This file** | Quick summary + decision tree | 5 min | Everyone |

---

## 🚀 Quick Start (5-minute overview)

### What You Need

**Before starting:**
- Developer accounts ($25 Google Play, $99 App Store)
- App files ready (APK for Google Play, IPA for App Store)
- Graphics (icon, feature graphic, 5+ screenshots per store)
- Store text (provided in `store-assets/copy/`)

### Two Parallel Tracks

You can set up Google Play and App Store **at the same time**:

```
Google Play Team          App Store Team
├─ 20 min setup           ├─ 20 min setup
├─ 30 min content         ├─ 30 min content
├─ 20 min pricing         ├─ 20 min pricing
├─ 15 min upload APK      ├─ 30 min build + upload IPA
└─ Submit                 └─ Submit
   (1-4 hours review)        (24-48 hours review)
```

**Total time:** 2-3 hours per platform

---

## 🎯 Decision Tree: Which Guide?

**Are you setting up Google Play?**
→ Open **`GOOGLE_PLAY_SETUP.md`** (26 steps, detailed instructions)

**Are you setting up App Store (iOS)?**
→ Open **`APP_STORE_SETUP.md`** (27 steps, detailed instructions)

**Need to verify everything is ready?**
→ Open **`STORE_SUBMISSION_CHECKLIST.md`** (before submitting)

**Need quick reference?**
→ You're reading it! 📍

---

## 📝 What's Provided for You

### Content Files (Ready to Copy-Paste)

Located in `captain-count/store-assets/copy/`:

- **app-description.json** — Full descriptions (4 languages: PT-BR, EN, ES, HE)
- **short-description.json** — 80-char descriptions + keywords
- **privacy-policy.md** — COPPA/GDPR/LGPD compliant
- **terms-of-service.md** — Payment terms, IP rights, etc.

### Configuration Files (Reference)

Located in `captain-count/store-assets/config/`:

- **google-play-config.json** — Pricing tiers, category, rating info
- **app-store-config.json** — Subscription IDs, categories, pricing

### Asset Directories (For You to Fill)

Located in `captain-count/store-assets/`:

```
store-assets/
├── screenshots/
│   ├── google-play/    ← Upload 5-8 images (1080x1920 PNG)
│   └── app-store/      ← Upload 5-8 images (1242x2688 PNG)
├── graphics/           ← App icon, feature graphic
│   ├── app-icon-512x512.png
│   ├── feature-graphic-1024x500.png
│   └── app-preview-video.mp4 (optional)
└── copy/               ← Text content (ready to use)
    ├── app-description.json
    ├── short-description.json
    ├── privacy-policy.md
    └── terms-of-service.md
```

---

## ✅ Pre-Flight Checklist (5 minutes)

Before opening the detailed guides:

**Do you have?**
- [ ] Google account with payment method
- [ ] Apple account with payment method
- [ ] APK file (signed, release build)
- [ ] IPA file (signed, release build)
- [ ] App icon (512x512 PNG + 1024x1024 PNG)
- [ ] Feature graphic (1024x500 PNG)
- [ ] Screenshots (5-8 per platform, correct sizes)
- [ ] Reviewed store text (app-description.json)
- [ ] 1-2 hours per platform to complete

**If NO to any above:**
→ Ask dev team to provide missing files

**If YES to all:**
→ Pick a guide (GOOGLE_PLAY_SETUP.md or APP_STORE_SETUP.md) and start!

---

## 🎬 Parallel Execution (Fastest Path)

If you have 2 team members:

**Person A (Google Play):**
1. Open `GOOGLE_PLAY_SETUP.md`
2. Follow steps 1-20 (create account, upload APK, submit)
3. Estimated time: 2-3 hours

**Person B (App Store):**
1. Open `APP_STORE_SETUP.md`
2. Follow steps 1-26 (create account, build/upload IPA, submit)
3. Estimated time: 2-3 hours

**Both finish simultaneously** → Total time: 2-3 hours (not 4-6)

---

## 📅 Expected Timeline

| Action | Duration | Notes |
|--------|----------|-------|
| Setup Google Play account | 20 min | Wait 1-2 hours for activation |
| Setup App Store account | 20 min | Wait 1-2 hours for activation |
| Create app + upload content | 30 min | Both platforms in parallel |
| Upload APK/IPA | 30 min | Both in parallel |
| **Submit for review** | Instant | Click submit button |
| Google Play review | 1-4 hours | Often faster |
| App Store review | 24-48 hours | Usually ~24 hours |
| **Both live** | 24-48 hours | Worst case scenario |

---

## 🔗 Important URLs

**Accounts:**
- Google Play Console: https://play.google.com/apps/publish
- App Store Connect: https://appstoreconnect.apple.com

**Store Listings (Once Published):**
- Google Play: https://play.google.com/store/apps/details?id=com.wizdi.captaincount
- App Store: https://apps.apple.com/br/app/captain-count/idXXXXXXXXXX

**Company:**
- Privacy Policy: https://wizdi.com/privacy
- Support: https://support.captaincount.com
- Marketing: https://www.captaincount.com

---

## 💡 Pro Tips

### Google Play

1. **Use a test card:** `4111 1111 1111 1111` (always succeeds)
2. **Staged rollout:** Start with 10% of users, then 100% after monitoring
3. **Monitor crashes:** Go to "Dashboards" → "Crashes" (target: <0.1%)
4. **Respond quickly:** Users expect responses within 24 hours

### App Store

1. **Use TestFlight:** Test with internal team for 7 days before public
2. **TestFlight promo codes:** Great for getting reviews
3. **Regular updates:** Update at least monthly for algorithm boost
4. **Monitor reviews:** Apple rewards apps with active responses

### Both

1. **Soft launch:** Start in Brazil only (as configured)
2. **Monitor first 24h:** Have someone watching dashboards
3. **Have rollback plan:** Know how to pull app quickly if critical issues
4. **Translations:** Make sure all 4 languages render correctly
5. **Payment testing:** Test all 3 tiers before public launch

---

## 🆘 Getting Help

**Questions about Google Play?**
→ Read `GOOGLE_PLAY_SETUP.md` (covers everything)

**Questions about App Store?**
→ Read `APP_STORE_SETUP.md` (covers everything)

**Need to verify readiness?**
→ Use `STORE_SUBMISSION_CHECKLIST.md` (complete verification)

**App rejected by store?**
→ Check "TROUBLESHOOTING" section in respective guide

**Technical issues (APK/IPA)?**
→ Email: **dario@wizdi.com**

**Business/content questions?**
→ Email: **support@wizdi.com**

---

## 📊 Success Metrics (After Launch)

**First 24 hours:**
- Crash rate < 0.1%
- At least 1 positive review
- First subscription purchase completes

**First week:**
- 100+ downloads
- D1 retention > 20%
- Conversion rate (free → paid) > 0.5%

**First month:**
- 1,000+ downloads
- D7 retention > 5%
- ARPU > R$0.10
- Revenue > R$100

---

## 🎓 Learning Resources

**Google Play:**
- Official guides: https://developer.android.com/studio/publish
- Policy guide: https://play.google.com/about/developer-content-policy/

**App Store:**
- Official guides: https://developer.apple.com/app-store-connect/
- App Store Review Guidelines: https://developer.apple.com/app-store/review/guidelines/

---

## 📌 Remember

✅ **Do this first:**
1. Read the appropriate guide (Google Play or App Store)
2. Gather all files (APK/IPA, screenshots, copy)
3. Create developer accounts (do this in parallel with dev work)
4. Follow steps 1-20 exactly as written
5. Use STORE_SUBMISSION_CHECKLIST.md before hitting submit

❌ **Don't skip steps:**
- Don't skip age rating questionnaire (legal requirement)
- Don't skip privacy policy (app will be rejected)
- Don't skip testing payment flow (real users will complain)
- Don't skip the checklist (prevents rejections)

✅ **Do test everything:**
- Test on actual devices (not just emulator)
- Test all payment tiers
- Test with test accounts
- Test all languages

---

**Ready to start?** Pick your platform:
- **Google Play:** `GOOGLE_PLAY_SETUP.md` → 26 detailed steps
- **App Store:** `APP_STORE_SETUP.md` → 27 detailed steps

**Questions?** Email support@wizdi.com

---

**Version:** 1.0 | **Date:** 2026-02-28 | **Status:** Ready to Use
