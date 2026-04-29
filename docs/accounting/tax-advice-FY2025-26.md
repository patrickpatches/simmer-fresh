# Hone — Tax Advice & Deduction Strategy
## FY 2025–26 | Patrick Nasr | ABN: 35 613 871 156 | Sole Trader

> **Last updated:** 29 April 2026  
> **Prepared by:** Claude (accounting function)  
> **Note:** This document constitutes structured accounting guidance. For formal lodgement advice, review with a registered tax agent before submitting your return. The ATO's ultimate test for any deduction is: *was the expense incurred in producing assessable income or in carrying on a business?*

---

## 1. Your Structure at a Glance

You are a **sole trader** with an active ABN (35 613 871 156). Your business activity is developing and commercialising **Hone**, a recipe and meal planning app for the Google Play Store.

**Key FY2025-26 facts:**
- Development commenced: 19 April 2026
- App is pre-revenue as at 30 June 2026 — no income expected this financial year
- Business activity period within FY2025-26: approximately 11 weeks (19 Apr – 30 Jun 2026)
- All expenses to date are start-up and development costs

**Why pre-revenue expenses still matter:** The ATO allows deductions for expenses genuinely incurred in carrying on a business, even before that business generates income. A **tax loss** from this year can be offset against other income you have (wages, etc.) — effectively reducing your total taxable income. This is the single biggest short-term financial benefit of proper record-keeping. The ATO rule is s8-1 ITAA 1997: *you can deduct a loss or outgoing to the extent it is incurred in gaining or producing assessable income, or is necessarily incurred in carrying on a business for that purpose.*

---

## 2. Confirmed Deductible Expenses (Claim These)

### 2.1 Software & Subscriptions — 100% deductible

These are revenue expenses (not capital), deductible in full in the year incurred.

| Expense | Status | Action Required |
|---|---|---|
| **Claude Pro / Anthropic API** | ⚠️ Amount unknown | Pull invoices from anthropic.com/account/billing. Claude Pro ≈ USD $20/month (≈AUD $31). Claim every month you used it for Hone. |
| **Google Play Console registration** | ⚠️ Not yet paid | When you pay: save the receipt. AUD equivalent at RBA rate on payment date. One-time fee, fully deductible. |
| **GitHub** (free tier) | $0 — no claim | Note for the record only. |
| **Expo / EAS** (free tier) | $0 — no claim | Note for the record only. |
| **Cloudflare Pages** (free tier) | $0 — no claim | Note for the record only. |

**Why:** These are directly and exclusively incurred in building Hone. No apportionment needed for 100% business-use subscriptions.

---

### 2.2 Home Office — claim every hour you work

The ATO's **revised fixed rate method** is the simplest and most defensible option for a sole trader working from home:

> **Deduction = total hours worked from home × $0.67 per hour**

This covers: electricity and gas, internet, home phone, stationery, and computer consumables. It does not cover occupancy costs (rent/mortgage interest) — those require the actual cost method.

**How to calculate for FY2025-26 (partial year — 19 Apr to 30 Jun 2026):**
- Roughly 11 weeks of development
- If you work approximately 20 hours/week on Hone: 220 hours × $0.67 = **$147.40**
- If you work approximately 40 hours/week: 440 hours × $0.67 = **$294.80**

**What you must keep:** A record showing the number of hours worked from home. This doesn't need to be a formal timesheet — the Development Log in the XLSX is a suitable contemporaneous record because it logs hours by date. Keep it. Do not throw it away.

**If you own your home** (not renting), you can additionally claim a portion of mortgage interest, council rates, and home and contents insurance under the actual cost method. The formula is: (office floor area ÷ total home floor area) × total annual occupancy costs. This generally yields a larger deduction but is more complex to substantiate.

---

### 2.3 Phone — business portion

Your mobile phone is used to test the Hone APK on Android, for GitHub/email access, and for other business communications.

**Claim:** annual phone bill (calls + data) × business use percentage.

A reasonable business use % for a developer: **30–50%**. The ATO expects you to be able to justify this if asked. The simplest method is a 4-week diary showing how you used the phone, taken at a representative time of year (once done, you can apply the same % for 3 years without redoing the diary).

**Example:** If your annual phone bill is $1,200 and you estimate 40% business use: $480 deductible.

Keep: monthly phone bills for 5 years from date of lodgement.

---

### 2.4 Internet — business portion

Your home internet is used for: GitHub, Anthropic API calls, documentation, research, web deployment, and general development.

**Claim:** annual internet bill × business use percentage.

A developer working full-time from home on an app can reasonably claim **50–80%** business use. If you also work a day job that uses the same connection, the combined percentage should be apportioned across all users and uses.

**Example:** If your annual internet bill is $1,200 and you claim 60% business: $720 deductible.

Keep: annual broadband bills.

---

### 2.5 Android Test Device

The Android phone you use to test Hone APK builds is a piece of equipment used in your business.

**ATO treatment:** Under the **instant asset write-off** (available to sole traders with aggregated turnover < $10M), assets costing less than $20,000 (incl. GST) acquired and used by 30 June 2026 can be **written off in full** in FY2025-26.

**Claim:** purchase price × business use %. If the device is also your personal phone, apportion honestly. A device that is primarily a test device (e.g., a second phone kept for testing) could be 80–100% business.

**What you need:** the original purchase receipt or invoice. If you bought it before Hone was conceived, you can only claim from the date you started using it for business — work out the business use % from that date.

---

### 2.6 Computer / Laptop

The computer you use to develop Hone is depreciable equipment.

**Claim options:**
1. **Instant asset write-off** (if the device costs < $20,000 and was acquired and first used for business in FY2025-26): write off the full cost × business use % in this year.
2. **Depreciation** (if acquired before FY2025-26 or over $20,000): claim the decline in value each year. ATO effective life for computers: 4 years (25% per year straight-line, or 37.5% diminishing value).

If you use the computer for both Hone and personal use, the deductible portion is the business use %. A developer whose primary computer activity is Hone development can justify 70–90% business use.

**What you need:** purchase receipt/invoice. If purchased before Hone started, note the date you started using it primarily for business.

---

## 3. Deductions You're Probably Leaving on the Table

### 3.1 Food Research — yes, this is real

Hone is a **cooking app**. Cooking recipes for the app, testing whether written instructions produce the intended result, verifying ingredient substitutions, and food photography are all **directly connected to your business activity**.

The ATO will accept a meal or ingredient purchase as a business deduction if:
1. It is directly related to the income-producing activity (developing Hone)
2. It is not a private or domestic expense in disguise

**What you can legitimately claim:**
- Ingredients purchased specifically to **test and photograph recipes** for the app (stage-by-stage recipe photos are a core feature per CLAUDE.md)
- Props and equipment purchased for recipe photography (boards, plates, linen for food styling)
- Restaurant meals where you are researching dishes you intend to add to the app — keep a note on the receipt of the dish and what you were researching

**What you cannot claim:** your regular weekly groceries. The line is whether the purchase was motivated by the business need or your ordinary eating. A dedicated recipe test session where you buy specific ingredients to produce app content = claimable. Your Thursday night dinner = not claimable.

**How to substantiate:** keep receipts and write a brief note on each one: "Tested carbonara recipe for Hone — verified guanciale substitution notes." This creates a contemporaneous record the ATO cannot easily dispute.

Estimated potential deduction: $500–$2,000/year if you do regular recipe testing.

---

### 3.2 Professional Development

Books, courses, and learning materials that help you develop Hone are deductible if directly related to the business.

**Claimable:**
- App development courses (Swift/Kotlin/React Native, even if you use them as background knowledge)
- UX design books or courses
- Business books about app monetisation, growth, or the food tech space
- Subscriptions to developer-focused content (Hacker News is free; paid equivalents are claimable)
- Design tool subscriptions if you use them for Hone (Figma, etc.)

**Not claimable:** a general hobby cooking class with no business link.

---

### 3.3 Accounting & Tax Agent Fees

This document is part of the accounting function for Hone. **The cost of tax advice and return preparation is deductible** (s25-5 ITAA 1997). If you ever pay a registered tax agent to lodge your return or advise on business structure, 100% of that fee is deductible — it is specifically carved out by statute.

---

### 3.4 Domain Name Registration

When you register a domain name for Hone (e.g., hone.com.au), the registration fee is 100% deductible as a business expense in the year it is incurred. Keep the invoice from your domain registrar.

---

## 4. Things That Require Care

### 4.1 ATO's "Non-commercial loss" rules (Division 35)

If you have a tax **loss** from Hone this year (expenses but no income), the ATO's non-commercial loss rules may prevent you from offsetting that loss against other income **unless** you meet one of the four tests:

1. **Assessable income test:** Your business income from this activity is ≥ $20,000. (You won't meet this in FY2025-26.)
2. **Profits test:** You made a profit in 3 of the last 5 years. (Not yet met.)
3. **Real property test:** You use real property worth ≥ $500,000 in the business. (Unlikely.)
4. **Other assets test:** You use other assets worth ≥ $100,000. (Possible if you have expensive equipment.)

**If you don't meet any of these tests**, your business losses are **deferred** — they carry forward and offset future Hone income (when the app launches and earns revenue). They don't disappear; they just can't offset your wages income this year.

**Exception — Commissioner's discretion:** You can apply to the ATO for the loss to be immediately deductible even without meeting the tests, if the business is genuinely being established and there's a reasonable expectation of profit. Given that Hone is a structured, documented, commercially-oriented app development project (not a hobby), this discretion application has merit. Discuss with a registered tax agent before lodgement.

---

### 4.2 GST Registration

Your ABN is registered. Check whether you need to register for GST:
- **Required if** your annual GST turnover is ≥ $75,000 (or expected to reach $75,000)
- **Not required** for pre-revenue app development — you are below the threshold
- **Can voluntarily register** for GST even below the threshold, which lets you claim back the GST component of your business expenses (10% of most purchases)

**Voluntary GST registration recommendation:** Once you have meaningful recurring expenses (e.g., paid subscriptions, equipment), voluntary GST registration is worth considering. It means you get 10% back on those expenses. The compliance cost is lodging a BAS quarterly (or annually). Discuss with a tax agent.

---

### 4.3 FBT — Not Applicable

As a sole trader, you pay yourself by drawing from business income — there is no employer/employee relationship and no Fringe Benefits Tax obligation. This simplifies your position considerably.

---

## 5. Record-Keeping Checklist

The ATO requires you to keep records for **5 years** from the date of lodging the relevant tax return.

| Record | Format | Where to Keep |
|---|---|---|
| All expense receipts | PDF or photo | `docs/accounting/receipts/` (create this folder) |
| Bank and credit card statements | PDF | Same folder, by month |
| Development Log XLSX | .xlsx | `docs/Hone_Development_Log_FY2025-26.xlsx` |
| Work-from-home hours record | Built into Development Log | Already maintained |
| Phone/internet usage diary | 4-week diary or reasonable estimate note | `docs/accounting/home-office-diary.md` |
| Recipe testing notes | Notes on receipts | Physical or scanned |
| Tax return and ATO correspondence | PDF | `docs/accounting/tax-returns/` |

---

## 6. Actions Required from Patrick (Prioritised)

1. **[HIGH] Pull Anthropic invoices** — log in to anthropic.com, go to billing, download all invoices for months you used Claude for Hone. Enter each month as a separate row in the Expense Tracker.

2. **[HIGH] Google Play Console** — when you pay the $25 USD fee, save the receipt immediately. Convert to AUD using the RBA exchange rate on the day of payment (rba.gov.au/statistics/frequency/exchange-rates.html).

3. **[MEDIUM] Confirm Claude Pro vs API** — are you on Claude Pro ($20/month) or the API (pay per use)? The answer determines what invoices to collect.

4. **[MEDIUM] Internet and phone bills** — download annual statements from your internet and phone providers. Decide on your business use % and enter into the Expense Tracker.

5. **[MEDIUM] Home office hours** — the Development Log already records hours worked. Confirm the number of hours/week you work from home on Hone and I'll calculate the 67c/hour deduction.

6. **[MEDIUM] Android test device receipt** — locate the purchase receipt for the Android phone used for testing. Decide what % is business use.

7. **[LOW] Computer receipt** — if your MacBook/PC was bought in the last few years, find the receipt. We'll work out whether instant write-off or depreciation applies.

8. **[WHEN RELEVANT] Recipe testing** — whenever you cook a recipe to test or photograph it for the app, keep the grocery receipt and write a brief note on it.

---

## 7. Next Scheduled Update

This document is reviewed and updated **weekly** (every Wednesday). The Expense Tracker XLSX is updated in the same cadence. Bring any new receipts or purchases to my attention and I will categorise and log them.

**Next review:** 6 May 2026.

---

*Patrick Nasr | Sole Trader | ABN 35 613 871 156 | Hone — Recipes & Meal Planning App*
