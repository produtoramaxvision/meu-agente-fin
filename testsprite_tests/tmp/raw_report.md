
# TestSprite AI Testing Report(MCP)

---

## 1️⃣ Document Metadata
- **Project Name:** meu-agente-fin
- **Date:** 2025-10-12
- **Prepared by:** TestSprite AI Team

---

## 2️⃣ Requirement Validation Summary

#### Test TC001
- **Test Name:** Phone-based Authentication Success
- **Test Code:** [TC001_Phone_based_Authentication_Success.py](./TC001_Phone_based_Authentication_Success.py)
- **Test Visualization and Result:** https://www.testsprite.com/dashboard/mcp/tests/8dedef91-8f75-4ccd-bf96-5e925d7fe17c/6229967a-f4f6-4d88-81e2-922f25a0bd56
- **Status:** ✅ Passed
- **Analysis / Findings:** {{TODO:AI_ANALYSIS}}.
---

#### Test TC002
- **Test Name:** Phone-based Authentication Failure with Invalid Number
- **Test Code:** [TC002_Phone_based_Authentication_Failure_with_Invalid_Number.py](./TC002_Phone_based_Authentication_Failure_with_Invalid_Number.py)
- **Test Visualization and Result:** https://www.testsprite.com/dashboard/mcp/tests/8dedef91-8f75-4ccd-bf96-5e925d7fe17c/72cbf0b7-b3f1-4541-a684-2ce08d0ec603
- **Status:** ✅ Passed
- **Analysis / Findings:** {{TODO:AI_ANALYSIS}}.
---

#### Test TC003
- **Test Name:** Rate Limiting on Authentication Attempts
- **Test Code:** [TC003_Rate_Limiting_on_Authentication_Attempts.py](./TC003_Rate_Limiting_on_Authentication_Attempts.py)
- **Test Visualization and Result:** https://www.testsprite.com/dashboard/mcp/tests/8dedef91-8f75-4ccd-bf96-5e925d7fe17c/a08dafcf-3427-403b-9a64-cb2927b04c73
- **Status:** ✅ Passed
- **Analysis / Findings:** {{TODO:AI_ANALYSIS}}.
---

#### Test TC004
- **Test Name:** Financial Record Creation and Categorization
- **Test Code:** [TC004_Financial_Record_Creation_and_Categorization.py](./TC004_Financial_Record_Creation_and_Categorization.py)
- **Test Error:** Tested adding financial records with correct categorization and data fields. Income record was saved and visible correctly. Expense record was saved but not visible in the list, indicating a display or filtering issue. Task stopped due to this issue.
Browser Console Logs:
[WARNING] useAgendaData: Datas inválidas ou iguais: {startDate: Sun Oct 12 2025 15:29:32 GMT+0000 (Coordinated Universal Time), endDate: Sun Oct 12 2025 15:29:32 GMT+0000 (Coordinated Universal Time)} (at http://localhost:8080/src/hooks/useAgendaData.ts:85:24)
[WARNING] useAgendaData: Datas inválidas ou iguais: {startDate: Sun Oct 12 2025 15:29:32 GMT+0000 (Coordinated Universal Time), endDate: Sun Oct 12 2025 15:29:32 GMT+0000 (Coordinated Universal Time)} (at http://localhost:8080/src/hooks/useAgendaData.ts:85:24)
[WARNING] useAgendaData: Datas inválidas ou iguais: {startDate: Sun Oct 12 2025 15:29:32 GMT+0000 (Coordinated Universal Time), endDate: Sun Oct 12 2025 15:29:32 GMT+0000 (Coordinated Universal Time)} (at http://localhost:8080/src/hooks/useAgendaData.ts:85:24)
[WARNING] useAgendaData: Datas inválidas ou iguais: {startDate: Sun Oct 12 2025 15:29:33 GMT+0000 (Coordinated Universal Time), endDate: Sun Oct 12 2025 15:29:33 GMT+0000 (Coordinated Universal Time)} (at http://localhost:8080/src/hooks/useAgendaData.ts:85:24)
[WARNING] useAgendaData: Datas inválidas ou iguais: {startDate: Sun Oct 12 2025 15:29:33 GMT+0000 (Coordinated Universal Time), endDate: Sun Oct 12 2025 15:29:33 GMT+0000 (Coordinated Universal Time)} (at http://localhost:8080/src/hooks/useAgendaData.ts:85:24)
[WARNING] useAgendaData: Datas inválidas ou iguais: {startDate: Sun Oct 12 2025 15:29:33 GMT+0000 (Coordinated Universal Time), endDate: Sun Oct 12 2025 15:29:33 GMT+0000 (Coordinated Universal Time)} (at http://localhost:8080/src/hooks/useAgendaData.ts:85:24)
[WARNING] useAgendaData: Datas inválidas ou iguais: {startDate: Sun Oct 12 2025 15:29:33 GMT+0000 (Coordinated Universal Time), endDate: Sun Oct 12 2025 15:29:33 GMT+0000 (Coordinated Universal Time)} (at http://localhost:8080/src/hooks/useAgendaData.ts:85:24)
[WARNING] useAgendaData: Datas inválidas ou iguais: {startDate: Sun Oct 12 2025 15:29:33 GMT+0000 (Coordinated Universal Time), endDate: Sun Oct 12 2025 15:29:33 GMT+0000 (Coordinated Universal Time)} (at http://localhost:8080/src/hooks/useAgendaData.ts:85:24)
[WARNING] useAgendaData: Datas inválidas ou iguais: {startDate: Sun Oct 12 2025 15:29:33 GMT+0000 (Coordinated Universal Time), endDate: Sun Oct 12 2025 15:29:33 GMT+0000 (Coordinated Universal Time)} (at http://localhost:8080/src/hooks/useAgendaData.ts:85:24)
[WARNING] useAgendaData: Datas inválidas ou iguais: {startDate: Sun Oct 12 2025 15:29:33 GMT+0000 (Coordinated Universal Time), endDate: Sun Oct 12 2025 15:29:33 GMT+0000 (Coordinated Universal Time)} (at http://localhost:8080/src/hooks/useAgendaData.ts:85:24)
[WARNING] useAgendaData: Datas inválidas ou iguais: {startDate: Sun Oct 12 2025 15:29:33 GMT+0000 (Coordinated Universal Time), endDate: Sun Oct 12 2025 15:29:33 GMT+0000 (Coordinated Universal Time)} (at http://localhost:8080/src/hooks/useAgendaData.ts:85:24)
[WARNING] useAgendaData: Datas inválidas ou iguais: {startDate: Sun Oct 12 2025 15:29:33 GMT+0000 (Coordinated Universal Time), endDate: Sun Oct 12 2025 15:29:33 GMT+0000 (Coordinated Universal Time)} (at http://localhost:8080/src/hooks/useAgendaData.ts:85:24)
[WARNING] useAgendaData: Datas inválidas ou iguais: {startDate: Sun Oct 12 2025 15:29:33 GMT+0000 (Coordinated Universal Time), endDate: Sun Oct 12 2025 15:29:33 GMT+0000 (Coordinated Universal Time)} (at http://localhost:8080/src/hooks/useAgendaData.ts:85:24)
[ERROR] 🚨 LOOP INFINITO DETECTADO! Bloqueando requisição para evitar sobrecarga do Supabase (at http://localhost:8080/src/hooks/useAgendaData.ts:73:28)
[WARNING] useAgendaData: Datas inválidas ou iguais: {startDate: Sun Oct 12 2025 15:29:33 GMT+0000 (Coordinated Universal Time), endDate: Sun Oct 12 2025 15:29:33 GMT+0000 (Coordinated Universal Time)} (at http://localhost:8080/src/hooks/useAgendaData.ts:85:24)
[WARNING] useAgendaData: Datas inválidas ou iguais: {startDate: Sun Oct 12 2025 15:29:33 GMT+0000 (Coordinated Universal Time), endDate: Sun Oct 12 2025 15:29:33 GMT+0000 (Coordinated Universal Time)} (at http://localhost:8080/src/hooks/useAgendaData.ts:85:24)
[WARNING] useAgendaData: Datas inválidas ou iguais: {startDate: Sun Oct 12 2025 15:29:33 GMT+0000 (Coordinated Universal Time), endDate: Sun Oct 12 2025 15:29:33 GMT+0000 (Coordinated Universal Time)} (at http://localhost:8080/src/hooks/useAgendaData.ts:85:24)
[WARNING] useAgendaData: Datas inválidas ou iguais: {startDate: Sun Oct 12 2025 15:29:33 GMT+0000 (Coordinated Universal Time), endDate: Sun Oct 12 2025 15:29:33 GMT+0000 (Coordinated Universal Time)} (at http://localhost:8080/src/hooks/useAgendaData.ts:85:24)
[WARNING] useAgendaData: Datas inválidas ou iguais: {startDate: Sun Oct 12 2025 15:29:33 GMT+0000 (Coordinated Universal Time), endDate: Sun Oct 12 2025 15:29:33 GMT+0000 (Coordinated Universal Time)} (at http://localhost:8080/src/hooks/useAgendaData.ts:85:24)
[WARNING] useAgendaData: Datas inválidas ou iguais: {startDate: Sun Oct 12 2025 15:29:33 GMT+0000 (Coordinated Universal Time), endDate: Sun Oct 12 2025 15:29:33 GMT+0000 (Coordinated Universal Time)} (at http://localhost:8080/src/hooks/useAgendaData.ts:85:24)
- **Test Visualization and Result:** https://www.testsprite.com/dashboard/mcp/tests/8dedef91-8f75-4ccd-bf96-5e925d7fe17c/bf281020-26e7-4d20-9ba1-744f7af604ca
- **Status:** ❌ Failed
- **Analysis / Findings:** {{TODO:AI_ANALYSIS}}.
---

#### Test TC005
- **Test Name:** Financial Record Export Functionality
- **Test Code:** [TC005_Financial_Record_Export_Functionality.py](./TC005_Financial_Record_Export_Functionality.py)
- **Test Error:** The financial records export functionality for paid plan users was successfully tested for CSV format with filters applied for date range (01/10/2025 to 12/10/2025) and category ('Salário'). The exported CSV file contained all selected records accurately as confirmed by the success message and record count (16). The PDF export and export restriction for free plan users were not tested yet, so the task is not fully complete.
Browser Console Logs:
[WARNING] useAgendaData: Datas inválidas ou iguais: {startDate: Sun Oct 12 2025 15:29:31 GMT+0000 (Coordinated Universal Time), endDate: Sun Oct 12 2025 15:29:31 GMT+0000 (Coordinated Universal Time)} (at http://localhost:8080/src/hooks/useAgendaData.ts:85:24)
[WARNING] useAgendaData: Datas inválidas ou iguais: {startDate: Sun Oct 12 2025 15:29:31 GMT+0000 (Coordinated Universal Time), endDate: Sun Oct 12 2025 15:29:31 GMT+0000 (Coordinated Universal Time)} (at http://localhost:8080/src/hooks/useAgendaData.ts:85:24)
[WARNING] useAgendaData: Datas inválidas ou iguais: {startDate: Sun Oct 12 2025 15:29:31 GMT+0000 (Coordinated Universal Time), endDate: Sun Oct 12 2025 15:29:31 GMT+0000 (Coordinated Universal Time)} (at http://localhost:8080/src/hooks/useAgendaData.ts:85:24)
[WARNING] useAgendaData: Datas inválidas ou iguais: {startDate: Sun Oct 12 2025 15:29:32 GMT+0000 (Coordinated Universal Time), endDate: Sun Oct 12 2025 15:29:32 GMT+0000 (Coordinated Universal Time)} (at http://localhost:8080/src/hooks/useAgendaData.ts:85:24)
[WARNING] useAgendaData: Datas inválidas ou iguais: {startDate: Sun Oct 12 2025 15:29:32 GMT+0000 (Coordinated Universal Time), endDate: Sun Oct 12 2025 15:29:32 GMT+0000 (Coordinated Universal Time)} (at http://localhost:8080/src/hooks/useAgendaData.ts:85:24)
[WARNING] useAgendaData: Datas inválidas ou iguais: {startDate: Sun Oct 12 2025 15:29:32 GMT+0000 (Coordinated Universal Time), endDate: Sun Oct 12 2025 15:29:32 GMT+0000 (Coordinated Universal Time)} (at http://localhost:8080/src/hooks/useAgendaData.ts:85:24)
[WARNING] useAgendaData: Datas inválidas ou iguais: {startDate: Sun Oct 12 2025 15:29:32 GMT+0000 (Coordinated Universal Time), endDate: Sun Oct 12 2025 15:29:32 GMT+0000 (Coordinated Universal Time)} (at http://localhost:8080/src/hooks/useAgendaData.ts:85:24)
[WARNING] useAgendaData: Datas inválidas ou iguais: {startDate: Sun Oct 12 2025 15:29:32 GMT+0000 (Coordinated Universal Time), endDate: Sun Oct 12 2025 15:29:32 GMT+0000 (Coordinated Universal Time)} (at http://localhost:8080/src/hooks/useAgendaData.ts:85:24)
[WARNING] useAgendaData: Datas inválidas ou iguais: {startDate: Sun Oct 12 2025 15:29:32 GMT+0000 (Coordinated Universal Time), endDate: Sun Oct 12 2025 15:29:32 GMT+0000 (Coordinated Universal Time)} (at http://localhost:8080/src/hooks/useAgendaData.ts:85:24)
[WARNING] useAgendaData: Datas inválidas ou iguais: {startDate: Sun Oct 12 2025 15:29:32 GMT+0000 (Coordinated Universal Time), endDate: Sun Oct 12 2025 15:29:32 GMT+0000 (Coordinated Universal Time)} (at http://localhost:8080/src/hooks/useAgendaData.ts:85:24)
[WARNING] useAgendaData: Datas inválidas ou iguais: {startDate: Sun Oct 12 2025 15:29:32 GMT+0000 (Coordinated Universal Time), endDate: Sun Oct 12 2025 15:29:32 GMT+0000 (Coordinated Universal Time)} (at http://localhost:8080/src/hooks/useAgendaData.ts:85:24)
[WARNING] useAgendaData: Datas inválidas ou iguais: {startDate: Sun Oct 12 2025 15:29:32 GMT+0000 (Coordinated Universal Time), endDate: Sun Oct 12 2025 15:29:32 GMT+0000 (Coordinated Universal Time)} (at http://localhost:8080/src/hooks/useAgendaData.ts:85:24)
[ERROR] 🚨 LOOP INFINITO DETECTADO! Bloqueando requisição para evitar sobrecarga do Supabase (at http://localhost:8080/src/hooks/useAgendaData.ts:73:28)
[WARNING] useAgendaData: Datas inválidas ou iguais: {startDate: Sun Oct 12 2025 15:29:32 GMT+0000 (Coordinated Universal Time), endDate: Sun Oct 12 2025 15:29:32 GMT+0000 (Coordinated Universal Time)} (at http://localhost:8080/src/hooks/useAgendaData.ts:85:24)
[WARNING] useAgendaData: Datas inválidas ou iguais: {startDate: Sun Oct 12 2025 15:29:32 GMT+0000 (Coordinated Universal Time), endDate: Sun Oct 12 2025 15:29:32 GMT+0000 (Coordinated Universal Time)} (at http://localhost:8080/src/hooks/useAgendaData.ts:85:24)
[WARNING] useAgendaData: Datas inválidas ou iguais: {startDate: Sun Oct 12 2025 15:29:32 GMT+0000 (Coordinated Universal Time), endDate: Sun Oct 12 2025 15:29:32 GMT+0000 (Coordinated Universal Time)} (at http://localhost:8080/src/hooks/useAgendaData.ts:85:24)
[WARNING] useAgendaData: Datas inválidas ou iguais: {startDate: Sun Oct 12 2025 15:29:32 GMT+0000 (Coordinated Universal Time), endDate: Sun Oct 12 2025 15:29:32 GMT+0000 (Coordinated Universal Time)} (at http://localhost:8080/src/hooks/useAgendaData.ts:85:24)
[WARNING] useAgendaData: Datas inválidas ou iguais: {startDate: Sun Oct 12 2025 15:29:32 GMT+0000 (Coordinated Universal Time), endDate: Sun Oct 12 2025 15:29:32 GMT+0000 (Coordinated Universal Time)} (at http://localhost:8080/src/hooks/useAgendaData.ts:85:24)
[WARNING] useAgendaData: Datas inválidas ou iguais: {startDate: Sun Oct 12 2025 15:29:32 GMT+0000 (Coordinated Universal Time), endDate: Sun Oct 12 2025 15:29:32 GMT+0000 (Coordinated Universal Time)} (at http://localhost:8080/src/hooks/useAgendaData.ts:85:24)
[WARNING] useAgendaData: Datas inválidas ou iguais: {startDate: Sun Oct 12 2025 15:29:32 GMT+0000 (Coordinated Universal Time), endDate: Sun Oct 12 2025 15:29:32 GMT+0000 (Coordinated Universal Time)} (at http://localhost:8080/src/hooks/useAgendaData.ts:85:24)
- **Test Visualization and Result:** https://www.testsprite.com/dashboard/mcp/tests/8dedef91-8f75-4ccd-bf96-5e925d7fe17c/2abf0032-ace5-4ac8-889c-4870e3d90508
- **Status:** ❌ Failed
- **Analysis / Findings:** {{TODO:AI_ANALYSIS}}.
---

#### Test TC006
- **Test Name:** Google Workspace Integration for Calendar Events
- **Test Code:** [TC006_Google_Workspace_Integration_for_Calendar_Events.py](./TC006_Google_Workspace_Integration_for_Calendar_Events.py)
- **Test Error:** Tested creating a calendar event successfully in the app. Verification of synchronization with Google Calendar failed due to CAPTCHA blocking external search. The app calendar page is stuck loading and does not allow further update or delete event tests. Reporting this issue for investigation. Test incomplete.
Browser Console Logs:
[WARNING] useAgendaData: Datas inválidas ou iguais: {startDate: Sun Oct 12 2025 15:29:32 GMT+0000 (Coordinated Universal Time), endDate: Sun Oct 12 2025 15:29:32 GMT+0000 (Coordinated Universal Time)} (at http://localhost:8080/src/hooks/useAgendaData.ts:85:24)
[WARNING] useAgendaData: Datas inválidas ou iguais: {startDate: Sun Oct 12 2025 15:29:32 GMT+0000 (Coordinated Universal Time), endDate: Sun Oct 12 2025 15:29:32 GMT+0000 (Coordinated Universal Time)} (at http://localhost:8080/src/hooks/useAgendaData.ts:85:24)
[WARNING] useAgendaData: Datas inválidas ou iguais: {startDate: Sun Oct 12 2025 15:29:32 GMT+0000 (Coordinated Universal Time), endDate: Sun Oct 12 2025 15:29:32 GMT+0000 (Coordinated Universal Time)} (at http://localhost:8080/src/hooks/useAgendaData.ts:85:24)
[WARNING] useAgendaData: Datas inválidas ou iguais: {startDate: Sun Oct 12 2025 15:29:32 GMT+0000 (Coordinated Universal Time), endDate: Sun Oct 12 2025 15:29:32 GMT+0000 (Coordinated Universal Time)} (at http://localhost:8080/src/hooks/useAgendaData.ts:85:24)
[WARNING] useAgendaData: Datas inválidas ou iguais: {startDate: Sun Oct 12 2025 15:29:32 GMT+0000 (Coordinated Universal Time), endDate: Sun Oct 12 2025 15:29:32 GMT+0000 (Coordinated Universal Time)} (at http://localhost:8080/src/hooks/useAgendaData.ts:85:24)
[WARNING] useAgendaData: Datas inválidas ou iguais: {startDate: Sun Oct 12 2025 15:29:32 GMT+0000 (Coordinated Universal Time), endDate: Sun Oct 12 2025 15:29:32 GMT+0000 (Coordinated Universal Time)} (at http://localhost:8080/src/hooks/useAgendaData.ts:85:24)
[WARNING] useAgendaData: Datas inválidas ou iguais: {startDate: Sun Oct 12 2025 15:29:32 GMT+0000 (Coordinated Universal Time), endDate: Sun Oct 12 2025 15:29:32 GMT+0000 (Coordinated Universal Time)} (at http://localhost:8080/src/hooks/useAgendaData.ts:85:24)
[WARNING] useAgendaData: Datas inválidas ou iguais: {startDate: Sun Oct 12 2025 15:29:32 GMT+0000 (Coordinated Universal Time), endDate: Sun Oct 12 2025 15:29:32 GMT+0000 (Coordinated Universal Time)} (at http://localhost:8080/src/hooks/useAgendaData.ts:85:24)
[WARNING] useAgendaData: Datas inválidas ou iguais: {startDate: Sun Oct 12 2025 15:29:32 GMT+0000 (Coordinated Universal Time), endDate: Sun Oct 12 2025 15:29:32 GMT+0000 (Coordinated Universal Time)} (at http://localhost:8080/src/hooks/useAgendaData.ts:85:24)
[WARNING] useAgendaData: Datas inválidas ou iguais: {startDate: Sun Oct 12 2025 15:29:32 GMT+0000 (Coordinated Universal Time), endDate: Sun Oct 12 2025 15:29:32 GMT+0000 (Coordinated Universal Time)} (at http://localhost:8080/src/hooks/useAgendaData.ts:85:24)
[WARNING] useAgendaData: Datas inválidas ou iguais: {startDate: Sun Oct 12 2025 15:29:32 GMT+0000 (Coordinated Universal Time), endDate: Sun Oct 12 2025 15:29:32 GMT+0000 (Coordinated Universal Time)} (at http://localhost:8080/src/hooks/useAgendaData.ts:85:24)
[ERROR] 🚨 LOOP INFINITO DETECTADO! Bloqueando requisição para evitar sobrecarga do Supabase (at http://localhost:8080/src/hooks/useAgendaData.ts:73:28)
[ERROR] 🚨 LOOP INFINITO DETECTADO! Bloqueando requisição para evitar sobrecarga do Supabase (at http://localhost:8080/src/hooks/useAgendaData.ts:73:28)
[WARNING] useAgendaData: Datas inválidas ou iguais: {startDate: Sun Oct 12 2025 15:29:32 GMT+0000 (Coordinated Universal Time), endDate: Sun Oct 12 2025 15:29:32 GMT+0000 (Coordinated Universal Time)} (at http://localhost:8080/src/hooks/useAgendaData.ts:85:24)
[WARNING] useAgendaData: Datas inválidas ou iguais: {startDate: Sun Oct 12 2025 15:29:32 GMT+0000 (Coordinated Universal Time), endDate: Sun Oct 12 2025 15:29:32 GMT+0000 (Coordinated Universal Time)} (at http://localhost:8080/src/hooks/useAgendaData.ts:85:24)
[WARNING] useAgendaData: Datas inválidas ou iguais: {startDate: Sun Oct 12 2025 15:29:32 GMT+0000 (Coordinated Universal Time), endDate: Sun Oct 12 2025 15:29:32 GMT+0000 (Coordinated Universal Time)} (at http://localhost:8080/src/hooks/useAgendaData.ts:85:24)
[WARNING] useAgendaData: Datas inválidas ou iguais: {startDate: Sun Oct 12 2025 15:29:33 GMT+0000 (Coordinated Universal Time), endDate: Sun Oct 12 2025 15:29:33 GMT+0000 (Coordinated Universal Time)} (at http://localhost:8080/src/hooks/useAgendaData.ts:85:24)
[WARNING] useAgendaData: Datas inválidas ou iguais: {startDate: Sun Oct 12 2025 15:29:33 GMT+0000 (Coordinated Universal Time), endDate: Sun Oct 12 2025 15:29:33 GMT+0000 (Coordinated Universal Time)} (at http://localhost:8080/src/hooks/useAgendaData.ts:85:24)
[WARNING] useAgendaData: Datas inválidas ou iguais: {startDate: Sun Oct 12 2025 15:29:33 GMT+0000 (Coordinated Universal Time), endDate: Sun Oct 12 2025 15:29:33 GMT+0000 (Coordinated Universal Time)} (at http://localhost:8080/src/hooks/useAgendaData.ts:85:24)
[WARNING] useAgendaData: Datas inválidas ou iguais: {startDate: Sun Oct 12 2025 15:29:33 GMT+0000 (Coordinated Universal Time), endDate: Sun Oct 12 2025 15:29:33 GMT+0000 (Coordinated Universal Time)} (at http://localhost:8080/src/hooks/useAgendaData.ts:85:24)
- **Test Visualization and Result:** https://www.testsprite.com/dashboard/mcp/tests/8dedef91-8f75-4ccd-bf96-5e925d7fe17c/658e1c5d-f0fa-4657-88a4-e960445c0bc8
- **Status:** ❌ Failed
- **Analysis / Findings:** {{TODO:AI_ANALYSIS}}.
---

#### Test TC007
- **Test Name:** WhatsApp Opt-in and Opt-out Message Handling
- **Test Code:** [TC007_WhatsApp_Opt_in_and_Opt_out_Message_Handling.py](./TC007_WhatsApp_Opt_in_and_Opt_out_Message_Handling.py)
- **Test Error:** Stopped testing due to missing WhatsApp opt-in/out management section in the system UI. Unable to proceed with the task to ensure correct handling of WhatsApp opt-in/out status and messaging limits.
Browser Console Logs:
[WARNING] useAgendaData: Datas inválidas ou iguais: {startDate: Sun Oct 12 2025 15:29:31 GMT+0000 (Coordinated Universal Time), endDate: Sun Oct 12 2025 15:29:31 GMT+0000 (Coordinated Universal Time)} (at http://localhost:8080/src/hooks/useAgendaData.ts:85:24)
[WARNING] useAgendaData: Datas inválidas ou iguais: {startDate: Sun Oct 12 2025 15:29:32 GMT+0000 (Coordinated Universal Time), endDate: Sun Oct 12 2025 15:29:32 GMT+0000 (Coordinated Universal Time)} (at http://localhost:8080/src/hooks/useAgendaData.ts:85:24)
[WARNING] useAgendaData: Datas inválidas ou iguais: {startDate: Sun Oct 12 2025 15:29:32 GMT+0000 (Coordinated Universal Time), endDate: Sun Oct 12 2025 15:29:32 GMT+0000 (Coordinated Universal Time)} (at http://localhost:8080/src/hooks/useAgendaData.ts:85:24)
[WARNING] useAgendaData: Datas inválidas ou iguais: {startDate: Sun Oct 12 2025 15:29:32 GMT+0000 (Coordinated Universal Time), endDate: Sun Oct 12 2025 15:29:32 GMT+0000 (Coordinated Universal Time)} (at http://localhost:8080/src/hooks/useAgendaData.ts:85:24)
[WARNING] useAgendaData: Datas inválidas ou iguais: {startDate: Sun Oct 12 2025 15:29:32 GMT+0000 (Coordinated Universal Time), endDate: Sun Oct 12 2025 15:29:32 GMT+0000 (Coordinated Universal Time)} (at http://localhost:8080/src/hooks/useAgendaData.ts:85:24)
[WARNING] useAgendaData: Datas inválidas ou iguais: {startDate: Sun Oct 12 2025 15:29:32 GMT+0000 (Coordinated Universal Time), endDate: Sun Oct 12 2025 15:29:32 GMT+0000 (Coordinated Universal Time)} (at http://localhost:8080/src/hooks/useAgendaData.ts:85:24)
[WARNING] useAgendaData: Datas inválidas ou iguais: {startDate: Sun Oct 12 2025 15:29:32 GMT+0000 (Coordinated Universal Time), endDate: Sun Oct 12 2025 15:29:32 GMT+0000 (Coordinated Universal Time)} (at http://localhost:8080/src/hooks/useAgendaData.ts:85:24)
[WARNING] useAgendaData: Datas inválidas ou iguais: {startDate: Sun Oct 12 2025 15:29:32 GMT+0000 (Coordinated Universal Time), endDate: Sun Oct 12 2025 15:29:32 GMT+0000 (Coordinated Universal Time)} (at http://localhost:8080/src/hooks/useAgendaData.ts:85:24)
[WARNING] useAgendaData: Datas inválidas ou iguais: {startDate: Sun Oct 12 2025 15:29:32 GMT+0000 (Coordinated Universal Time), endDate: Sun Oct 12 2025 15:29:32 GMT+0000 (Coordinated Universal Time)} (at http://localhost:8080/src/hooks/useAgendaData.ts:85:24)
[WARNING] useAgendaData: Datas inválidas ou iguais: {startDate: Sun Oct 12 2025 15:29:32 GMT+0000 (Coordinated Universal Time), endDate: Sun Oct 12 2025 15:29:32 GMT+0000 (Coordinated Universal Time)} (at http://localhost:8080/src/hooks/useAgendaData.ts:85:24)
[WARNING] useAgendaData: Datas inválidas ou iguais: {startDate: Sun Oct 12 2025 15:29:32 GMT+0000 (Coordinated Universal Time), endDate: Sun Oct 12 2025 15:29:32 GMT+0000 (Coordinated Universal Time)} (at http://localhost:8080/src/hooks/useAgendaData.ts:85:24)
[ERROR] 🚨 LOOP INFINITO DETECTADO! Bloqueando requisição para evitar sobrecarga do Supabase (at http://localhost:8080/src/hooks/useAgendaData.ts:73:28)
[ERROR] 🚨 LOOP INFINITO DETECTADO! Bloqueando requisição para evitar sobrecarga do Supabase (at http://localhost:8080/src/hooks/useAgendaData.ts:73:28)
[WARNING] useAgendaData: Datas inválidas ou iguais: {startDate: Sun Oct 12 2025 15:29:32 GMT+0000 (Coordinated Universal Time), endDate: Sun Oct 12 2025 15:29:32 GMT+0000 (Coordinated Universal Time)} (at http://localhost:8080/src/hooks/useAgendaData.ts:85:24)
[WARNING] useAgendaData: Datas inválidas ou iguais: {startDate: Sun Oct 12 2025 15:29:32 GMT+0000 (Coordinated Universal Time), endDate: Sun Oct 12 2025 15:29:32 GMT+0000 (Coordinated Universal Time)} (at http://localhost:8080/src/hooks/useAgendaData.ts:85:24)
[WARNING] useAgendaData: Datas inválidas ou iguais: {startDate: Sun Oct 12 2025 15:29:32 GMT+0000 (Coordinated Universal Time), endDate: Sun Oct 12 2025 15:29:32 GMT+0000 (Coordinated Universal Time)} (at http://localhost:8080/src/hooks/useAgendaData.ts:85:24)
[WARNING] useAgendaData: Datas inválidas ou iguais: {startDate: Sun Oct 12 2025 15:29:32 GMT+0000 (Coordinated Universal Time), endDate: Sun Oct 12 2025 15:29:32 GMT+0000 (Coordinated Universal Time)} (at http://localhost:8080/src/hooks/useAgendaData.ts:85:24)
[WARNING] useAgendaData: Datas inválidas ou iguais: {startDate: Sun Oct 12 2025 15:29:32 GMT+0000 (Coordinated Universal Time), endDate: Sun Oct 12 2025 15:29:32 GMT+0000 (Coordinated Universal Time)} (at http://localhost:8080/src/hooks/useAgendaData.ts:85:24)
[WARNING] useAgendaData: Datas inválidas ou iguais: {startDate: Sun Oct 12 2025 15:29:32 GMT+0000 (Coordinated Universal Time), endDate: Sun Oct 12 2025 15:29:32 GMT+0000 (Coordinated Universal Time)} (at http://localhost:8080/src/hooks/useAgendaData.ts:85:24)
[WARNING] useAgendaData: Datas inválidas ou iguais: {startDate: Sun Oct 12 2025 15:29:32 GMT+0000 (Coordinated Universal Time), endDate: Sun Oct 12 2025 15:29:32 GMT+0000 (Coordinated Universal Time)} (at http://localhost:8080/src/hooks/useAgendaData.ts:85:24)
- **Test Visualization and Result:** https://www.testsprite.com/dashboard/mcp/tests/8dedef91-8f75-4ccd-bf96-5e925d7fe17c/119b6e27-5205-4bad-bd7a-af3e730f41b0
- **Status:** ❌ Failed
- **Analysis / Findings:** {{TODO:AI_ANALYSIS}}.
---

#### Test TC008
- **Test Name:** Role-Based Access Control and Plan Restrictions
- **Test Code:** [TC008_Role_Based_Access_Control_and_Plan_Restrictions.py](./TC008_Role_Based_Access_Control_and_Plan_Restrictions.py)
- **Test Error:** Logout functionality is broken, preventing switching users for further role-based access tests. Reporting this critical issue and stopping further testing until resolved.
Browser Console Logs:
[WARNING] useAgendaData: Datas inválidas ou iguais: {startDate: Sun Oct 12 2025 15:29:31 GMT+0000 (Coordinated Universal Time), endDate: Sun Oct 12 2025 15:29:31 GMT+0000 (Coordinated Universal Time)} (at http://localhost:8080/src/hooks/useAgendaData.ts:85:24)
[WARNING] useAgendaData: Datas inválidas ou iguais: {startDate: Sun Oct 12 2025 15:29:31 GMT+0000 (Coordinated Universal Time), endDate: Sun Oct 12 2025 15:29:31 GMT+0000 (Coordinated Universal Time)} (at http://localhost:8080/src/hooks/useAgendaData.ts:85:24)
[WARNING] useAgendaData: Datas inválidas ou iguais: {startDate: Sun Oct 12 2025 15:29:31 GMT+0000 (Coordinated Universal Time), endDate: Sun Oct 12 2025 15:29:31 GMT+0000 (Coordinated Universal Time)} (at http://localhost:8080/src/hooks/useAgendaData.ts:85:24)
[WARNING] useAgendaData: Datas inválidas ou iguais: {startDate: Sun Oct 12 2025 15:29:31 GMT+0000 (Coordinated Universal Time), endDate: Sun Oct 12 2025 15:29:31 GMT+0000 (Coordinated Universal Time)} (at http://localhost:8080/src/hooks/useAgendaData.ts:85:24)
[WARNING] useAgendaData: Datas inválidas ou iguais: {startDate: Sun Oct 12 2025 15:29:31 GMT+0000 (Coordinated Universal Time), endDate: Sun Oct 12 2025 15:29:31 GMT+0000 (Coordinated Universal Time)} (at http://localhost:8080/src/hooks/useAgendaData.ts:85:24)
[WARNING] useAgendaData: Datas inválidas ou iguais: {startDate: Sun Oct 12 2025 15:29:31 GMT+0000 (Coordinated Universal Time), endDate: Sun Oct 12 2025 15:29:31 GMT+0000 (Coordinated Universal Time)} (at http://localhost:8080/src/hooks/useAgendaData.ts:85:24)
[WARNING] useAgendaData: Datas inválidas ou iguais: {startDate: Sun Oct 12 2025 15:29:31 GMT+0000 (Coordinated Universal Time), endDate: Sun Oct 12 2025 15:29:31 GMT+0000 (Coordinated Universal Time)} (at http://localhost:8080/src/hooks/useAgendaData.ts:85:24)
[WARNING] useAgendaData: Datas inválidas ou iguais: {startDate: Sun Oct 12 2025 15:29:31 GMT+0000 (Coordinated Universal Time), endDate: Sun Oct 12 2025 15:29:31 GMT+0000 (Coordinated Universal Time)} (at http://localhost:8080/src/hooks/useAgendaData.ts:85:24)
[WARNING] useAgendaData: Datas inválidas ou iguais: {startDate: Sun Oct 12 2025 15:29:31 GMT+0000 (Coordinated Universal Time), endDate: Sun Oct 12 2025 15:29:31 GMT+0000 (Coordinated Universal Time)} (at http://localhost:8080/src/hooks/useAgendaData.ts:85:24)
[WARNING] useAgendaData: Datas inválidas ou iguais: {startDate: Sun Oct 12 2025 15:29:31 GMT+0000 (Coordinated Universal Time), endDate: Sun Oct 12 2025 15:29:31 GMT+0000 (Coordinated Universal Time)} (at http://localhost:8080/src/hooks/useAgendaData.ts:85:24)
[WARNING] useAgendaData: Datas inválidas ou iguais: {startDate: Sun Oct 12 2025 15:29:31 GMT+0000 (Coordinated Universal Time), endDate: Sun Oct 12 2025 15:29:31 GMT+0000 (Coordinated Universal Time)} (at http://localhost:8080/src/hooks/useAgendaData.ts:85:24)
[ERROR] 🚨 LOOP INFINITO DETECTADO! Bloqueando requisição para evitar sobrecarga do Supabase (at http://localhost:8080/src/hooks/useAgendaData.ts:73:28)
[WARNING] useAgendaData: Datas inválidas ou iguais: {startDate: Sun Oct 12 2025 15:29:32 GMT+0000 (Coordinated Universal Time), endDate: Sun Oct 12 2025 15:29:32 GMT+0000 (Coordinated Universal Time)} (at http://localhost:8080/src/hooks/useAgendaData.ts:85:24)
[WARNING] useAgendaData: Datas inválidas ou iguais: {startDate: Sun Oct 12 2025 15:29:32 GMT+0000 (Coordinated Universal Time), endDate: Sun Oct 12 2025 15:29:32 GMT+0000 (Coordinated Universal Time)} (at http://localhost:8080/src/hooks/useAgendaData.ts:85:24)
[WARNING] useAgendaData: Datas inválidas ou iguais: {startDate: Sun Oct 12 2025 15:29:32 GMT+0000 (Coordinated Universal Time), endDate: Sun Oct 12 2025 15:29:32 GMT+0000 (Coordinated Universal Time)} (at http://localhost:8080/src/hooks/useAgendaData.ts:85:24)
[WARNING] useAgendaData: Datas inválidas ou iguais: {startDate: Sun Oct 12 2025 15:29:32 GMT+0000 (Coordinated Universal Time), endDate: Sun Oct 12 2025 15:29:32 GMT+0000 (Coordinated Universal Time)} (at http://localhost:8080/src/hooks/useAgendaData.ts:85:24)
[WARNING] useAgendaData: Datas inválidas ou iguais: {startDate: Sun Oct 12 2025 15:29:32 GMT+0000 (Coordinated Universal Time), endDate: Sun Oct 12 2025 15:29:32 GMT+0000 (Coordinated Universal Time)} (at http://localhost:8080/src/hooks/useAgendaData.ts:85:24)
[WARNING] useAgendaData: Datas inválidas ou iguais: {startDate: Sun Oct 12 2025 15:29:32 GMT+0000 (Coordinated Universal Time), endDate: Sun Oct 12 2025 15:29:32 GMT+0000 (Coordinated Universal Time)} (at http://localhost:8080/src/hooks/useAgendaData.ts:85:24)
[WARNING] useAgendaData: Datas inválidas ou iguais: {startDate: Sun Oct 12 2025 15:29:32 GMT+0000 (Coordinated Universal Time), endDate: Sun Oct 12 2025 15:29:32 GMT+0000 (Coordinated Universal Time)} (at http://localhost:8080/src/hooks/useAgendaData.ts:85:24)
[WARNING] useAgendaData: Datas inválidas ou iguais: {startDate: Sun Oct 12 2025 15:29:32 GMT+0000 (Coordinated Universal Time), endDate: Sun Oct 12 2025 15:29:32 GMT+0000 (Coordinated Universal Time)} (at http://localhost:8080/src/hooks/useAgendaData.ts:85:24)
- **Test Visualization and Result:** https://www.testsprite.com/dashboard/mcp/tests/8dedef91-8f75-4ccd-bf96-5e925d7fe17c/9c322de5-2236-4af0-ae40-3ea1ad0a0077
- **Status:** ❌ Failed
- **Analysis / Findings:** {{TODO:AI_ANALYSIS}}.
---

#### Test TC009
- **Test Name:** Backup System Daily Off-site Backup and Restoration
- **Test Code:** [TC009_Backup_System_Daily_Off_site_Backup_and_Restoration.py](./TC009_Backup_System_Daily_Off_site_Backup_and_Restoration.py)
- **Test Visualization and Result:** https://www.testsprite.com/dashboard/mcp/tests/8dedef91-8f75-4ccd-bf96-5e925d7fe17c/bf356347-e702-420e-a85f-c2a283205c65
- **Status:** ✅ Passed
- **Analysis / Findings:** {{TODO:AI_ANALYSIS}}.
---

#### Test TC010
- **Test Name:** Support Ticket Creation and Priority Handling
- **Test Code:** [TC010_Support_Ticket_Creation_and_Priority_Handling.py](./TC010_Support_Ticket_Creation_and_Priority_Handling.py)
- **Test Error:** Testing stopped due to critical row-level security policy violation blocking support ticket creation for Free plan users. Issue reported for resolution. Cannot proceed further with ticket creation and priority verification tests.
Browser Console Logs:
[WARNING] useAgendaData: Datas inválidas ou iguais: {startDate: Sun Oct 12 2025 15:29:31 GMT+0000 (Coordinated Universal Time), endDate: Sun Oct 12 2025 15:29:31 GMT+0000 (Coordinated Universal Time)} (at http://localhost:8080/src/hooks/useAgendaData.ts:85:24)
[WARNING] useAgendaData: Datas inválidas ou iguais: {startDate: Sun Oct 12 2025 15:29:31 GMT+0000 (Coordinated Universal Time), endDate: Sun Oct 12 2025 15:29:31 GMT+0000 (Coordinated Universal Time)} (at http://localhost:8080/src/hooks/useAgendaData.ts:85:24)
[WARNING] useAgendaData: Datas inválidas ou iguais: {startDate: Sun Oct 12 2025 15:29:31 GMT+0000 (Coordinated Universal Time), endDate: Sun Oct 12 2025 15:29:31 GMT+0000 (Coordinated Universal Time)} (at http://localhost:8080/src/hooks/useAgendaData.ts:85:24)
[WARNING] useAgendaData: Datas inválidas ou iguais: {startDate: Sun Oct 12 2025 15:29:31 GMT+0000 (Coordinated Universal Time), endDate: Sun Oct 12 2025 15:29:31 GMT+0000 (Coordinated Universal Time)} (at http://localhost:8080/src/hooks/useAgendaData.ts:85:24)
[WARNING] useAgendaData: Datas inválidas ou iguais: {startDate: Sun Oct 12 2025 15:29:31 GMT+0000 (Coordinated Universal Time), endDate: Sun Oct 12 2025 15:29:31 GMT+0000 (Coordinated Universal Time)} (at http://localhost:8080/src/hooks/useAgendaData.ts:85:24)
[WARNING] useAgendaData: Datas inválidas ou iguais: {startDate: Sun Oct 12 2025 15:29:31 GMT+0000 (Coordinated Universal Time), endDate: Sun Oct 12 2025 15:29:31 GMT+0000 (Coordinated Universal Time)} (at http://localhost:8080/src/hooks/useAgendaData.ts:85:24)
[WARNING] useAgendaData: Datas inválidas ou iguais: {startDate: Sun Oct 12 2025 15:29:31 GMT+0000 (Coordinated Universal Time), endDate: Sun Oct 12 2025 15:29:31 GMT+0000 (Coordinated Universal Time)} (at http://localhost:8080/src/hooks/useAgendaData.ts:85:24)
[WARNING] useAgendaData: Datas inválidas ou iguais: {startDate: Sun Oct 12 2025 15:29:31 GMT+0000 (Coordinated Universal Time), endDate: Sun Oct 12 2025 15:29:31 GMT+0000 (Coordinated Universal Time)} (at http://localhost:8080/src/hooks/useAgendaData.ts:85:24)
[WARNING] useAgendaData: Datas inválidas ou iguais: {startDate: Sun Oct 12 2025 15:29:31 GMT+0000 (Coordinated Universal Time), endDate: Sun Oct 12 2025 15:29:31 GMT+0000 (Coordinated Universal Time)} (at http://localhost:8080/src/hooks/useAgendaData.ts:85:24)
[WARNING] useAgendaData: Datas inválidas ou iguais: {startDate: Sun Oct 12 2025 15:29:31 GMT+0000 (Coordinated Universal Time), endDate: Sun Oct 12 2025 15:29:31 GMT+0000 (Coordinated Universal Time)} (at http://localhost:8080/src/hooks/useAgendaData.ts:85:24)
[WARNING] useAgendaData: Datas inválidas ou iguais: {startDate: Sun Oct 12 2025 15:29:31 GMT+0000 (Coordinated Universal Time), endDate: Sun Oct 12 2025 15:29:31 GMT+0000 (Coordinated Universal Time)} (at http://localhost:8080/src/hooks/useAgendaData.ts:85:24)
[WARNING] useAgendaData: Datas inválidas ou iguais: {startDate: Sun Oct 12 2025 15:29:31 GMT+0000 (Coordinated Universal Time), endDate: Sun Oct 12 2025 15:29:31 GMT+0000 (Coordinated Universal Time)} (at http://localhost:8080/src/hooks/useAgendaData.ts:85:24)
[ERROR] 🚨 LOOP INFINITO DETECTADO! Bloqueando requisição para evitar sobrecarga do Supabase (at http://localhost:8080/src/hooks/useAgendaData.ts:73:28)
[WARNING] useAgendaData: Datas inválidas ou iguais: {startDate: Sun Oct 12 2025 15:29:32 GMT+0000 (Coordinated Universal Time), endDate: Sun Oct 12 2025 15:29:32 GMT+0000 (Coordinated Universal Time)} (at http://localhost:8080/src/hooks/useAgendaData.ts:85:24)
[WARNING] useAgendaData: Datas inválidas ou iguais: {startDate: Sun Oct 12 2025 15:29:32 GMT+0000 (Coordinated Universal Time), endDate: Sun Oct 12 2025 15:29:32 GMT+0000 (Coordinated Universal Time)} (at http://localhost:8080/src/hooks/useAgendaData.ts:85:24)
[WARNING] useAgendaData: Datas inválidas ou iguais: {startDate: Sun Oct 12 2025 15:29:32 GMT+0000 (Coordinated Universal Time), endDate: Sun Oct 12 2025 15:29:32 GMT+0000 (Coordinated Universal Time)} (at http://localhost:8080/src/hooks/useAgendaData.ts:85:24)
[WARNING] useAgendaData: Datas inválidas ou iguais: {startDate: Sun Oct 12 2025 15:29:32 GMT+0000 (Coordinated Universal Time), endDate: Sun Oct 12 2025 15:29:32 GMT+0000 (Coordinated Universal Time)} (at http://localhost:8080/src/hooks/useAgendaData.ts:85:24)
[WARNING] useAgendaData: Datas inválidas ou iguais: {startDate: Sun Oct 12 2025 15:29:32 GMT+0000 (Coordinated Universal Time), endDate: Sun Oct 12 2025 15:29:32 GMT+0000 (Coordinated Universal Time)} (at http://localhost:8080/src/hooks/useAgendaData.ts:85:24)
[WARNING] useAgendaData: Datas inválidas ou iguais: {startDate: Sun Oct 12 2025 15:29:32 GMT+0000 (Coordinated Universal Time), endDate: Sun Oct 12 2025 15:29:32 GMT+0000 (Coordinated Universal Time)} (at http://localhost:8080/src/hooks/useAgendaData.ts:85:24)
[WARNING] useAgendaData: Datas inválidas ou iguais: {startDate: Sun Oct 12 2025 15:29:32 GMT+0000 (Coordinated Universal Time), endDate: Sun Oct 12 2025 15:29:32 GMT+0000 (Coordinated Universal Time)} (at http://localhost:8080/src/hooks/useAgendaData.ts:85:24)
- **Test Visualization and Result:** https://www.testsprite.com/dashboard/mcp/tests/8dedef91-8f75-4ccd-bf96-5e925d7fe17c/05e5abaf-3dc6-4c87-b71e-1be9a01e3934
- **Status:** ❌ Failed
- **Analysis / Findings:** {{TODO:AI_ANALYSIS}}.
---

#### Test TC011
- **Test Name:** Dashboard Real-Time Data and Export Reports
- **Test Code:** [TC011_Dashboard_Real_Time_Data_and_Export_Reports.py](./TC011_Dashboard_Real_Time_Data_and_Export_Reports.py)
- **Test Visualization and Result:** https://www.testsprite.com/dashboard/mcp/tests/8dedef91-8f75-4ccd-bf96-5e925d7fe17c/7715236c-82a9-445b-9c05-e673a5a2b40a
- **Status:** ✅ Passed
- **Analysis / Findings:** {{TODO:AI_ANALYSIS}}.
---

#### Test TC012
- **Test Name:** AI Sub-agent Functionalities per Subscription Plan
- **Test Code:** [TC012_AI_Sub_agent_Functionalities_per_Subscription_Plan.py](./TC012_AI_Sub_agent_Functionalities_per_Subscription_Plan.py)
- **Test Error:** Logout functionality is broken, preventing switching between user accounts. Cannot proceed with testing sub-agent features for Business and Premium plans. Reporting issue and stopping further actions.
Browser Console Logs:
[WARNING] useAgendaData: Datas inválidas ou iguais: {startDate: Sun Oct 12 2025 15:29:31 GMT+0000 (Coordinated Universal Time), endDate: Sun Oct 12 2025 15:29:31 GMT+0000 (Coordinated Universal Time)} (at http://localhost:8080/src/hooks/useAgendaData.ts:85:24)
[WARNING] useAgendaData: Datas inválidas ou iguais: {startDate: Sun Oct 12 2025 15:29:31 GMT+0000 (Coordinated Universal Time), endDate: Sun Oct 12 2025 15:29:31 GMT+0000 (Coordinated Universal Time)} (at http://localhost:8080/src/hooks/useAgendaData.ts:85:24)
[WARNING] useAgendaData: Datas inválidas ou iguais: {startDate: Sun Oct 12 2025 15:29:31 GMT+0000 (Coordinated Universal Time), endDate: Sun Oct 12 2025 15:29:31 GMT+0000 (Coordinated Universal Time)} (at http://localhost:8080/src/hooks/useAgendaData.ts:85:24)
[WARNING] useAgendaData: Datas inválidas ou iguais: {startDate: Sun Oct 12 2025 15:29:31 GMT+0000 (Coordinated Universal Time), endDate: Sun Oct 12 2025 15:29:31 GMT+0000 (Coordinated Universal Time)} (at http://localhost:8080/src/hooks/useAgendaData.ts:85:24)
[WARNING] useAgendaData: Datas inválidas ou iguais: {startDate: Sun Oct 12 2025 15:29:31 GMT+0000 (Coordinated Universal Time), endDate: Sun Oct 12 2025 15:29:31 GMT+0000 (Coordinated Universal Time)} (at http://localhost:8080/src/hooks/useAgendaData.ts:85:24)
[WARNING] useAgendaData: Datas inválidas ou iguais: {startDate: Sun Oct 12 2025 15:29:31 GMT+0000 (Coordinated Universal Time), endDate: Sun Oct 12 2025 15:29:31 GMT+0000 (Coordinated Universal Time)} (at http://localhost:8080/src/hooks/useAgendaData.ts:85:24)
[WARNING] useAgendaData: Datas inválidas ou iguais: {startDate: Sun Oct 12 2025 15:29:31 GMT+0000 (Coordinated Universal Time), endDate: Sun Oct 12 2025 15:29:31 GMT+0000 (Coordinated Universal Time)} (at http://localhost:8080/src/hooks/useAgendaData.ts:85:24)
[WARNING] useAgendaData: Datas inválidas ou iguais: {startDate: Sun Oct 12 2025 15:29:31 GMT+0000 (Coordinated Universal Time), endDate: Sun Oct 12 2025 15:29:31 GMT+0000 (Coordinated Universal Time)} (at http://localhost:8080/src/hooks/useAgendaData.ts:85:24)
[WARNING] useAgendaData: Datas inválidas ou iguais: {startDate: Sun Oct 12 2025 15:29:31 GMT+0000 (Coordinated Universal Time), endDate: Sun Oct 12 2025 15:29:31 GMT+0000 (Coordinated Universal Time)} (at http://localhost:8080/src/hooks/useAgendaData.ts:85:24)
[WARNING] useAgendaData: Datas inválidas ou iguais: {startDate: Sun Oct 12 2025 15:29:31 GMT+0000 (Coordinated Universal Time), endDate: Sun Oct 12 2025 15:29:31 GMT+0000 (Coordinated Universal Time)} (at http://localhost:8080/src/hooks/useAgendaData.ts:85:24)
[WARNING] useAgendaData: Datas inválidas ou iguais: {startDate: Sun Oct 12 2025 15:29:31 GMT+0000 (Coordinated Universal Time), endDate: Sun Oct 12 2025 15:29:31 GMT+0000 (Coordinated Universal Time)} (at http://localhost:8080/src/hooks/useAgendaData.ts:85:24)
[ERROR] 🚨 LOOP INFINITO DETECTADO! Bloqueando requisição para evitar sobrecarga do Supabase (at http://localhost:8080/src/hooks/useAgendaData.ts:73:28)
[WARNING] useAgendaData: Datas inválidas ou iguais: {startDate: Sun Oct 12 2025 15:29:32 GMT+0000 (Coordinated Universal Time), endDate: Sun Oct 12 2025 15:29:32 GMT+0000 (Coordinated Universal Time)} (at http://localhost:8080/src/hooks/useAgendaData.ts:85:24)
[WARNING] useAgendaData: Datas inválidas ou iguais: {startDate: Sun Oct 12 2025 15:29:32 GMT+0000 (Coordinated Universal Time), endDate: Sun Oct 12 2025 15:29:32 GMT+0000 (Coordinated Universal Time)} (at http://localhost:8080/src/hooks/useAgendaData.ts:85:24)
[WARNING] useAgendaData: Datas inválidas ou iguais: {startDate: Sun Oct 12 2025 15:29:32 GMT+0000 (Coordinated Universal Time), endDate: Sun Oct 12 2025 15:29:32 GMT+0000 (Coordinated Universal Time)} (at http://localhost:8080/src/hooks/useAgendaData.ts:85:24)
[WARNING] useAgendaData: Datas inválidas ou iguais: {startDate: Sun Oct 12 2025 15:29:32 GMT+0000 (Coordinated Universal Time), endDate: Sun Oct 12 2025 15:29:32 GMT+0000 (Coordinated Universal Time)} (at http://localhost:8080/src/hooks/useAgendaData.ts:85:24)
[WARNING] useAgendaData: Datas inválidas ou iguais: {startDate: Sun Oct 12 2025 15:29:32 GMT+0000 (Coordinated Universal Time), endDate: Sun Oct 12 2025 15:29:32 GMT+0000 (Coordinated Universal Time)} (at http://localhost:8080/src/hooks/useAgendaData.ts:85:24)
[WARNING] useAgendaData: Datas inválidas ou iguais: {startDate: Sun Oct 12 2025 15:29:32 GMT+0000 (Coordinated Universal Time), endDate: Sun Oct 12 2025 15:29:32 GMT+0000 (Coordinated Universal Time)} (at http://localhost:8080/src/hooks/useAgendaData.ts:85:24)
[WARNING] useAgendaData: Datas inválidas ou iguais: {startDate: Sun Oct 12 2025 15:29:32 GMT+0000 (Coordinated Universal Time), endDate: Sun Oct 12 2025 15:29:32 GMT+0000 (Coordinated Universal Time)} (at http://localhost:8080/src/hooks/useAgendaData.ts:85:24)
[WARNING] useAgendaData: Datas inválidas ou iguais: {startDate: Sun Oct 12 2025 15:29:32 GMT+0000 (Coordinated Universal Time), endDate: Sun Oct 12 2025 15:29:32 GMT+0000 (Coordinated Universal Time)} (at http://localhost:8080/src/hooks/useAgendaData.ts:85:24)
- **Test Visualization and Result:** https://www.testsprite.com/dashboard/mcp/tests/8dedef91-8f75-4ccd-bf96-5e925d7fe17c/e079fd0c-e316-438b-99e6-f9102b2070b8
- **Status:** ❌ Failed
- **Analysis / Findings:** {{TODO:AI_ANALYSIS}}.
---

#### Test TC013
- **Test Name:** UI Responsiveness and Theme Toggle
- **Test Code:** [TC013_UI_Responsiveness_and_Theme_Toggle.py](./TC013_UI_Responsiveness_and_Theme_Toggle.py)
- **Test Error:** Testing stopped due to persistent dashboard loading issue preventing UI verification. Reported the issue for resolution.
Browser Console Logs:
[WARNING] useAgendaData: Datas inválidas ou iguais: {startDate: Sun Oct 12 2025 15:29:31 GMT+0000 (Coordinated Universal Time), endDate: Sun Oct 12 2025 15:29:31 GMT+0000 (Coordinated Universal Time)} (at http://localhost:8080/src/hooks/useAgendaData.ts:85:24)
[WARNING] useAgendaData: Datas inválidas ou iguais: {startDate: Sun Oct 12 2025 15:29:32 GMT+0000 (Coordinated Universal Time), endDate: Sun Oct 12 2025 15:29:32 GMT+0000 (Coordinated Universal Time)} (at http://localhost:8080/src/hooks/useAgendaData.ts:85:24)
[WARNING] useAgendaData: Datas inválidas ou iguais: {startDate: Sun Oct 12 2025 15:29:32 GMT+0000 (Coordinated Universal Time), endDate: Sun Oct 12 2025 15:29:32 GMT+0000 (Coordinated Universal Time)} (at http://localhost:8080/src/hooks/useAgendaData.ts:85:24)
[WARNING] useAgendaData: Datas inválidas ou iguais: {startDate: Sun Oct 12 2025 15:29:32 GMT+0000 (Coordinated Universal Time), endDate: Sun Oct 12 2025 15:29:32 GMT+0000 (Coordinated Universal Time)} (at http://localhost:8080/src/hooks/useAgendaData.ts:85:24)
[WARNING] useAgendaData: Datas inválidas ou iguais: {startDate: Sun Oct 12 2025 15:29:32 GMT+0000 (Coordinated Universal Time), endDate: Sun Oct 12 2025 15:29:32 GMT+0000 (Coordinated Universal Time)} (at http://localhost:8080/src/hooks/useAgendaData.ts:85:24)
[WARNING] useAgendaData: Datas inválidas ou iguais: {startDate: Sun Oct 12 2025 15:29:32 GMT+0000 (Coordinated Universal Time), endDate: Sun Oct 12 2025 15:29:32 GMT+0000 (Coordinated Universal Time)} (at http://localhost:8080/src/hooks/useAgendaData.ts:85:24)
[WARNING] useAgendaData: Datas inválidas ou iguais: {startDate: Sun Oct 12 2025 15:29:32 GMT+0000 (Coordinated Universal Time), endDate: Sun Oct 12 2025 15:29:32 GMT+0000 (Coordinated Universal Time)} (at http://localhost:8080/src/hooks/useAgendaData.ts:85:24)
[WARNING] useAgendaData: Datas inválidas ou iguais: {startDate: Sun Oct 12 2025 15:29:32 GMT+0000 (Coordinated Universal Time), endDate: Sun Oct 12 2025 15:29:32 GMT+0000 (Coordinated Universal Time)} (at http://localhost:8080/src/hooks/useAgendaData.ts:85:24)
[WARNING] useAgendaData: Datas inválidas ou iguais: {startDate: Sun Oct 12 2025 15:29:32 GMT+0000 (Coordinated Universal Time), endDate: Sun Oct 12 2025 15:29:32 GMT+0000 (Coordinated Universal Time)} (at http://localhost:8080/src/hooks/useAgendaData.ts:85:24)
[WARNING] useAgendaData: Datas inválidas ou iguais: {startDate: Sun Oct 12 2025 15:29:32 GMT+0000 (Coordinated Universal Time), endDate: Sun Oct 12 2025 15:29:32 GMT+0000 (Coordinated Universal Time)} (at http://localhost:8080/src/hooks/useAgendaData.ts:85:24)
[WARNING] useAgendaData: Datas inválidas ou iguais: {startDate: Sun Oct 12 2025 15:29:32 GMT+0000 (Coordinated Universal Time), endDate: Sun Oct 12 2025 15:29:32 GMT+0000 (Coordinated Universal Time)} (at http://localhost:8080/src/hooks/useAgendaData.ts:85:24)
[WARNING] useAgendaData: Datas inválidas ou iguais: {startDate: Sun Oct 12 2025 15:29:32 GMT+0000 (Coordinated Universal Time), endDate: Sun Oct 12 2025 15:29:32 GMT+0000 (Coordinated Universal Time)} (at http://localhost:8080/src/hooks/useAgendaData.ts:85:24)
[ERROR] 🚨 LOOP INFINITO DETECTADO! Bloqueando requisição para evitar sobrecarga do Supabase (at http://localhost:8080/src/hooks/useAgendaData.ts:73:28)
[ERROR] 🚨 LOOP INFINITO DETECTADO! Bloqueando requisição para evitar sobrecarga do Supabase (at http://localhost:8080/src/hooks/useAgendaData.ts:73:28)
[WARNING] useAgendaData: Datas inválidas ou iguais: {startDate: Sun Oct 12 2025 15:29:32 GMT+0000 (Coordinated Universal Time), endDate: Sun Oct 12 2025 15:29:32 GMT+0000 (Coordinated Universal Time)} (at http://localhost:8080/src/hooks/useAgendaData.ts:85:24)
[WARNING] useAgendaData: Datas inválidas ou iguais: {startDate: Sun Oct 12 2025 15:29:32 GMT+0000 (Coordinated Universal Time), endDate: Sun Oct 12 2025 15:29:32 GMT+0000 (Coordinated Universal Time)} (at http://localhost:8080/src/hooks/useAgendaData.ts:85:24)
[WARNING] useAgendaData: Datas inválidas ou iguais: {startDate: Sun Oct 12 2025 15:29:32 GMT+0000 (Coordinated Universal Time), endDate: Sun Oct 12 2025 15:29:32 GMT+0000 (Coordinated Universal Time)} (at http://localhost:8080/src/hooks/useAgendaData.ts:85:24)
[WARNING] useAgendaData: Datas inválidas ou iguais: {startDate: Sun Oct 12 2025 15:29:33 GMT+0000 (Coordinated Universal Time), endDate: Sun Oct 12 2025 15:29:33 GMT+0000 (Coordinated Universal Time)} (at http://localhost:8080/src/hooks/useAgendaData.ts:85:24)
[WARNING] useAgendaData: Datas inválidas ou iguais: {startDate: Sun Oct 12 2025 15:29:33 GMT+0000 (Coordinated Universal Time), endDate: Sun Oct 12 2025 15:29:33 GMT+0000 (Coordinated Universal Time)} (at http://localhost:8080/src/hooks/useAgendaData.ts:85:24)
[WARNING] useAgendaData: Datas inválidas ou iguais: {startDate: Sun Oct 12 2025 15:29:33 GMT+0000 (Coordinated Universal Time), endDate: Sun Oct 12 2025 15:29:33 GMT+0000 (Coordinated Universal Time)} (at http://localhost:8080/src/hooks/useAgendaData.ts:85:24)
- **Test Visualization and Result:** https://www.testsprite.com/dashboard/mcp/tests/8dedef91-8f75-4ccd-bf96-5e925d7fe17c/33517d36-4504-42b4-b6e0-2c2126d0e1f7
- **Status:** ❌ Failed
- **Analysis / Findings:** {{TODO:AI_ANALYSIS}}.
---

#### Test TC014
- **Test Name:** LGPD Compliance: Data Privacy and Opt-out Management
- **Test Code:** [TC014_LGPD_Compliance_Data_Privacy_and_Opt_out_Management.py](./TC014_LGPD_Compliance_Data_Privacy_and_Opt_out_Management.py)
- **Test Error:** Testing stopped due to failure in data deletion functionality. Data export works, but deletion request does not respond, blocking LGPD compliance verification. Issue reported for developer attention.
Browser Console Logs:
[WARNING] useAgendaData: Datas inválidas ou iguais: {startDate: Sun Oct 12 2025 15:29:31 GMT+0000 (Coordinated Universal Time), endDate: Sun Oct 12 2025 15:29:31 GMT+0000 (Coordinated Universal Time)} (at http://localhost:8080/src/hooks/useAgendaData.ts:85:24)
[WARNING] useAgendaData: Datas inválidas ou iguais: {startDate: Sun Oct 12 2025 15:29:32 GMT+0000 (Coordinated Universal Time), endDate: Sun Oct 12 2025 15:29:32 GMT+0000 (Coordinated Universal Time)} (at http://localhost:8080/src/hooks/useAgendaData.ts:85:24)
[WARNING] useAgendaData: Datas inválidas ou iguais: {startDate: Sun Oct 12 2025 15:29:32 GMT+0000 (Coordinated Universal Time), endDate: Sun Oct 12 2025 15:29:32 GMT+0000 (Coordinated Universal Time)} (at http://localhost:8080/src/hooks/useAgendaData.ts:85:24)
[WARNING] useAgendaData: Datas inválidas ou iguais: {startDate: Sun Oct 12 2025 15:29:32 GMT+0000 (Coordinated Universal Time), endDate: Sun Oct 12 2025 15:29:32 GMT+0000 (Coordinated Universal Time)} (at http://localhost:8080/src/hooks/useAgendaData.ts:85:24)
[WARNING] useAgendaData: Datas inválidas ou iguais: {startDate: Sun Oct 12 2025 15:29:32 GMT+0000 (Coordinated Universal Time), endDate: Sun Oct 12 2025 15:29:32 GMT+0000 (Coordinated Universal Time)} (at http://localhost:8080/src/hooks/useAgendaData.ts:85:24)
[WARNING] useAgendaData: Datas inválidas ou iguais: {startDate: Sun Oct 12 2025 15:29:32 GMT+0000 (Coordinated Universal Time), endDate: Sun Oct 12 2025 15:29:32 GMT+0000 (Coordinated Universal Time)} (at http://localhost:8080/src/hooks/useAgendaData.ts:85:24)
[WARNING] useAgendaData: Datas inválidas ou iguais: {startDate: Sun Oct 12 2025 15:29:32 GMT+0000 (Coordinated Universal Time), endDate: Sun Oct 12 2025 15:29:32 GMT+0000 (Coordinated Universal Time)} (at http://localhost:8080/src/hooks/useAgendaData.ts:85:24)
[WARNING] useAgendaData: Datas inválidas ou iguais: {startDate: Sun Oct 12 2025 15:29:32 GMT+0000 (Coordinated Universal Time), endDate: Sun Oct 12 2025 15:29:32 GMT+0000 (Coordinated Universal Time)} (at http://localhost:8080/src/hooks/useAgendaData.ts:85:24)
[WARNING] useAgendaData: Datas inválidas ou iguais: {startDate: Sun Oct 12 2025 15:29:32 GMT+0000 (Coordinated Universal Time), endDate: Sun Oct 12 2025 15:29:32 GMT+0000 (Coordinated Universal Time)} (at http://localhost:8080/src/hooks/useAgendaData.ts:85:24)
[WARNING] useAgendaData: Datas inválidas ou iguais: {startDate: Sun Oct 12 2025 15:29:32 GMT+0000 (Coordinated Universal Time), endDate: Sun Oct 12 2025 15:29:32 GMT+0000 (Coordinated Universal Time)} (at http://localhost:8080/src/hooks/useAgendaData.ts:85:24)
[WARNING] useAgendaData: Datas inválidas ou iguais: {startDate: Sun Oct 12 2025 15:29:32 GMT+0000 (Coordinated Universal Time), endDate: Sun Oct 12 2025 15:29:32 GMT+0000 (Coordinated Universal Time)} (at http://localhost:8080/src/hooks/useAgendaData.ts:85:24)
[WARNING] useAgendaData: Datas inválidas ou iguais: {startDate: Sun Oct 12 2025 15:29:32 GMT+0000 (Coordinated Universal Time), endDate: Sun Oct 12 2025 15:29:32 GMT+0000 (Coordinated Universal Time)} (at http://localhost:8080/src/hooks/useAgendaData.ts:85:24)
[WARNING] useAgendaData: Datas inválidas ou iguais: {startDate: Sun Oct 12 2025 15:29:32 GMT+0000 (Coordinated Universal Time), endDate: Sun Oct 12 2025 15:29:32 GMT+0000 (Coordinated Universal Time)} (at http://localhost:8080/src/hooks/useAgendaData.ts:85:24)
[WARNING] useAgendaData: Datas inválidas ou iguais: {startDate: Sun Oct 12 2025 15:29:32 GMT+0000 (Coordinated Universal Time), endDate: Sun Oct 12 2025 15:29:32 GMT+0000 (Coordinated Universal Time)} (at http://localhost:8080/src/hooks/useAgendaData.ts:85:24)
[WARNING] useAgendaData: Datas inválidas ou iguais: {startDate: Sun Oct 12 2025 15:29:32 GMT+0000 (Coordinated Universal Time), endDate: Sun Oct 12 2025 15:29:32 GMT+0000 (Coordinated Universal Time)} (at http://localhost:8080/src/hooks/useAgendaData.ts:85:24)
[WARNING] useAgendaData: Datas inválidas ou iguais: {startDate: Sun Oct 12 2025 15:29:32 GMT+0000 (Coordinated Universal Time), endDate: Sun Oct 12 2025 15:29:32 GMT+0000 (Coordinated Universal Time)} (at http://localhost:8080/src/hooks/useAgendaData.ts:85:24)
[WARNING] useAgendaData: Datas inválidas ou iguais: {startDate: Sun Oct 12 2025 15:29:32 GMT+0000 (Coordinated Universal Time), endDate: Sun Oct 12 2025 15:29:32 GMT+0000 (Coordinated Universal Time)} (at http://localhost:8080/src/hooks/useAgendaData.ts:85:24)
[WARNING] useAgendaData: Datas inválidas ou iguais: {startDate: Sun Oct 12 2025 15:29:32 GMT+0000 (Coordinated Universal Time), endDate: Sun Oct 12 2025 15:29:32 GMT+0000 (Coordinated Universal Time)} (at http://localhost:8080/src/hooks/useAgendaData.ts:85:24)
[WARNING] useAgendaData: Datas inválidas ou iguais: {startDate: Sun Oct 12 2025 15:29:32 GMT+0000 (Coordinated Universal Time), endDate: Sun Oct 12 2025 15:29:32 GMT+0000 (Coordinated Universal Time)} (at http://localhost:8080/src/hooks/useAgendaData.ts:85:24)
[WARNING] useAgendaData: Datas inválidas ou iguais: {startDate: Sun Oct 12 2025 15:29:32 GMT+0000 (Coordinated Universal Time), endDate: Sun Oct 12 2025 15:29:32 GMT+0000 (Coordinated Universal Time)} (at http://localhost:8080/src/hooks/useAgendaData.ts:85:24)
- **Test Visualization and Result:** https://www.testsprite.com/dashboard/mcp/tests/8dedef91-8f75-4ccd-bf96-5e925d7fe17c/f92ce29c-264e-4e9a-ba00-2f53fa5befd1
- **Status:** ❌ Failed
- **Analysis / Findings:** {{TODO:AI_ANALYSIS}}.
---

#### Test TC015
- **Test Name:** Support System FAQ Accessibility and Search
- **Test Code:** [TC015_Support_System_FAQ_Accessibility_and_Search.py](./TC015_Support_System_FAQ_Accessibility_and_Search.py)
- **Test Visualization and Result:** https://www.testsprite.com/dashboard/mcp/tests/8dedef91-8f75-4ccd-bf96-5e925d7fe17c/53fea097-49a0-406a-8278-3eeb8a7f6893
- **Status:** ✅ Passed
- **Analysis / Findings:** {{TODO:AI_ANALYSIS}}.
---

#### Test TC016
- **Test Name:** Scheduling Agent Sending WhatsApp Reminders
- **Test Code:** [TC016_Scheduling_Agent_Sending_WhatsApp_Reminders.py](./TC016_Scheduling_Agent_Sending_WhatsApp_Reminders.py)
- **Test Error:** Test completed with partial success. The event was successfully scheduled and visible in the app agenda. Verification in Google Calendar was blocked by CAPTCHA. The agenda page is persistently stuck loading, preventing further verification of WhatsApp reminder opt-in status and message sending. Please investigate the agenda page loading issue to continue testing.
Browser Console Logs:
[WARNING] useAgendaData: Datas inválidas ou iguais: {startDate: Sun Oct 12 2025 15:29:31 GMT+0000 (Coordinated Universal Time), endDate: Sun Oct 12 2025 15:29:31 GMT+0000 (Coordinated Universal Time)} (at http://localhost:8080/src/hooks/useAgendaData.ts:85:24)
[WARNING] useAgendaData: Datas inválidas ou iguais: {startDate: Sun Oct 12 2025 15:29:31 GMT+0000 (Coordinated Universal Time), endDate: Sun Oct 12 2025 15:29:31 GMT+0000 (Coordinated Universal Time)} (at http://localhost:8080/src/hooks/useAgendaData.ts:85:24)
[WARNING] useAgendaData: Datas inválidas ou iguais: {startDate: Sun Oct 12 2025 15:29:31 GMT+0000 (Coordinated Universal Time), endDate: Sun Oct 12 2025 15:29:31 GMT+0000 (Coordinated Universal Time)} (at http://localhost:8080/src/hooks/useAgendaData.ts:85:24)
[WARNING] useAgendaData: Datas inválidas ou iguais: {startDate: Sun Oct 12 2025 15:29:31 GMT+0000 (Coordinated Universal Time), endDate: Sun Oct 12 2025 15:29:31 GMT+0000 (Coordinated Universal Time)} (at http://localhost:8080/src/hooks/useAgendaData.ts:85:24)
[WARNING] useAgendaData: Datas inválidas ou iguais: {startDate: Sun Oct 12 2025 15:29:31 GMT+0000 (Coordinated Universal Time), endDate: Sun Oct 12 2025 15:29:31 GMT+0000 (Coordinated Universal Time)} (at http://localhost:8080/src/hooks/useAgendaData.ts:85:24)
[WARNING] useAgendaData: Datas inválidas ou iguais: {startDate: Sun Oct 12 2025 15:29:31 GMT+0000 (Coordinated Universal Time), endDate: Sun Oct 12 2025 15:29:31 GMT+0000 (Coordinated Universal Time)} (at http://localhost:8080/src/hooks/useAgendaData.ts:85:24)
[WARNING] useAgendaData: Datas inválidas ou iguais: {startDate: Sun Oct 12 2025 15:29:31 GMT+0000 (Coordinated Universal Time), endDate: Sun Oct 12 2025 15:29:31 GMT+0000 (Coordinated Universal Time)} (at http://localhost:8080/src/hooks/useAgendaData.ts:85:24)
[WARNING] useAgendaData: Datas inválidas ou iguais: {startDate: Sun Oct 12 2025 15:29:31 GMT+0000 (Coordinated Universal Time), endDate: Sun Oct 12 2025 15:29:31 GMT+0000 (Coordinated Universal Time)} (at http://localhost:8080/src/hooks/useAgendaData.ts:85:24)
[WARNING] useAgendaData: Datas inválidas ou iguais: {startDate: Sun Oct 12 2025 15:29:31 GMT+0000 (Coordinated Universal Time), endDate: Sun Oct 12 2025 15:29:31 GMT+0000 (Coordinated Universal Time)} (at http://localhost:8080/src/hooks/useAgendaData.ts:85:24)
[WARNING] useAgendaData: Datas inválidas ou iguais: {startDate: Sun Oct 12 2025 15:29:31 GMT+0000 (Coordinated Universal Time), endDate: Sun Oct 12 2025 15:29:31 GMT+0000 (Coordinated Universal Time)} (at http://localhost:8080/src/hooks/useAgendaData.ts:85:24)
[WARNING] useAgendaData: Datas inválidas ou iguais: {startDate: Sun Oct 12 2025 15:29:31 GMT+0000 (Coordinated Universal Time), endDate: Sun Oct 12 2025 15:29:31 GMT+0000 (Coordinated Universal Time)} (at http://localhost:8080/src/hooks/useAgendaData.ts:85:24)
[WARNING] useAgendaData: Datas inválidas ou iguais: {startDate: Sun Oct 12 2025 15:29:31 GMT+0000 (Coordinated Universal Time), endDate: Sun Oct 12 2025 15:29:31 GMT+0000 (Coordinated Universal Time)} (at http://localhost:8080/src/hooks/useAgendaData.ts:85:24)
[WARNING] useAgendaData: Datas inválidas ou iguais: {startDate: Sun Oct 12 2025 15:29:32 GMT+0000 (Coordinated Universal Time), endDate: Sun Oct 12 2025 15:29:32 GMT+0000 (Coordinated Universal Time)} (at http://localhost:8080/src/hooks/useAgendaData.ts:85:24)
[WARNING] useAgendaData: Datas inválidas ou iguais: {startDate: Sun Oct 12 2025 15:29:32 GMT+0000 (Coordinated Universal Time), endDate: Sun Oct 12 2025 15:29:32 GMT+0000 (Coordinated Universal Time)} (at http://localhost:8080/src/hooks/useAgendaData.ts:85:24)
[WARNING] useAgendaData: Datas inválidas ou iguais: {startDate: Sun Oct 12 2025 15:29:32 GMT+0000 (Coordinated Universal Time), endDate: Sun Oct 12 2025 15:29:32 GMT+0000 (Coordinated Universal Time)} (at http://localhost:8080/src/hooks/useAgendaData.ts:85:24)
[WARNING] useAgendaData: Datas inválidas ou iguais: {startDate: Sun Oct 12 2025 15:29:32 GMT+0000 (Coordinated Universal Time), endDate: Sun Oct 12 2025 15:29:32 GMT+0000 (Coordinated Universal Time)} (at http://localhost:8080/src/hooks/useAgendaData.ts:85:24)
[WARNING] useAgendaData: Datas inválidas ou iguais: {startDate: Sun Oct 12 2025 15:29:32 GMT+0000 (Coordinated Universal Time), endDate: Sun Oct 12 2025 15:29:32 GMT+0000 (Coordinated Universal Time)} (at http://localhost:8080/src/hooks/useAgendaData.ts:85:24)
[WARNING] useAgendaData: Datas inválidas ou iguais: {startDate: Sun Oct 12 2025 15:29:32 GMT+0000 (Coordinated Universal Time), endDate: Sun Oct 12 2025 15:29:32 GMT+0000 (Coordinated Universal Time)} (at http://localhost:8080/src/hooks/useAgendaData.ts:85:24)
[ERROR] 🚨 LOOP INFINITO DETECTADO! Bloqueando requisição para evitar sobrecarga do Supabase (at http://localhost:8080/src/hooks/useAgendaData.ts:73:28)
[ERROR] 🚨 LOOP INFINITO DETECTADO! Bloqueando requisição para evitar sobrecarga do Supabase (at http://localhost:8080/src/hooks/useAgendaData.ts:73:28)
- **Test Visualization and Result:** https://www.testsprite.com/dashboard/mcp/tests/8dedef91-8f75-4ccd-bf96-5e925d7fe17c/d20c80d2-a946-4d17-bb07-a2381d24966b
- **Status:** ❌ Failed
- **Analysis / Findings:** {{TODO:AI_ANALYSIS}}.
---


## 3️⃣ Coverage & Matching Metrics

- **37.50** of tests passed

| Requirement        | Total Tests | ✅ Passed | ❌ Failed  |
|--------------------|-------------|-----------|------------|
| ...                | ...         | ...       | ...        |
---


## 4️⃣ Key Gaps / Risks
{AI_GNERATED_KET_GAPS_AND_RISKS}
---