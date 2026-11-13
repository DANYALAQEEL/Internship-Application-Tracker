# Internship Application Tracker

**CS 344 — Web Engineering · Assignment 1: Client-Side Web Application**

A responsive, single-page web application that helps a university student record and track internship applications. It is built with semantic HTML5, CSS3 and vanilla JavaScript only, runs entirely in the browser, and needs no backend, build step or installation.

| | |
| :--- | :--- |
| **Assigned idea** | #11 — Internship Application Tracker (from the Assignment 1–3 idea bank) |
| **Individual rule / data variant** | No additional individual rule or data variant has been assigned to me as of the date of submission. |
| **Author** | DANYAL AQEEL |
| **Roll Number** | 503823 |
| **Repository** | [https://github.com/DANYALAQEEL/Internship-Application-Tracker](https://github.com/DANYALAQEEL/Internship-Application-Tracker) |
| **Live URL** | [https://danyalaqeel.github.io/Internship-Application-Tracker/](https://danyalaqeel.github.io/Internship-Application-Tracker/) |

---

## Table of Contents

1. [Problem Being Addressed](#1-problem-being-addressed)
2. [Main Features](#2-main-features)
3. [Technologies Used](#3-technologies-used)
4. [Project Structure](#4-project-structure)
5. [Documentation](#5-documentation)
6. [Requirements](#6-requirements)
7. [Running the Application Locally](#7-running-the-application-locally)
8. [How to Use the Application](#8-how-to-use-the-application)
9. [Data and Persistence Limitations](#9-data-and-persistence-limitations)
10. [Responsive Design](#10-responsive-design)
11. [Accessibility Considerations](#11-accessibility-considerations)
12. [Screenshots](#12-screenshots)
13. [Assignment Scope and Future Development](#13-assignment-scope-and-future-development)
14. [AI Assistance Disclosure](#14-ai-assistance-disclosure)
15. [References and Attributions](#15-references-and-attributions)

---

## 1. Problem Being Addressed

Students often apply to many internships at once, through job boards, company career pages, career fairs and referrals. Details end up scattered across spreadsheets, bookmarks and e-mails, which makes it hard to see how many applications are at each stage, to find a particular one, or to keep statuses up to date.

This application gives the student one page where they can record each application, keep its status current, search and filter the list, and see summary counts. See [`docs/design-note.md`](docs/design-note.md) for the user, problem and WDLC discussion.

---

## 2. Main Features

- **Dashboard metrics** — five live counters: *Total Applied*, *Under Review*, *Interviewing*, *Offers Received* and *Rejected*, recalculated after every add, edit or delete. They always reflect all records, regardless of any active search or filter.
- **Application list** — shows company, job position, location, applied date, a colour-coded status pill, and *Edit* / *Delete* buttons. It is a table on tablet and desktop and stacked cards on mobile.
- **Add application** — a validated form in a modal dialog.
- **Edit application** — the same dialog, pre-filled with the record's values.
- **Delete application** — with a browser confirmation prompt.
- **Search** — as-you-type, case-insensitive search of company name and job position.
- **Status filter** — *All Statuses, Applied, Under Review, Interview, Offered, Rejected*; combines with the search.
- **Form validation** — the browser's built-in validation (`required`, length limits, URL and date types) plus custom rules, with messages shown under the relevant field.
- **Feedback and empty states** — a short success/deletion banner and a "No applications found" message with a *Clear Filters* button.
- **Six sample records** loaded at start-up (see [§8.8](#88-sample-data)).

Not included: login, saving between visits, sorting, reminders/calendar, or any server functionality. Navigation provides smooth in-page scrolling to `#dashboard` and `#applications` with active tab tracking; unused placeholder routes (Reports, Profile) were removed to avoid dead links.

---

## 3. Technologies Used

| Technology | Use in this project |
| :--- | :--- |
| **HTML5** | Semantic structure (`<aside>`, `<nav>`, `<main>`, `<header>`, `<section>`, `<table>`, native `<dialog>`), labelled form controls and input types |
| **CSS3** | Custom properties (design tokens), Grid (desktop page shell, dashboard cards), Flexbox (top bar, toolbar, cards, dialog), media queries, `:focus-visible`, `::backdrop`, transitions and a short fade animation; system font stack |
| **JavaScript (ES6+)** | In-memory data array, DOM creation and updates, event listeners, array methods, HTML5 constraint-validation API, the native dialog API |

No frameworks, libraries, CSS frameworks, package manager, build tools, external fonts, icon sets or images are used. Icons are Unicode characters written as HTML entities.

---

## 4. Project Structure

```text
Internship-Application-Tracker/
├── assignment-1/
│   ├── index.html          # Page structure, dashboard, table, and Add/Edit dialog
│   ├── css/
│   │   └── style.css       # All styling and responsive rules
│   ├── js/
│   │   └── app.js          # Data, rendering, search/filter, validation, dialog logic
│   └── assets/             # Placeholder folder (currently empty); not referenced by the code
├── docs/
│   ├── PROJECT_BRIEF.md    # Requirements, data model, sample dataset, validation rules
│   ├── wireframe.md        # Interface layouts and component specification
│   ├── design-note.md      # User/problem, WDLC stages, client vs server, responsiveness
│   ├── CSS_AUDIT.md        # CSS quality and accessibility audit
│   └── screenshots/        # Visual evidence and layout screenshots (see §12)
└── README.md
```

---

## 5. Documentation

| Document | Contents |
| :--- | :--- |
| [`docs/PROJECT_BRIEF.md`](docs/PROJECT_BRIEF.md) | Problem statement, features, data model, sample records |
| [`docs/wireframe.md`](docs/wireframe.md) | Desktop, tablet, mobile and dialog layouts, as implemented |
| [`docs/design-note.md`](docs/design-note.md) | User and problem, WDLC stages, client-side vs server-side, responsive strategy |
| [`docs/CSS_AUDIT.md`](docs/CSS_AUDIT.md) | Layout, contrast and accessibility audit of the stylesheet |

---

## 6. Requirements

- A current desktop or mobile web browser with support for the HTML `<dialog>` element, CSS Grid and Flexbox. Development and checking were done in **Chromium**; other browsers have **not** been tested.
- JavaScript must be enabled (the list and dashboard are generated by JavaScript).
- No internet connection is needed. There is nothing to install, no package manager, and no server.

---

## 7. Running the Application Locally

The application is a set of static files. It does not use modules, `fetch` or any server feature, so it works when opened straight from disk.

1. Get the project files (clone the repository or download it as a ZIP and extract it).
2. Open the `assignment-1` folder.
3. Double-click **`index.html`**, or right-click it and choose *Open with* → your browser. Alternatively, drag `index.html` into an open browser window.

The page loads `css/style.css` and `js/app.js` using relative paths, so keep the `assignment-1/css/` and `assignment-1/js/` folders next to `index.html`.

If you prefer to serve the folder with a static file server of your own choice, that also works, but it is not required.

**Troubleshooting:** if the page shows an empty table with no dashboard numbers, JavaScript is disabled or `js/app.js` was not found next to `index.html`.

---

## 8. How to Use the Application

### 8.1 View the dashboard metrics

The five cards at the top of the page show the number of applications overall and in each of these states: **Under Review**, **Interviewing**, **Offers Received** and **Rejected**. (A fifth status, *Applied*, has no card of its own but is included in *Total Applied*.) The numbers change immediately whenever a record is added, edited or deleted.

### 8.2 Add an application

1. Select **+ Add Application**.
2. Fill in the form (required fields are marked with a red `*`).
3. Select **Save Application**. The dialog closes, the new record appears in the list, the counters update and a green confirmation banner appears.

Select **Cancel**, the **×** button or press **Esc** to close the dialog without saving.

### 8.3 Edit an application

1. Select **Edit** on a record. The dialog opens with the current values.
2. Change any field and select **Save Changes**.
3. The record is updated in place (its internal `id` stays the same) and the counters refresh.

### 8.4 Delete an application

1. Select **Delete** on a record.
2. Confirm in the browser prompt. Choosing *Cancel* keeps the record.
3. After confirmation, the record is removed, the counters update and a red banner appears.

### 8.5 Search applications

Type in the **Search by company or position…** box. The list narrows as you type; matching is case-insensitive and applies to the company name and job position only.

### 8.6 Filter by status

Use the **Filter by** drop-down. Choose a status to show only matching records, or *All Statuses* to show everything. The filter works together with the search box. If nothing matches, a "No applications found" message appears; **Clear Filters** resets both controls.

### 8.7 Understand form validation

| Field | Required | Rules |
| :--- | :-: | :--- |
| Company Name | Yes | 2–50 characters (leading/trailing spaces are ignored) |
| Job Position | Yes | 2–50 characters (leading/trailing spaces are ignored) |
| Location | Yes | Not empty; at most 50 characters |
| Application Date | Yes | A real calendar date, **no later than 30 days after today** (the date picker's maximum is set from your computer's date when the page loads). There is no earliest date. |
| Status | Yes | One of *Applied, Under Review, Interview, Offered, Rejected* |
| Job Posting URL | No | If provided, must be a valid URL starting with **`http://` or `https://`** (other schemes such as `ftp:` are rejected) |
| Notes & Follow-ups | No | Up to 300 characters; a counter shows how many you have used |

How errors appear:

- Pressing **Save** with invalid data keeps the dialog open, shows a red message **under each invalid field**, and moves the keyboard focus to the first invalid field.
- Messages update or disappear as you correct the field.
- The form uses the browser's built-in validation together with JavaScript rules for things HTML attributes cannot express (such as text consisting only of spaces, or `http`/`https`-only URLs). The browser's own pop-up tooltip is suppressed for these fields so that the inline messages are shown instead.

> These validation checks run in the browser only. They improve usability but are not a security measure.

### 8.8 Sample data

The application starts with six sample records. They are illustrative examples, not real application outcomes.

| Company | Position | Location | Date | Status |
| :--- | :--- | :--- | :--- | :--- |
| Systems Limited | Software Engineering Intern | Islamabad (Hybrid) | 2026-11-01 | Interview |
| Techlogix | Full Stack Intern | Lahore (Onsite) | 2026-11-03 | Applied |
| Arbisoft | Python / Web Intern | Lahore (Remote) | 2026-10-28 | Under Review |
| Contour Software | QA Automation Intern | Karachi (Hybrid) | 2026-10-25 | Offered |
| NetSol Technologies | Frontend Intern | Lahore (Onsite) | 2026-10-20 | Rejected |
| Afiniti | Data Science / ML Intern | Islamabad (Remote) | 2026-11-08 | Applied |

Initial dashboard values: Total 6, Under Review 1, Interviewing 1, Offers 1, Rejected 1. Each record also stores a job posting URL and notes; these are visible only in the **Edit** dialog, not in the list.

---

## 9. Data and Persistence Limitations

- **Data is held in memory only.** The records live in a JavaScript array while the page is open.
- **Nothing is saved.** Refreshing or closing the page discards every addition, edit and deletion and restores the six sample records. The application does not use `localStorage`, `sessionStorage`, cookies, a file or a database.
- Each browser tab has its own separate copy of the data; there is no sharing or synchronisation.
- There are no user accounts or access control. Anyone who opens the page sees and can change the sample data.
- Do not enter private or sensitive information; it is not stored anywhere, but this is a prototype.
- Because validation happens only in the browser, a user could bypass it using developer tools. Server-side validation is outside the scope of this assignment.

---

## 10. Responsive Design

The CSS is mobile-first, with two breakpoints (`min-width: 768px` and `min-width: 1024px`) and one `max-width: 767px` block for the card layout of the records.

| Width | Navigation | Dashboard | Records | Toolbar |
| :--- | :--- | :--- | :--- | :--- |
| **< 768 px** (mobile) | Compact top bar with a horizontally scrollable link row | 2 columns (fifth card spans both) | Stacked labelled **cards** | Search and filter stacked, full width |
| **768 – 1023 px** (tablet) | Compact top bar | 3 columns (3 + 2) | Standard **table** in a horizontally scrollable container | Search and filter side by side |
| **≥ 1024 px** (desktop) | Persistent 240 px sidebar (CSS Grid layout) with user badge | 5 columns | Standard table | Search and filter side by side |

The Add/Edit dialog is centred, up to 540 px wide, and scrolls internally on short screens. Layout was checked at 375, 768, 1024 and 1440 px in Chromium, and the page was measured for horizontal overflow at widths from 320 px to 1440 px (none found). In narrow dashboard cards (for example around 1024 px) the icon badge wraps below the label instead of overlapping it. Details: [`docs/design-note.md`](docs/design-note.md) §4 and [`docs/wireframe.md`](docs/wireframe.md).

---

## 11. Accessibility Considerations

Implemented:

- Semantic landmarks, a single page heading, document language, and labelled form controls with appropriate input types.
- A table caption (visually hidden) and column headers; on mobile each card row is labelled with its column name.
- A native modal `<dialog>` with an accessible name, keyboard-operable close/cancel buttons and Esc to close.
- Inline validation messages linked to their fields (`aria-describedby`, `aria-invalid`) and focus moved to the first invalid field.
- A polite live region for success and deletion messages.
- A visible keyboard focus indicator; status shown as text, not colour alone.
- WCAG 2.2 AA compliant subtle text contrast: Secondary text, placeholders, and character counter use `#64748b` on white (4.61 : 1 contrast ratio, exceeding 4.5 : 1).
- Touch-friendly action buttons: *Edit* and *Delete* buttons have enlarged touch targets (`36px` min-height with `8px 14px` padding).
- Automatic dialog focus: Opening the modal dialog automatically places keyboard focus onto Company Name.
- Dynamic empty states: Differentiates between zero search/filter results and an entirely empty tracker.

Known limitations (see [`docs/CSS_AUDIT.md`](docs/CSS_AUDIT.md) and [`docs/wireframe.md`](docs/wireframe.md) §9):

- While action buttons are enlarged to 36 px min-height for comfortable touch use, they remain below the strict 44 px mobile guideline.
- Delete confirmation uses the browser's native `confirm()` prompt.
- Navigation links smoothly scroll to actual page sections (`#dashboard`, `#applications`) with active state tracking.
- No screen-reader testing, cross-browser testing or complete accessibility audit has been done, so **full WCAG 2.2 AA conformance is not claimed**.

---

## 12. Screenshots

The screenshots below were captured from the fully interactive working application running in Chromium and are stored in [`docs/screenshots/`](docs/screenshots/).

| Viewport / View | Screenshot Link | Description |
| :--- | :--- | :--- |
| **Large Desktop — 1440 px** | [`docs/screenshots/desktop-1440.png`](docs/screenshots/desktop-1440.png) | Two-column CSS Grid shell, 240 px persistent sidebar, five-metric dashboard cards row, and full interactive records table. |
| **Small Desktop — 1024 px** | [`docs/screenshots/desktop-1024.png`](docs/screenshots/desktop-1024.png) | Two-column layout at the desktop breakpoint; all five dashboard cards and the *Add Application* button fit without horizontal page scrolling, and the records table scrolls inside its own container. |
| **Tablet — 768 px** | [`docs/screenshots/tablet-768.png`](docs/screenshots/tablet-768.png) | Compact navigation bar, 3-column dashboard statistics grid, and horizontally scrollable table container. |
| **Mobile — 375 px** | [`docs/screenshots/mobile-375.png`](docs/screenshots/mobile-375.png) | Mobile single-column view with 2-column statistics (5th card spanning full width) and records converted to stacked cards via `data-label`. |
| **Add / Edit Modal Dialog** | [`docs/screenshots/dialog-add.png`](docs/screenshots/dialog-add.png) | Native HTML5 `<dialog>` opened in modal mode with backdrop overlay and form inputs. |
| **Inline Validation States** | [`docs/screenshots/dialog-validation.png`](docs/screenshots/dialog-validation.png) | Inline red validation error messages displayed under invalid form fields with automatic first-field focus. |

---

## 13. Assignment Scope and Future Development

**In scope (Assignment 1):** semantic HTML, CSS (selectors, box model, Grid/Flexbox, at least two breakpoints), JavaScript (variables, functions, arrays, conditionals, DOM events), a form with browser validation, at least two meaningful interactions (here: search, status filtering, add/edit/delete with live counters), empty and invalid-input handling, six sample records, a wireframe and a design note — all working without a backend.

**Planned later stages** (from the course assignment brief; **none are implemented here**):

| Assignment | Planned focus |
| :--- | :--- |
| Assignment 2 | PHP with PDO and a database, a JSON endpoint used with Fetch/async-await, server-side validation, output encoding, session ownership and CSRF protection |
| Assignment 3 | React interface, Express REST API, MongoDB, authentication and ownership/role checks, plus a new feature and tests |

---

## 14. AI Assistance Disclosure

Generative AI assistance was used strictly in a supportive, consultative capacity during the development of this project, in accordance with course guidelines:

- **Conceptual & Syntax Clarification:** Consulted occasionally for syntax queries and advice on browser API behavior, specifically regarding how to cleanly suppress native browser form validation popups during the `invalid` event in order to display custom, accessible inline error messages.
- **Review & Proofreading:** Consulted as a sounding board to double-check edge-case testing ideas (such as empty search strings and future date boundaries) and proofread documentation drafts for clarity.
- **Student Authorship:** All HTML semantic markup, CSS stylesheets and responsive layout rules, JavaScript application architecture, DOM event manipulation, in-memory data structures, and documentation were written, integrated, and verified directly by the author.

**Student Declaration:**
The author (DANYAL AQEEL) understands all architectural decisions, styling rules, and JavaScript logic implemented in this repository, and is fully prepared to explain, defend, and modify all submitted code.

---

## 15. References and Attributions

- Requirements: *CS 344 Web Engineering — Assignments 1–3, Fall 2026* (course assignment brief), idea #11.
- No third-party code, libraries, frameworks, fonts, images or icons are used. Icons are Unicode characters inserted as HTML entities; text uses the user's system font stack.
- Company names in the sample records are used only as realistic examples; no affiliation or real application data is implied.
- No external code, libraries, or tutorials were consulted or reused; all application implementation was developed specifically for this assignment.
