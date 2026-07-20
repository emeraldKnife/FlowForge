# FlowForge Bug Analysis Report

After performing a scan of the codebase and checking the running application in the browser, several bugs and logic issues have been identified across both the frontend and backend. These issues collectively hinder the routing, dashboard view, delay-tracking service, and workflow transitions.

---

## 1. Frontend Issues & Bugs

### A. Missing Router Configuration for the Root Path (`/`) and Global Dashboard
* **Symptom:** Accessing `http://localhost:5173/` or trying to access a general `/dashboard` path renders a completely blank screen.
* **Console Output:** `No routes matched location "/"`
* **Root Cause:** In [App.jsx](file:///c:/Users/mohit/Documents/FlowForge/frontend/src/App.jsx), there is no route mapped for the root path `/` or `/dashboard`. Consequently, users who visit the root URL receive a blank page and are not redirected to `/login`.

### B. Unused Global Dashboard Component (`Dashboard.jsx`)
* **Symptom:** The global analytics dashboard is completely unreachable.
* **Root Cause:** The actual analytics-fetching and chart-rendering logic is written inside [Dashboard.jsx](file:///c:/Users/mohit/Documents/FlowForge/frontend/src/pages/Dashboard.jsx). However, this component is **never imported or registered** in [App.jsx](file:///c:/Users/mohit/Documents/FlowForge/frontend/src/App.jsx). 
* **Mismatch in CEODashboard:** When a user logs in as a CEO, they are navigated to `/ceo` which renders [CEODashboard.jsx](file:///c:/Users/mohit/Documents/FlowForge/frontend/src/pages/CEODashboard.jsx). That file is currently just a static placeholder saying *"Company analytics and reports will appear here."*, completely neglecting the actual implementation in `Dashboard.jsx`.

### C. Case-Sensitivity Role Navigation Mismatch
* **Symptom:** Potential redirect loop or navigation to the wrong role dashboard.
* **Root Cause:** In [Login.jsx](file:///c:/Users/mohit/Documents/FlowForge/frontend/src/pages/Login.jsx), roles decoded from the JWT token are compared case-sensitively:
  ```javascript
  if (decoded.role === "admin") { navigate("/admin"); }
  else if (decoded.role === "ceo") { navigate("/ceo"); }
  ```
  If roles are stored in the database with differing capitalization (e.g. `"CEO"` or `"Admin"`), these checks will fail, forcing them to fall through to `/worker`, which then redirects them back to `/login` via the `RoleRoute` protection since their role doesn't match `"worker"`.

---

## 2. Backend Issues & Bugs

### A. Delay Check Skipped for Design Department (First Stage)
* **Symptom:** Delays in the first stage of any workflow (Design department) are never detected or logged.
* **Root Cause:** When an order is initialized via [workflowService.js](file:///c:/Users/mohit/Documents/FlowForge/backend/src/services/workflowService.js), the first stage is inserted with `status = 'in_progress'`, but **its `started_at` timestamp is left as `NULL`**:
  ```javascript
  i === 1 ? "in_progress" : "pending"
  ```
  When the delay checker runs in [delayService.js](file:///c:/Users/mohit/Documents/FlowForge/backend/src/services/delayService.js), it does:
  ```javascript
  if (!stage.started_at || !stage.expected_duration) continue;
  ```
  Since `started_at` is `null` for the first stage, the delay checker skips it entirely.

### B. JavaScript String Addition Gotcha in Stage Transitions
* **Symptom:** Completing the first stage of an order immediately marks the entire order as completed, skipping the remaining stages (Production, Quality, and Dispatch).
* **Root Cause:** In [stageService.js](file:///c:/Users/mohit/Documents/FlowForge/backend/src/services/stageService.js), the next department is calculated as:
  ```javascript
  departmentId + 1
  ```
  If `departmentId` is parsed as a string (e.g., `"1"`), JavaScript concatenates it, resulting in `"11"`. The database is queried for `department_id = 11` (which returns empty), causing the service to assume there is no next stage and immediately marks the order as `'completed'`.
  * **Fix:** Convert `departmentId` to a number using `Number(departmentId)` or `parseInt` before incrementing.

### C. Out-of-Bounds Notification Call
* **Symptom:** Errors or logs attempting to notify a non-existent next department when a workflow finishes.
* **Root Cause:** At the end of [stageService.js](file:///c:/Users/mohit/Documents/FlowForge/backend/src/services/stageService.js), the notification call is outside the conditional block:
  ```javascript
  await notificationService.createNotificationForDepartment(
    departmentId + 1,
    `Your department can now start work on order ${orderId}`
  );
  ```
  When the final stage completes (e.g. stage 4), the system tries to notify department 5. This call should be moved inside the `if (nextStage.rows.length > 0)` block.

---

## 3. Missing / Pending Enhancements (from `later.txt`)
* **Background Check Scheduler:** There is currently no active scheduler/timer (e.g., `setInterval` or `cron` job) to trigger the `delayService.checkDelays()` automatically. It has to be triggered manually via a GET request to `/check-delays`.
* **JWT Secret Management:** The `JWT_SECRET` in `authController.js` and `authMiddleware.js` is hardcoded as a string instead of being read from a `.env` file.
