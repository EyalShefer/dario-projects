# Google Play Setup Guide — Captain Count

**للمُستخدم النهائي:** This guide walks you through setting up Captain Count on Google Play from start to finish.

---

## 📋 Prerequisites Checklist

Before you start, make sure you have:

- [ ] Google account (personal or business)
- [ ] Valid payment method (credit/debit card)
- [ ] App APK file (release build) — `captain-count-v1.0.0.apk`
- [ ] Store assets:
  - [ ] App icon (512x512 PNG)
  - [ ] Feature graphic (1024x500 PNG)
  - [ ] 5-8 screenshots (1080x1920 PNG each)
- [ ] Store text (copy provided separately):
  - [ ] App name: "Captain Count"
  - [ ] Short description
  - [ ] Full description
  - [ ] Keywords

---

## 🚀 Step-by-Step Setup

### PHASE 1: Create Developer Account (15 minutes)

#### Step 1: Go to Google Play Console

1. Open https://play.google.com/apps/publish in your browser
2. Sign in with your Google account
   - If you don't have a Google account, create one at https://accounts.google.com

**Screenshot:** You should see "Welcome to Google Play Console"

---

#### Step 2: Accept Developer Program Agreement

1. Read the **Google Play Developer Program Policies**
2. Check the box: "I agree to the Google Play Developer Program Policies and all Developer Agreement and Policy terms"
3. Check the box: "I confirm that I am not a resident of a restricted country"
4. Click **"Accept"**

**Screenshot:** You'll see a redirect to payment screen

---

#### Step 3: Pay the Registration Fee ($25)

1. You'll be asked for payment information
2. Enter your **credit/debit card** details:
   - Card number
   - Expiration date
   - CVC (3-4 digit security code)
   - Billing address
3. Click **"Continue"**
4. Payment is processed (usually instant)

**Screenshot:** Confirmation message: "Welcome to Google Play Developer Program"

**⏱️ Wait Time:** 1-2 hours for account activation (you'll get an email)

---

### PHASE 2: Create Your Application (10 minutes)

#### Step 4: Create New App

1. In Google Play Console, click the **blue "Create app" button** (top right)
2. Fill in the required fields:

   **App name:** `Captain Count`
   
   **Default language:** Select **Portuguese (Brazil)** from dropdown
   
   **App or game:** Select **Game**
   
   **Free or paid:** Select **Free**

3. Check the box: "I confirm that my app complies with Google Play policies"
4. Click **"Create app"**

**Screenshot:** You're now in the Captain Count app dashboard

---

### PHASE 3: Add App Details (15 minutes)

#### Step 5: Go to "Store Listing"

1. In the left sidebar, click **"Store listing"**
2. Select language from top: **Portuguese (Brazil)**

---

#### Step 6: Fill in Basic Information

**Location in form:** Top section "About this app"

1. **Short description** (copy provided):
   ```
   70 jogos de matemática para crianças de 5-7 anos. 
   Aprenda contagem, adição, subtração e muito mais! 
   Offline, sem publicidade, seguro.
   ```
   
   *Max 80 characters*

2. **Full description** (copy provided):
   - Copy the full Portuguese description from the store content document
   - Paste into the "Full description" field
   - Max 4,000 characters
   
   *It starts with: "Bem-vindo ao Captain Count..."*

3. **Keywords:**
   ```
   matemática, educação, crianças, aprender, jogos, números, contagem, adição
   ```
   
   *Separate with commas, max 8 keywords*

**Screenshot:** All text fields filled in

---

#### Step 7: Add App Icon & Graphics

**Location in form:** "Graphics" section

##### App Icon

1. Scroll down to **Graphics** section
2. Click on **"App icon"**
3. Upload your icon file (512x512 PNG)
   - Click "Upload image"
   - Select `app-icon-512x512.png` from your computer
   - Wait for upload to complete
4. You'll see a preview

**Expected:** Checkmark next to "App icon" when done

##### Feature Graphic

1. In same Graphics section, click **"Feature graphic"**
2. Upload your feature graphic (1024x500 PNG)
   - Click "Upload image"
   - Select `feature-graphic-1024x500.png`
   - Wait for upload to complete

**Expected:** Checkmark next to "Feature graphic" when done

---

#### Step 8: Add Screenshots

**Location in form:** "Screenshots" section (same page)

1. Scroll down to **Screenshots**
2. Click **"Add screenshots"**
3. You'll see a box for "Phone screenshots (1080x1920 PNG/JPG/GIF)"
4. Click "Select files" and upload 5-8 screenshots:
   - Screenshot 1: Main menu
   - Screenshot 2: Game selection
   - Screenshot 3: Gameplay
   - Screenshot 4: Parent dashboard
   - Screenshot 5: Premium unlock
   - (Optional 6-8: Additional features)

**Expected:** All 5+ screenshots shown in preview

---

#### Step 9: Save Store Listing

1. Scroll to **bottom of page**
2. Click **"Save"** (blue button)
3. Wait for confirmation: "Saved successfully"

**Screenshot:** Green checkmark or success message

---

### PHASE 4: Set Content Rating (10 minutes)

#### Step 10: Complete Content Rating Questionnaire

1. In left sidebar, click **"Content rating"**
2. You'll see a form asking about app content
3. Answer the questionnaire:

   **Violence:** "None"
   
   **Sexual content:** "None"
   
   **Profanity/vulgarity:** "None"
   
   **Alcohol/tobacco/drugs:** "None"
   
   **Gambling:** "None"
   
   **Malware/spyware:** "None"
   
   **Unrestricted internet access:** "No"

4. Click **"Save questionnaire"**
5. Google will generate a **content rating**: You should get **4+** or **Everyone**

**Screenshot:** "Content rating saved" confirmation

---

### PHASE 5: Configure Pricing & Distribution (20 minutes)

#### Step 11: Set Pricing

1. In left sidebar, click **"Pricing and distribution"**
2. You'll see pricing options

   **App pricing:**
   - Select **"Free"** (since we offer it free + in-app purchases)

3. **In-app purchases:**
   - This will be configured separately below

4. Click **"Save"** 

---

#### Step 12: Add In-App Subscriptions

1. Still in "Pricing and distribution" page
2. Scroll down to **"In-app products"** section
3. Click **"Manage products"** → **"Subscriptions"**
4. Click **"Create subscription"** (do this 3 times for all tiers)

**Subscription 1: Basic Monthly**

1. **Product ID:** `basic.monthly`
2. **Display title:** `Captain Count Basic`
3. **Description:** `40 games + parent dashboard`
4. **Subscription period:** `Monthly`
5. **Price tier:** Select appropriate tier for R$9.99
6. **Free trial:** `3 days` (optional but recommended)
7. **Click Save**

---

**Subscription 2: Premium Monthly**

1. **Product ID:** `premium.monthly`
2. **Display title:** `Captain Count Premium`
3. **Description:** `All 70 games + offline mode + no ads`
4. **Subscription period:** `Monthly`
5. **Price tier:** Select appropriate tier for R$19.99
6. **Free trial:** `3 days`
7. **Click Save**

---

**Subscription 3: Annual**

1. **Product ID:** `annual`
2. **Display title:** `Captain Count Annual`
3. **Description:** `All features for one year`
4. **Subscription period:** `Annual`
5. **Price tier:** Select appropriate tier for R$99
6. **Free trial:** `7 days`
7. **Click Save**

**Screenshot:** All 3 subscriptions listed

---

#### Step 13: Set Target Countries

1. Back in "Pricing and distribution" page
2. Scroll to **"Distribution"** section
3. Under **"Countries and regions":**
   - Uncheck "Everywhere"
   - Check only **"Brazil"** (for soft launch)
4. Click **"Save"**

**Screenshot:** Only Brazil is checked

---

### PHASE 6: Add App Signing Certificate (10 minutes)

#### Step 14: Create/Upload App Signing

1. In left sidebar, click **"App signing"**
2. You'll see options:
   
   **Recommended:** "Let Google Play sign your app"
   - Check this option
   - Google will handle signing automatically
   - You just upload the unsigned APK

3. Accept the terms
4. Click **"Save"**

**Screenshot:** App signing configured

---

### PHASE 7: Upload Release APK (15 minutes)

#### Step 15: Upload Your App Binary

1. In left sidebar, click **"Releases"** → **"Production"**
2. Click **"Create new release"** button (blue)
3. You'll see a section "Upload APK files"
4. Click **"Browse files"**
5. Select your APK file: `captain-count-v1.0.0.apk`
6. Wait for upload to complete (you'll see file size confirmation)

**Screenshot:** APK file uploaded, no errors

---

#### Step 16: Review Release Information

After upload, you'll see:

- **App size:**  (shows automatically)
- **Target SDK:** (shows automatically)
- **Permissions:** Review the list
  - Should show things like: Internet, Storage, etc.
  - No suspicious permissions

1. Scroll down to **"Release notes"** section
2. Enter release notes:
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

3. Scroll down and click **"Review"** (DO NOT CLICK "RELEASE TO PRODUCTION" YET)

**Screenshot:** Review page with all info displayed

---

### PHASE 8: Test Before Launch (Optional but Recommended)

#### Step 17: Set Up Internal Testing (Optional)

1. Go to **"Releases"** → **"Internal testing"**
2. Click **"Create release"**
3. Upload the same APK file
4. Click **"Save release"**
5. You can now share with testers internally before public launch

**Note:** Skip this if you want to go directly to production

---

### PHASE 9: Submit to Google Play (Final Step)

#### Step 18: Final Review & Submit

1. Go back to **"Releases"** → **"Production"**
2. You should see your draft release
3. Click on the release to view details
4. **FINAL CHECKLIST:**
   - [ ] App name: "Captain Count"
   - [ ] Short description filled in
   - [ ] Full description filled in
   - [ ] App icon uploaded (✓)
   - [ ] Feature graphic uploaded (✓)
   - [ ] Screenshots uploaded (5+)
   - [ ] Content rating: 4+ or Everyone
   - [ ] Pricing: Free with subscriptions
   - [ ] In-app products: 3 subscriptions created
   - [ ] Country: Brazil
   - [ ] APK uploaded, no errors
   - [ ] Release notes filled in

5. If all checkmarks are complete, click **"Review"** button
6. Accept all agreements:
   - Check: "I confirm this app doesn't violate any policy"
   - Check: "I accept all agreements"
7. Click **"Confirm rollout"** or **"Submit for review"**

**Screenshot:** You should see "Release submitted for review"

---

### PHASE 10: Monitor Review Status (Waiting)

#### Step 19: Wait for Google Approval

1. In **"Releases"** → **"Production"**, you'll see status:
   - "Pending review" — Currently being reviewed
   - "In review" — Under investigation
   - "Approved" — Ready to launch

2. **Timeline:** Usually 1-4 hours, sometimes up to 48 hours

3. You'll get an email when:
   - ✅ App is approved
   - ❌ App is rejected (with reason)

---

#### Step 20: Launch to Production

Once approved:

1. Go to **"Releases"** → **"Production"**
2. Click your release
3. Click **"Review and roll out"**
4. Select **"Rollout"** option:
   - "Roll out to 100% of users" (full launch)
   - Or "Staged rollout" (gradual launch, e.g., 10%, 25%, 100%)
5. Click **"Confirm rollout"**

**Screenshot:** Release is now LIVE on Google Play

---

## ✅ You're Done!

Your app is now live on Google Play!

### Next Steps:

1. **Share the link:**
   - Go to **"Store listing"**
   - Copy the URL: `https://play.google.com/store/apps/details?id=com.wizdi.captaincount`
   - Share with players, teachers, parents

2. **Monitor Performance:**
   - Go to **"Dashboards"** to see:
     - Downloads
     - Crashes
     - Ratings & reviews
     - Revenue (subscriptions)

3. **Respond to Reviews:**
   - Go to **"Ratings & reviews"**
   - Reply to user feedback
   - Address issues

4. **Track Analytics:**
   - Go to **"Statistics"** to see:
     - Installs
     - Uninstalls
     - Daily active users
     - Revenue

---

## 📞 Support & Troubleshooting

### Common Issues

**Issue:** "APK signature error"
- **Solution:** Make sure APK is signed. Contact dev team.

**Issue:** "Content rating rejected"
- **Solution:** Re-answer questionnaire. Ensure app doesn't have forbidden content.

**Issue:** "App review takes >48 hours"
- **Solution:** Normal. Sometimes happens. Wait or check "Policies" for any violations.

**Issue:** "Subscription pricing not showing"
- **Solution:** Make sure in-app products are set up in "Pricing & distribution"

### Contact Support

If you have questions:
- Email: **support@wizdi.com**
- Dev team: **dario@wizdi.com**

---

## 📊 Post-Launch Checklist

- [ ] App is visible on Google Play
- [ ] Can search by "Captain Count"
- [ ] Screenshots display correctly
- [ ] Subscriptions work (test with test card `4111 1111 1111 1111`)
- [ ] Parent dashboard shows analytics
- [ ] Offline mode works
- [ ] All 4 languages load correctly
- [ ] Ratings/reviews enabled

---

**Estimated Total Time:** 2-3 hours (including waiting for approval)

**Cost:** $25 (one-time developer registration fee)

---

**Version:** 1.0 | **Date:** 2026-02-28 | **Status:** Ready for submission
