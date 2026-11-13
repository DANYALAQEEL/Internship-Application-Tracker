# Interface Wireframe & Layout Specification

| | |
| :--- | :--- |
| **Project** | Internship Application Tracker (Assignment 1) |
| **Document** | `docs/wireframe.md` |
| **Basis** | The implemented `index.html`, `css/style.css` and `js/app.js`. |
| **Layout model** | Mobile-first; CSS Grid and Flexbox |
| **Breakpoints** | `< 768px` mobile · `768px – 1023px` tablet · `≥ 1024px` desktop |

> **How to read this document.** The diagrams are simplified text sketches of what the application actually renders, not pixel-accurate mock-ups. Section 8 lists items from earlier design drafts that were **not** implemented, so that proposed and implemented elements are not confused.

---

## 1. Shared Interface Elements

These are the same at every width; only their arrangement changes.

| Element | Content as implemented |
| :--- | :--- |
| **Brand** | Briefcase icon (HTML entity) + "InternTrack" |
| **Navigation list** | Dashboard (marked active), Applications, Reports, Profile — see §6 for what these do |
| **User badge** (desktop only) | "ST" avatar, "Student Portal", "Applicant" — static text |
| **Page header** | Title "Internship Applications", subtitle "Track, organize, and monitor your career opportunities", and the **+ Add Application** button |
| **Feedback banner** | Hidden by default. After an add, edit or delete it shows a message for about 4 seconds (green for add/edit, red for delete). It is a polite live region. |
| **Dashboard metrics** | Five cards (§3) |
| **Toolbar** | Search box and status filter (§4) |
| **Records** | Table or cards (§5) |
| **Empty state** | Shown when the list to display is empty (§5.3) |
| **Add / Edit dialog** | Native modal dialog (§7) |

---

## 2. Page Layouts

### 2.1 Desktop (≥ 1024px)

Two-column CSS Grid: a 240 px sticky sidebar and the main workspace. The dashboard is a five-column grid.

```text
+------------------+-----------------------------------------------------------------------------+
| SIDEBAR (sticky) | MAIN                                                                        |
|                  |                                                                             |
| [icon] InternTrack|  Internship Applications                              [ + Add Application ] |
| ----------------- |  Track, organize, and monitor your career opportunities                     |
|  Dashboard (act.)|                                                                             |
|  Applications    |  (feedback banner appears here after add / edit / delete)                   |
|  Reports         |                                                                             |
|  Profile         |  +----------+ +----------+ +-----------+ +----------+ +----------+           |
|                  |  | Total    | | Under    | |Interviewing| | Offers   | | Rejected |           |
|                  |  | Applied  | | Review   | |            | | Received | |          |           |
|                  |  |   6      | |   1      | |    1       | |   1      | |   1      |           |
|                  |  +----------+ +----------+ +-----------+ +----------+ +----------+           |
|                  |                                                                             |
|                  |  [Q Search by company or position...]          Filter by: [All Statuses v] |
|                  |                                                                             |
|                  |  COMPANY        JOB POSITION       LOCATION     APPLIED DATE  STATUS ACTIONS|
|                  |  [S] Systems Ltd  Software Eng. Intern Islamabad (Hybrid) Nov 1, 2026 Interview [Edit][Delete]
|                  |  [T] Techlogix    Full Stack Intern    Lahore (Onsite)    Nov 3, 2026 Applied   [Edit][Delete]
|                  |  [A] Arbisoft     Python / Web Intern  Lahore (Remote)    Oct 28, 2026 Under Review [Edit][Delete]
|                  |  [C] Contour Soft. QA Automation Intern Karachi (Hybrid)  Oct 25, 2026 Offered  [Edit][Delete]
|                  |  [N] NetSol Tech.  Frontend Intern     Lahore (Onsite)    Oct 20, 2026 Rejected [Edit][Delete]
|                  |  [A] Afiniti       Data Science / ML   Islamabad (Remote) Nov 8, 2026  Applied  [Edit][Delete]
| [ST] Student     |                                                                             |
|      Portal      |                                                                             |
|      Applicant   |                                                                             |
+------------------+-----------------------------------------------------------------------------+
```

Notes:
- Rows are shown in the order they were added (not sorted). Dates are displayed as `Mon D, YYYY`.
- The search box is **inside the main area**, above the table. There is no search box in the page header.
- There is no "Showing X of Y" counter.

### 2.2 Tablet (768px – 1023px)

The sidebar is a compact top bar (brand + horizontally scrollable navigation links; no user badge). The page header is a row. The dashboard is a **three-column** grid (3 cards, then 2). The records are shown as a **table** inside a horizontally scrollable container.

```text
+--------------------------------------------------------------------------+
| [icon] InternTrack      Dashboard  Applications  Reports  Profile        |
+--------------------------------------------------------------------------+
| Internship Applications                               [ + Add Application ]|
| Track, organize, and monitor your career opportunities                    |
|                                                                          |
| +----------------+  +----------------+  +----------------+               |
| | Total Applied  |  | Under Review   |  | Interviewing   |               |
| |      6         |  |      1         |  |      1         |               |
| +----------------+  +----------------+  +----------------+               |
| +----------------+  +----------------+                                    |
| | Offers Received|  | Rejected       |                                    |
| |      1         |  |      1         |                                    |
| +----------------+  +----------------+                                    |
|                                                                          |
| [Q Search by company or position... ]        Filter by: [All Statuses v] |
|                                                                          |
| COMPANY | JOB POSITION | LOCATION | APPLIED DATE | STATUS | ACTIONS       |
| (table rows as on desktop; the container scrolls sideways if too narrow) |
+--------------------------------------------------------------------------+
```

### 2.3 Mobile (< 768px)

Single column. The top bar is as on tablet. The dashboard is a **two-column** grid; the fifth card spans both columns. Search and filter stack at full width. **Records are displayed as stacked cards, not as a table**: the table's header row is moved off-screen and each cell shows its column name (from `data-label`) beside its value.

```text
+----------------------------------------+
| [icon] InternTrack  Dashboard Applic.. |  <- nav row scrolls sideways
+----------------------------------------+
| Internship Applications                |
| Track, organize, and monitor your ...  |
| [ + Add Application ]                  |
|                                        |
| +--------------+ +--------------+      |
| | Total Applied| | Under Review |      |
| |      6       | |      1       |      |
| +--------------+ +--------------+      |
| +--------------+ +--------------+      |
| | Interviewing | | Offers Recvd |      |
| |      1       | |      1       |      |
| +--------------+ +--------------+      |
| +-----------------------------+        |
| | Rejected                1   |        |  <- spans both columns
| +-----------------------------+        |
|                                        |
| [Q Search by company or position... ]  |
| Filter by: [All Statuses            v] |
|                                        |
| +------------------------------------+ |
| | [S] Systems Limited                | |
| | JOB POSITION  Software Eng. Intern | |
| | LOCATION      Islamabad (Hybrid)   | |
| | APPLIED DATE  Nov 1, 2026          | |
| | STATUS        [Interview]          | |
| |                    [Edit] [Delete] | |
| +------------------------------------+ |
| +------------------------------------+ |
| | [T] Techlogix  ...  (same layout)  | |
| +------------------------------------+ |
+----------------------------------------+
```

Notes:
- The *Add Application* button stays in the page header (it scrolls with the page). There is **no** floating or sticky bottom button.
- Cards show Company, Job Position, Location, Applied Date, Status and the two action buttons. **Notes and the job URL are not shown on cards.**

---

## 3. Dashboard Metric Cards

Five cards, always calculated from **all** records (they do not change when a search or filter is active). They update immediately after an add, edit or delete.

| # | Label on screen | Counts records with status | Initial value |
| :-: | :--- | :--- | :-: |
| 1 | **Total Applied** | all records | 6 |
| 2 | **Under Review** | `Under Review` | 1 |
| 3 | **Interviewing** | `Interview` | 1 |
| 4 | **Offers Received** | `Offered` | 1 |
| 5 | **Rejected** | `Rejected` | 1 |

Each card has a text label, a large number and a coloured icon badge. In narrow cards (for example around 1024 px, or at 320 px) the icon badge wraps below the number instead of sitting to the right. Cards are grouped as 2 columns (mobile, with the fifth spanning two), 3 columns (tablet) or 5 columns (desktop).

---

## 4. Search and Filtering Controls

| Control | Behaviour |
| :--- | :--- |
| **Search** (`type="search"`) | Placeholder "Search by company or position…". The label is visually hidden but available to screen readers. Filters as the user types (`input` event). Case-insensitive; matches **company** or **position** text only (not location, notes or status). Leading/trailing spaces are ignored. |
| **Filter by** (`<select>`) | Options: *All Statuses, Applied, Under Review, Interview, Offered, Rejected*. Applies on change. |
| **Combination** | Search and status filter are applied together (both must match). |
| **Layout** | Stacked at full width on mobile; side by side from 768 px (search up to 360 px wide, select 180 px). |

There is **no** sort control.

---

## 5. Application Records

### 5.1 Record fields displayed

| Column / card row | Source field | Notes |
| :--- | :--- | :--- |
| Company | `company` | Shown with a square badge containing the first letter |
| Job Position | `position` | |
| Location | `location` | |
| Applied Date | `applicationDate` | Formatted `Mon D, YYYY` |
| Status | `status` | Coloured pill (see §5.2) |
| Actions | — | **Edit** and **Delete** buttons |

`jobUrl` and `notes` are stored with each record and appear in the Edit dialog, but are **not** displayed in the table or cards.

### 5.2 Status pills

| Status | Text colour | Background |
| :--- | :--- | :--- |
| Applied | Blue `#1d4ed8` | `#eff6ff` |
| Under Review | Amber `#b45309` | `#fffbeb` |
| Interview | Purple `#6d28d9` | `#f5f3ff` |
| Offered | Green `#047857` | `#ecfdf5` |
| Rejected | Red `#b91c1c` | `#fef2f2` |

The status name is always written as text inside the pill, so colour is not the only indicator.

### 5.3 Actions and empty state

- **Edit** opens the dialog pre-filled with the record's values.
- **Delete** opens the browser's confirmation prompt ("Are you sure you want to delete the application for "…" - …?"). Choosing *Cancel* keeps the record. Confirming removes it, updates the counters and shows a red banner.
- **Empty state** (shown when the list to display is empty): folder icon, heading "No applications found", text "No internship records match your current filter or search criteria.", and a **Clear Filters** button that resets the search box and the status filter. The same message appears if every record has been deleted.

---

## 6. Navigation (Placeholder Status)

The navigation list contains **Dashboard**, **Applications**, **Reports** and **Profile**. Each is a link to an in-page anchor (`#dashboard`, `#applications`, `#reports`, `#profile`) **for which no matching element exists**, and `app.js` has no navigation code. These items therefore do not switch views or scroll; "Dashboard" is simply styled as the current item. The application is effectively a single page. There are no Calendar or Settings items, and no Reports or Profile screens.

---

## 7. Add / Edit Dialog

A native `<dialog>` opened as a modal. It is the only form in the application. Title and submit button depend on the mode.

| Mode | Dialog title | Submit button |
| :--- | :--- | :--- |
| Add | New Application | Save Application |
| Edit | Edit Application | Save Changes |

```text
+---------------------------------------------------------+
|  New Application                                  [ × ] |
+---------------------------------------------------------+
|  Company Name *                                         |
|  [ e.g. Systems Limited                               ] |
|  (inline error text appears here)                       |
|                                                         |
|  Job Position *                                         |
|  [ e.g. Software Engineering Intern                   ] |
|                                                         |
|  Location *                                             |
|  [ e.g. Islamabad (Hybrid)                            ] |
|                                                         |
|  Application Date *               Status *              |
|  [ mm/dd/yyyy      ]              [ Select status    v] |   <- stacked on mobile
|                                                         |
|  Job Posting URL                                        |
|  [ https://company.com/careers/job                    ] |
|                                                         |
|  Notes & Follow-ups                                     |
|  [ e.g. Round 1 technical interview scheduled...      ] |
|                                          Max 300 chars  |
|  ------------------------------------------------------ |
|                          [ Cancel ]  [ Save Application ]|
+---------------------------------------------------------+
```

### 7.1 Fields

| Field | Required? | Control | Rules enforced |
| :--- | :-: | :--- | :--- |
| Company Name | **Yes** | text | 2–50 characters after trimming spaces |
| Job Position | **Yes** | text | 2–50 characters after trimming spaces |
| Location | **Yes** | text | Not empty after trimming; at most 50 characters |
| Application Date | **Yes** | date | A real calendar date; not later than 30 days after today (local date). No earliest date. |
| Status | **Yes** | select (starts on a disabled "Select status") | One of Applied, Under Review, Interview, Offered, Rejected |
| Job Posting URL | No | url | If filled: valid URL using `http` or `https` only |
| Notes & Follow-ups | No | textarea | At most 300 characters; live counter ("Max 300 characters" → "n / 300 characters") |

Required fields are marked with a red asterisk.

### 7.2 Behaviour

- **Open / close:** *+ Add Application*, or *Edit* on a record, opens the dialog. *×*, *Cancel* and the Escape key close it and reset the form. Clicking the dark backdrop does not close it.
- **Validation:** the browser's built-in constraint checks (required, length, URL and date limits) run when *Save* is pressed. The application then shows a message in the **inline error line under each invalid field**, marks the field as invalid for assistive technology, and moves focus to the first invalid field. Messages update or disappear as the user corrects a field. Rules that HTML attributes cannot express (whitespace-only text, the allowed status list, `http`/`https`-only URLs, the 30-day date limit) are applied through the same mechanism.
- **Save:** a valid form adds a record (new `id` = highest existing `id` + 1) or replaces the edited record (same `id`), closes the dialog, redraws the list and counters, and shows a green banner.
- **Small screens:** the dialog is `100% − 32 px` wide (max 540 px) and scrolls internally if taller than 90 % of the viewport.

---

## 8. Proposed vs. Implemented

Items that appeared in earlier design drafts of this wireframe but **do not exist** in the application, or differ from it:

| Earlier draft item | Actual state |
| :--- | :--- |
| Calendar and Settings navigation items | Not present |
| Reports and Profile as working screens | Present only as placeholder links (§6) |
| Search bar in the top header | Search is in the toolbar above the table |
| Sort dropdown | Not implemented |
| "Showing X of Y applications" line | Not implemented |
| Tablet dashboard as a 2×2 grid; desktop cards "In Review / Interviews / Offers / Pending" | Actual: five cards — 3-column on tablet, 5-column on desktop; labels per §3 |
| Combined "Offers / Pending / Other" card | Not implemented; Offers and Rejected are separate cards |
| Location optional | **Required** |
| Cards show a "Note" line and a **View Link** button | Not implemented; notes and URL are not displayed outside the dialog |
| Floating action button / sticky bottom *Add* bar | Not implemented; *Add Application* is in the page header |
| Dialog title "Job Information / Application Details", button "Save Record" | Actual: "New Application" / "Edit Application"; "Save Application" / "Save Changes" |
| Horizontal carousel of statistic cards on mobile | Not implemented; a 2-column grid is used |
| Hamburger (`[=]`) menu in the top bar | Not implemented; navigation links are shown directly in a scrollable row |

---

## 9. Accessibility Considerations (as implemented)

**Implemented:**
- Document language set (`lang="en"`); one `<h1>`; landmarks `<aside>`, `<nav>`, `<main>`, `<header>` and `<section>` with accessible names.
- The records table has a (visually hidden) `<caption>` and `<th scope="col">` headers; on mobile each card row is labelled via its `data-label`.
- Every form control has a `<label>` linked by `for`/`id`; the search box has a visually hidden label; decorative icons are `aria-hidden`; the close button has an `aria-label`.
- The Add/Edit form uses a native `<dialog>` (opened with `showModal()`), labelled by its title, so focus is kept inside while it is open.
- Inline error messages sit directly under each field, are linked to it with `aria-describedby`, and the field is marked `aria-invalid` while it has an error. The first invalid field receives focus.
- The feedback banner is a polite live region (`role="status"`).
- A visible focus ring (`:focus-visible`) is defined; the table container is keyboard-focusable so it can be scrolled.
- Status is conveyed by text as well as colour.

**Known gaps (not claimed as conformant):**
- Placeholder, character-count and some secondary text use a light grey (`#94a3b8`) with a contrast of roughly 2.5 : 1 on white, below the 4.5 : 1 guideline for normal text.
- *Edit* / *Delete* buttons are about 28 px tall, below the 44 px touch-target guideline.
- Delete confirmation uses the browser's `confirm()` prompt.
- Placeholder navigation links (§6) can be focused but do nothing.
- No screen-reader or cross-browser testing has been performed, and no complete accessibility audit exists. Full WCAG 2.2 AA conformance is therefore **not** claimed.
