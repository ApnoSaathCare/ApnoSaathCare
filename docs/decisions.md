# AapnoSaath Care — Launch Prerequisites & Pending Business Decisions

This document outlines key operational, legal, and business decisions that must be finalized prior to commercial launch in Vadodara, Gujarat.

---

## 1. Pending Business & Operational Decisions

1. **Pricing Commercialization**:
   - Current figures (₹1,499/mo for 2 visits, ₹2,999/mo for 4 visits, ₹299–₹699/task) are structured as **proposed pilot pricing**.
   - Confirmation needed on: Goods and Services Tax (GST) registration, billing cycle terms, and payment collection mechanisms (UPI / Razorpay / Stripe).

2. **Official Business Identity**:
   - Registered entity name (LLP / Pvt Ltd / Sole Proprietorship).
   - Physical office address and verified contact numbers in Vadodara.
   - Verified support email domain (`support@aapnosaathcare.in` or similar).

3. **Field Provider Verification Policy**:
   - Exact vetting protocols (police verification, background checks, Aadhaar verification, reference validation).
   - Training curriculum on hospital accompaniment safety, care boundaries, empathy, privacy, and elder communication.

4. **Service Scope & Boundary Enforcement**:
   - Standard Operating Procedure (SOP) for medical emergencies encountered during visits (e.g. protocol for contacting family contacts and 108 Emergency Ambulance service).
   - Formal policy on cash handling limits, prescription collection guidelines, and accompanying parents outside the home.

5. **Consent & Privacy Framework**:
   - Formal consent documentation signed by the elderly parent prior to commencement of visits.
   - Protocols for visits where the parent withdraws consent or requests non-disclosure to the family member.

---

## 2. Technical Launch Prerequisites

- [ ] Connect production PostgreSQL instance (AWS RDS, Supabase, Neon, or self-hosted).
- [ ] Implement email/SMS notification integration (e.g., SendGrid, AWS SES, Twilio, Msg91) on submission of enquiries and consultation requests.
- [ ] Configure production HTTPS and SSL certificates with automated renewal.
- [ ] Conduct formal legal review of Draft Privacy Policy, Terms of Service, and Service Scope & Care Boundaries Disclaimer.
- [ ] Connect custom domain and configure DNS records (SPF, DKIM, DMARC for email deliverables).
