# AapnoSaath Care — Public API Specification (v1)

Base URL: `/api/v1`

Interactive Swagger Documentation: `http://localhost:3000/api/docs`

---

## Endpoints Overview

| Method | Endpoint | Description | Public / Protected |
|---|---|---|---|
| `GET` | `/api/v1/health` | Service health status check | Public |
| `GET` | `/api/v1/public-config` | Non-sensitive public business settings | Public |
| `GET` | `/api/v1/services` | Retrieve list of published service plans | Public |
| `GET` | `/api/v1/services/:slug` | Retrieve single service plan by unique slug | Public |
| `GET` | `/api/v1/service-areas/check` | Check coverage status by locality or PIN code | Public |
| `GET` | `/api/v1/service-areas` | List active service coverage areas | Public |
| `POST` | `/api/v1/enquiries` | Submit service enquiry form | Public (Rate-limited) |
| `GET` | `/api/v1/enquiries/:referenceNumber/status` | Public-safe enquiry submission verification | Public |
| `POST` | `/api/v1/consultation-requests` | Submit initial consultation booking request | Public (Rate-limited) |
| `GET` | `/api/v1/consultation-requests/:referenceNumber/status` | Public-safe consultation request verification | Public |

---

## Detailed Specifications

### 1. Health Check
- **URL**: `GET /api/v1/health`
- **Response**:
```json
{
  "status": "ok",
  "timestamp": "2026-10-09T10:30:00.000Z",
  "service": "AapnoSaath Care API",
  "version": "1.0.0"
}
```

---

### 2. Public Configuration
- **URL**: `GET /api/v1/public-config`
- **Description**: Returns non-sensitive public metadata (contact placeholders, operating geography, policy versions).
- **Response**:
```json
{
  "orgName": "AapnoSaath Care",
  "tagline": "Close to Your Parents. Wherever You Are.",
  "serviceCity": "Vadodara",
  "serviceState": "Gujarat",
  "serviceCountry": "India",
  "supportEmail": "enquiries@aapnosaathcare.example.com",
  "supportPhone": "+91 98765 43210",
  "privacyNoticeVersion": "v1.0",
  "termsVersion": "v1.0",
  "disclaimer": "AapnoSaath Care provides elder care assistance, hospital appointment accompaniment, and family coordination. We do not provide clinical medical procedures, nursing care, or emergency ambulance rescue."
}
```

---

### 3. Service Plans
- **URL**: `GET /api/v1/services`
- **Response**:
```json
[
  {
    "id": "sp-001",
    "name": "Family Check-in",
    "slug": "family-check-in",
    "shortDescription": "Ideal for families wanting regular reassurance and thoughtful check-ins.",
    "priceAmount": 1499.00,
    "currencyCode": "INR",
    "billingPeriod": "per month",
    "inclusions": [
      "2 scheduled home visits per month",
      "Up to 30 minutes per visit",
      "Brief visit summary after each completed visit (subject to consent)",
      "Basic coordination with nominated family contact"
    ],
    "exclusions": [
      "Medical nursing or clinical procedures",
      "Emergency medical response"
    ],
    "displayOrder": 1,
    "isPilotPricing": false
  }
]
```

---

### 4. Service Area Coverage Checker
- **URL**: `GET /api/v1/service-areas/check?locality=Alkapuri&pincode=390007`
- **Response (Covered Area)**:
```json
{
  "status": "AVAILABLE",
  "locality": "Alkapuri",
  "pincode": "390007",
  "city": "Vadodara",
  "state": "Gujarat",
  "message": "Your locality is currently within our service area in Vadodara. Submit an enquiry to confirm scheduling for your requirements.",
  "notes": "Core coverage zone with standard scheduling availability."
}
```
- **Response (Unconfirmed Area)**:
```json
{
  "status": "NEEDS_CONFIRMATION",
  "locality": "Ajwa Road",
  "pincode": "390019",
  "city": "Vadodara",
  "state": "Gujarat",
  "message": "We have not yet confirmed scheduled coverage for this locality. Please submit an enquiry, and our team will review your location.",
  "notes": "Availability needs confirmation."
}
```

---

### 5. Submit Service Enquiry
- **URL**: `POST /api/v1/enquiries`
- **Body**:
```json
{
  "fullName": "Rahul Desai",
  "email": "rahul.desai@example.com",
  "phone": "+91 98765 43210",
  "relationshipToParent": "Son",
  "parentCity": "Vadodara",
  "parentLocality": "Alkapuri",
  "parentPincode": "390007",
  "parentPreferredName": "Mr. K. Desai",
  "serviceOfInterest": "regular-support",
  "preferredContactMethod": "PHONE",
  "preferredConsultationDate": "2026-10-15",
  "preferredTimeWindow": "Morning (9:00 AM - 12:00 PM)",
  "message": "Looking for weekly check-ins and errand assistance for my father.",
  "contactConsent": true,
  "botHoneypot": ""
}
```
- **Response (201 Created)**:
```json
{
  "success": true,
  "referenceNumber": "ASC-ENQ-482910",
  "message": "Thank you. Your enquiry has been received. Our team in Vadodara will contact you shortly to understand your family's needs.",
  "status": "NEW",
  "createdAt": "2026-10-09T10:35:00.000Z"
}
```

---

### 6. Submit Consultation Booking Request
- **URL**: `POST /api/v1/consultation-requests`
- **Body**:
```json
{
  "fullName": "Ananya Patel",
  "email": "ananya.patel@example.com",
  "phone": "+91 91234 56789",
  "preferredDate": "2026-10-18",
  "preferredTimeWindow": "Evening (3:00 PM - 6:00 PM)",
  "consultationMethod": "PHONE",
  "supportRequirements": "Initial consultation regarding regular assistance for elderly mother in Gotri.",
  "botHoneypot": ""
}
```
- **Response (201 Created)**:
```json
{
  "success": true,
  "referenceNumber": "ASC-CON-918234",
  "message": "Your consultation request has been submitted. Our team will review availability and confirm your scheduled slot.",
  "status": "PENDING_CONFIRMATION",
  "createdAt": "2026-10-09T10:36:00.000Z"
}
```
