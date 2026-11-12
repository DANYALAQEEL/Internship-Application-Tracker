# Project Brief: Internship Application Tracker

**Course:** Web Engineering  
**Stage:** Assignment 1 — Client-Side Prototype  
**Topic:** Idea #11 — Internship Application Tracker  
**Author / Team:** Student Team  
**Architecture:** Client-Side Web Application (Semantic HTML5, CSS3, Vanilla JavaScript)  
**Strict Constraints:** No React, No PHP, No backend, No CSS frameworks (Tailwind, Bootstrap), No external UI libraries.

---

## 1. Problem Statement & User Persona

### 1.1 The Problem
University students and recent graduates apply to dozens of internships across diverse job boards, LinkedIn, company career portals, and referrals. Without a dedicated tracking system, students suffer from:
- Missed interview dates and follow-up deadlines.
- Disorganized spreadsheets or scattered email confirmations.
- Inability to quickly assess the health of their job search (conversion rates from applied to interview).
- Difficulty recalling specific job links, requirements, and personal notes during impromptu recruiter calls.

### 1.2 Target User
- **Primary User:** University students actively seeking summer, fall, or semester internships.
- **User Needs:** Quick data entry, immediate visual overview of applications status, easy filtering by company/status, accessible on both desktop laptops and smartphones.

---

## 2. Core Features & Functional Requirements

| Feature | Description | Interaction / Technical Requirement |
| :--- | :--- | :--- |
| **1. Summary Dashboard** | Displays live metric counters for Total Applications, Under Review, Interviews, Offers, and Rejections. | Dynamically calculated from the in-memory array of applications. |
| **2. Application List / View** | Displays all tracked applications in a structured format (responsive table on desktop, card layout on mobile). | Rendered dynamically via JavaScript DOM manipulation. |
| **3. Add Application Form** | Form (modal or dedicated section) to record a new internship application. | Native HTML5 browser validation + JS validation; prevents empty/invalid submissions. |
| **4. Edit Application** | Allows modifying an existing application's status, notes, date, or other details. | Re-populates form, validates, and updates record in-place. |
| **5. Delete Application** | Allows removing an application with user confirmation. | Updates array, recalculates stats, and re-renders view. |
| **6. Search Bar** | Real-time text search filtering by Company Name or Job Title. | Triggers on `input` or `keyup` event without page reload. |
| **7. Status Filter** | Dropdown filter to view applications by status (`All`, `Applied`, `Under Review`, `Interview`, `Offered`, `Rejected`). | Asynchronous-style DOM filtering based on selected value. |
| **8. Empty & Error States** | Informative feedback when no records match a search/filter, or when the tracker is empty. | Displays clean user-friendly empty state message. |

---

## 3. Data Model & Field Specifications

Each internship application is represented as an object:

| Field Name | Data Type | HTML Input Type | Required? | Validation / Constraints | Example |
| :--- | :--- | :--- | :--- | :--- | :--- |
| `id` | `String` / `Number` | Hidden / Generated | Yes | Unique timestamp or incremental ID | `1700000001` |
| `company` | `String` | `text` | Yes | 2–50 characters, trimmed, non-empty | `"Systems Limited"` |
| `position` | `String` | `text` | Yes | 2–50 characters, trimmed, non-empty | `"Software Engineering Intern"` |
| `location` | `String` | `text` | Yes | City or format (e.g., "Islamabad (Hybrid)") | `"Islamabad (Hybrid)"` |
| `applicationDate`| `String` (ISO) | `date` | Yes | Valid date (YYYY-MM-DD), not in distant future | `"2026-11-01"` |
| `status` | `String` (Enum) | `select` | Yes | One of: `Applied`, `Under Review`, `Interview`, `Offered`, `Rejected` | `"Interview"` |
| `jobUrl` | `String` | `url` | No | Valid URL format if provided | `"https://careers.systemsltd.com"` |
| `notes` | `String` | `textarea` | No | Max 300 characters, optional contextual details | `"First technical round scheduled for Tuesday."` |

---

## 4. Status Progression Pipeline

Applications transition through the following pipeline:
1. **Applied:** Application submitted; awaiting initial recruiter acknowledgement.
2. **Under Review:** Application screened or automated assessment sent.
3. **Interview:** Phone screen, technical interview, or HR round scheduled.
4. **Offered:** Official internship offer received.
5. **Rejected:** Application closed or candidate not selected.

---

## 5. Sample Dataset (6 Pre-loaded Records)

The application initializes with at least six realistic sample records to fulfill Assignment 1 criteria:

```javascript
[
  {
    id: 1,
    company: "Systems Limited",
    position: "Software Engineering Intern",
    location: "Islamabad (Hybrid)",
    applicationDate: "2026-11-01",
    status: "Interview",
    jobUrl: "https://systemsltd.com/careers",
    notes: "First round technical interview scheduled for Tuesday at 11:00 AM."
  },
  {
    id: 2,
    company: "Techlogix",
    position: "Full Stack Intern",
    location: "Lahore (Onsite)",
    applicationDate: "2026-11-03",
    status: "Applied",
    jobUrl: "https://techlogix.com/careers",
    notes: "Applied through university career fair portal. Awaiting response."
  },
  {
    id: 3,
    company: "Arbisoft",
    position: "Python / Web Intern",
    location: "Lahore (Remote)",
    applicationDate: "2026-10-28",
    status: "Under Review",
    jobUrl: "https://arbisoft.com/careers",
    notes: "Completed online algorithmic screening test (passed 4/4 test cases)."
  },
  {
    id: 4,
    company: "Contour Software",
    position: "QA Automation Intern",
    location: "Karachi (Hybrid)",
    applicationDate: "2026-10-25",
    status: "Offered",
    jobUrl: "https://contour-software.com/careers",
    notes: "Offer letter received via email. 8-week duration, stipend PKRs confirmed."
  },
  {
    id: 5,
    company: "NetSol Technologies",
    position: "Frontend Intern",
    location: "Lahore (Onsite)",
    applicationDate: "2026-10-20",
    status: "Rejected",
    jobUrl: "https://netsoltech.com/careers",
    notes: "Position filled internally by co-op returnee."
  },
  {
    id: 6,
    company: "Afiniti",
    position: "Data Science / ML Intern",
    location: "Islamabad (Remote)",
    applicationDate: "2026-11-08",
    status: "Applied",
    jobUrl: "https://afiniti.com/careers",
    notes: "Submitted CV and portfolio link via employee referral."
  }
]
```

---

## 6. Input Validation & Error Handling Rules

1. **Company Name & Position:**
   - Mandatory field (`required`).
   - Length between 2 and 50 characters.
   - Trimming whitespace to avoid empty whitespace submissions.
2. **Date:**
   - Mandatory field.
   - Must be a valid calendar date formatted as `YYYY-MM-DD`.
3. **Status:**
   - Must match one of the predefined options (`Applied`, `Under Review`, `Interview`, `Offered`, `Rejected`).
4. **URL:**
   - Optional, but if entered, must adhere to URL schema (`https://...` or `http://...`).
5. **Client Feedback:**
   - Clear visual error messaging directly below offending input fields.
   - Form submission intercepted via `event.preventDefault()` to validate before persisting to the array.
