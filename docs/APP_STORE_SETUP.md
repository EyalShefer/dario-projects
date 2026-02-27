# App Store (iOS) Setup Guide — Captain Count

**For the App Store team:** This guide walks you through setting up Captain Count on Apple App Store from start to finish.

---

## 📋 Prerequisites Checklist

Before you start, make sure you have:

- [ ] Apple ID (personal or business)
- [ ] Valid payment method on file
- [ ] Mac computer (for building IPA file)
- [ ] Xcode installed (free from App Store)
- [ ] App IPA file (release build) — `captain-count-v1.0.0.ipa`
- [ ] Store assets:
  - [ ] App icon (1024x1024 PNG)
  - [ ] 5-8 screenshots (1242x2688 PNG each, iPhone 6.5")
  - [ ] Preview video (optional, 15-30 seconds MP4)
- [ ] Store text (copy provided separately):
  - [ ] App name: "Captain Count"
  - [ ] Subtitle: "Adventure Matemática"
  - [ ] Description
  - [ ] Keywords
  - [ ] Support URL
  - [ ] Privacy policy URL

---

## 🚀 Step-by-Step Setup

### PHASE 1: Create Developer Account (20 minutes)

#### Step 1: Enroll in Apple Developer Program

1. Go to https://developer.apple.com/account
2. Sign in with your Apple ID
   - If you don't have one, create at https://appleid.apple.com
3. Click **"Enroll"** or **"Join the Apple Developer Program"**
4. You'll be guided through enrollment

---

#### Step 2: Accept Agreements

1. Read the **Apple Developer Program License Agreement**
2. Check: "I agree to the Apple Developer Program License Agreement"
3. Click **"Continue"**

---

#### Step 3: Pay Annual Fee ($99)

1. You'll be directed to payment information screen
2. Enter your **credit/debit card** details:
   - Card number
   - Expiration date
   - CVC (security code)
   - Billing address
3. Click **"Continue"**
4. Payment is processed (usually instant)

**Screenshot:** Confirmation: "Welcome to the Apple Developer Program"

**⏱️ Wait Time:** 1-2 hours for full account activation

---

### PHASE 2: Create App ID (10 minutes)

#### Step 4: Register App ID

1. Go to https://developer.apple.com/account/resources/certificates/list
2. Click **"Identifiers"** in the left sidebar
3. Click the **"+"** button (top right)
4. Select **"App IDs"** and click **"Continue"**

---

#### Step 5: Fill in App ID Details

**Select type:**
- Choose **"App"**
- Click **"Continue"**

**Register an App ID:**
1. **Description:** `Captain Count`
2. **Bundle ID:**
   - Select **"Explicit"**
   - Enter: `com.wizdi.captaincount`
3. **Capabilities:**
   - Check ✓ **"In-App Purchase"** (required for subscriptions)
   - Check ✓ **"Push Notifications"** (optional)
   - Uncheck everything else
4. Click **"Continue"**
5. Click **"Register"**

**Screenshot:** "The App ID 'Captain Count' has been registered"

---

### PHASE 3: Create App in App Store Connect (10 minutes)

#### Step 6: Go to App Store Connect

1. Go to https://appstoreconnect.apple.com
2. Sign in with your Apple ID
3. Click **"Apps"** (left sidebar)
4. Click the **"+"** button and select **"New App"**

---

#### Step 7: Create New App

A form will appear. Fill in:

**Platform:** Select **"iOS"**

**Name:** `Captain Count`
- This is the name shown on the App Store

**Primary Language:** **Portuguese (Brazil)** from dropdown

**Bundle ID:** Select `com.wizdi.captaincount` from dropdown
- (Should match the App ID you created above)

**SKU:** `CAPTAINCOUNT001`
- Unique identifier (can be any unique string)

**User Access:** Select **"Full Access"**

Click **"Create"**

**Screenshot:** You're now in the Captain Count app dashboard

---

### PHASE 4: Fill in App Information (20 minutes)

#### Step 8: Go to App Information

1. In left sidebar, click **"App Information"**
2. You'll see various fields to fill

---

#### Step 9: Fill Basic App Details

**Subtitle:** 
```
Adventure Matemática
```
(Portuguese for "Math Adventure")

**Category:** Select **"Games"** → **"Educational"**

**Privacy Policy URL:**
```
https://wizdi.com/privacy
```
(Or wherever your privacy policy is hosted)

**Age Rating:** 
- Click **"Edit"** next to "Age Rating"
- A form appears
- Answer all questions as "None/No"
- You should get **Age 4+**

**Content Rating:**
- Should auto-populate as **"Educational"**

Click **"Save"** at bottom

**Screenshot:** All fields filled

---

#### Step 10: Add Localizations

Your app will support 4 languages: Portuguese (Brazil), English, Spanish, Hebrew.

1. Scroll down to **"App Localizations"**
2. Click **"+"** to add new language
3. Select **"English"** from dropdown
4. Click **"Add"**

Repeat for **"Spanish"** and **"Hebrew"**

**Screenshot:** 4 languages listed (Portuguese, English, Spanish, Hebrew)

---

### PHASE 5: Pricing and Availability (15 minutes)

#### Step 11: Set Availability

1. In left sidebar, click **"Pricing and Availability"**
2. You'll see pricing section

**Price Tier:**
- Select **"Free"** (since we offer free + subscriptions)

**Availability:**
- Uncheck "Everywhere"
- Check only **"Brazil"** (soft launch)
- Uncheck all other countries
- Click **"Done"**

3. Scroll down
4. Click **"Save"** (blue button)

**Screenshot:** Brazil is the only selected country

---

### PHASE 6: Configure In-App Purchases (20 minutes)

#### Step 12: Create Auto-Renewable Subscriptions

1. In left sidebar, click **"In-App Purchases"**
2. Click **"+"** button to create new product

**First Subscription: Basic Monthly**

1. **Product Type:** Select **"Auto-Renewable Subscription"**
2. **Reference Name:** `Captain Count Basic Monthly`
3. **Product ID:** `com.wizdi.captaincount.basic.monthly`
4. **Billing Period:** Select **"Monthly"**
5. **Free Trial Period:** Select **"3 days"** (optional)
6. **Localization:** 
   - Language: Portuguese (Brazil)
   - **Display Name:** `Captain Count Basic`
   - **Description:** `40 games + parent dashboard`
7. **Pricing:**
   - **Price Tier:** Select tier for R$9.99
   - **Currency:** BRL (Brazilian Real)
8. **Subscription Duration:** Monthly
9. Click **"Save"**

---

**Second Subscription: Premium Monthly**

Repeat the same process:
1. **Reference Name:** `Captain Count Premium Monthly`
2. **Product ID:** `com.wizdi.captaincount.premium.monthly`
3. **Billing Period:** Monthly
4. **Free Trial:** 3 days
5. **Display Name:** `Captain Count Premium`
6. **Description:** `All 70 games + offline mode + no ads`
7. **Price Tier:** R$19.99
8. Click **"Save"**

---

**Third Subscription: Annual**

1. **Reference Name:** `Captain Count Annual`
2. **Product ID:** `com.wizdi.captaincount.annual`
3. **Billing Period:** Select **"Annual"**
4. **Free Trial:** 7 days (optional, more generous for annual)
5. **Display Name:** `Captain Count Annual`
6. **Description:** `All features for one year`
7. **Price Tier:** R$99.00
8. Click **"Save"**

**Screenshot:** All 3 subscriptions listed in In-App Purchases

---

### PHASE 7: App Description & Media (30 minutes)

#### Step 13: Go to App Description

1. In left sidebar, click **"App Description"**
2. Select language: **"Portuguese (Brazil)"** from top dropdown
3. You're now editing the Portuguese version

---

#### Step 14: Fill in Description Fields

**Subtitle:**
```
70 jogos educativos para crianças de 5-7 anos
```

**Description:**
- Copy the full Portuguese description from the store content document
- Paste it into the "Description" field
- Max 4,000 characters
- Should start with: "Bem-vindo ao Captain Count..."

**Keywords:** (comma-separated)
```
matemática, educação, crianças, aprender, jogos, números, contagem, adição
```

**Support URL:**
```
https://support.captaincount.com
```

**Marketing URL:**
```
https://www.captaincount.com
```

**Privacy Policy URL:**
```
https://wizdi.com/privacy
```

Click **"Save"** at bottom

---

#### Step 15: Add Localizations

1. Scroll down to **"Localizations"**
2. Click **"+"** to add new language
3. Select **"English"**
4. Click **"Add"**

Repeat for **"Spanish"** and **"Hebrew"**, filling in translations of the above fields.

**Screenshot:** All 4 languages configured

---

#### Step 16: Add Screenshots and Preview

**Location:** Still in "App Description" or click **"Screenshots"** section

1. Select device: **"iPhone 6.5-inch display"** (iPhone 15 Pro Max)
2. Click **"Select files"** under "Screenshot uploads"
3. Upload 5-8 screenshots (1242x2688 PNG each):
   - Screenshot 1: Main menu
   - Screenshot 2: Game selection
   - Screenshot 3: Gameplay
   - Screenshot 4: Parent dashboard
   - Screenshot 5: Premium unlock
   - (Optional 6-8: Additional features)

4. For each screenshot, you can add a caption (optional):
   - Captions auto-translate to all languages
   - English: "Explore 70 educational math games"

**Screenshot:** All 5+ screenshots displayed in preview

---

#### Step 17: Add Preview Video (Optional)

1. Still in screenshot section
2. Look for **"App Preview"** section
3. Click **"Select file"**
4. Upload MP4 video (15-30 seconds max):
   - Shows the app in action
   - Optional but recommended

---

### PHASE 8: Build & Upload IPA (30 minutes)

#### Step 18: Build App Archive (on Mac with Xcode)

1. Open Xcode on your Mac
2. Open the Captain Count project: `CaptainCount.xcworkspace`
3. Select **Scheme:** "CaptainCount"
4. Select **Destination:** "Generic iOS Device" (not simulator)
5. Menu: **Product** → **Archive**
6. Xcode builds the app (may take 5-10 minutes)
7. "Organizer" window opens with archive ready

---

#### Step 19: Export IPA File

1. In Organizer window, select your build
2. Click **"Distribute App"**
3. Select **"App Store Connect"**
4. Click **"Next"**
5. Select **"Upload"**
6. Click **"Next"**
7. Select **"Automatically manage signing"**
8. Click **"Next"**
9. Select signing options (usually auto-filled):
   - Team: Your team
   - Signing Certificate: Your certificate
10. Click **"Next"**
11. Review summary
12. Click **"Upload"**

**Screenshot:** "Upload Successful" message

**Alternatively (if upload doesn't work):**
1. Click **"Export"** instead of "Upload"
2. Select location to save IPA file
3. Then manually upload in App Store Connect

---

### PHASE 9: Submit IPA to App Store (10 minutes)

#### Step 20: Build Version Management

1. Go to App Store Connect
2. Click **"Builds"**
3. If you uploaded via Xcode, build should appear here
4. If not, click **"+"** to upload manually using Transporter app

---

#### Step 21: Assign Build to Version

1. Click on your build
2. Assign it to **"Version 1.0"** (or current version)
3. Click **"Save"**

---

### PHASE 10: App Store Listing Review (10 minutes)

#### Step 22: Final Pre-Submission Checklist

Go to **"App Store"** tab and verify:

**General:**
- [ ] App name: "Captain Count"
- [ ] Primary category: Games/Educational
- [ ] Age rating: 4+
- [ ] Privacy policy URL: Filled in
- [ ] Support URL: Filled in

**App Information:**
- [ ] Subtitle filled in
- [ ] Description filled in
- [ ] Keywords filled in
- [ ] Screenshots: 5+ images

**Pricing & Availability:**
- [ ] Pricing: Free
- [ ] Availability: Brazil only
- [ ] In-App Purchases: 3 subscriptions created

**Version Release:**
- [ ] Release notes filled in
- [ ] Build assigned
- [ ] No warnings/errors

---

#### Step 23: Add Release Notes

1. Go to **"Version 1.0"** → **"Version Information"**
2. Add **"Release Notes":**

```
Initial release of Captain Count! 
Featuring 70 educational math games for children ages 5-7.

Features:
• 70 mini-games covering grade 1 mathematics
• Personalized progress tracking
• Offline mode
• 4 languages: Portuguese, English, Spanish, Hebrew
• Safe for children (COPPA compliant)

Download Captain Count today!
```

3. Click **"Save"**

---

### PHASE 11: Submit for Review (Final)

#### Step 24: Submit App for Review

1. Go to **"App Store"** → **"Version 1.0"**
2. Scroll to top
3. Click **"Submit for Review"** (blue button)
4. A popup will ask about:
   - **Export compliance:** Select "No" (we don't use encryption)
   - **Advertising ID:** Select "No"
   - **Third-party sharing:** Select "No"
5. Click **"Submit"**

**Screenshot:** "Your app has been submitted for review"

**Timeline:** Usually 24-48 hours

---

#### Step 25: Monitor Review Status

1. Go to **"Builds"** section
2. You'll see your build with status:
   - "Processing" — Apple is reviewing
   - "Approved" — Ready to release
   - "Rejected" — Issues found (you'll get email with reason)

3. You'll get email notifications at each stage

---

### PHASE 12: Release to App Store (5 minutes)

#### Step 26: Release After Approval

Once Apple approves (you get email):

1. Go to **"App Store"** → **"Version 1.0"**
2. Scroll to top
3. Click **"Release This Version"**
4. Select release date:
   - "Release immediately" (goes live now)
   - "Release on a specific date" (schedule for later)
5. Click **"Release"**

**Screenshot:** "Version 1.0 is ready for sale" or similar message

---

### PHASE 13: TestFlight (Beta Testing - Optional)

#### Step 27: Invite Beta Testers (Optional)

Before full release, you can test with small group:

1. Go to **"TestFlight"** in left sidebar
2. Click **"+"** to add testers
3. Enter email addresses of 5-10 testers
4. They'll get invitation email
5. They can download and test via TestFlight app
6. They submit feedback via TestFlight
7. You can push new builds with fixes

**Recommended:** Test for 7 days before public launch

---

## ✅ You're Done!

Your app is now live on the App Store!

### Next Steps:

1. **Share the link:**
   - Go to **"App Information"**
   - Copy the App Store link
   - Share with players, teachers, parents

2. **Monitor Performance:**
   - Go to **"Sales and Trends"** to see:
     - Downloads
     - Revenue
     - User ratings
     - Crashes

3. **Respond to Reviews:**
   - Go to **"Ratings & Reviews"**
   - Reply to user feedback
   - Address any issues

4. **Track Analytics:**
   - Go to **"Analytics"** to see:
     - Total downloads
     - Active devices
     - Retention curves
     - In-app purchase revenue

---

## 📞 Support & Troubleshooting

### Common Issues

**Issue:** "Build marked as invalid"
- **Solution:** Make sure app is signed with correct certificate. Verify Bundle ID matches.

**Issue:** "App rejected for privacy reasons"
- **Solution:** Re-check privacy policy URL. Make sure COPPA/GDPR compliant.

**Issue:** "In-app purchases not showing"
- **Solution:** Make sure subscriptions are configured. Check pricing tier is set.

**Issue:** "App review takes >48 hours"
- **Solution:** Normal for busy times. Usually 24-48 hours.

### Contact Support

If you have questions:
- Email: **support@wizdi.com**
- Dev team: **dario@wizdi.com**

---

## 📊 Post-Launch Checklist

- [ ] App is visible on App Store
- [ ] Can search by "Captain Count"
- [ ] Screenshots display correctly
- [ ] Subscriptions work (use test account if available)
- [ ] Parent dashboard shows analytics
- [ ] Offline mode works
- [ ] All 4 languages load correctly
- [ ] Ratings/reviews enabled

---

**Estimated Total Time:** 2-3 hours (including building + waiting for approval)

**Cost:** $99 (annual Apple Developer Program fee)

---

**Version:** 1.0 | **Date:** 2026-02-28 | **Status:** Ready for submission
