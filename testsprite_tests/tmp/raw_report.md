
# TestSprite AI Testing Report(MCP)

---

## 1️⃣ Document Metadata
- **Project Name:** meu-agente-fin
- **Date:** 2025-11-14
- **Prepared by:** TestSprite AI Team

---

## 2️⃣ Requirement Validation Summary

#### Test TC001
- **Test Name:** User Signup with Valid Data
- **Test Code:** [TC001_User_Signup_with_Valid_Data.py](./TC001_User_Signup_with_Valid_Data.py)
- **Test Error:** The signup form cannot be submitted despite all fields being correctly filled with valid data. The 'Criar Conta' button remains disabled with no visible validation errors or consent checkbox. This is a blocking issue preventing new user account creation via Supabase Auth. Test stopped.
Browser Console Logs:
[ERROR] Failed to load resource: the server responded with a status of 400 () (at https://pzoodkjepcarxnawuxoa.supabase.co/auth/v1/signup?redirect_to=http%3A%2F%2Flocalhost%3A8080%2Fauth%2Flogin:0:0)
[ERROR] Signup error: Error: Erro ao criar conta
    at signup (http://localhost:8080/src/contexts/AuthContext.tsx?t=1763104751159:298:15)
    at async handleSubmit (http://localhost:8080/src/pages/auth/Signup.tsx?t=1763109131269:93:13) (at http://localhost:8080/src/contexts/AuthContext.tsx?t=1763104751159:325:14)
[ERROR] Failed to load resource: the server responded with a status of 400 () (at https://pzoodkjepcarxnawuxoa.supabase.co/auth/v1/signup?redirect_to=http%3A%2F%2Flocalhost%3A8080%2Fauth%2Flogin:0:0)
[ERROR] Signup error: Error: Erro ao criar conta
    at signup (http://localhost:8080/src/contexts/AuthContext.tsx?t=1763104751159:298:15)
    at async handleSubmit (http://localhost:8080/src/pages/auth/Signup.tsx?t=1763109131269:93:13) (at http://localhost:8080/src/contexts/AuthContext.tsx?t=1763104751159:325:14)
[ERROR] Failed to load resource: the server responded with a status of 400 () (at https://pzoodkjepcarxnawuxoa.supabase.co/auth/v1/signup?redirect_to=http%3A%2F%2Flocalhost%3A8080%2Fauth%2Flogin:0:0)
[ERROR] Signup error: Error: Erro ao criar conta
    at signup (http://localhost:8080/src/contexts/AuthContext.tsx?t=1763104751159:298:15)
    at async handleSubmit (http://localhost:8080/src/pages/auth/Signup.tsx?t=1763109131269:93:13) (at http://localhost:8080/src/contexts/AuthContext.tsx?t=1763104751159:325:14)
- **Test Visualization and Result:** https://www.testsprite.com/dashboard/mcp/tests/fa7e461c-0781-4e0a-9a4f-41b2faf1e6ac/496af38b-5f8f-4932-ab74-c1db7708319a
- **Status:** ❌ Failed
- **Analysis / Findings:** {{TODO:AI_ANALYSIS}}.
---

#### Test TC002
- **Test Name:** Login with Correct Credentials
- **Test Code:** [TC002_Login_with_Correct_Credentials.py](./TC002_Login_with_Correct_Credentials.py)
- **Test Visualization and Result:** https://www.testsprite.com/dashboard/mcp/tests/fa7e461c-0781-4e0a-9a4f-41b2faf1e6ac/7e31bdfb-4efd-44f7-bd6e-29ef9603dec0
- **Status:** ✅ Passed
- **Analysis / Findings:** {{TODO:AI_ANALYSIS}}.
---

#### Test TC003
- **Test Name:** Login with Incorrect Password
- **Test Code:** [TC003_Login_with_Incorrect_Password.py](./TC003_Login_with_Incorrect_Password.py)
- **Test Error:** Test stopped due to critical authentication issue: login succeeded with incorrect password, which is a security flaw. Reported the issue and will not proceed further.
- **Test Visualization and Result:** https://www.testsprite.com/dashboard/mcp/tests/fa7e461c-0781-4e0a-9a4f-41b2faf1e6ac/205b6027-63d1-46d3-b7ed-85d7f5478cef
- **Status:** ❌ Failed
- **Analysis / Findings:** {{TODO:AI_ANALYSIS}}.
---

#### Test TC004
- **Test Name:** Password Recovery Flow
- **Test Code:** [TC004_Password_Recovery_Flow.py](./TC004_Password_Recovery_Flow.py)
- **Test Error:** The password recovery test cannot proceed because the 'Forgot password' link or password reset feature is missing on the login page. The help menu provides only support, bug reporting, and suggestions options unrelated to password reset. Task stopped due to this issue.
- **Test Visualization and Result:** https://www.testsprite.com/dashboard/mcp/tests/fa7e461c-0781-4e0a-9a4f-41b2faf1e6ac/7dbf966d-3dea-4fef-9227-18221da3ea60
- **Status:** ❌ Failed
- **Analysis / Findings:** {{TODO:AI_ANALYSIS}}.
---

#### Test TC005
- **Test Name:** Access Control by Subscription Plan
- **Test Code:** [TC005_Access_Control_by_Subscription_Plan.py](./TC005_Access_Control_by_Subscription_Plan.py)
- **Test Visualization and Result:** https://www.testsprite.com/dashboard/mcp/tests/fa7e461c-0781-4e0a-9a4f-41b2faf1e6ac/138d185b-c5d0-482c-b533-0d17d19d1212
- **Status:** ✅ Passed
- **Analysis / Findings:** {{TODO:AI_ANALYSIS}}.
---

#### Test TC006
- **Test Name:** Record Financial Entry with Valid Data
- **Test Code:** [TC006_Record_Financial_Entry_with_Valid_Data.py](./TC006_Record_Financial_Entry_with_Valid_Data.py)
- **Test Visualization and Result:** https://www.testsprite.com/dashboard/mcp/tests/fa7e461c-0781-4e0a-9a4f-41b2faf1e6ac/d282c15c-3d83-4107-974d-81f7e91932b6
- **Status:** ✅ Passed
- **Analysis / Findings:** {{TODO:AI_ANALYSIS}}.
---

#### Test TC007
- **Test Name:** Prevent Duplicate Financial Entry
- **Test Code:** [TC007_Prevent_Duplicate_Financial_Entry.py](./TC007_Prevent_Duplicate_Financial_Entry.py)
- **Test Visualization and Result:** https://www.testsprite.com/dashboard/mcp/tests/fa7e461c-0781-4e0a-9a4f-41b2faf1e6ac/07dd0ce8-9d73-406c-b5b6-cff1015e4f2d
- **Status:** ✅ Passed
- **Analysis / Findings:** {{TODO:AI_ANALYSIS}}.
---

#### Test TC008
- **Test Name:** Export Financial Data in Paid Plans
- **Test Code:** [TC008_Export_Financial_Data_in_Paid_Plans.py](./TC008_Export_Financial_Data_in_Paid_Plans.py)
- **Test Error:** Verification summary: Basic user cannot export financial data as export button is locked with 'PREMIUM' label. Business user also cannot export as export button remains locked with 'PREMIUM' label. Export functionality is restricted to Premium users only. The task to verify export for paid plans is partially complete: Basic and Business plans do not have export access, only Premium plan has export enabled. Since Premium user test was not performed, full verification is incomplete.
Browser Console Logs:
[ERROR] Failed to load resource: the server responded with a status of 403 () (at https://pzoodkjepcarxnawuxoa.supabase.co/auth/v1/logout?scope=global:0:0)
[ERROR] Logout error: AuthSessionMissingError: Auth session missing!
    at handleError2 (http://localhost:8080/node_modules/.vite/deps/@supabase_supabase-js.js?v=513c6d87:5102:11)
    at async _handleRequest2 (http://localhost:8080/node_modules/.vite/deps/@supabase_supabase-js.js?v=513c6d87:5145:5)
    at async _request (http://localhost:8080/node_modules/.vite/deps/@supabase_supabase-js.js?v=513c6d87:5129:16)
    at async GoTrueAdminApi.signOut (http://localhost:8080/node_modules/.vite/deps/@supabase_supabase-js.js?v=513c6d87:5243:7)
    at async http://localhost:8080/node_modules/.vite/deps/@supabase_supabase-js.js?v=513c6d87:7015:27
    at async SupabaseAuthClient._useSession (http://localhost:8080/node_modules/.vite/deps/@supabase_supabase-js.js?v=513c6d87:6633:14)
    at async SupabaseAuthClient._signOut (http://localhost:8080/node_modules/.vite/deps/@supabase_supabase-js.js?v=513c6d87:7007:12)
    at async http://localhost:8080/node_modules/.vite/deps/@supabase_supabase-js.js?v=513c6d87:7003:14 (at http://localhost:8080/src/contexts/AuthContext.tsx?t=1763104751159:342:16)
- **Test Visualization and Result:** https://www.testsprite.com/dashboard/mcp/tests/fa7e461c-0781-4e0a-9a4f-41b2faf1e6ac/3f971c42-5ea8-4681-a4c9-955d71ac677c
- **Status:** ❌ Failed
- **Analysis / Findings:** {{TODO:AI_ANALYSIS}}.
---

#### Test TC009
- **Test Name:** Automated Financial Record via WhatsApp AI Agents
- **Test Code:** [TC009_Automated_Financial_Record_via_WhatsApp_AI_Agents.py](./TC009_Automated_Financial_Record_via_WhatsApp_AI_Agents.py)
- **Test Visualization and Result:** https://www.testsprite.com/dashboard/mcp/tests/fa7e461c-0781-4e0a-9a4f-41b2faf1e6ac/3122c125-ed3b-4d69-b2ab-a8743262a75f
- **Status:** ✅ Passed
- **Analysis / Findings:** {{TODO:AI_ANALYSIS}}.
---

#### Test TC010
- **Test Name:** Google Workspace Scheduling Integration
- **Test Code:** [TC010_Google_Workspace_Scheduling_Integration.py](./TC010_Google_Workspace_Scheduling_Integration.py)
- **Test Visualization and Result:** https://www.testsprite.com/dashboard/mcp/tests/fa7e461c-0781-4e0a-9a4f-41b2faf1e6ac/135adf61-8a49-41d3-b493-eab720ba56ed
- **Status:** ✅ Passed
- **Analysis / Findings:** {{TODO:AI_ANALYSIS}}.
---

#### Test TC011
- **Test Name:** Notification Delivery via WhatsApp and In-App
- **Test Code:** [TC011_Notification_Delivery_via_WhatsApp_and_In_App.py](./TC011_Notification_Delivery_via_WhatsApp_and_In_App.py)
- **Test Visualization and Result:** https://www.testsprite.com/dashboard/mcp/tests/fa7e461c-0781-4e0a-9a4f-41b2faf1e6ac/9ca3137d-e2a9-41de-b0b4-8c1b5b6dd4c4
- **Status:** ✅ Passed
- **Analysis / Findings:** {{TODO:AI_ANALYSIS}}.
---

#### Test TC012
- **Test Name:** Support Ticket Creation and Tracking
- **Test Code:** [TC012_Support_Ticket_Creation_and_Tracking.py](./TC012_Support_Ticket_Creation_and_Tracking.py)
- **Test Error:** Testing stopped due to unresponsive upgrade button preventing subscription upgrade and support access. Issue reported for resolution.
- **Test Visualization and Result:** https://www.testsprite.com/dashboard/mcp/tests/fa7e461c-0781-4e0a-9a4f-41b2faf1e6ac/54a9d790-6e07-4193-afff-559158f58581
- **Status:** ❌ Failed
- **Analysis / Findings:** {{TODO:AI_ANALYSIS}}.
---

#### Test TC013
- **Test Name:** Daily Backup and Restore on Premium Plan
- **Test Code:** [TC013_Daily_Backup_and_Restore_on_Premium_Plan.py](./TC013_Daily_Backup_and_Restore_on_Premium_Plan.py)
- **Test Visualization and Result:** https://www.testsprite.com/dashboard/mcp/tests/fa7e461c-0781-4e0a-9a4f-41b2faf1e6ac/cb1d9fc5-5deb-4ab1-82e9-08efdf447ac2
- **Status:** ✅ Passed
- **Analysis / Findings:** {{TODO:AI_ANALYSIS}}.
---

#### Test TC014
- **Test Name:** User Profile Update and Avatar Upload
- **Test Code:** [TC014_User_Profile_Update_and_Avatar_Upload.py](./TC014_User_Profile_Update_and_Avatar_Upload.py)
- **Test Error:** Tested user profile update including editing name and email fields successfully. However, the avatar image upload functionality is broken as clicking the 'Adicionar foto' button does not open the file upload dialog or allow image selection. This prevents completing the avatar update test. Reporting this issue and stopping further testing.
- **Test Visualization and Result:** https://www.testsprite.com/dashboard/mcp/tests/fa7e461c-0781-4e0a-9a4f-41b2faf1e6ac/3ac92a16-a3ca-433b-b84c-c165164dea81
- **Status:** ❌ Failed
- **Analysis / Findings:** {{TODO:AI_ANALYSIS}}.
---

#### Test TC015
- **Test Name:** Data Privacy Compliance and Opt-Out Management
- **Test Code:** [TC015_Data_Privacy_Compliance_and_Opt_Out_Management.py](./TC015_Data_Privacy_Compliance_and_Opt_Out_Management.py)
- **Test Error:** Reported the issue with privacy preferences not saving or applying. Stopping further actions as user cannot manage privacy settings properly, which is critical for LGPD compliance.
Browser Console Logs:
[ERROR] Erro ao salvar configurações: TypeError: toast.success is not a function
    at savePrivacySettings (http://localhost:8080/src/components/PrivacySection.tsx:99:19) (at http://localhost:8080/src/components/PrivacySection.tsx:106:20)
- **Test Visualization and Result:** https://www.testsprite.com/dashboard/mcp/tests/fa7e461c-0781-4e0a-9a4f-41b2faf1e6ac/bb44a22d-66e0-42b1-bf05-7d4f67a71067
- **Status:** ❌ Failed
- **Analysis / Findings:** {{TODO:AI_ANALYSIS}}.
---

#### Test TC016
- **Test Name:** PWA Functionality and Offline Access
- **Test Code:** [TC016_PWA_Functionality_and_Offline_Access.py](./TC016_PWA_Functionality_and_Offline_Access.py)
- **Test Visualization and Result:** https://www.testsprite.com/dashboard/mcp/tests/fa7e461c-0781-4e0a-9a4f-41b2faf1e6ac/ab5b519a-af79-42dc-8cd1-c485c931f5d5
- **Status:** ✅ Passed
- **Analysis / Findings:** {{TODO:AI_ANALYSIS}}.
---

#### Test TC017
- **Test Name:** AI Agents Web Search and Scraping Compliance
- **Test Code:** [TC017_AI_Agents_Web_Search_and_Scraping_Compliance.py](./TC017_AI_Agents_Web_Search_and_Scraping_Compliance.py)
- **Test Visualization and Result:** https://www.testsprite.com/dashboard/mcp/tests/fa7e461c-0781-4e0a-9a4f-41b2faf1e6ac/a8796d33-8c1d-41e3-9af7-df222cc697c7
- **Status:** ✅ Passed
- **Analysis / Findings:** {{TODO:AI_ANALYSIS}}.
---

#### Test TC018
- **Test Name:** Role-Based Access Control Enforcement
- **Test Code:** [TC018_Role_Based_Access_Control_Enforcement.py](./TC018_Role_Based_Access_Control_Enforcement.py)
- **Test Visualization and Result:** https://www.testsprite.com/dashboard/mcp/tests/fa7e461c-0781-4e0a-9a4f-41b2faf1e6ac/189c7ef9-622d-4ca1-88fa-49c3521047e6
- **Status:** ✅ Passed
- **Analysis / Findings:** {{TODO:AI_ANALYSIS}}.
---

#### Test TC019
- **Test Name:** Financial Goal Tracking and Alerts
- **Test Code:** [TC019_Financial_Goal_Tracking_and_Alerts.py](./TC019_Financial_Goal_Tracking_and_Alerts.py)
- **Test Error:** The task to validate creation of financial goals, progress tracking, and alert generation on goal milestones or failures is partially complete. We successfully created a financial goal titled 'Viagem para a Europa' with a target of R$100.00 and a 12-month deadline. We recorded transactions affecting the goal, including an 'Entrada' transaction of R$5.00 and an expense transaction, and observed that the progress tracking updates correctly for income transactions. However, alert generation for goal milestones or failures was not fully tested due to limited transaction simulation. Overall, the core functionalities of goal creation and progress tracking are validated, but alert generation requires additional testing.
- **Test Visualization and Result:** https://www.testsprite.com/dashboard/mcp/tests/fa7e461c-0781-4e0a-9a4f-41b2faf1e6ac/80c0056e-0d62-46c8-b503-c7ac50c4e3a9
- **Status:** ❌ Failed
- **Analysis / Findings:** {{TODO:AI_ANALYSIS}}.
---

#### Test TC020
- **Test Name:** Robustness of Drag-and-Drop in Calendar and Tasks
- **Test Code:** [TC020_Robustness_of_Drag_and_Drop_in_Calendar_and_Tasks.py](./TC020_Robustness_of_Drag_and_Drop_in_Calendar_and_Tasks.py)
- **Test Error:** Calendar event drag-and-drop functionality was successfully tested across day and week views, including valid and invalid drop handling. Task prioritization drag-and-drop testing was started by opening the new task creation modal and partially filling in a high priority task, but task creation and reordering tests were not completed. The overall task is partially finished due to incomplete task drag-and-drop testing.
Browser Console Logs:
[ERROR] Warning: Function components cannot be given refs. Attempts to access this ref will fail. Did you mean to use React.forwardRef()?%s%s 

Check the render method of `Primitive.button.SlotClone`. 
    at DraggableEvent (http://localhost:8080/src/components/AgendaGridWeek.tsx?t=1763104751159:98:31)
    at http://localhost:8080/node_modules/.vite/deps/chunk-X5NZ3XE2.js?v=caf6c667:79:13
    at http://localhost:8080/node_modules/.vite/deps/chunk-X5NZ3XE2.js?v=caf6c667:56:13
    at http://localhost:8080/node_modules/.vite/deps/chunk-O2YYWS4G.js?v=caf6c667:43:13
    at http://localhost:8080/node_modules/.vite/deps/chunk-X5NZ3XE2.js?v=caf6c667:79:13
    at http://localhost:8080/node_modules/.vite/deps/chunk-X5NZ3XE2.js?v=caf6c667:56:13
    at http://localhost:8080/node_modules/.vite/deps/chunk-O2YYWS4G.js?v=caf6c667:43:13
    at http://localhost:8080/node_modules/.vite/deps/chunk-5SYEHYVE.js?v=caf6c667:1955:13
    at http://localhost:8080/node_modules/.vite/deps/@radix-ui_react-popover.js?v=6df56843:119:13
    at Provider (http://localhost:8080/node_modules/.vite/deps/chunk-3RXG37ZK.js?v=caf6c667:38:15)
    at Provider (http://localhost:8080/node_modules/.vite/deps/chunk-3RXG37ZK.js?v=caf6c667:38:15)
    at Popper (http://localhost:8080/node_modules/.vite/deps/chunk-5SYEHYVE.js?v=caf6c667:1947:11)
    at Popover (http://localhost:8080/node_modules/.vite/deps/@radix-ui_react-popover.js?v=6df56843:67:5)
    at EventPopover (http://localhost:8080/src/components/EventPopover.tsx?t=1763104751159:32:40)
    at div
    at div
    at div
    at DndContext2 (http://localhost:8080/node_modules/.vite/deps/chunk-525GK5KX.js?v=caf6c667:2521:5)
    at div
    at _c (http://localhost:8080/src/components/ui/card.tsx:23:53)
    at AgendaGridWeek (http://localhost:8080/src/components/AgendaGridWeek.tsx?t=1763104751159:32:42)
    at div
    at div
    at div
    at div
    at Agenda (http://localhost:8080/src/pages/Agenda.tsx?t=1763104751159:49:25)
    at div
    at main
    at div
    at div
    at NotificationProvider (http://localhost:8080/src/contexts/NotificationContext.tsx?t=1763104751159:27:40)
    at AppLayout (http://localhost:8080/src/components/layout/AppLayout.tsx?t=1763104751159:30:29)
    at ProtectedRoute (http://localhost:8080/src/components/ProtectedRoute.tsx?t=1763104751159:24:34)
    at RenderedRoute (http://localhost:8080/node_modules/.vite/deps/react-router-dom.js?v=b9ef3e2d:4088:5)
    at Routes (http://localhost:8080/node_modules/.vite/deps/react-router-dom.js?v=b9ef3e2d:4558:5)
    at Suspense
    at SearchProvider (http://localhost:8080/src/contexts/SearchContext.tsx:24:34)
    at Provider (http://localhost:8080/node_modules/.vite/deps/chunk-3RXG37ZK.js?v=caf6c667:38:15)
    at TooltipProvider (http://localhost:8080/node_modules/.vite/deps/@radix-ui_react-tooltip.js?v=27a5af6c:65:5)
    at AuthProvider (http://localhost:8080/src/contexts/AuthContext.tsx?t=1763104751159:29:32)
    at ThemeProvider (http://localhost:8080/src/contexts/ThemeContext.tsx:24:33)
    at Router (http://localhost:8080/node_modules/.vite/deps/react-router-dom.js?v=b9ef3e2d:4501:15)
    at BrowserRouter (http://localhost:8080/node_modules/.vite/deps/react-router-dom.js?v=b9ef3e2d:5247:5)
    at App
    at QueryClientProvider (http://localhost:8080/node_modules/.vite/deps/chunk-O56JZI23.js?v=caf6c667:3086:3) (at http://localhost:8080/node_modules/.vite/deps/chunk-W6L2VRDA.js?v=caf6c667:520:37)
[ERROR] Warning: Function components cannot be given refs. Attempts to access this ref will fail. Did you mean to use React.forwardRef()?%s%s 

Check the render method of `Primitive.button.SlotClone`. 
    at DraggableEvent (http://localhost:8080/src/components/AgendaGridWeek.tsx?t=1763104751159:98:31)
    at http://localhost:8080/node_modules/.vite/deps/chunk-X5NZ3XE2.js?v=caf6c667:79:13
    at http://localhost:8080/node_modules/.vite/deps/chunk-X5NZ3XE2.js?v=caf6c667:56:13
    at http://localhost:8080/node_modules/.vite/deps/chunk-O2YYWS4G.js?v=caf6c667:43:13
    at http://localhost:8080/node_modules/.vite/deps/chunk-X5NZ3XE2.js?v=caf6c667:79:13
    at http://localhost:8080/node_modules/.vite/deps/chunk-X5NZ3XE2.js?v=caf6c667:56:13
    at http://localhost:8080/node_modules/.vite/deps/chunk-O2YYWS4G.js?v=caf6c667:43:13
    at http://localhost:8080/node_modules/.vite/deps/chunk-5SYEHYVE.js?v=caf6c667:1955:13
    at http://localhost:8080/node_modules/.vite/deps/@radix-ui_react-popover.js?v=6df56843:119:13
    at Provider (http://localhost:8080/node_modules/.vite/deps/chunk-3RXG37ZK.js?v=caf6c667:38:15)
    at Provider (http://localhost:8080/node_modules/.vite/deps/chunk-3RXG37ZK.js?v=caf6c667:38:15)
    at Popper (http://localhost:8080/node_modules/.vite/deps/chunk-5SYEHYVE.js?v=caf6c667:1947:11)
    at Popover (http://localhost:8080/node_modules/.vite/deps/@radix-ui_react-popover.js?v=6df56843:67:5)
    at EventPopover (http://localhost:8080/src/components/EventPopover.tsx?t=1763104751159:32:40)
    at div
    at div
    at MotionDOMComponent (http://localhost:8080/node_modules/.vite/deps/framer-motion.js?v=3c1a5aa8:5396:40)
    at DroppableDay (http://localhost:8080/src/components/AgendaGridWeek.tsx?t=1763104751159:178:29)
    at div
    at div
    at DndContext2 (http://localhost:8080/node_modules/.vite/deps/chunk-525GK5KX.js?v=caf6c667:2521:5)
    at div
    at _c (http://localhost:8080/src/components/ui/card.tsx:23:53)
    at AgendaGridWeek (http://localhost:8080/src/components/AgendaGridWeek.tsx?t=1763104751159:32:42)
    at div
    at div
    at div
    at div
    at Agenda (http://localhost:8080/src/pages/Agenda.tsx?t=1763104751159:49:25)
    at div
    at main
    at div
    at div
    at NotificationProvider (http://localhost:8080/src/contexts/NotificationContext.tsx?t=1763104751159:27:40)
    at AppLayout (http://localhost:8080/src/components/layout/AppLayout.tsx?t=1763104751159:30:29)
    at ProtectedRoute (http://localhost:8080/src/components/ProtectedRoute.tsx?t=1763104751159:24:34)
    at RenderedRoute (http://localhost:8080/node_modules/.vite/deps/react-router-dom.js?v=b9ef3e2d:4088:5)
    at Routes (http://localhost:8080/node_modules/.vite/deps/react-router-dom.js?v=b9ef3e2d:4558:5)
    at Suspense
    at SearchProvider (http://localhost:8080/src/contexts/SearchContext.tsx:24:34)
    at Provider (http://localhost:8080/node_modules/.vite/deps/chunk-3RXG37ZK.js?v=caf6c667:38:15)
    at TooltipProvider (http://localhost:8080/node_modules/.vite/deps/@radix-ui_react-tooltip.js?v=27a5af6c:65:5)
    at AuthProvider (http://localhost:8080/src/contexts/AuthContext.tsx?t=1763104751159:29:32)
    at ThemeProvider (http://localhost:8080/src/contexts/ThemeContext.tsx:24:33)
    at Router (http://localhost:8080/node_modules/.vite/deps/react-router-dom.js?v=b9ef3e2d:4501:15)
    at BrowserRouter (http://localhost:8080/node_modules/.vite/deps/react-router-dom.js?v=b9ef3e2d:5247:5)
    at App
    at QueryClientProvider (http://localhost:8080/node_modules/.vite/deps/chunk-O56JZI23.js?v=caf6c667:3086:3) (at http://localhost:8080/node_modules/.vite/deps/chunk-W6L2VRDA.js?v=caf6c667:520:37)
[ERROR] ❌ Erro no canal de alertas financeiros (não crítico) (at http://localhost:8080/src/hooks/useRealtimeFinancialAlerts.ts:94:24)
[ERROR] ❌ Erro no canal de notificações (at http://localhost:8080/src/contexts/NotificationContext.tsx?t=1763104751159:113:32)
[ERROR] ❌ Erro no canal de alertas financeiros (não crítico) (at http://localhost:8080/src/hooks/useRealtimeFinancialAlerts.ts:94:24)
[ERROR] ❌ Erro no canal de notificações (at http://localhost:8080/src/contexts/NotificationContext.tsx?t=1763104751159:113:32)
- **Test Visualization and Result:** https://www.testsprite.com/dashboard/mcp/tests/fa7e461c-0781-4e0a-9a4f-41b2faf1e6ac/1fafe3a5-02bf-4e74-b8a0-11e33b8abe3f
- **Status:** ❌ Failed
- **Analysis / Findings:** {{TODO:AI_ANALYSIS}}.
---


## 3️⃣ Coverage & Matching Metrics

- **55.00** of tests passed

| Requirement        | Total Tests | ✅ Passed | ❌ Failed  |
|--------------------|-------------|-----------|------------|
| ...                | ...         | ...       | ...        |
---


## 4️⃣ Key Gaps / Risks
{AI_GNERATED_KET_GAPS_AND_RISKS}
---