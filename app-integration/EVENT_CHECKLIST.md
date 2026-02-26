# Task 1: Event Tracking Checklist

**Purpose:** Verify all analytics events are firing correctly before launch

---

## Pre-Launch Testing (Before Week 1 Release)

### Setup Phase
- [ ] Firebase project created in console
- [ ] Google Analytics 4 property created
- [ ] Android app added to Firebase (google-services.json downloaded)
- [ ] iOS app added to Firebase (GoogleService-Info.plist downloaded)
- [ ] GA4 measurement ID recorded
- [ ] Stripe account created with BRL currency
- [ ] Stripe webhook endpoint configured
- [ ] App code has Firebase SDK integrated (Android + iOS)
- [ ] App code has Stripe SDK integrated

### Event Firing Tests (Local/Dev Build)

#### Core Engagement Events
- [ ] **app_open** fires when app launches
  - Check: Firebase DebugView shows event with `session_id`
  - Expected params: `user_id`, `install_source`

- [ ] **level_start** fires when user taps game
  - Check: DebugView shows event with level_id + game_type
  - Test on level 1, 10, 50 to ensure all levels tracked

- [ ] **level_complete** fires when user finishes game
  - Check: DebugView shows event with score + stars_earned
  - Verify **time_spent_seconds** is accurate (> 0)

#### Monetization Events
- [ ] **subscription_initiated** fires when paywall shown
  - Check: DebugView shows event with tier (basic|premium|annual)
  - Verify entry_point captured (paywall|after_games|settings)

- [ ] **subscription_purchased** fires after successful payment
  - Check: Event has `value`, `currency` (BRL), `transaction_id`
  - Verify payment_method captured (card|boleto|pix)
  - **Test all 3 payment methods** (Stripe test mode):
    - Card: 4242 4242 4242 4242 | Exp 12/25 | CVC 123
    - Boleto: (mock in test mode)
    - PIX: (mock in test mode)

- [ ] **subscription_failed** fires after failed payment
  - Check: Event has `error_code` + `error_message`
  - Intentionally fail payment to test (use 4000 0000 0000 0002 card)

- [ ] **subscription_cancelled** fires when user cancels
  - Check: Event has `tier` + `subscription_length_days`

#### Monetization - Ads Events
- [ ] **ad_impression** fires when ad shown (free tier only)
  - Check: DebugView shows event with ad_format + ad_network

- [ ] **ad_click** fires when user clicks ad
  - Check: DebugView shows corresponding ad_impression first

#### Health Events
- [ ] **app_crash** fires automatically when app crashes
  - Check: Firebase Crashlytics shows crash with stack trace
  - Intentionally crash app to test (divide by zero, null reference)

### Firebase Validation
- [ ] Dashboard shows installs trend
- [ ] D1 retention > 0% (users returning Day 2)
- [ ] Events volume reasonable (no missing events)
- [ ] No spike in crash reports
- [ ] Custom dimensions populated:
  - [ ] `tier_access` shows free/basic/premium
  - [ ] `install_source` shows organic
  - [ ] `game_type` shows game variations

### Stripe Validation
- [ ] Webhook endpoint receives payment events
  - [ ] Test: Create subscription → Check `charge.succeeded` received
  - [ ] Test: Cancel subscription → Check `customer.subscription.deleted` received
- [ ] Revenue appears in Stripe Dashboard (Test mode)
- [ ] Customers list grows with test transactions

### Google Analytics 4 Validation
- [ ] Real-time events showing in GA4 (not delayed)
- [ ] Purchase event has correct revenue value
- [ ] Conversion funnel shows Free → Basic → Premium flow
- [ ] Retention cohorts showing D1/D7/D30 values

---

## Launch Readiness (Week 1, Before Public Release)

- [ ] All events tested and verified
- [ ] Firebase + GA4 dashboards created
- [ ] Stripe webhook handlers tested
- [ ] App Crashlytics configured (production settings)
- [ ] Analytics enabled in production build
- [ ] Privacy policy updated (mentions Firebase/Stripe/GA4)
- [ ] No test data in production analytics

---

## Week 1-2 Soft Launch Monitoring

**Daily Checks (after release):**

- [ ] Installs trending up (target: 50+ first 24h)
- [ ] D1 retention ≥ 30% (users returning)
- [ ] Zero crashes (or <1% crash rate)
- [ ] Payment flow working (successful test purchases)
- [ ] User reviews monitored (check for complaints about ads/pricing)
- [ ] No analytics data missing (events tracking correctly)

**Metrics to Log Daily:**

Create `monitoring/daily-report.md`:

```markdown
# Daily Report — [DATE]

## Installs
- Today: [X]
- Total: [X]
- Source: [X% organic]

## Engagement
- D1 Retention: [X%]
- Avg Session: [X min]
- Top Game: [game name]

## Monetization
- New Subscriptions: [X]
- Conversion: [X%]
- Revenue: R$[X]

## Health
- Crashes: [X]
- Reviews: [positive|negative feedback]

## Actions
- [What we fixed/changed]
```

---

## Success Metrics (Week 1 Checkpoints)

✅ **Week 1 Launch Target:**
- [ ] 50+ organic installs
- [ ] D1 retention ≥ 30%
- [ ] Zero critical crashes
- [ ] Positive user reviews (no complaints about bugs)
- [ ] All analytics events firing correctly
- [ ] Payment flow validated (successful test transactions)

⚠️ **Red Flags:**
- [ ] D1 retention < 20% (game not engaging)
- [ ] Crash rate > 2% (critical issue)
- [ ] Revenue = R$0 after 100 installs (pricing issue)
- [ ] Analytics events missing (tracking problem)

---

## Rollback Plan (If Critical Issue Found)

If any of these occur:
1. **Zero installs** → Check Google Play listing (rejected?)
2. **Crash rate > 5%** → Pull app from Play Store, hotfix, resubmit
3. **Analytics missing** → Verify Firebase SDK initialized in app code
4. **Payment failing** → Check Stripe keys correct, webhook endpoint live

---

## Notes

- Firebase DebugView is only available for 24h after enabling
- GA4 data takes ~24h to fully populate (real-time is partial)
- Stripe test mode doesn't affect real accounts
- Always test on actual devices (emulator behavior can differ)
