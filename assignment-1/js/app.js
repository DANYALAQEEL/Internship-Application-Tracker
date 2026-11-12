/**
 * ==============================================================================
 * INTERNSHIP APPLICATION TRACKER — ASSIGNMENT 1 (STAGE 5B)
 * Complete Interactive Application Management (Vanilla JavaScript)
 * ==============================================================================
 * Course: Web Engineering
 * Features:
 *   - In-memory data store with 6 sample records
 *   - Dynamic DOM rendering with XSS safety
 *   - Modal Add & Edit workflows with native <dialog>
 *   - Confirmation-gated Deletion
 *   - Integrated Search & Status Filtering
 *   - Live 5-metric Dashboard Counters
 *   - Two-tier validation (native HTML5 constraints + custom JS rules),
 *     surfaced as inline messages via the 'invalid' event
 * ==============================================================================
 */

'use strict';

/* ------------------------------------------------------------------------------
 * 1. IN-MEMORY DATA STORE & INITIAL SAMPLE RECORDS
 * Exactly mirrors docs/PROJECT_BRIEF.md. Kept in memory only.
 * ------------------------------------------------------------------------------ */
const initialApplications = [
  {
    id: 1,
    company: 'Systems Limited',
    position: 'Software Engineering Intern',
    location: 'Islamabad (Hybrid)',
    applicationDate: '2026-11-01',
    status: 'Interview',
    jobUrl: 'https://systemsltd.com/careers',
    notes: 'First round technical interview scheduled for Tuesday at 11:00 AM.'
  },
  {
    id: 2,
    company: 'Techlogix',
    position: 'Full Stack Intern',
    location: 'Lahore (Onsite)',
    applicationDate: '2026-11-03',
    status: 'Applied',
    jobUrl: 'https://techlogix.com/careers',
    notes: 'Applied through university career fair portal. Awaiting response.'
  },
  {
    id: 3,
    company: 'Arbisoft',
    position: 'Python / Web Intern',
    location: 'Lahore (Remote)',
    applicationDate: '2026-10-28',
    status: 'Under Review',
    jobUrl: 'https://arbisoft.com/careers',
    notes: 'Completed online algorithmic screening test (passed 4/4 test cases).'
  },
  {
    id: 4,
    company: 'Contour Software',
    position: 'QA Automation Intern',
    location: 'Karachi (Hybrid)',
    applicationDate: '2026-10-25',
    status: 'Offered',
    jobUrl: 'https://contour-software.com/careers',
    notes: 'Offer letter received via email. 8-week duration, stipend PKRs confirmed.'
  },
  {
    id: 5,
    company: 'NetSol Technologies',
    position: 'Frontend Intern',
    location: 'Lahore (Onsite)',
    applicationDate: '2026-10-20',
    status: 'Rejected',
    jobUrl: 'https://netsoltech.com/careers',
    notes: 'Position filled internally by co-op returnee.'
  },
  {
    id: 6,
    company: 'Afiniti',
    position: 'Data Science / ML Intern',
    location: 'Islamabad (Remote)',
    applicationDate: '2026-11-08',
    status: 'Applied',
    jobUrl: 'https://afiniti.com/careers',
    notes: 'Submitted CV and portfolio link via employee referral.'
  }
];

// Active in-memory state
let applications = [...initialApplications];

// Approved statuses allowed by the project specification
const VALID_STATUSES = ['Applied', 'Under Review', 'Interview', 'Offered', 'Rejected'];

// Active search & filter parameters
let currentSearchQuery = '';
let currentStatusFilter = 'All';

// Feedback banner timeout handle
let feedbackTimeoutId = null;

/* ------------------------------------------------------------------------------
 * 2. HELPER UTILITIES
 * Pure formatting and validation helpers.
 * ------------------------------------------------------------------------------ */

/**
 * Maps a status string to its corresponding CSS badge class.
 * @param {string} status - Application status.
 * @returns {string} CSS class name.
 */
function getStatusBadgeClass(status) {
  switch (status) {
    case 'Applied':
      return 'status-applied';
    case 'Under Review':
      return 'status-review';
    case 'Interview':
      return 'status-interview';
    case 'Offered':
      return 'status-offered';
    case 'Rejected':
      return 'status-rejected';
    default:
      return 'status-applied';
  }
}

/**
 * Formats an ISO date string (YYYY-MM-DD) into 'Mon DD, YYYY'.
 * @param {string} dateString - ISO date.
 * @returns {string} Formatted date.
 */
function formatDate(dateString) {
  if (!dateString) return 'N/A';
  const parts = dateString.split('-');
  if (parts.length === 3) {
    const monthNames = [
      'Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun',
      'Jul', 'Aug', 'Sep', 'Oct', 'Nov', 'Dec'
    ];
    const year = parts[0];
    const monthIndex = parseInt(parts[1], 10) - 1;
    const day = parseInt(parts[2], 10);
    if (monthIndex >= 0 && monthIndex < 12 && !isNaN(day)) {
      return `${monthNames[monthIndex]} ${day}, ${year}`;
    }
  }
  return dateString;
}

/**
 * Generates an incremental unique ID for new applications.
 * @returns {number} Unique numeric ID.
 */
function getNextId() {
  if (applications.length === 0) return 1;
  const maxId = applications.reduce((max, app) => Math.max(max, Number(app.id) || 0), 0);
  return maxId + 1;
}

/**
 * Validates whether an input URL is well-formed (http/https).
 * Optional: empty strings are considered valid.
 * @param {string} urlString - URL to test.
 * @returns {boolean} True if valid or empty.
 */
function isValidUrl(urlString) {
  if (!urlString || urlString.trim() === '') return true;
  try {
    const parsed = new URL(urlString.trim());
    return parsed.protocol === 'http:' || parsed.protocol === 'https:';
  } catch (err) {
    return false;
  }
}

/**
 * Validates a calendar date string (YYYY-MM-DD) ensuring it exists on the calendar
 * and is not more than 30 days ahead of today.
 * @param {string} dateString - Date to validate.
 * @returns {{isValid: boolean, error: string}} Validation result.
 */
function validateApplicationDate(dateString) {
  if (!dateString) {
    return { isValid: false, error: 'Application date is required.' };
  }
  const regex = /^\d{4}-\d{2}-\d{2}$/;
  if (!regex.test(dateString)) {
    return { isValid: false, error: 'Date must be formatted as YYYY-MM-DD.' };
  }

  const parts = dateString.split('-');
  const year = parseInt(parts[0], 10);
  const month = parseInt(parts[1], 10) - 1;
  const day = parseInt(parts[2], 10);

  const parsedDate = new Date(year, month, day);
  if (
    parsedDate.getFullYear() !== year ||
    parsedDate.getMonth() !== month ||
    parsedDate.getDate() !== day
  ) {
    return { isValid: false, error: 'Please enter a valid calendar date.' };
  }

  // Boundary check: not more than 30 days in the future
  const now = new Date();
  const maxDate = new Date(now.getFullYear(), now.getMonth(), now.getDate() + 30, 23, 59, 59, 999);
  if (parsedDate > maxDate) {
    return { isValid: false, error: 'Application date cannot be more than 30 days in the future.' };
  }

  return { isValid: true, error: '' };
}

/* ------------------------------------------------------------------------------
 * 3. LIVE DASHBOARD STATISTICS CONTROLLER
 * Calculates and updates all five statistic counters from the complete dataset.
 * ------------------------------------------------------------------------------ */

/**
 * Computes counts for Total, Under Review, Interview, Offered, and Rejected.
 * Strictly reflects the entire applications dataset, independent of active filters.
 */
function updateDashboardStats() {
  const totalCount = applications.length;
  const reviewCount = applications.filter((a) => a.status === 'Under Review').length;
  const interviewCount = applications.filter((a) => a.status === 'Interview').length;
  const offerCount = applications.filter((a) => a.status === 'Offered').length;
  const rejectedCount = applications.filter((a) => a.status === 'Rejected').length;

  const statTotal = document.getElementById('stat-total');
  const statReview = document.getElementById('stat-review');
  const statInterview = document.getElementById('stat-interview');
  const statOffer = document.getElementById('stat-offer');
  const statRejected = document.getElementById('stat-rejected');

  if (statTotal) statTotal.textContent = String(totalCount);
  if (statReview) statReview.textContent = String(reviewCount);
  if (statInterview) statInterview.textContent = String(interviewCount);
  if (statOffer) statOffer.textContent = String(offerCount);
  if (statRejected) statRejected.textContent = String(rejectedCount);
}

/* ------------------------------------------------------------------------------
 * 4. FEEDBACK BANNER CONTROLLER
 * Accessible live notifications for user actions (add, edit, delete).
 * ------------------------------------------------------------------------------ */

/**
 * Displays an alert message in the accessible feedback banner.
 * @param {string} message - Notification text.
 * @param {'success'|'danger'} type - Alert style type.
 */
function showFeedbackBanner(message, type = 'success') {
  const banner = document.getElementById('feedback-banner');
  if (!banner) return;

  if (feedbackTimeoutId) {
    clearTimeout(feedbackTimeoutId);
    feedbackTimeoutId = null;
  }

  banner.textContent = message;
  banner.className = `feedback-banner feedback-${type}`;
  banner.hidden = false;

  feedbackTimeoutId = setTimeout(() => {
    banner.hidden = true;
    banner.textContent = '';
  }, 4000);
}

/* ------------------------------------------------------------------------------
 * 5. SAFE DOM ROW CREATION & RENDERING
 * Strictly uses document.createElement() and textContent.
 * ------------------------------------------------------------------------------ */

/**
 * Creates a table row element for an application object.
 * @param {Object} app - Application record.
 * @returns {HTMLTableRowElement} Safe table row element.
 */
function createApplicationRow(app) {
  const tr = document.createElement('tr');
  tr.setAttribute('data-id', app.id);

  // 1. Company Cell
  const tdCompany = document.createElement('td');
  tdCompany.setAttribute('data-label', 'Company');

  const companyCell = document.createElement('div');
  companyCell.className = 'company-cell';

  const avatar = document.createElement('span');
  avatar.className = 'company-avatar';
  avatar.setAttribute('aria-hidden', 'true');
  avatar.textContent = (app.company && app.company.trim().length > 0)
    ? app.company.trim().charAt(0).toUpperCase()
    : '?';

  const nameSpan = document.createElement('span');
  nameSpan.className = 'company-name';
  nameSpan.textContent = app.company || 'Unknown Company';

  companyCell.appendChild(avatar);
  companyCell.appendChild(nameSpan);
  tdCompany.appendChild(companyCell);
  tr.appendChild(tdCompany);

  // 2. Job Position Cell
  const tdPosition = document.createElement('td');
  tdPosition.setAttribute('data-label', 'Job Position');
  tdPosition.textContent = app.position || 'N/A';
  tr.appendChild(tdPosition);

  // 3. Location Cell
  const tdLocation = document.createElement('td');
  tdLocation.setAttribute('data-label', 'Location');
  tdLocation.textContent = app.location || 'Not specified';
  tr.appendChild(tdLocation);

  // 4. Applied Date Cell
  const tdDate = document.createElement('td');
  tdDate.setAttribute('data-label', 'Applied Date');

  const timeElem = document.createElement('time');
  timeElem.setAttribute('datetime', app.applicationDate || '');
  timeElem.textContent = formatDate(app.applicationDate);

  tdDate.appendChild(timeElem);
  tr.appendChild(tdDate);

  // 5. Status Cell
  const tdStatus = document.createElement('td');
  tdStatus.setAttribute('data-label', 'Status');

  const statusPill = document.createElement('span');
  statusPill.className = `status-pill ${getStatusBadgeClass(app.status)}`;
  statusPill.textContent = app.status || 'Applied';

  tdStatus.appendChild(statusPill);
  tr.appendChild(tdStatus);

  // 6. Actions Cell
  const tdActions = document.createElement('td');
  tdActions.setAttribute('data-label', 'Actions');

  const actionGroup = document.createElement('div');
  actionGroup.className = 'action-buttons';

  const editBtn = document.createElement('button');
  editBtn.type = 'button';
  editBtn.className = 'btn-action btn-edit';
  editBtn.setAttribute('data-id', app.id);
  editBtn.setAttribute('title', 'Edit Application');
  editBtn.textContent = 'Edit';

  const deleteBtn = document.createElement('button');
  deleteBtn.type = 'button';
  deleteBtn.className = 'btn-action btn-delete';
  deleteBtn.setAttribute('data-id', app.id);
  deleteBtn.setAttribute('title', 'Delete Application');
  deleteBtn.textContent = 'Delete';

  actionGroup.appendChild(editBtn);
  actionGroup.appendChild(deleteBtn);
  tdActions.appendChild(actionGroup);
  tr.appendChild(tdActions);

  return tr;
}

/**
 * Renders an array of applications into the DOM table body.
 * Manages the empty state container visibility.
 * @param {Array<Object>} appList - Filtered or complete application records.
 */
function renderApplications(appList) {
  const tbody = document.getElementById('applications-tbody');
  const emptyState = document.getElementById('empty-state');

  if (!tbody) return;

  // Clear existing rows safely
  while (tbody.firstChild) {
    tbody.removeChild(tbody.firstChild);
  }

  // Toggle empty state
  if (!appList || appList.length === 0) {
    if (emptyState) emptyState.hidden = false;
    return;
  }

  if (emptyState) emptyState.hidden = true;

  // Batch insert rows
  const fragment = document.createDocumentFragment();
  appList.forEach((app) => {
    const row = createApplicationRow(app);
    fragment.appendChild(row);
  });

  tbody.appendChild(fragment);
}

/* ------------------------------------------------------------------------------
 * 6. SEARCH & FILTER CONTROLLER
 * Combines live text search and status dropdown filtering.
 * ------------------------------------------------------------------------------ */

/**
 * Filters the applications dataset based on current search and status filter settings,
 * then re-renders the table.
 */
function filterAndRenderApplications() {
  const query = currentSearchQuery.trim().toLowerCase();

  const filtered = applications.filter((app) => {
    // 1. Status Filter Check
    const matchesStatus =
      currentStatusFilter === 'All' || app.status === currentStatusFilter;

    // 2. Search Query Check (matches Company or Position)
    const companyText = (app.company || '').toLowerCase();
    const positionText = (app.position || '').toLowerCase();
    const matchesSearch =
      query === '' ||
      companyText.includes(query) ||
      positionText.includes(query);

    return matchesStatus && matchesSearch;
  });

  renderApplications(filtered);
}

/* ------------------------------------------------------------------------------
 * 7. FORM VALIDATION & ERROR MESSAGING
 * ------------------------------------------------------------------------------ */

/**
 * Maps each validated form control (by id) to the id of its inline error element.
 * These error elements already exist in index.html.
 */
const FIELD_ERROR_IDS = {
  'app-company': 'company-error',
  'app-position': 'position-error',
  'app-location': 'location-error',
  'app-date': 'date-error',
  'app-status': 'status-error',
  'app-url': 'url-error'
};

/**
 * Returns the validated form controls that currently exist in the DOM.
 * @returns {Array<HTMLElement>}
 */
function getValidatedFields() {
  return Object.keys(FIELD_ERROR_IDS)
    .map((id) => document.getElementById(id))
    .filter(Boolean);
}

/**
 * Shows or clears the inline error for one field, and keeps ARIA state in sync.
 * @param {HTMLElement} field - The form control.
 * @param {string} message - Error text, or '' to clear the error.
 */
function setFieldError(field, message) {
  const errorEl = document.getElementById(FIELD_ERROR_IDS[field.id]);
  if (errorEl) errorEl.textContent = message;

  if (message) {
    field.setAttribute('aria-invalid', 'true');
    if (errorEl) field.setAttribute('aria-describedby', errorEl.id);
  } else {
    field.removeAttribute('aria-invalid');
    field.removeAttribute('aria-describedby');
  }
}

/**
 * Clears all inline error messages under form inputs.
 */
function clearAllErrors() {
  const errorSpans = document.querySelectorAll('.form-error');
  errorSpans.forEach((span) => {
    span.textContent = '';
  });
  getValidatedFields().forEach((field) => {
    field.removeAttribute('aria-invalid');
    field.removeAttribute('aria-describedby');
  });
}

/**
 * Translates the browser's native constraint-validation state of a field
 * (required, minlength, maxlength, type=url, type=date, max) into the
 * project's inline error wording.
 * @param {HTMLElement} field - The form control.
 * @returns {string} Error message.
 */
function getNativeErrorMessage(field) {
  const v = field.validity;
  switch (field.id) {
    case 'app-company':
      if (v.valueMissing) return 'Company name is required.';
      return 'Company name must be between 2 and 50 characters.';
    case 'app-position':
      if (v.valueMissing) return 'Job position is required.';
      return 'Job position must be between 2 and 50 characters.';
    case 'app-location':
      if (v.valueMissing) return 'Location is required.';
      return 'Location cannot exceed 50 characters.';
    case 'app-date':
      if (v.badInput) return 'Please enter a valid calendar date.';
      if (v.valueMissing) return 'Application date is required.';
      if (v.rangeOverflow) return 'Application date cannot be more than 30 days in the future.';
      return 'Please enter a valid calendar date.';
    case 'app-status':
      return 'Please select a valid status option.';
    case 'app-url':
      return 'Please enter a valid website URL (e.g. https://example.com).';
    default:
      return field.validationMessage || 'Please correct this field.';
  }
}

/**
 * Project-specific rules that native attributes cannot express:
 * whitespace-only / padded values (checked after trimming), the calendar and
 * 30-day date rule, the allowed status list, and http/https-only URLs.
 * Only called when the field already passes native validation.
 * @param {HTMLElement} field - The form control.
 * @returns {string} Error message, or '' if the custom rules pass.
 */
function getCustomErrorMessage(field) {
  const value = field.value.trim();

  switch (field.id) {
    case 'app-company':
      if (!value) return 'Company name is required.';
      if (value.length < 2 || value.length > 50) return 'Company name must be between 2 and 50 characters.';
      return '';
    case 'app-position':
      if (!value) return 'Job position is required.';
      if (value.length < 2 || value.length > 50) return 'Job position must be between 2 and 50 characters.';
      return '';
    case 'app-location':
      if (!value) return 'Location is required.';
      if (value.length > 50) return 'Location cannot exceed 50 characters.';
      return '';
    case 'app-date':
      return validateApplicationDate(value).error;
    case 'app-status':
      return VALID_STATUSES.includes(value) ? '' : 'Please select a valid status option.';
    case 'app-url':
      return value && !isValidUrl(value)
        ? 'Please enter a valid website URL (e.g. https://example.com).'
        : '';
    default:
      return '';
  }
}

/**
 * Validates one field and synchronises the browser's validity state with it.
 * Native constraints are evaluated first. If they pass, the custom rules run
 * and, on failure, are registered with setCustomValidity() so the browser
 * also treats the field as invalid and blocks submission.
 * This function does NOT write to the DOM; callers decide whether to display
 * the returned message.
 * @param {HTMLElement} field - The form control.
 * @returns {string} Error message, or '' if the field is valid.
 */
function validateField(field) {
  field.setCustomValidity('');

  if (!field.validity.valid) {
    return getNativeErrorMessage(field);
  }

  const customMessage = getCustomErrorMessage(field);
  if (customMessage) {
    field.setCustomValidity(customMessage);
  }
  return customMessage;
}

/**
 * Handles the browser's 'invalid' event (fired for each invalid control when
 * the user clicks Save). Native constraint validation blocks the 'submit'
 * event, so this is where inline messages are displayed.
 * The native tooltip is suppressed with preventDefault(), and focus is moved
 * to the first invalid field manually (the browser would not do it once the
 * event is cancelled).
 * @param {Event} event - The invalid event (captured at the form level).
 */
function handleFieldInvalid(event) {
  const field = event.target;
  if (!(field instanceof HTMLElement) || !FIELD_ERROR_IDS[field.id]) return;

  event.preventDefault();

  const message = field.validity.customError
    ? field.validationMessage
    : getNativeErrorMessage(field);
  setFieldError(field, message);

  const form = field.form;
  if (form) {
    const firstInvalid = Array.from(form.elements).find(
      (el) => el.willValidate && !el.validity.valid
    );
    if (firstInvalid === field) field.focus();
  }
}

/**
 * Re-validates a field as the user edits it. The browser's validity state is
 * always refreshed; a visible inline message is updated or cleared, but
 * untouched fields are not flagged while the user is still typing.
 * @param {Event} event - input or change event.
 */
function handleFieldEdit(event) {
  const field = event.target;
  if (!(field instanceof HTMLElement) || !FIELD_ERROR_IDS[field.id]) return;

  const message = validateField(field);
  const errorEl = document.getElementById(FIELD_ERROR_IDS[field.id]);
  if (errorEl && errorEl.textContent) {
    setFieldError(field, message);
  }
}

/**
 * Runs just before the browser performs its own validation on Save.
 * Registers the custom rules with the browser (so e.g. a whitespace-only
 * value counts as invalid) and clears stale messages. The 'invalid' event
 * then re-displays messages only for fields that are still invalid.
 */
function prepareFormForValidation() {
  clearAllErrors();
  getValidatedFields().forEach((field) => validateField(field));
}

/**
 * Validates all form inputs according to assignment rules.
 * Safety net used on submit; it applies exactly the same per-field rules
 * as the live 'invalid' / input handling above.
 * @returns {{isValid: boolean, data: Object|null}}
 */
function validateApplicationForm() {
  clearAllErrors();

  let isValid = true;

  getValidatedFields().forEach((field) => {
    const message = validateField(field);
    if (message) {
      setFieldError(field, message);
      isValid = false;
    }
  });

  const companyVal = document.getElementById('app-company').value.trim();
  const positionVal = document.getElementById('app-position').value.trim();
  const locationVal = document.getElementById('app-location').value.trim();
  const dateVal = document.getElementById('app-date').value.trim();
  const statusVal = document.getElementById('app-status').value.trim();
  const urlVal = document.getElementById('app-url').value.trim();

  // Notes: Optional, max 300 characters
  const notesInput = document.getElementById('app-notes');
  const notesVal = notesInput ? notesInput.value.trim() : '';
  if (notesVal.length > 300) {
    isValid = false;
  }

  if (!isValid) {
    return { isValid: false, data: null };
  }

  return {
    isValid: true,
    data: {
      company: companyVal,
      position: positionVal,
      location: locationVal,
      applicationDate: dateVal,
      status: statusVal,
      jobUrl: urlVal,
      notes: notesVal
    }
  };
}

/* ------------------------------------------------------------------------------
 * 8. MODAL DIALOG WORKFLOWS (ADD & EDIT)
 * ------------------------------------------------------------------------------ */

/**
 * Resets the modal dialog back to default 'Add Application' state.
 */
function resetDialogMode() {
  const dialogTitle = document.getElementById('dialog-title');
  const submitBtn = document.getElementById('save-app-btn');
  const form = document.getElementById('application-form');
  const idInput = document.getElementById('app-id');
  const charCount = document.getElementById('notes-char-count');

  if (dialogTitle) dialogTitle.textContent = 'New Application';
  if (submitBtn) submitBtn.textContent = 'Save Application';
  if (idInput) idInput.value = '';
  if (form) form.reset();
  // form.reset() does not clear setCustomValidity() state, so do it explicitly
  getValidatedFields().forEach((field) => field.setCustomValidity(''));
  if (charCount) charCount.textContent = 'Max 300 characters';
  clearAllErrors();
}

/**
 * Opens the native <dialog> in either 'add' or 'edit' mode.
 * @param {'add'|'edit'} mode - Mode identifier.
 * @param {number|string|null} appId - ID of application when editing.
 */
function openApplicationDialog(mode = 'add', appId = null) {
  const dialog = document.getElementById('application-dialog');
  if (!dialog) return;

  resetDialogMode();

  if (mode === 'edit' && appId !== null) {
    const targetApp = applications.find((a) => a.id === Number(appId));
    if (!targetApp) {
      console.error('Cannot edit: Application not found with id', appId);
      return;
    }

    // Set dialog header & submit button
    document.getElementById('dialog-title').textContent = 'Edit Application';
    document.getElementById('save-app-btn').textContent = 'Save Changes';

    // Populate form fields
    document.getElementById('app-id').value = targetApp.id;
    document.getElementById('app-company').value = targetApp.company || '';
    document.getElementById('app-position').value = targetApp.position || '';
    document.getElementById('app-location').value = targetApp.location || '';
    document.getElementById('app-date').value = targetApp.applicationDate || '';
    document.getElementById('app-status').value = targetApp.status || '';
    document.getElementById('app-url').value = targetApp.jobUrl || '';
    document.getElementById('app-notes').value = targetApp.notes || '';

    // Update notes character count
    const charCount = document.getElementById('notes-char-count');
    if (charCount) {
      const len = (targetApp.notes || '').length;
      charCount.textContent = `${len} / 300 characters`;
    }
  }

  // Open native dialog modal
  if (typeof dialog.showModal === 'function') {
    dialog.showModal();
  } else {
    dialog.setAttribute('open', '');
  }
}

/**
 * Closes the modal dialog and resets state.
 */
function closeApplicationDialog() {
  const dialog = document.getElementById('application-dialog');
  if (!dialog) return;

  if (typeof dialog.close === 'function') {
    dialog.close();
  } else {
    dialog.removeAttribute('open');
  }

  resetDialogMode();
}

/**
 * Handles form submission for both creating and updating records.
 * @param {Event} event - Submit event.
 */
function handleFormSubmit(event) {
  event.preventDefault();

  const validation = validateApplicationForm();
  if (!validation.isValid) {
    return;
  }

  const formData = validation.data;
  const idInput = document.getElementById('app-id');
  const existingId = idInput && idInput.value ? Number(idInput.value) : null;

  if (existingId) {
    // ----------------- EDIT MODE -----------------
    const index = applications.findIndex((a) => a.id === existingId);
    if (index !== -1) {
      applications[index] = {
        ...applications[index],
        ...formData,
        id: existingId // preserve exact ID
      };
      showFeedbackBanner(`Application for "${formData.company}" updated successfully.`, 'success');
    }
  } else {
    // ----------------- ADD MODE -----------------
    const newRecord = {
      id: getNextId(),
      ...formData
    };
    applications.push(newRecord);
    showFeedbackBanner(`New application for "${formData.company}" added successfully.`, 'success');
  }

  // Close dialog and reset form
  closeApplicationDialog();

  // Re-render and update live counters
  filterAndRenderApplications();
  updateDashboardStats();
}

/* ------------------------------------------------------------------------------
 * 9. DELETE ACTION CONTROLLER
 * Prompts user confirmation before deleting a record.
 * ------------------------------------------------------------------------------ */

/**
 * Prompts confirmation and removes an application from the in-memory store.
 * @param {number|string} appId - Application ID.
 */
function handleDeleteApplication(appId) {
  const targetId = Number(appId);
  const targetApp = applications.find((a) => a.id === targetId);
  if (!targetApp) return;

  const confirmationMessage = `Are you sure you want to delete the application for "${targetApp.company}" - ${targetApp.position}?`;
  const userConfirmed = window.confirm(confirmationMessage);

  if (!userConfirmed) {
    return; // Cancelled by user
  }

  // Remove from array
  applications = applications.filter((a) => a.id !== targetId);

  // Update UI and stats immediately
  filterAndRenderApplications();
  updateDashboardStats();
  showFeedbackBanner(`Application for "${targetApp.company}" was deleted.`, 'danger');
}

/* ------------------------------------------------------------------------------
 * 10. APPLICATION INITIALIZATION & EVENT BINDINGS
 * Attaches event delegation and DOM listeners.
 * ------------------------------------------------------------------------------ */

/**
 * Sets dynamic calendar date limits on the application date input (#app-date).
 * Caps the maximum selectable date to 30 days ahead of the user's current local date.
 * Uses local calendar date components to avoid UTC timezone off-by-one errors.
 */
function setApplicationDateBoundary() {
  const dateInput = document.getElementById('app-date');
  if (!dateInput) return;

  const now = new Date();
  const maxDate = new Date(now.getFullYear(), now.getMonth(), now.getDate() + 30);

  const year = maxDate.getFullYear();
  const month = String(maxDate.getMonth() + 1).padStart(2, '0');
  const day = String(maxDate.getDate()).padStart(2, '0');

  dateInput.max = `${year}-${month}-${day}`;
}

/**
 * Binds all interactive event handlers.
 */
function setupEventListeners() {
  // 1. Add Application Modal Opener
  const openModalBtn = document.getElementById('open-modal-btn');
  if (openModalBtn) {
    openModalBtn.addEventListener('click', () => openApplicationDialog('add'));
  }

  // 2. Dialog Close & Cancel Buttons
  const closeModalBtn = document.getElementById('close-dialog-btn');
  if (closeModalBtn) {
    closeModalBtn.addEventListener('click', closeApplicationDialog);
  }

  const cancelModalBtn = document.getElementById('cancel-dialog-btn');
  if (cancelModalBtn) {
    cancelModalBtn.addEventListener('click', closeApplicationDialog);
  }

  // Ensure Add mode is restored if user presses ESC key to dismiss dialog
  const dialogElem = document.getElementById('application-dialog');
  if (dialogElem) {
    dialogElem.addEventListener('close', resetDialogMode);
    dialogElem.addEventListener('cancel', resetDialogMode);
  }

  // 3. Form Submission
  const appForm = document.getElementById('application-form');
  if (appForm) {
    appForm.addEventListener('submit', handleFormSubmit);

    // 'invalid' does not bubble, so listen in the capture phase on the form.
    appForm.addEventListener('invalid', handleFieldInvalid, true);

    // Keep validity state fresh and update/clear inline errors as the user edits.
    getValidatedFields().forEach((field) => {
      field.addEventListener('input', handleFieldEdit);
      field.addEventListener('change', handleFieldEdit);
    });

    // Register custom rules with the browser just before native validation runs
    // (also fires when the user presses Enter, via implicit submission).
    const saveBtn = document.getElementById('save-app-btn');
    if (saveBtn) {
      saveBtn.addEventListener('click', prepareFormForValidation);
    }
  }

  // 4. Notes Real-Time Character Counter
  const notesTextarea = document.getElementById('app-notes');
  const charCountSpan = document.getElementById('notes-char-count');
  if (notesTextarea && charCountSpan) {
    notesTextarea.addEventListener('input', () => {
      const currentLength = notesTextarea.value.length;
      charCountSpan.textContent = `${currentLength} / 300 characters`;
      charCountSpan.style.color = currentLength > 300 ? '#dc2626' : '';
    });
  }

  // 5. Table Row Actions Event Delegation (Edit & Delete)
  const tbody = document.getElementById('applications-tbody');
  if (tbody) {
    tbody.addEventListener('click', (event) => {
      const target = event.target;
      if (!(target instanceof HTMLElement)) return;

      const editBtn = target.closest('.btn-edit');
      if (editBtn) {
        const id = editBtn.getAttribute('data-id');
        if (id) openApplicationDialog('edit', id);
        return;
      }

      const deleteBtn = target.closest('.btn-delete');
      if (deleteBtn) {
        const id = deleteBtn.getAttribute('data-id');
        if (id) handleDeleteApplication(id);
      }
    });
  }

  // 6. Live Search Input
  const searchInput = document.getElementById('search-input');
  if (searchInput) {
    searchInput.addEventListener('input', (event) => {
      currentSearchQuery = event.target.value;
      filterAndRenderApplications();
    });
  }

  // 7. Status Filter Dropdown
  const statusFilter = document.getElementById('status-filter');
  if (statusFilter) {
    statusFilter.addEventListener('change', (event) => {
      currentStatusFilter = event.target.value;
      filterAndRenderApplications();
    });
  }

  // 8. Empty State Reset Filters Button
  const resetFiltersBtn = document.getElementById('reset-filters-btn');
  if (resetFiltersBtn) {
    resetFiltersBtn.addEventListener('click', () => {
      currentSearchQuery = '';
      currentStatusFilter = 'All';

      if (searchInput) searchInput.value = '';
      if (statusFilter) statusFilter.value = 'All';

      filterAndRenderApplications();
    });
  }
}

/**
 * Initializes the entire application state and bindings.
 */
function initApp() {
  // Set date boundary
  setApplicationDateBoundary();

  // Bind UI events
  setupEventListeners();

  // Initial table render
  renderApplications(applications);

  // Compute and display initial live statistics
  updateDashboardStats();

  console.log('Internship Application Tracker fully initialized with', applications.length, 'records.');
}

// Start app once DOM is ready
if (document.readyState === 'loading') {
  document.addEventListener('DOMContentLoaded', initApp);
} else {
  initApp();
}
