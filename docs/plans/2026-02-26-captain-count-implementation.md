# Captain Count Launch — Implementation Plan

> **For Claude:** REQUIRED SUB-SKILL: Use superpowers:executing-plans to implement this plan task-by-task.

**Goal:** Execute Captain Count's global launch strategy starting with Brazil soft launch (organic) in Week 1-2, followed by paid ads scaling in Weeks 3-4.

**Architecture:** Pre-launch setup (analytics, payments, ASO) → Soft launch (organic) → Monitor metrics → Scale with paid ads

**Tech Stack:** 
- App: Unity/Unreal (existing)
- Analytics: Google Analytics + Mixpanel
- Payments: Stripe + local (Brazil: Boleto/PIX)
- Marketing: Facebook Ads, App Annie, Sensor Tower

---

## Pre-Launch Phase (Week 1, Before Release)

### Task 1: Set Up Analytics & Tracking

**Files:**
- Firebase project configuration
- Google Analytics GA4 setup
- Mixpanel project initialization
- Custom event tracking schema

**Step 1: Create Firebase project for Captain Count**

Go to Firebase Console (console.firebase.google.com):
1. Create new project: "Captain Count - Brazil"
2. Add iOS app (Bundle ID: com.wizdi.captaincount)
3. Add Android app (Package ID: com.wizdi.captaincount)
4. Download config files (GoogleService-Info.plist, google-services.json)
5. Commit Firebase config files

**Step 2: Configure GA4 events**

Define core events to track:
- `app_open` — user opens app
- `level_start` — user starts a game (level)
- `level_complete` — user finishes a game
- `subscription_initiated` — user starts subscription flow
- `subscription_purchased` — successful purchase
- `subscription_failed` — failed payment

**Step 3: Set up Mixpanel (optional but recommended)**

1. Create Mixpanel project
2. Get API key
3. Integrate SDK into app
4. Mirror GA4 events to Mixpanel

**Step 4: Set up payment tracking**

In Firebase/Mixpanel:
- Track conversion funnel: Free → Basic tier → Premium tier
- Track churn: inactive for 7+ days
- Track LTV: sum of all revenue per user

**Step 5: Commit**

```bash
git add firebase-config/ analytics-setup/ payment-tracking/
git commit -m "feat: setup analytics and payment tracking for Captain Count"
```

---

### Task 2: Set Up Payment Processing

**Files:**
- Stripe account configuration
- Brazil payment processor setup (Boleto, PIX)
- Payment webhook handlers
- Receipt validation logic

**Step 1: Create Stripe account**

1. Go to stripe.com
2. Create account for "Wizdi - Captain Count"
3. Enable Brazil payment methods:
   - Credit/Debit cards
   - Boleto (bank transfer)
   - PIX (instant payment)
4. Set currency: BRL (Brazilian Real)

**Step 2: Configure payment tiers**

In Stripe:

**Free tier:**
- Price: R$0 (no product needed)
- Linked to "free" user segment

**Basic tier:**
- Price: R$9.99/month
- Product: "Captain Count Basic"
- Billing cycle: monthly
- Trial: 3-7 days (optional)

**Premium tier:**
- Price: R$19.99/month
- Product: "Captain Count Premium"
- Billing cycle: monthly

**Annual tier:**
- Price: R$99/year
- Product: "Captain Count Annual"
- Billing cycle: yearly

**Step 3: Set up webhooks**

Create webhook endpoints to handle:
- `charge.succeeded` — log subscription start
- `charge.failed` — trigger retry + user notification
- `customer.subscription.updated` — tier change
- `customer.subscription.deleted` — churn tracking

**Step 4: Test payment flow**

Use Stripe test keys locally:
```bash
Test card: 4242 4242 4242 4242
Expiry: 12/25
CVC: 123
```

Test all three payment methods (card, Boleto mock, PIX mock).

**Step 5: Commit**

```bash
git add payment-processing/ stripe-config/ webhooks/
git commit -m "feat: setup Stripe payment processing for Brazil"
```

---

### Task 3: Prepare App Store Listings

**Files:**
- `app-store-metadata/pt-BR/` (Portuguese)
- `app-store-metadata/screenshots/`
- `app-store-metadata/description.txt`
- `app-store-metadata/keywords.txt`

**Step 1: Write app store description (Portuguese)**

Create `app-store-metadata/pt-BR/description.txt`:

```
Capitão Conta: Jogo de Matemática para Crianças

Capitão Conta é um jogo educativo divertido que ensina matemática para crianças do jardim e 1ª série.

✨ 70 jogos mini que cobrem toda a matemática do 1º ano
🎮 Gráficos de alta qualidade e personagens adoráveis
📊 Dashboard dos pais para acompanhar o progresso
🎯 Currículo alinhado (BNCC Brasil)
🌍 Jogue em português, inglês, espanhol, e mais

Características:
- Aprende matemática jogando (adição, subtração, contagem)
- Progressão inteligente (desafios aumentam conforme o nível)
- Sem publicidade (versão premium)
- Seguro para crianças (sem dados coletados)
- Jogue offline ou online

🎁 Teste grátis por 7 dias. Sem anúncio na versão premium.

Classificação: Recomendado para crianças de 4-7 anos
```

**Step 2: Create app store keywords**

Create `app-store-metadata/keywords.txt`:

```
matemática crianças, jogo educativo, app infantil, 
aprender matemática, jogo de números, educação infantil,
app para crianças, matemática interativa, jogos pedagógicos
```

**Step 3: Prepare screenshots (5 required)**

Screenshots should show:
1. Hero game (Capitão Conta mascot)
2. Gameplay (one mini-game)
3. Progress dashboard
4. Premium features
5. Parent dashboard (if available)

Design text overlay in Portuguese describing features.

**Step 4: Prepare app store icon**

- Size: 512×512 px
- Format: PNG with transparency
- Must include: Captain Count mascot + app name
- Must be distinct vs competitors

**Step 5: Commit**

```bash
git add app-store-metadata/
git commit -m "feat: prepare Google Play & App Store listings (Portuguese)"
```

---

### Task 4: Create Launch Marketing Assets

**Files:**
- `marketing/social-media/` (assets for Facebook, Instagram, TikTok)
- `marketing/landing-page/` (optional: landing page HTML)
- `marketing/press-release/` (PR for media)
- `marketing/email-template/` (pre-launch email to waitlist)

**Step 1: Create social media assets (Facebook/Instagram)**

Design 3-4 image posts:

**Post 1: Hero image**
- Image: Captain Count mascot + "Capitão Conta está aqui!" (Captain Count is here!)
- Text: "Um novo jogo de matemática para crianças. Testá grátis por 7 dias."
- CTA: "Download agora" (Download now)

**Post 2: Gameplay showcase**
- Image: Animated GIF of one mini-game
- Text: "70 jogos diferentes que ensinam matemática"
- CTA: "Jogue grátis"

**Post 3: Parent testimonial (or mock)**
- Image: Parent + child playing (stock photo)
- Text: "Minha filha aprende matemática brincando. Recomendo!" (My daughter learns math while playing)
- CTA: "Descobre Capitão Conta"

**Step 2: Create pre-launch landing page (optional)**

Create simple landing page:
- Hero section: Captain Count mascot + headline
- Features: 3-4 bullet points
- Pricing: Show tiers (Free, Basic R$9.99, Premium R$19.99)
- Download button: Links to Google Play (pre-registration link)
- Parent benefits: Why you should care

Host on: GitHub Pages or simple static site

**Step 3: Draft press release**

Create `marketing/press-release.txt`:

```
FOR IMMEDIATE RELEASE

Captain Count Launches in Brazil: New AI-Powered Math Game for Kids

São Paulo, Brazil — February 26, 2026 — Wizdi, an Israeli EdTech startup, 
today launched Captain Count, a high-quality educational math game designed 
for children in grades 1-2.

[2-3 paragraphs about the app, team, and vision]

Availability:
- Google Play: [link]
- App Store: [link]
- Free download + premium tiers starting at R$9.99/month

About Wizdi:
[1 paragraph about company]

Contact:
[email/phone]
```

**Step 4: Create email template (pre-launch)**

For early users/waitlist:

```
Subject: Capitão Conta chegou! 🎮 Jogue matemática gratuitamente

Oi [Name],

Temos uma notícia emocionante: Capitão Conta está disponível no Brasil!

70 mini-jogos que ensinam matemática de forma divertida.

🎁 7 dias grátis. Sem compromisso.

[Download link]

Aproveite o lançamento,
Equipe Wizdi
```

**Step 5: Commit**

```bash
git add marketing/
git commit -m "feat: create launch marketing assets (social media, PR, landing page)"
```

---

## Soft Launch Phase (Week 1-2, After Release)

### Task 5: Launch on Google Play (Organic, No Ads)

**Files:**
- Google Play Console project
- App release (build version 1.0)
- Store listing (Portuguese metadata)

**Step 1: Create Google Play Console project**

1. Go to play.google.com/console
2. Create project: "Wizdi - Captain Count"
3. Set up app: "Captain Count"
4. Enable monetization (Stripe integration)

**Step 2: Upload app build**

1. Create release APK (build v1.0)
2. Upload to Internal Testing track (beta)
3. Test on 2-3 devices (install, payment flow, crashes)
4. Fix any crashes found

**Step 3: Set up store listing**

1. Upload icon (512×512 PNG)
2. Upload 5 screenshots (in Portuguese)
3. Paste description and keywords
4. Set age rating (free content for kids)
5. Set price: Free (with in-app purchases)

**Step 4: Enable pre-registration (optional)**

If you want early waitlist:
1. Create pre-registration campaign
2. Share link on social media
3. Track how many pre-registrations

**Step 5: Launch to production**

1. Submit for review (usually approved in 2-4 hours)
2. Once approved, publish to Production
3. App is now live

**Step 6: Monitor initial metrics**

Track in Analytics:
- Installs/hour
- Install source (organic vs campaign)
- Crashes
- Average session length
- D1 retention

Expected: 10-50 installs in first 24 hours (organic)

**Step 7: Commit**

```bash
git add google-play-console-config/ app-v1.0/
git commit -m "feat: launch Captain Count on Google Play (Brazil, Portuguese)"
```

---

### Task 6: Monitor Soft Launch Metrics (Days 1-7)

**Files:**
- `monitoring/dashboard.html` (simple metrics dashboard)
- `monitoring/daily-report.md` (log findings)

**Step 1: Set up metrics dashboard**

Create simple HTML dashboard that pulls from:
- Google Analytics (installs, sessions, retention)
- Stripe (revenue, conversion)
- Firebase (crashes, errors)

Display:
- Total installs (daily)
- DAU/MAU
- D1/D7 retention
- Average revenue per user (ARPU)
- Conversion rate (free → paid)
- Any crashes or errors

**Step 2: Daily monitoring routine (Days 1-7)**

Each morning, check:
1. Total installs (target: 50-100/day organic)
2. D1 retention (target: 35%+)
3. Payment errors (zero is goal)
4. App crashes (should be 0)
5. User feedback (app store reviews)

Log findings in `monitoring/daily-report.md`

**Step 3: Address any crashes**

If crash rate > 1%:
1. Identify crash location (from Firebase)
2. Create fix (code change)
3. Build new APK (v1.0.1)
4. Upload to Internal Testing, test, then release

**Step 4: Respond to reviews**

Monitor Google Play reviews:
- If negative: Respond professionally, offer to help
- If positive: Thank user, ask them to share

**Step 5: Compile Week 1 report**

Create summary:
- Total installs: [X]
- D1 retention: [X%]
- D7 retention: [X%]
- ARPU: R$[X]
- Conversion (free → paid): [X%]
- Top complaints: [list]
- Top praise: [list]

**Step 6: Commit**

```bash
git add monitoring/
git commit -m "docs: add soft launch metrics & daily monitoring report"
```

---

## Scale Phase (Week 3-4, Paid Ads)

### Task 7: Set Up Paid Advertising (Facebook Ads)

**Files:**
- `marketing/facebook-ads/` (campaign config)
- `marketing/facebook-ads/creative-assets.txt` (ad copy & images)
- `marketing/facebook-ads/audience-targeting.txt` (target audience definition)

**Step 1: Create Facebook Ad Account**

1. Go to facebook.com/ads/manager
2. Create Business Account (if not exists)
3. Create Ad Account: "Captain Count - Brazil"
4. Set currency: BRL
5. Link Stripe for tracking conversions

**Step 2: Define ad audience**

Create audience (in Ad Manager):

**Name:** "Parents in Brazil (6-12 income)"

**Targeting:**
- Location: Brazil
- Age: 25-55 (parents)
- Interests: Education, parenting, kids apps, learning
- Behavior: Recently purchased apps
- Income: Middle to upper-middle class (optional)

**Exclusions:**
- People who already installed the app

**Step 3: Create ad creative**

Design 2-3 ad variations:

**Ad Variant 1: "Capitão Conta"**
- Image: Hero screenshot (Captain Count mascot)
- Headline: "Capitão Conta: Jogo de Matemática Grátis"
- Body: "70 jogos que ensinam matemática. Teste grátis por 7 dias."
- CTA: "Instalar Agora" (Install Now)

**Ad Variant 2: "Aprenda Brincando"**
- Image: Gameplay screenshot
- Headline: "Aprenda Matemática Brincando"
- Body: "Seu filho vai adorar. Sem anúncios na versão premium."
- CTA: "Baixar" (Download)

**Ad Variant 3: "Testimonial"**
- Image: Parent + child (stock or user-generated)
- Headline: "Minha filha ama matemática agora!"
- Body: "Capitão Conta torna a aprendizagem divertida."
- CTA: "Descobre"

**Step 4: Create campaign**

In Ad Manager:

**Campaign Details:**
- Objective: App Installs
- App: Captain Count
- Daily budget: R$50 (start small, ~$10 USD)
- Campaign duration: 7 days (test period)

**Ad Set:**
- Audience: "Parents in Brazil (6-12 income)"
- Placement: Automatic (Instagram, Facebook, Audience Network)
- Bid strategy: Lowest cost
- Event optimization: App installs

**Ads:**
- Add 3 ad variants
- Rotation: Balanced

**Step 5: Launch campaign & monitor**

1. Submit for review (usually approved in 1-2 hours)
2. Once live, monitor daily:
   - Cost per install (CPI): Should be R$2-3
   - Install rate: Should see 20-50 installs/day
   - Conversion (free → paid): Track in Analytics

3. If CPI > R$4: Turn off campaign, troubleshoot
4. If CPI R$2-3: Keep running, monitor

**Step 6: A/B test (Week 4)**

After 3-4 days:
- Identify best performing ad variant
- Pause low performers
- Increase budget on winners (to R$100/day)
- Test new creatives

**Step 7: Commit**

```bash
git add marketing/facebook-ads/
git commit -m "feat: setup Facebook Ads campaign for Brazil expansion"
```

---

## Post-Launch Monitoring (Week 3-4+)

### Task 8: Create Daily Metrics Report

**Files:**
- `monitoring/metrics-template.md` (template for daily reports)
- `monitoring/weekly-summary.md` (weekly synthesis)

**Daily Checklist (each morning):**

Create file: `monitoring/report-2026-03-[day].md`

```markdown
# Daily Report — March [day], 2026

## Metrics (from Analytics + Stripe)

### Acquisition
- New installs (yesterday): [X]
- Total installs: [X]
- Install source: [X% organic, X% paid]
- Cost per install (paid): R$[X]

### Engagement
- DAU: [X]
- D1 retention: [X%]
- Average session: [X min]
- Top game played: [game name]

### Monetization
- New subscriptions: [X]
- Conversion rate: [X%] (free → paid)
- Revenue (yesterday): R$[X]
- ARPU: R$[X]

### Health
- Crashes: [X]
- Negative reviews: [X]
- Support tickets: [X]

## Key Findings
- [Most important metric change]
- [One positive highlight]
- [One concern/blocker]

## Actions Taken
- [What we changed/fixed]

## Next 24h Priority
- [One thing to focus on]
```

**Weekly Summary (every Friday):**

Compile daily reports into:

```markdown
# Weekly Summary — Week of March [date]

## Overall Performance
- Total installs: [X] (up X% vs last week)
- D7 retention: [X%] (goal: 25%+)
- ARPU: R$[X] (goal: R$3+)
- Revenue: R$[X] (goal: R$500+)

## What Worked
- [Success story]
- [Metric improvement]

## What Needs Fixing
- [Issue 1]
- [Issue 2]

## Plan for Next Week
- [Action 1]
- [Action 2]
```

**Step 1-5: Execute daily monitoring for Weeks 3-4**

**Step 6: Commit weekly**

```bash
git add monitoring/
git commit -m "docs: add weekly metrics reports and analysis"
```

---

## Success Criteria & Checkpoints

### Week 1 (Soft Launch - Organic)
✅ **Must Have:**
- App live on Google Play
- Zero critical crashes
- 50+ organic installs
- D1 retention ≥ 30%

⚠️ **Red Flag:**
- D1 retention < 20%
- Crash rate > 2%
- Negative reviews (complaining about bugs)

### Week 2 (Monitoring)
✅ **Must Have:**
- 500+ total installs
- D7 retention ≥ 20%
- At least 1-2 paid subscribers
- User feedback analyzed

⚠️ **Red Flag:**
- D7 retention < 15% (app not engaging)
- Zero paid conversions (pricing issue)
- Churn rate > 10%/day

### Week 3-4 (Paid Ads)
✅ **Must Have:**
- Ads approved & running
- CPI R$2-3 (not higher)
- 100+ installs/day from ads
- Conversion (free → paid) ≥ 2%

⚠️ **Red Flag:**
- CPI > R$4 (too expensive)
- Conversion < 1% (offer not compelling)
- Ad account flagged for violations

### Month 1 Finale
✅ **Target:**
- 3K-5K active users
- D7 retention ≥ 25%
- ARPU ≥ R$2/month
- Positive unit economics (LTV > 3× CAC)

---

## Execution Handoff

Plan saved to `docs/plans/2026-02-26-captain-count-implementation.md`

**Two execution options:**

**1. Subagent-Driven (this session)**
- I dispatch fresh subagent per task
- Code review between tasks
- Fast iteration & feedback loop

**2. Parallel Session (separate)**
- Open new session with executing-plans skill
- Batch execution with checkpoints
- More focused, less context switching

**Which approach do you prefer?**
