# Store Setup Documents Index — Captain Count

**All documents needed to set up Captain Count on Google Play and App Store.**

---

## 📚 Complete File List

### 📖 Guides (Read These First)

| File | Purpose | Length | Audience |
|------|---------|--------|----------|
| **STORE_SETUP_SUMMARY.md** | 5-min overview + quick reference | 5 pages | Everyone |
| **GOOGLE_PLAY_SETUP.md** | Complete step-by-step Google Play guide | 26 steps, 13 pages | Google Play team |
| **APP_STORE_SETUP.md** | Complete step-by-step App Store guide | 27 steps, 15 pages | iOS team |
| **STORE_SUBMISSION_CHECKLIST.md** | Pre-launch verification checklist | 12 pages | QA/Product |

### 📝 Content Files (Copy-Paste Ready)

Located in `store-assets/copy/`:

| File | Purpose | Languages | Ready? |
|------|---------|-----------|--------|
| **app-description.json** | Full app descriptions (4 lang) | PT-BR, EN, ES, HE | ✅ Yes |
| **short-description.json** | Short descriptions + keywords | PT-BR, EN, ES, HE | ⏳ TODO |
| **privacy-policy.md** | COPPA/GDPR/LGPD compliant policy | English | ⏳ TODO |
| **terms-of-service.md** | Payment & legal terms | English | ⏳ TODO |

### ⚙️ Configuration Files (Reference)

Located in `store-assets/config/`:

| File | Purpose | For | Ready? |
|------|---------|-----|--------|
| **google-play-config.json** | Pricing, category, ratings | Google Play | ✅ Yes |
| **app-store-config.json** | Subscriptions, categories | App Store | ✅ Yes |

### 📁 Asset Directories (For You to Fill)

Located in `store-assets/`:

```
store-assets/
├── screenshots/
│   ├── google-play/          ← ADD: 5-8 images (1080x1920 PNG)
│   ├── app-store/            ← ADD: 5-8 images (1242x2688 PNG)
│   └── screenshot-captions.json (optional localized captions)
├── graphics/
│   ├── app-icon-512x512.png  ← ADD: App icon
│   ├── app-icon-1024x1024.png (for App Store)
│   ├── feature-graphic-1024x500.png ← ADD: Google Play feature
│   └── app-preview-video.mp4 ← ADD: Optional video (15-30 sec)
└── copy/                      ← Content files (see above)
    ├── app-description.json   ✅ Done
    ├── short-description.json ⏳ Pending
    ├── privacy-policy.md      ⏳ Pending
    └── terms-of-service.md    ⏳ Pending
```

---

## 🎯 Quick Start Guide

### If You Have 2-3 Hours and Want to Launch Today

**Step 1: Read (5 min)**
- Open `STORE_SETUP_SUMMARY.md`
- Decide: Google Play, App Store, or both?

**Step 2: Gather Assets (15 min)**
- Collect app APK/IPA files
- Collect screenshots (5-8 images)
- Collect icon + feature graphic

**Step 3: Create Accounts (20 min)**
- Google Play: $25 registration fee
- App Store: $99/year registration fee
- Wait 1-2 hours for activation (do in parallel)

**Step 4: Follow the Guide (1.5-2 hours)**
- **Google Play?** → Open `GOOGLE_PLAY_SETUP.md` (26 steps)
- **App Store?** → Open `APP_STORE_SETUP.md` (27 steps)
- Follow each step exactly
- Copy-paste text from `store-assets/copy/`

**Step 5: Verify (30 min)**
- Use `STORE_SUBMISSION_CHECKLIST.md`
- Check all boxes
- Fix any issues

**Step 6: Submit (5 min)**
- Click "Submit for Review"
- Google Play: 1-4 hours approval
- App Store: 24-48 hours approval
- You're done! 🎉

**Total Time:** 2-3 hours + waiting for approval

---

## 📖 Which Document Should I Read?

### "I want a quick overview"
→ **STORE_SETUP_SUMMARY.md** (5 pages, 5 minutes)

### "I'm ready to set up Google Play"
→ **GOOGLE_PLAY_SETUP.md** (13 pages, 2-3 hours execution)

### "I'm ready to set up App Store"
→ **APP_STORE_SETUP.md** (15 pages, 2-3 hours execution)

### "I need to verify everything before launching"
→ **STORE_SUBMISSION_CHECKLIST.md** (12 pages, 30 minutes verification)

### "I'm doing both Google Play and App Store at the same time"
→ 1. Read **STORE_SETUP_SUMMARY.md** (overview)
→ 2. Have one person follow **GOOGLE_PLAY_SETUP.md**
→ 3. Have another follow **APP_STORE_SETUP.md** (in parallel)
→ 4. Both use **STORE_SUBMISSION_CHECKLIST.md** before submitting

---

## 💼 For Management/Non-Technical Users

**If you're managing the store launch:**

1. **First:** Read `STORE_SETUP_SUMMARY.md` (understand what's involved)
2. **Then:** Gather your team:
   - App Store person (iOS developer or technical)
   - Google Play person (Android developer or technical)
   - QA person (testing)
3. **Give them:** Links to this directory
4. **Timeline:** Expect 2-3 hours per platform, 1-2 days for reviews

---

## 🚀 Content That's Ready vs. Pending

### ✅ Already Created

- `app-description.json` — Full descriptions in 4 languages
- `google-play-config.json` — Pricing & category config
- `app-store-config.json` — Subscription config
- All 4 setup guides — Complete step-by-step instructions

### ⏳ Still Need to Do

- Add short descriptions to `short-description.json`
- Add privacy policy & terms to legal files
- Create screenshots (5-8 per store)
- Create app icon (512x512 + 1024x1024)
- Create feature graphic (1024x500)

**Status:** ~60% complete, all hard parts (guides) done!

---

## 📋 Checklist: Before You Start

### Account Setup
- [ ] Google account with payment method
- [ ] Apple account with payment method
- [ ] $25 ready for Google Play registration
- [ ] $99 ready for App Store registration

### Files & Assets
- [ ] App APK file (signed, release build)
- [ ] App IPA file (signed, release build)
- [ ] App icon (512x512 PNG)
- [ ] Feature graphic (1024x500 PNG)
- [ ] Screenshots ready (5-8 per platform)

### Content Ready
- [ ] Copy from `store-assets/copy/app-description.json` reviewed
- [ ] Privacy policy URL decided
- [ ] Support URL decided
- [ ] Marketing URL decided

### Time Available
- [ ] 2-3 hours for Google Play setup
- [ ] 2-3 hours for App Store setup
- [ ] 30 min for final verification
- [ ] 1-2 days for app reviews

---

## 📞 Support & Questions

### Questions About Google Play?
→ Read `GOOGLE_PLAY_SETUP.md` section on your issue

### Questions About App Store?
→ Read `APP_STORE_SETUP.md` section on your issue

### Not sure which guide to start with?
→ Read `STORE_SETUP_SUMMARY.md` (it'll guide you)

### Technical issues with APK/IPA building?
→ Email: **dario@wizdi.com**

### Questions about store policies or requirements?
→ Email: **support@wizdi.com**

---

## 🗺️ Navigation Map

```
You are here ↓
     ↓
STORE_SETUP_INDEX.md (this file)
     ↓
     ├─→ STORE_SETUP_SUMMARY.md (overview + quick decisions)
     │
     ├─→ GOOGLE_PLAY_SETUP.md (detailed Google Play guide)
     │    └─→ store-assets/copy/ (content to copy-paste)
     │    └─→ store-assets/config/google-play-config.json
     │
     ├─→ APP_STORE_SETUP.md (detailed App Store guide)
     │    └─→ store-assets/copy/ (content to copy-paste)
     │    └─→ store-assets/config/app-store-config.json
     │
     └─→ STORE_SUBMISSION_CHECKLIST.md (before launching)
          └─→ Verify all requirements met
          └─→ Fix any issues
          └─→ SUBMIT
```

---

## 📊 Document Sizes

| Document | Pages | Reading Time | Execution Time |
|----------|-------|--------------|---|
| STORE_SETUP_SUMMARY.md | 5 | 5 min | — |
| GOOGLE_PLAY_SETUP.md | 13 | 20 min | 2-3 hours |
| APP_STORE_SETUP.md | 15 | 25 min | 2-3 hours |
| STORE_SUBMISSION_CHECKLIST.md | 12 | 15 min | 30 min |
| **TOTAL (both stores)** | **45** | **1 hour** | **4-6 hours** |

**Parallel execution (recommended):** Split between 2 people → 2-3 hours total

---

## 🎓 Who Should Read What

### App Store Manager / iOS Dev
1. **First:** `STORE_SETUP_SUMMARY.md` (decide if you're doing this)
2. **Main:** `APP_STORE_SETUP.md` (step-by-step guide)
3. **Before launch:** `STORE_SUBMISSION_CHECKLIST.md`

### Google Play Manager / Android Dev
1. **First:** `STORE_SETUP_SUMMARY.md` (decide if you're doing this)
2. **Main:** `GOOGLE_PLAY_SETUP.md` (step-by-step guide)
3. **Before launch:** `STORE_SUBMISSION_CHECKLIST.md`

### QA / Testing Lead
1. **First:** `STORE_SETUP_SUMMARY.md` (understand the process)
2. **Main:** `STORE_SUBMISSION_CHECKLIST.md` (verification)
3. **Reference:** Both guides (understand what was done)

### Product Manager / Business Lead
1. **First:** `STORE_SETUP_SUMMARY.md` (overview)
2. **Reference:** Check content in `store-assets/copy/` is approved
3. **Sign-off:** Use checklist before launch

### Founder / Decision Maker
1. **First:** `STORE_SETUP_SUMMARY.md` (5-minute overview)
2. **Timeline:** See "Expected Timeline" section
3. **Budget:** $25 (Google Play) + $99 (App Store) one-time + annual renewals

---

## ✨ Pro Tips

1. **Do both in parallel:** Assign one person to Google Play, one to App Store. They run simultaneously = 2-3 hours instead of 4-6.

2. **Pre-load the content:** Copy content from `store-assets/copy/app-description.json` into a text editor first. Have it ready to paste.

3. **Screenshot beforehand:** Take/prepare all screenshots before starting. Have them in the right folder.

4. **Test payments first:** Before submitting, test the payment flow with test cards.

5. **Have a rollback plan:** Know how to unpublish quickly if critical issues arise.

6. **Monitor the first 24 hours:** Have someone watching crash rates and user reviews.

---

## 📞 Quick Links

**Accounts:**
- Google Play Console: https://play.google.com/apps/publish
- App Store Connect: https://appstoreconnect.apple.com

**References:**
- Privacy Policy: https://wizdi.com/privacy
- Support: https://support.captaincount.com
- Marketing: https://www.captaincount.com

**Help:**
- Email: support@wizdi.com

---

**Last Updated:** 2026-02-28  
**Status:** All Guides Complete & Ready to Use ✅  
**Version:** 1.0

---

## Ready to Launch?

**START HERE:** Pick your path →

→ **Google Play?** Open `GOOGLE_PLAY_SETUP.md` and follow 26 steps  
→ **App Store?** Open `APP_STORE_SETUP.md` and follow 27 steps  
→ **Both?** Give one guide to each person, have them run in parallel  

Good luck! 🚀
