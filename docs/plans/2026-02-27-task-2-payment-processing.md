# Task 2: Payment Processing Implementation Plan

> **For Dario:** EXECUTE TASK-BY-TASK using bite-sized steps. Code first, commit frequently.

**Goal:** Integrate Stripe API to process payments (Card, Boleto, PIX) and handle payment webhooks

**Architecture:** 
- Backend API routes for payment creation
- Stripe webhook handlers for payment confirmation
- Receipt validation & database logging
- Error handling & retry logic

**Tech Stack:** 
- Stripe API (Node.js/JavaScript)
- Express.js (if backend exists) or Cloud Functions
- Firebase Firestore (payment records)
- Webhook signature verification

---

## Phase 1: Stripe API Setup (No Code Yet)

### Task 1.1: Create Stripe Configuration File

**File:** `stripe-config/stripe-config.json`

**Contents needed (Eyal will provide):**
```json
{
  "stripe": {
    "publishableKey": "pk_live_...",
    "secretKey": "sk_live_...",
    "webhookSecret": "whsec_...",
    "accountId": "acct_..."
  },
  "products": {
    "basic": "price_...",
    "premium": "price_...",
    "annual": "price_..."
  }
}
```

**Action:** Create file with placeholders. Do NOT commit secret key to git.

---

## Phase 2: Payment Creation API

### Task 2.1: Design Payment Intent Schema

**File:** `payment-processing/PAYMENT_SCHEMA.md`

**Define:**
- Payment intent structure (what data we send to Stripe)
- Supported payment methods (card, boleto, ideal)
- Currency & amounts
- Metadata (user_id, tier, subscription_type)
- Error codes & handling

**Example:**
```json
{
  "amount": 999,
  "currency": "brl",
  "payment_method_types": ["card", "boleto"],
  "metadata": {
    "user_id": "user_123",
    "tier": "premium",
    "app_version": "1.0.0"
  }
}
```

### Task 2.2: Create Payment Intent Handler

**File:** `payment-processing/create-payment-intent.js`

**Function:**
```javascript
async function createPaymentIntent(userId, tier, email) {
  const stripe = require('stripe')(config.stripe.secretKey);
  
  const intent = await stripe.paymentIntents.create({
    amount: getTierAmount(tier),
    currency: 'brl',
    payment_method_types: ['card', 'boleto'],
    metadata: {
      user_id: userId,
      tier: tier,
      email: email
    }
  });
  
  return {
    clientSecret: intent.client_secret,
    paymentIntentId: intent.id
  };
}
```

**Test:**
- Call with valid tier → returns clientSecret ✓
- Call with invalid tier → throws error ✓
- Verify Stripe receives correct amount ✓

### Task 2.3: Create Express Route for Payment Intent

**File:** `routes/payments.js`

```javascript
app.post('/api/payments/create-intent', async (req, res) => {
  const { userId, tier, email } = req.body;
  
  try {
    const result = await createPaymentIntent(userId, tier, email);
    res.json(result);
  } catch (error) {
    res.status(400).json({ error: error.message });
  }
});
```

**Test:** `curl -X POST http://localhost:3000/api/payments/create-intent -d ...`

---

## Phase 3: Webhook Handling

### Task 3.1: Design Webhook Handler

**File:** `payment-processing/webhook-handler.md`

**Events to handle:**
- `payment_intent.succeeded` → Mark payment complete, grant access
- `payment_intent.payment_failed` → Log failure, notify user
- `charge.refunded` → Revoke access if refund > 7 days

### Task 3.2: Create Webhook Handler

**File:** `routes/webhooks.js`

```javascript
const stripe = require('stripe')(config.stripe.secretKey);

app.post('/webhooks/stripe', express.raw({type: 'application/json'}), async (req, res) => {
  const sig = req.headers['stripe-signature'];
  
  try {
    const event = stripe.webhooks.constructEvent(
      req.body,
      sig,
      config.stripe.webhookSecret
    );
    
    switch(event.type) {
      case 'payment_intent.succeeded':
        await handlePaymentSuccess(event.data.object);
        break;
      case 'payment_intent.payment_failed':
        await handlePaymentFailed(event.data.object);
        break;
    }
    
    res.json({received: true});
  } catch (error) {
    res.status(400).send(`Webhook Error: ${error.message}`);
  }
});
```

### Task 3.3: Implement Payment Success Handler

**File:** `payment-processing/handlers.js`

```javascript
async function handlePaymentSuccess(paymentIntent) {
  const { user_id, tier } = paymentIntent.metadata;
  
  // 1. Log payment in Firestore
  await db.collection('payments').add({
    user_id,
    tier,
    stripe_payment_id: paymentIntent.id,
    amount: paymentIntent.amount,
    currency: paymentIntent.currency,
    status: 'completed',
    created_at: new Date(paymentIntent.created * 1000)
  });
  
  // 2. Grant tier access to user
  await db.collection('users').doc(user_id).update({
    tier_access: tier,
    tier_expires_at: calculateExpiry(tier)
  });
  
  // 3. Send confirmation email (optional)
  // await sendConfirmationEmail(user_id);
}
```

**Test:**
- Simulate webhook with test payment → user gets access ✓
- Check Firestore has payment record ✓
- Verify user tier updated ✓

---

## Phase 4: Testing & Validation

### Task 4.1: Create Test Payments

**File:** `payment-processing/TESTING.md`

**Using Stripe Test Mode:**

1. **Test Card (always succeeds):**
   ```
   Card: 4242 4242 4242 4242
   Expiry: 12/25
   CVC: 123
   ```

2. **Test Card (fails):**
   ```
   Card: 4000 0000 0000 0002
   Expiry: 12/25
   CVC: 123
   ```

3. **Test Boleto:**
   - Use card `4000 0076 5000 3236` → generates test boleto
   - Verify webhook fires

### Task 4.2: Verify Payment Flow

**Checklist:**
- [ ] POST to `/api/payments/create-intent` with valid tier
- [ ] Receive `clientSecret` back
- [ ] Use clientSecret to confirm payment on client (mobile app)
- [ ] Webhook fires (check Stripe Dashboard → Webhooks)
- [ ] Payment appears in Firestore
- [ ] User tier updated
- [ ] Try refund → verify access revoked

---

## Phase 5: Logging & Monitoring

### Task 5.1: Add Payment Logging

**File:** `payment-processing/logger.js`

```javascript
async function logPayment(action, details) {
  await db.collection('payment_logs').add({
    action,
    details,
    timestamp: new Date(),
    status: details.status
  });
}
```

### Task 5.2: Create Payment Dashboard Query

**File:** `payment-processing/analytics.js`

```javascript
async function getPaymentStats(from, to) {
  const payments = await db.collection('payments')
    .where('created_at', '>=', from)
    .where('created_at', '<=', to)
    .get();
  
  return {
    total_transactions: payments.size,
    total_revenue_brl: payments.docs.reduce((sum, doc) => sum + doc.data().amount, 0),
    by_method: countByMethod(payments),
    by_tier: countByTier(payments)
  };
}
```

---

## Files to Create

```
captain-count/
├── stripe-config/
│   └── stripe-config.json (Eyal provides secrets)
├── payment-processing/
│   ├── PAYMENT_SCHEMA.md
│   ├── TESTING.md
│   ├── create-payment-intent.js
│   ├── handlers.js
│   ├── logger.js
│   └── analytics.js
├── routes/
│   ├── payments.js
│   └── webhooks.js
└── docs/plans/
    └── 2026-02-27-task-2-payment-processing.md (this file)
```

---

## Dependencies

- `stripe` npm package
- `express` (if not already installed)
- Firebase Admin SDK (for Firestore)

---

## Estimated Time

- Phase 1 (Setup): 30 min
- Phase 2 (Payment API): 1 hour
- Phase 3 (Webhooks): 1 hour
- Phase 4 (Testing): 30 min
- Phase 5 (Logging): 30 min

**Total: ~3.5 hours** (vs. 2 hours estimated — includes testing & docs)

---

## Success Criteria

✅ Payment intent created via API  
✅ Webhook receives & processes payment events  
✅ User tier granted after successful payment  
✅ Test payments work (all 3 methods)  
✅ Payment logged in Firestore  
✅ Error handling for failed payments  
✅ Webhook signature verified  

---

## Next Steps (Task 3+)

Once Task 2 complete:
- Task 3: App Store setup
- Task 4: Marketing assets
- Task 5: Soft launch
- Task 6: Monitoring
- Task 7: Paid ads
- Task 8: Scale & optimize
