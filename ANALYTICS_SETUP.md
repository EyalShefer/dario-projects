# Task 1: Analytics & Tracking Setup

**Status:** In Progress  
**Started:** 2026-02-26  
**Completed By:** 2026-02-27  

---

## Overview

This document describes the complete analytics & tracking infrastructure for Captain Count, a children's educational math game launching in Brazil (Portuguese, English, Spanish, Hebrew).

**Goals:**
- Track user acquisition, engagement, retention, and monetization
- Identify crashes and performance issues
- Calculate LTV (Lifetime Value), CAC (Customer Acquisition Cost), ARPU
- Validate product-market fit (soft launch Week 1-2, paid ads Week 3-4)

---

## Phase 1: Firebase Project Setup

### Step 1.1: Create Firebase Project (Manual - Console)

**Go to:** https://console.firebase.google.com

1. Click **"Create Project"**
   - Project Name: `Captain Count - Brazil`
   - Analytics: Enable
   - Analytics Region: Brazil (south-america-east1)

2. Once created, click **"Add App"** → Android
   - App Name: `Captain Count`
   - Android Package ID: `com.wizdi.captaincount`
   - SHA-1 Fingerprint: (Generate from your signing key)
   
   Download: `google-services.json` → Save to `firebase-config/google-services.json`

3. Click **"Add App"** → iOS
   - App Name: `Captain Count`
   - iOS Bundle ID: `com.wizdi.captaincount`
   
   Download: `GoogleService-Info.plist` → Save to `firebase-config/GoogleService-Info.plist`

### Step 1.2: Enable Firestore

1. In Firebase Console, go to **Firestore Database**
2. Click **"Create Database"**
   - Start in Production Mode
   - Location: `eur5` (or `nam5` for Americas)
3. Security Rules (temporary - for development only):

```
rules_version = '2';
service cloud.firestore {
  match /databases/{database}/documents {
    match /users/{uid} {
      allow read, write: if request.auth.uid == uid;
    }
    match /analytics/{document=**} {
      allow read, write: if request.auth != null;
    }
  }
}
```

### Step 1.3: Enable Crashlytics

1. In Firebase Console, go to **Crashlytics**
2. Click **"Enable Crashlytics"**
3. Follow platform-specific SDK integration (will be done in app code)

### Step 1.4: Enable Performance Monitoring

1. In Firebase Console, go to **Performance**
2. Click **"Enable"**
3. Configure thresholds (default settings are fine)

---

## Phase 2: Google Analytics 4 (GA4) Setup

### Step 2.1: Create GA4 Property

**Go to:** https://analytics.google.com

1. Click **"Admin"** (bottom left)
2. Click **"Create Property"** (under Account)
   - Property Name: `Captain Count - Brazil`
   - Industry Category: `Games`
   - Business Objectives: Select all relevant
   - Timezone: `America/Sao_Paulo (Brasília)`
   - Currency: `BRL` (Brazilian Real)

3. Accept data collection terms

### Step 2.2: Create Data Stream (App)

1. In GA4 Property, go to **Data Streams**
2. Click **"Add Stream"** → App
   - Select Platform: Android (first)
   - App Name: `Captain Count`
   - Package ID: `com.wizdi.captaincount`
   - Click **"Create Stream"**

3. Copy the **Measurement ID** → Save to `firebase-config/firebase-config.json` (field: `analytics.measurementId`)

4. Repeat for iOS (Bundle ID: `com.wizdi.captaincount`)

### Step 2.3: Define Custom Events (GA4)

In GA4 Admin, go to **Custom Definitions** → **Custom Events**, create each:

| Event Name | Description |
|---|---|
| `level_start` | User starts a game |
| `level_complete` | User finishes a game |
| `subscription_initiated` | User views pricing/subscription flow |
| `subscription_purchased` | Successful subscription |
| `subscription_failed` | Failed payment |
| `subscription_cancelled` | User cancels subscription |
| `ad_impression` | Ad shown (free tier) |
| `ad_click` | User clicked ad |

**For each event:**
1. Click **"Create Event"**
2. Name: (from table above)
3. Description: (from table above)
4. Click **"Create"**

All events and parameters are predefined in `analytics-setup/ga4-event-schema.json`.

### Step 2.4: Create Custom Dimensions (GA4)

In GA4 Admin, go to **Custom Definitions** → **Custom Dimensions**, create each:

| Dimension Name | Description | Scope |
|---|---|---|
| `tier_access` | User subscription tier (free/basic/premium) | User |
| `install_source` | How user found app (organic/facebook_ads) | User |
| `game_type` | Type of game played (addition/subtraction/etc) | Event |
| `payment_method` | Payment method used (card/boleto/pix) | Event |

---

## Phase 3: Mixpanel Setup (Optional)

### Step 3.1: Create Mixpanel Project

**Go to:** https://mixpanel.com

1. Sign up or log in
2. Click **"Projects"** → **"Create Project"**
   - Project Name: `Captain Count`
   - Industry: `Games`
   - Timezone: `America/Sao_Paulo`

3. Copy **Project Token** → Save to `firebase-config/firebase-config.json` (field: `mixpanel.projectToken`)

### Step 3.2: Define Events in Mixpanel

In Mixpanel Admin, go to **Data Management** → **Events**, and verify these are tracked (copy same schema from `analytics-setup/ga4-event-schema.json`):

- `app_open`
- `level_start`
- `level_complete`
- `subscription_initiated`
- `subscription_purchased`
- `subscription_failed`
- `subscription_cancelled`
- `ad_impression`
- `ad_click`

---

## Phase 4: Stripe Payment Setup

### Step 4.1: Create Stripe Account

**Go to:** https://stripe.com

1. Click **"Start Now"** → Sign up
2. Business Name: `Wizdi - Captain Count`
3. Country: Brazil
4. Enable these payment methods:
   - Credit/Debit Cards
   - **Boleto** (Brazilian bank transfer)
   - **PIX** (Brazilian instant payment)

### Step 4.2: Create Stripe Products

In Stripe Dashboard, go to **Products** → **Add Product**

**Product 1: Basic Tier**
- Name: `Captain Count Basic`
- Type: Service
- Pricing Model: Recurring
  - Price: R$9.99
  - Billing Period: Monthly
  - Trial: 3-7 days (optional)

**Product 2: Premium Tier**
- Name: `Captain Count Premium`
- Type: Service
- Pricing Model: Recurring
  - Price: R$19.99
  - Billing Period: Monthly
  - Trial: 3-7 days (optional)

**Product 3: Annual Tier**
- Name: `Captain Count Annual`
- Type: Service
- Pricing Model: Recurring
  - Price: R$99.00
  - Billing Period: Yearly

### Step 4.3: Configure Webhooks

In Stripe Dashboard, go to **Developers** → **Webhooks**

1. Click **"Add Endpoint"**
   - Endpoint URL: `https://YOUR_DOMAIN/webhooks/stripe`
   - Events to Send:
     - `charge.succeeded`
     - `charge.failed`
     - `customer.subscription.updated`
     - `customer.subscription.deleted`

2. Copy **Signing Secret** → Save to `firebase-config/firebase-config.json`

### Step 4.4: Test Payment Flow

**Using Stripe Test Keys:**
- Card: `4242 4242 4242 4242`
- Exp: `12/25`
- CVC: `123`

Test flow:
1. Create test customer
2. Create test subscription (Basic)
3. Verify webhook fires
4. Create another subscription (Premium)
5. Test cancellation

---

## Phase 5: App Integration (Code)

### Step 5.1: Android Integration (Kotlin/Java)

**Firebase Analytics:**
```kotlin
import com.google.firebase.analytics.FirebaseAnalytics

val analytics = FirebaseAnalytics.getInstance(context)

// Log level start
analytics.logEvent("level_start", bundleOf(
    "level_id" to 1,
    "level_name" to "Addition Basics",
    "game_type" to "addition",
    "difficulty" to 1
))

// Log level complete
analytics.logEvent("level_complete", bundleOf(
    "level_id" to 1,
    "score" to 100,
    "stars_earned" to 3,
    "time_spent_seconds" to 45
))

// Log purchase
analytics.logEvent(FirebaseAnalytics.Event.PURCHASE, bundleOf(
    FirebaseAnalytics.Param.VALUE to 9.99,
    FirebaseAnalytics.Param.CURRENCY to "BRL",
    FirebaseAnalytics.Param.ITEMS to arrayOf(
        bundleOf(
            FirebaseAnalytics.Param.ITEM_ID to "basic",
            FirebaseAnalytics.Param.ITEM_NAME to "Captain Count Basic"
        )
    )
))
```

**Stripe Payment:**
```kotlin
import com.stripe.android.PaymentConfiguration
import com.stripe.android.model.ConfirmPaymentIntentParams

// Initialize Stripe
PaymentConfiguration.init(context, "pk_test_YOUR_PUBLIC_KEY")

// Create subscription
val confirmParams = ConfirmPaymentIntentParams.createWithPaymentMethodId(
    paymentMethodId = paymentMethodId,
    clientSecret = clientSecret
)

// Handle success/failure via webhook
```

### Step 5.2: iOS Integration (Swift)

**Firebase Analytics:**
```swift
import FirebaseAnalytics

// Log level start
Analytics.logEvent("level_start", parameters: [
    "level_id": 1,
    "level_name": "Addition Basics",
    "game_type": "addition",
    "difficulty": 1
])

// Log purchase
Analytics.logEvent(AnalyticsEventPurchase, parameters: [
    AnalyticsParameterValue: 9.99,
    AnalyticsParameterCurrency: "BRL",
    AnalyticsParameterItems: [[
        AnalyticsParameterItemID: "basic",
        AnalyticsParameterItemName: "Captain Count Basic"
    ]]
])
```

**Stripe Payment:**
```swift
import StripePaymentSheet

// Initialize Stripe
StripeAPI.defaultPublishableKey = "pk_test_YOUR_PUBLIC_KEY"

// Create subscription
let paymentSheet = PaymentSheet()
paymentSheet.present(from: viewController, completion: { paymentResult in
    switch paymentResult {
    case .completed:
        print("Payment successful")
    case .canceled:
        print("Payment canceled")
    case .failed(let error):
        print("Payment failed: \(error)")
    }
})
```

### Step 5.3: Event Firing Checklist

Create a file `app-integration/EVENT_CHECKLIST.md`:

- [ ] `app_open` - fires on app launch
- [ ] `level_start` - fires when user taps game
- [ ] `level_complete` - fires when user finishes game
- [ ] `subscription_initiated` - fires when paywall shown
- [ ] `subscription_purchased` - fires after successful payment
- [ ] `subscription_failed` - fires after failed payment
- [ ] `subscription_cancelled` - fires when user cancels
- [ ] `ad_impression` - fires when ad shown (free tier)
- [ ] `ad_click` - fires when user taps ad
- [ ] `app_crash` - fires automatically via Crashlytics

---

## Phase 6: Monitoring & Testing

### Step 6.1: Firebase DebugView

**Android:**
```bash
adb shell setprop debug.firebase.analytics.app com.wizdi.captaincount
```

**iOS:**
Enable in Xcode Scheme → Run → Arguments → `-FIRDebugEnabled`

Then check Firebase Console → Analytics → DebugView to see real-time events.

### Step 6.2: Test Event Flow

1. Install app (test build)
2. Open app → Should see `app_open` event in DebugView
3. Play a game → Should see `level_start` + `level_complete`
4. Try subscription → Should see `subscription_initiated` + (success/failure)
5. Check Firebase Console → All events visible

### Step 6.3: Mixpanel Testing

If using Mixpanel, similar event tracking in real-time panel.

---

## Phase 7: Dashboard Setup

### Step 7.1: Create GA4 Dashboard

In Google Analytics, go to **Dashboard** → **Create Dashboard**

Add cards:
- **Installs (Daily)** — `source = organic | facebook_ads`
- **D1 Retention** — Users with session on Day 2 / Total installs
- **D7 Retention** — Users with session on Day 7 / Total installs
- **Conversion Rate** — `subscription_purchased` / Total users
- **ARPU** — Revenue / Active users (monthly)
- **Top Games** — `level_complete` by game_type

### Step 7.2: Create Stripe Dashboard

In Stripe, go to **Dashboard** → Bookmark key metrics:
- Monthly Recurring Revenue (MRR)
- Churn Rate
- Payment Success Rate
- Top Payment Methods

### Step 7.3: Create Custom Dashboard (HTML)

Create `monitoring/dashboard.html` (simple web dashboard):

```html
<!DOCTYPE html>
<html>
<head>
    <title>Captain Count - Metrics Dashboard</title>
    <script src="https://cdn.jsdelivr.net/npm/chart.js"></script>
</head>
<body>
    <h1>Captain Count — Live Metrics</h1>
    
    <!-- Installs Chart -->
    <canvas id="installsChart"></canvas>
    
    <!-- Retention Chart -->
    <canvas id="retentionChart"></canvas>
    
    <!-- Revenue Chart -->
    <canvas id="revenueChart"></canvas>
    
    <script>
        // Fetch from Firebase + Stripe API every 5 minutes
        // Update charts in real-time
    </script>
</body>
</html>
```

---

## Deliverables (Task 1)

- ✅ Firebase project created
- ✅ GA4 property with events + custom dimensions
- ✅ Mixpanel project (optional)
- ✅ Stripe account with products + webhooks
- ✅ GA4 & Stripe event schema (JSON)
- ✅ App integration code samples (Kotlin + Swift)
- ✅ Event testing checklist
- ✅ Monitoring dashboard (HTML template)
- ✅ This setup guide

---

## Git Commit

```bash
cd captain-count
git add firebase-config/ analytics-setup/ payment-tracking/ ANALYTICS_SETUP.md
git commit -m "feat: setup analytics and payment tracking for Captain Count"
git log --oneline
```

---

## Next: Task 2 (Payment Processing)

Once Task 1 is complete:
1. Set up Stripe integration in app code
2. Test payment flow (test card, Boleto, PIX)
3. Configure webhook handlers
4. Validate receipt flow

**Estimated Duration:** 3-4 hours total

---

## Questions / Blockers

- [ ] Firebase project created? (need ProjectId from console)
- [ ] GA4 Measurement ID recorded?
- [ ] Stripe account approved for Brazil?
- [ ] App code ready for SDK integration?
