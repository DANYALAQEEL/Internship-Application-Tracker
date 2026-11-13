# Design Note: Internship Application Tracker

| | |
| :--- | :--- |
| **Course** | CS 344 — Web Engineering |
| **Stage** | Assignment 1 — Client-Side Web Application |
| **Assigned idea** | #11 — Internship Application Tracker |
| **Technology** | Semantic HTML5, CSS3 (Custom Properties, Grid, Flexbox, media queries), Vanilla JavaScript (ES6+) |
| **Related documents** | [`PROJECT_BRIEF.md`](PROJECT_BRIEF.md), [`wireframe.md`](wireframe.md), [`CSS_AUDIT.md`](CSS_AUDIT.md) |

This note names the user and the problem, explains the Web Development Life Cycle (WDLC) stages as applied to this project, and explains what runs in the browser (client) versus on a server. Where a statement describes the finished application it is based on the submitted `index.html`, `style.css` and `app.js`.

---

## 1. User Problem & Intended Solution

### 1.1 The user

The primary user is a **university student** who applies for several internships at the same time through job boards, company career pages, career fairs and referrals.

### 1.2 The problem

Application details usually end up scattered across spreadsheets, bookmarks, e-mails and memory. A student then finds it hard to:

- see at a glance how many applications are at each stage;
- find a particular company or role quickly;
- keep the status of each application up to date;
- recall the role, location, date, posting link or notes for a given application when asked.

### 1.3 Intended solution (what the application actually does)

The tracker gives the student one page in which they can manage a list of internship applications. The **core workflow** is:

1. **See** the current state of the search in five dashboard counters: *Total Applied*, *Under Review*, *Interviewing*, *Offers Received* and *Rejected*.
2. **Add** an application through a validated form (company, position, location, application date, status, and optionally a job posting URL and notes).
3. **Edit** an existing application in the same form.
4. **Delete** an application after a browser confirmation prompt.
5. **Search** by company name or position, and **filter** by status. Both can be applied together.
6. **Receive feedback**: inline validation messages, a short success/deletion banner, and an empty-state message when nothing matches.

The five statuses are `Applied`, `Under Review`, `Interview`, `Offered` and `Rejected`. The application starts with six sample records (see §3.4).

### 1.4 What the application does *not* do

To avoid ambiguity, the following are **not** part of Assignment 1: user accounts or login, saving data between visits, a server or database, reminders or calendar features, sorting, importing/exporting data, or editing from anywhere other than the Add/Edit dialog. Navigation provides direct, smooth in-page scrolling to `#dashboard` and `#applications`; unused placeholder routes were removed to eliminate dead links (see [`wireframe.md`](wireframe.md) §6).

---

## 2. Web Development Life Cycle (WDLC) Stages

The project follows six stages. The stage names below are used consistently in this document. (The exact stage model used in the course lectures was not available when this note was written; the stages here follow a standard WDLC sequence.)

```text
1. Planning &      2. Design       3. Implementation     4. Testing        5. Evaluation     6. Deployment &
   Analysis    -->               -->                 -->               -->  & Review    -->   Maintenance
```

### Stage 1 — Planning & Analysis
- Identified the user (internship-seeking student) and the problem (§1).
- Defined the core workflow, the eight data fields per record, the five statuses and the validation rules in [`PROJECT_BRIEF.md`](PROJECT_BRIEF.md).
- Set constraints from the assignment: semantic HTML, CSS and vanilla JavaScript only; no framework, no backend; at least six sample records; at least two media-query breakpoints; browser form validation; handling of empty and invalid input.

### Stage 2 — Design
- Produced layout descriptions for mobile, tablet and desktop, and for the Add/Edit dialog ([`wireframe.md`](wireframe.md)).
- Chose a small set of CSS custom properties (colours, spacing, radii, shadows, one system-font stack) so the visual style is defined in one place.
- Defined the record structure as a JavaScript object with the fields `id`, `company`, `position`, `location`, `applicationDate`, `status`, `jobUrl` and `notes`.
- Chose a table on wider screens that becomes stacked cards on narrow screens.

### Stage 3 — Implementation
- **HTML:** landmarks (`<aside>`, `<nav>`, `<main>`, `<header>`, `<section>`), a data `<table>` with caption and `scope` headers, and a native `<dialog>` containing a `<form>` with labelled controls and `required`, `minlength`, `maxlength`, `type="date"`, `type="url"` and `<select>` constraints.
- **CSS:** custom properties; Grid for the desktop page shell and the dashboard cards; Flexbox for the top bar, toolbar, cards and dialog; media queries at 768 px and 1024 px; a `data-label` technique that turns table rows into labelled cards on narrow screens.
- **JavaScript (`app.js`):** an in-memory array of records; functions for rendering, filtering, statistics, validation and the dialog; event listeners for button clicks, input and change events, and form validation events; array methods (`filter`, `find`, `findIndex`, `reduce`, `forEach`, `map`); conditionals for empty and invalid states. Table rows are built with `createElement` and `textContent`, not `innerHTML`.

### Stage 4 — Testing
What was done:
- Layout was checked at four viewport widths (375, 768, 1024 and 1440 px) in headless Chromium during the CSS audit ([`CSS_AUDIT.md`](CSS_AUDIT.md)). That audit was performed *before* the JavaScript was written, so it covers layout, not behaviour. After the JavaScript was integrated, the page was measured for horizontal overflow at widths from 320 px to 1440 px; an overflow found between 1024 px and about 1145 px was corrected (see the addendum in `CSS_AUDIT.md`).
- After a form-validation correction (native browser validation was preventing the custom inline error messages from showing), the Add, Edit, Delete, search, filter and validation workflows were exercised in Chromium with scripted browser interactions, including clicking *Save* with an empty form, too-short text, invalid URLs, an out-of-range date, whitespace-only input and a successful add and edit. These scripts are not part of the repository.

What was **not** done: testing in Firefox or Safari, testing on physical phones or tablets, testing with a screen reader, and a formal automated test suite.

### Stage 5 — Evaluation & Review
- [`CSS_AUDIT.md`](CSS_AUDIT.md) reviews the stylesheet for layout, responsiveness and accessibility. Its contrast and touch-target findings were fixed afterwards: secondary text, placeholders and the character counter now use `#64748b` (4.61 : 1 on white, meeting the 4.5 : 1 guideline), and the Edit/Delete buttons have a 36 px minimum height. They are still below the stricter 44 px touch-target guideline, which remains a known limitation.
- This is a **partial** review. The project does not claim full WCAG 2.2 AA conformance.

### Stage 6 — Deployment & Maintenance
- For Assignment 1 the application is delivered as static files in a GitHub repository and can be run by opening `assignment-1/index.html` in a browser (see the README). It is also deployed to GitHub Pages by the workflow in `.github/workflows/deploy.yml`, which publishes the `assignment-1` folder; the live URL is given in the README.
- Maintenance is planned as a progression through the later assignments (§3.3). The separation of rendering, state, validation and event wiring in `app.js` is intended to make that migration easier, but no later-stage functionality exists in this submission.

---

## 3. Why the Application is Initially Client-Side

### 3.1 Client-side versus server-side

| | **Client-side (browser)** | **Server-side** |
| :--- | :--- | :--- |
| **Where code runs** | In the user's browser | On a web server |
| **Typical tasks** | Drawing the interface, reacting to clicks and typing, checking form input before it is sent, updating the page without reloading | Storing data in a database, checking input again, controlling who may see or change data, producing JSON/HTML responses |
| **Languages in this course** | HTML, CSS, JavaScript (Assignment 1) | PHP and a database (Assignment 2); Node/Express and MongoDB (Assignment 3) |
| **Trust level** | The user can inspect and change anything in their own browser, so it cannot be trusted for security | Can enforce rules the user cannot bypass |

### 3.2 What runs where in this project

In Assignment 1 **everything runs in the browser**: rendering, searching, filtering, statistics, form validation, and the stored records. No code is executed on a server and the page makes **no network requests for data** (`app.js` does not use `fetch`, `XMLHttpRequest`, `localStorage` or `sessionStorage`). If the files are hosted, a web server's only role is to deliver the static HTML, CSS and JavaScript files; if the file is opened directly from disk, no server is involved at all.

Because validation happens only in the browser, it is a usability aid (fast, specific feedback) and **not** a security control. Server-side validation is introduced in Assignment 2.

### 3.3 Why in-memory JavaScript data is used

- The assignment requires the application to work **without a backend** and to focus on Weeks 1–5 content: HTML/forms, CSS/responsive design, JavaScript fundamentals, and the DOM and events.
- Holding the records in one JavaScript array (`applications`, copied from the constant `initialApplications` when the page loads) keeps the **data layer** (an array of objects) separate from the **view layer** (the HTML/CSS and the functions that render it). Every Add, Edit or Delete changes the array and then re-renders the table and counters.
- The same record structure can later be stored by a database without redesigning the interface.

**Consequences, stated plainly:**
- **Data is not saved.** Reloading or closing the page restores the six sample records; anything added, edited or deleted is lost.
- There is **no guaranteed offline or cross-visit persistence**, no synchronisation between tabs or devices, and no user accounts.
- Because the page works from local files, it can be *opened* without a connection, but nothing the user enters is retained.

### 3.4 The six sample records

The application starts with these six records (identical to [`PROJECT_BRIEF.md`](PROJECT_BRIEF.md) §5 and to `initialApplications` in `app.js`). They are illustrative sample data, not real application results.

| # | Company | Position | Location | Date | Status |
| :-: | :--- | :--- | :--- | :--- | :--- |
| 1 | Systems Limited | Software Engineering Intern | Islamabad (Hybrid) | 2026-11-01 | Interview |
| 2 | Techlogix | Full Stack Intern | Lahore (Onsite) | 2026-11-03 | Applied |
| 3 | Arbisoft | Python / Web Intern | Lahore (Remote) | 2026-10-28 | Under Review |
| 4 | Contour Software | QA Automation Intern | Karachi (Hybrid) | 2026-10-25 | Offered |
| 5 | NetSol Technologies | Frontend Intern | Lahore (Onsite) | 2026-10-20 | Rejected |
| 6 | Afiniti | Data Science / ML Intern | Islamabad (Remote) | 2026-11-08 | Applied |

Resulting dashboard counters at start-up: Total 6, Under Review 1, Interviewing 1, Offers 1, Rejected 1. (Two records have the status *Applied*; there is no separate "Applied" counter.)

### 3.5 Planned progression (not implemented in Assignment 1)

The assignment sequence keeps the same application idea across three stages:

| Stage | Planned technology (per the course assignment brief) | Status in this submission |
| :--- | :--- | :--- |
| **Assignment 1** | Client-side HTML, CSS, JavaScript with in-memory data | **Implemented** |
| **Assignment 2** | PHP with PDO and a SQLite/MySQL database, JSON endpoint called with Fetch/async-await, server-side validation, output encoding, session ownership and CSRF protection | Not implemented |
| **Assignment 3** | React interface, Express REST API, MongoDB, authentication and role/ownership checks | Not implemented |

---

## 4. Responsive Adaptation Strategy

The stylesheet is written **mobile-first**: the base rules describe the narrow layout and two `min-width` media queries add the tablet and desktop layouts. One extra `max-width: 767px` block holds the rules that turn table rows into cards. The breakpoints are therefore **768 px** and **1024 px**.

| Viewport width | Layout as implemented in `style.css` |
| :--- | :--- |
| **Below 768 px** (mobile) | Single column. The sidebar becomes a compact top bar with the brand and a horizontally scrollable row of navigation links; the user badge is hidden. The page header stacks (title above the *Add Application* button). The dashboard is a **2-column grid**; the fifth card (Rejected) spans both columns. Search and filter stack at full width. The table is converted to **stacked cards**: each record is a bordered card whose rows are labelled using each cell's `data-label` (Company, Job Position, Location, Applied Date, Status, Actions); the header row is moved off-screen. In the dialog, *Application Date* and *Status* stack. |
| **768 px – 1023 px** (tablet) | The top bar remains. The page header becomes a row (title left, button right). The dashboard becomes a **3-column grid** (three cards in the first row, two in the second). Search (up to 360 px wide) and the filter select (180 px) sit side by side. The records return to a standard **table** inside a horizontally scrollable container. In the dialog, *Application Date* and *Status* sit side by side. |
| **1024 px and wider** (desktop) | The page shell becomes a **CSS Grid of two columns** (`240px 1fr`). The sidebar is a sticky, full-height vertical panel with the brand, a vertical navigation list and the user badge. The main area uses the remaining width with larger padding. The dashboard becomes a **5-column grid**, one card per metric. |

The *Add / Edit* dialog is a native `<dialog>` opened with `showModal()`. It is centred, is `100% − 32 px` wide up to a maximum of 540 px, scrolls inside itself when the screen is short (maximum height 90 vh), and uses a dimmed, slightly blurred backdrop.

**Limits of this strategy.** Between 1024 px and roughly 1200 px the five dashboard cards are narrow, so each card's icon badge wraps below its label (`flex-wrap`). The records table is wider than the main column at these widths and scrolls inside its own container. Action buttons (*Edit*, *Delete*) were enlarged to 36 px min-height with increased padding for comfortable touch targets. Layout was checked at 375, 768, 1024 and 1440 px in Chromium only.

---

## 5. Design Decisions and Known Limitations

| Topic | Decision / limitation |
| :--- | :--- |
| Notes and job URL | Both are collected and stored (and can be changed in the Edit dialog) but are **not displayed in the list or cards**. |
| Location | **Required** (up to 50 characters). |
| Application date | Must be a real calendar date and **no later than 30 days after today** (the date picker's `max` is set from the user's local date when the page loads). There is no earliest date. |
| Job posting URL | Optional. If entered, it must be a valid URL using **`http` or `https`** only. |
| Sidebar items | *Dashboard* and *Applications* link to the real in-page sections `#dashboard` and `#applications`; clicking one scrolls smoothly to it and updates the active link. Earlier placeholder links (Reports, Profile) were removed so there are no dead links. The user badge ("Student Portal / Applicant") is static text; there is no login. |
| Empty state | Two messages are used. If records exist but none match the search/filter, the page shows "No applications found" with a *Clear Filters* button. If every record has been deleted, it shows "No applications yet" with a prompt to add one, and the *Clear Filters* button is hidden. |
| Accessibility | Labelled controls, landmarks, a live region for notifications, focus styling and inline error messages linked to fields are implemented. Conformance with WCAG 2.2 AA is **not** claimed; see the limits in §2 (Stage 5). |
| Performance | No performance measurements were made, and none are claimed. |
