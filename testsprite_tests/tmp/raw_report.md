
# TestSprite AI Testing Report(MCP)

---

## 1️⃣ Document Metadata
- **Project Name:** meu-agente-fin
- **Date:** 2025-10-14
- **Prepared by:** TestSprite AI Team

---

## 2️⃣ Requirement Validation Summary

#### Test TC001
- **Test Name:** Phone OTP Authentication Success
- **Test Code:** [TC001_Phone_OTP_Authentication_Success.py](./TC001_Phone_OTP_Authentication_Success.py)
- **Test Error:** Failed to go to the start URL. Err: Error executing action go_to_url: Page.goto: Timeout 60000ms exceeded.
Call log:
  - navigating to "http://localhost:8080/", waiting until "load"

- **Test Visualization and Result:** https://www.testsprite.com/dashboard/mcp/tests/07778ff7-3d99-4338-b6f6-3ebe4abc57b3/5b3e7ac2-4e8a-46c9-bb99-254813f07d3f
- **Status:** ❌ Failed
- **Analysis / Findings:** {{TODO:AI_ANALYSIS}}.
---

#### Test TC002
- **Test Name:** Phone OTP Authentication Rate Limiting
- **Test Code:** [TC002_Phone_OTP_Authentication_Rate_Limiting.py](./TC002_Phone_OTP_Authentication_Rate_Limiting.py)
- **Test Error:** Failed to go to the start URL. Err: Error executing action go_to_url: Page.goto: Timeout 60000ms exceeded.
Call log:
  - navigating to "http://localhost:8080/", waiting until "load"

- **Test Visualization and Result:** https://www.testsprite.com/dashboard/mcp/tests/07778ff7-3d99-4338-b6f6-3ebe4abc57b3/43cf7423-392e-406f-b09c-b40a96c9f6ed
- **Status:** ❌ Failed
- **Analysis / Findings:** {{TODO:AI_ANALYSIS}}.
---

#### Test TC003
- **Test Name:** Authentication with Invalid OTP
- **Test Code:** [TC003_Authentication_with_Invalid_OTP.py](./TC003_Authentication_with_Invalid_OTP.py)
- **Test Error:** The task to verify login failure with invalid or expired OTP codes and appropriate error messages was not fully completed because the invalid or expired OTP input test was not performed. The login with valid phone number and password was successfully tested multiple times, and logout was performed to return to the login page. However, the step to enter an invalid or expired OTP and verify the error message was not executed. Therefore, the task is incomplete.
Browser Console Logs:
[WARNING] useAgendaData: Datas inválidas ou iguais: {startDate: Tue Oct 14 2025 03:16:06 GMT+0000 (Coordinated Universal Time), endDate: Tue Oct 14 2025 03:16:06 GMT+0000 (Coordinated Universal Time)} (at http://localhost:8080/src/hooks/useAgendaData.ts:97:24)
[WARNING] useAgendaData: Datas inválidas ou iguais: {startDate: Tue Oct 14 2025 03:16:06 GMT+0000 (Coordinated Universal Time), endDate: Tue Oct 14 2025 03:16:06 GMT+0000 (Coordinated Universal Time)} (at http://localhost:8080/src/hooks/useAgendaData.ts:97:24)
[WARNING] useAgendaData: Datas inválidas ou iguais: {startDate: Tue Oct 14 2025 03:16:06 GMT+0000 (Coordinated Universal Time), endDate: Tue Oct 14 2025 03:16:06 GMT+0000 (Coordinated Universal Time)} (at http://localhost:8080/src/hooks/useAgendaData.ts:97:24)
[WARNING] useAgendaData: Datas inválidas ou iguais: {startDate: Tue Oct 14 2025 03:16:06 GMT+0000 (Coordinated Universal Time), endDate: Tue Oct 14 2025 03:16:06 GMT+0000 (Coordinated Universal Time)} (at http://localhost:8080/src/hooks/useAgendaData.ts:97:24)
[WARNING] useAgendaData: Datas inválidas ou iguais: {startDate: Tue Oct 14 2025 03:16:06 GMT+0000 (Coordinated Universal Time), endDate: Tue Oct 14 2025 03:16:06 GMT+0000 (Coordinated Universal Time)} (at http://localhost:8080/src/hooks/useAgendaData.ts:97:24)
[WARNING] useAgendaData: Datas inválidas ou iguais: {startDate: Tue Oct 14 2025 03:16:06 GMT+0000 (Coordinated Universal Time), endDate: Tue Oct 14 2025 03:16:06 GMT+0000 (Coordinated Universal Time)} (at http://localhost:8080/src/hooks/useAgendaData.ts:97:24)
[WARNING] useAgendaData: Datas inválidas ou iguais: {startDate: Tue Oct 14 2025 03:16:06 GMT+0000 (Coordinated Universal Time), endDate: Tue Oct 14 2025 03:16:06 GMT+0000 (Coordinated Universal Time)} (at http://localhost:8080/src/hooks/useAgendaData.ts:97:24)
[WARNING] useAgendaData: Datas inválidas ou iguais: {startDate: Tue Oct 14 2025 03:16:06 GMT+0000 (Coordinated Universal Time), endDate: Tue Oct 14 2025 03:16:06 GMT+0000 (Coordinated Universal Time)} (at http://localhost:8080/src/hooks/useAgendaData.ts:97:24)
[WARNING] useAgendaData: Datas inválidas ou iguais: {startDate: Tue Oct 14 2025 03:16:06 GMT+0000 (Coordinated Universal Time), endDate: Tue Oct 14 2025 03:16:06 GMT+0000 (Coordinated Universal Time)} (at http://localhost:8080/src/hooks/useAgendaData.ts:97:24)
[WARNING] useAgendaData: Datas inválidas ou iguais: {startDate: Tue Oct 14 2025 03:16:06 GMT+0000 (Coordinated Universal Time), endDate: Tue Oct 14 2025 03:16:06 GMT+0000 (Coordinated Universal Time)} (at http://localhost:8080/src/hooks/useAgendaData.ts:97:24)
[WARNING] useAgendaData: Datas inválidas ou iguais: {startDate: Tue Oct 14 2025 03:16:06 GMT+0000 (Coordinated Universal Time), endDate: Tue Oct 14 2025 03:16:06 GMT+0000 (Coordinated Universal Time)} (at http://localhost:8080/src/hooks/useAgendaData.ts:97:24)
[WARNING] useAgendaData: Datas inválidas ou iguais: {startDate: Tue Oct 14 2025 03:16:06 GMT+0000 (Coordinated Universal Time), endDate: Tue Oct 14 2025 03:16:06 GMT+0000 (Coordinated Universal Time)} (at http://localhost:8080/src/hooks/useAgendaData.ts:97:24)
[WARNING] useAgendaData: Datas inválidas ou iguais: {startDate: Tue Oct 14 2025 03:16:06 GMT+0000 (Coordinated Universal Time), endDate: Tue Oct 14 2025 03:16:06 GMT+0000 (Coordinated Universal Time)} (at http://localhost:8080/src/hooks/useAgendaData.ts:97:24)
[WARNING] useAgendaData: Datas inválidas ou iguais: {startDate: Tue Oct 14 2025 03:16:07 GMT+0000 (Coordinated Universal Time), endDate: Tue Oct 14 2025 03:16:07 GMT+0000 (Coordinated Universal Time)} (at http://localhost:8080/src/hooks/useAgendaData.ts:97:24)
[WARNING] useAgendaData: Datas inválidas ou iguais: {startDate: Tue Oct 14 2025 03:16:07 GMT+0000 (Coordinated Universal Time), endDate: Tue Oct 14 2025 03:16:07 GMT+0000 (Coordinated Universal Time)} (at http://localhost:8080/src/hooks/useAgendaData.ts:97:24)
[WARNING] useAgendaData: Datas inválidas ou iguais: {startDate: Tue Oct 14 2025 03:16:07 GMT+0000 (Coordinated Universal Time), endDate: Tue Oct 14 2025 03:16:07 GMT+0000 (Coordinated Universal Time)} (at http://localhost:8080/src/hooks/useAgendaData.ts:97:24)
[WARNING] useAgendaData: Datas inválidas ou iguais: {startDate: Tue Oct 14 2025 03:16:07 GMT+0000 (Coordinated Universal Time), endDate: Tue Oct 14 2025 03:16:07 GMT+0000 (Coordinated Universal Time)} (at http://localhost:8080/src/hooks/useAgendaData.ts:97:24)
[ERROR] 🚨 LOOP INFINITO DETECTADO! Bloqueando requisições por 5 segundos (at http://localhost:8080/src/hooks/useAgendaData.ts:84:28)
[WARNING] useAgendaData: Requisição bloqueada temporariamente (at http://localhost:8080/src/hooks/useAgendaData.ts:77:28)
[WARNING] useAgendaData: Requisição bloqueada temporariamente (at http://localhost:8080/src/hooks/useAgendaData.ts:77:28)
- **Test Visualization and Result:** https://www.testsprite.com/dashboard/mcp/tests/07778ff7-3d99-4338-b6f6-3ebe4abc57b3/216d57ca-74b1-4b48-8885-14f50e8d2738
- **Status:** ❌ Failed
- **Analysis / Findings:** {{TODO:AI_ANALYSIS}}.
---

#### Test TC004
- **Test Name:** Add Income and Expense Record - Free Plan
- **Test Code:** [TC004_Add_Income_and_Expense_Record___Free_Plan.py](./TC004_Add_Income_and_Expense_Record___Free_Plan.py)
- **Test Error:** Test failed: Free plan user cannot add income records as the records do not appear after saving. Stopping further testing.
Browser Console Logs:
[WARNING] useAgendaData: Datas inválidas ou iguais: {startDate: Tue Oct 14 2025 03:16:06 GMT+0000 (Coordinated Universal Time), endDate: Tue Oct 14 2025 03:16:06 GMT+0000 (Coordinated Universal Time)} (at http://localhost:8080/src/hooks/useAgendaData.ts:97:24)
[WARNING] useAgendaData: Datas inválidas ou iguais: {startDate: Tue Oct 14 2025 03:16:06 GMT+0000 (Coordinated Universal Time), endDate: Tue Oct 14 2025 03:16:06 GMT+0000 (Coordinated Universal Time)} (at http://localhost:8080/src/hooks/useAgendaData.ts:97:24)
[WARNING] useAgendaData: Datas inválidas ou iguais: {startDate: Tue Oct 14 2025 03:16:06 GMT+0000 (Coordinated Universal Time), endDate: Tue Oct 14 2025 03:16:06 GMT+0000 (Coordinated Universal Time)} (at http://localhost:8080/src/hooks/useAgendaData.ts:97:24)
[WARNING] useAgendaData: Datas inválidas ou iguais: {startDate: Tue Oct 14 2025 03:16:06 GMT+0000 (Coordinated Universal Time), endDate: Tue Oct 14 2025 03:16:06 GMT+0000 (Coordinated Universal Time)} (at http://localhost:8080/src/hooks/useAgendaData.ts:97:24)
[WARNING] useAgendaData: Datas inválidas ou iguais: {startDate: Tue Oct 14 2025 03:16:06 GMT+0000 (Coordinated Universal Time), endDate: Tue Oct 14 2025 03:16:06 GMT+0000 (Coordinated Universal Time)} (at http://localhost:8080/src/hooks/useAgendaData.ts:97:24)
[WARNING] useAgendaData: Datas inválidas ou iguais: {startDate: Tue Oct 14 2025 03:16:06 GMT+0000 (Coordinated Universal Time), endDate: Tue Oct 14 2025 03:16:06 GMT+0000 (Coordinated Universal Time)} (at http://localhost:8080/src/hooks/useAgendaData.ts:97:24)
[WARNING] useAgendaData: Datas inválidas ou iguais: {startDate: Tue Oct 14 2025 03:16:06 GMT+0000 (Coordinated Universal Time), endDate: Tue Oct 14 2025 03:16:06 GMT+0000 (Coordinated Universal Time)} (at http://localhost:8080/src/hooks/useAgendaData.ts:97:24)
[WARNING] useAgendaData: Datas inválidas ou iguais: {startDate: Tue Oct 14 2025 03:16:06 GMT+0000 (Coordinated Universal Time), endDate: Tue Oct 14 2025 03:16:06 GMT+0000 (Coordinated Universal Time)} (at http://localhost:8080/src/hooks/useAgendaData.ts:97:24)
[WARNING] useAgendaData: Datas inválidas ou iguais: {startDate: Tue Oct 14 2025 03:16:06 GMT+0000 (Coordinated Universal Time), endDate: Tue Oct 14 2025 03:16:06 GMT+0000 (Coordinated Universal Time)} (at http://localhost:8080/src/hooks/useAgendaData.ts:97:24)
[WARNING] useAgendaData: Datas inválidas ou iguais: {startDate: Tue Oct 14 2025 03:16:06 GMT+0000 (Coordinated Universal Time), endDate: Tue Oct 14 2025 03:16:06 GMT+0000 (Coordinated Universal Time)} (at http://localhost:8080/src/hooks/useAgendaData.ts:97:24)
[WARNING] useAgendaData: Datas inválidas ou iguais: {startDate: Tue Oct 14 2025 03:16:06 GMT+0000 (Coordinated Universal Time), endDate: Tue Oct 14 2025 03:16:06 GMT+0000 (Coordinated Universal Time)} (at http://localhost:8080/src/hooks/useAgendaData.ts:97:24)
[WARNING] useAgendaData: Datas inválidas ou iguais: {startDate: Tue Oct 14 2025 03:16:06 GMT+0000 (Coordinated Universal Time), endDate: Tue Oct 14 2025 03:16:06 GMT+0000 (Coordinated Universal Time)} (at http://localhost:8080/src/hooks/useAgendaData.ts:97:24)
[WARNING] useAgendaData: Datas inválidas ou iguais: {startDate: Tue Oct 14 2025 03:16:06 GMT+0000 (Coordinated Universal Time), endDate: Tue Oct 14 2025 03:16:06 GMT+0000 (Coordinated Universal Time)} (at http://localhost:8080/src/hooks/useAgendaData.ts:97:24)
[WARNING] useAgendaData: Datas inválidas ou iguais: {startDate: Tue Oct 14 2025 03:16:06 GMT+0000 (Coordinated Universal Time), endDate: Tue Oct 14 2025 03:16:06 GMT+0000 (Coordinated Universal Time)} (at http://localhost:8080/src/hooks/useAgendaData.ts:97:24)
[WARNING] useAgendaData: Datas inválidas ou iguais: {startDate: Tue Oct 14 2025 03:16:06 GMT+0000 (Coordinated Universal Time), endDate: Tue Oct 14 2025 03:16:06 GMT+0000 (Coordinated Universal Time)} (at http://localhost:8080/src/hooks/useAgendaData.ts:97:24)
[WARNING] useAgendaData: Datas inválidas ou iguais: {startDate: Tue Oct 14 2025 03:16:06 GMT+0000 (Coordinated Universal Time), endDate: Tue Oct 14 2025 03:16:06 GMT+0000 (Coordinated Universal Time)} (at http://localhost:8080/src/hooks/useAgendaData.ts:97:24)
[WARNING] useAgendaData: Datas inválidas ou iguais: {startDate: Tue Oct 14 2025 03:16:07 GMT+0000 (Coordinated Universal Time), endDate: Tue Oct 14 2025 03:16:07 GMT+0000 (Coordinated Universal Time)} (at http://localhost:8080/src/hooks/useAgendaData.ts:97:24)
[ERROR] 🚨 LOOP INFINITO DETECTADO! Bloqueando requisições por 5 segundos (at http://localhost:8080/src/hooks/useAgendaData.ts:84:28)
[WARNING] useAgendaData: Requisição bloqueada temporariamente (at http://localhost:8080/src/hooks/useAgendaData.ts:77:28)
[WARNING] useAgendaData: Requisição bloqueada temporariamente (at http://localhost:8080/src/hooks/useAgendaData.ts:77:28)
- **Test Visualization and Result:** https://www.testsprite.com/dashboard/mcp/tests/07778ff7-3d99-4338-b6f6-3ebe4abc57b3/cef62cd3-e489-46f5-bc06-af77f7f66a07
- **Status:** ❌ Failed
- **Analysis / Findings:** {{TODO:AI_ANALYSIS}}.
---

#### Test TC005
- **Test Name:** Export Financial Data CSV/PDF - Business Plan
- **Test Code:** [null](./null)
- **Test Error:** Test execution timed out after 15 minutes
- **Test Visualization and Result:** https://www.testsprite.com/dashboard/mcp/tests/07778ff7-3d99-4338-b6f6-3ebe4abc57b3/389e4ae4-1a06-471a-bf57-5d22162ce86b
- **Status:** ❌ Failed
- **Analysis / Findings:** {{TODO:AI_ANALYSIS}}.
---

#### Test TC006
- **Test Name:** Task Creation and Status Update
- **Test Code:** [TC006_Task_Creation_and_Status_Update.py](./TC006_Task_Creation_and_Status_Update.py)
- **Test Error:** The test to create a task with priority, category, due date, and update status was partially successful. Title, description, and priority were set correctly in the new task form. However, attempts to input the category and due date failed due to interaction issues with those fields. Consequently, the task was not saved, and the new task does not appear in the task list with all specified details. Status update could not be tested as the task creation was incomplete. Further investigation is needed to resolve input field interaction problems to fully verify task creation and status update functionality.
Browser Console Logs:
[WARNING] useAgendaData: Datas inválidas ou iguais: {startDate: Tue Oct 14 2025 03:16:08 GMT+0000 (Coordinated Universal Time), endDate: Tue Oct 14 2025 03:16:08 GMT+0000 (Coordinated Universal Time)} (at http://localhost:8080/src/hooks/useAgendaData.ts:97:24)
[WARNING] useAgendaData: Datas inválidas ou iguais: {startDate: Tue Oct 14 2025 03:16:09 GMT+0000 (Coordinated Universal Time), endDate: Tue Oct 14 2025 03:16:09 GMT+0000 (Coordinated Universal Time)} (at http://localhost:8080/src/hooks/useAgendaData.ts:97:24)
[WARNING] useAgendaData: Datas inválidas ou iguais: {startDate: Tue Oct 14 2025 03:16:09 GMT+0000 (Coordinated Universal Time), endDate: Tue Oct 14 2025 03:16:09 GMT+0000 (Coordinated Universal Time)} (at http://localhost:8080/src/hooks/useAgendaData.ts:97:24)
[WARNING] useAgendaData: Datas inválidas ou iguais: {startDate: Tue Oct 14 2025 03:16:09 GMT+0000 (Coordinated Universal Time), endDate: Tue Oct 14 2025 03:16:09 GMT+0000 (Coordinated Universal Time)} (at http://localhost:8080/src/hooks/useAgendaData.ts:97:24)
[WARNING] useAgendaData: Datas inválidas ou iguais: {startDate: Tue Oct 14 2025 03:16:09 GMT+0000 (Coordinated Universal Time), endDate: Tue Oct 14 2025 03:16:09 GMT+0000 (Coordinated Universal Time)} (at http://localhost:8080/src/hooks/useAgendaData.ts:97:24)
[WARNING] useAgendaData: Datas inválidas ou iguais: {startDate: Tue Oct 14 2025 03:16:09 GMT+0000 (Coordinated Universal Time), endDate: Tue Oct 14 2025 03:16:09 GMT+0000 (Coordinated Universal Time)} (at http://localhost:8080/src/hooks/useAgendaData.ts:97:24)
[WARNING] useAgendaData: Datas inválidas ou iguais: {startDate: Tue Oct 14 2025 03:16:09 GMT+0000 (Coordinated Universal Time), endDate: Tue Oct 14 2025 03:16:09 GMT+0000 (Coordinated Universal Time)} (at http://localhost:8080/src/hooks/useAgendaData.ts:97:24)
[WARNING] useAgendaData: Datas inválidas ou iguais: {startDate: Tue Oct 14 2025 03:16:09 GMT+0000 (Coordinated Universal Time), endDate: Tue Oct 14 2025 03:16:09 GMT+0000 (Coordinated Universal Time)} (at http://localhost:8080/src/hooks/useAgendaData.ts:97:24)
[WARNING] useAgendaData: Datas inválidas ou iguais: {startDate: Tue Oct 14 2025 03:16:09 GMT+0000 (Coordinated Universal Time), endDate: Tue Oct 14 2025 03:16:09 GMT+0000 (Coordinated Universal Time)} (at http://localhost:8080/src/hooks/useAgendaData.ts:97:24)
[WARNING] useAgendaData: Datas inválidas ou iguais: {startDate: Tue Oct 14 2025 03:16:09 GMT+0000 (Coordinated Universal Time), endDate: Tue Oct 14 2025 03:16:09 GMT+0000 (Coordinated Universal Time)} (at http://localhost:8080/src/hooks/useAgendaData.ts:97:24)
[WARNING] useAgendaData: Datas inválidas ou iguais: {startDate: Tue Oct 14 2025 03:16:09 GMT+0000 (Coordinated Universal Time), endDate: Tue Oct 14 2025 03:16:09 GMT+0000 (Coordinated Universal Time)} (at http://localhost:8080/src/hooks/useAgendaData.ts:97:24)
[WARNING] useAgendaData: Datas inválidas ou iguais: {startDate: Tue Oct 14 2025 03:16:09 GMT+0000 (Coordinated Universal Time), endDate: Tue Oct 14 2025 03:16:09 GMT+0000 (Coordinated Universal Time)} (at http://localhost:8080/src/hooks/useAgendaData.ts:97:24)
[WARNING] useAgendaData: Datas inválidas ou iguais: {startDate: Tue Oct 14 2025 03:16:09 GMT+0000 (Coordinated Universal Time), endDate: Tue Oct 14 2025 03:16:09 GMT+0000 (Coordinated Universal Time)} (at http://localhost:8080/src/hooks/useAgendaData.ts:97:24)
[WARNING] useAgendaData: Datas inválidas ou iguais: {startDate: Tue Oct 14 2025 03:16:09 GMT+0000 (Coordinated Universal Time), endDate: Tue Oct 14 2025 03:16:09 GMT+0000 (Coordinated Universal Time)} (at http://localhost:8080/src/hooks/useAgendaData.ts:97:24)
[WARNING] useAgendaData: Datas inválidas ou iguais: {startDate: Tue Oct 14 2025 03:16:09 GMT+0000 (Coordinated Universal Time), endDate: Tue Oct 14 2025 03:16:09 GMT+0000 (Coordinated Universal Time)} (at http://localhost:8080/src/hooks/useAgendaData.ts:97:24)
[WARNING] useAgendaData: Datas inválidas ou iguais: {startDate: Tue Oct 14 2025 03:16:09 GMT+0000 (Coordinated Universal Time), endDate: Tue Oct 14 2025 03:16:09 GMT+0000 (Coordinated Universal Time)} (at http://localhost:8080/src/hooks/useAgendaData.ts:97:24)
[WARNING] useAgendaData: Datas inválidas ou iguais: {startDate: Tue Oct 14 2025 03:16:09 GMT+0000 (Coordinated Universal Time), endDate: Tue Oct 14 2025 03:16:09 GMT+0000 (Coordinated Universal Time)} (at http://localhost:8080/src/hooks/useAgendaData.ts:97:24)
[ERROR] 🚨 LOOP INFINITO DETECTADO! Bloqueando requisições por 5 segundos (at http://localhost:8080/src/hooks/useAgendaData.ts:84:28)
[WARNING] useAgendaData: Requisição bloqueada temporariamente (at http://localhost:8080/src/hooks/useAgendaData.ts:77:28)
[WARNING] useAgendaData: Requisição bloqueada temporariamente (at http://localhost:8080/src/hooks/useAgendaData.ts:77:28)
- **Test Visualization and Result:** https://www.testsprite.com/dashboard/mcp/tests/07778ff7-3d99-4338-b6f6-3ebe4abc57b3/33949625-3158-47ed-98c9-c723311d0ce9
- **Status:** ❌ Failed
- **Analysis / Findings:** {{TODO:AI_ANALYSIS}}.
---

#### Test TC007
- **Test Name:** Goal Setting and Progress Tracking
- **Test Code:** [TC007_Goal_Setting_and_Progress_Tracking.py](./TC007_Goal_Setting_and_Progress_Tracking.py)
- **Test Error:** Tested goal creation and display with progress bar successfully. However, the progress update functionality could not be tested due to missing or inaccessible UI controls for updating progress on the goals management page. Reporting this issue and stopping further testing.
Browser Console Logs:
[WARNING] useAgendaData: Datas inválidas ou iguais: {startDate: Tue Oct 14 2025 03:16:12 GMT+0000 (Coordinated Universal Time), endDate: Tue Oct 14 2025 03:16:12 GMT+0000 (Coordinated Universal Time)} (at http://localhost:8080/src/hooks/useAgendaData.ts:97:24)
[WARNING] useAgendaData: Datas inválidas ou iguais: {startDate: Tue Oct 14 2025 03:16:12 GMT+0000 (Coordinated Universal Time), endDate: Tue Oct 14 2025 03:16:12 GMT+0000 (Coordinated Universal Time)} (at http://localhost:8080/src/hooks/useAgendaData.ts:97:24)
[WARNING] useAgendaData: Datas inválidas ou iguais: {startDate: Tue Oct 14 2025 03:16:12 GMT+0000 (Coordinated Universal Time), endDate: Tue Oct 14 2025 03:16:12 GMT+0000 (Coordinated Universal Time)} (at http://localhost:8080/src/hooks/useAgendaData.ts:97:24)
[WARNING] useAgendaData: Datas inválidas ou iguais: {startDate: Tue Oct 14 2025 03:16:12 GMT+0000 (Coordinated Universal Time), endDate: Tue Oct 14 2025 03:16:12 GMT+0000 (Coordinated Universal Time)} (at http://localhost:8080/src/hooks/useAgendaData.ts:97:24)
[WARNING] useAgendaData: Datas inválidas ou iguais: {startDate: Tue Oct 14 2025 03:16:12 GMT+0000 (Coordinated Universal Time), endDate: Tue Oct 14 2025 03:16:12 GMT+0000 (Coordinated Universal Time)} (at http://localhost:8080/src/hooks/useAgendaData.ts:97:24)
[WARNING] useAgendaData: Datas inválidas ou iguais: {startDate: Tue Oct 14 2025 03:16:12 GMT+0000 (Coordinated Universal Time), endDate: Tue Oct 14 2025 03:16:12 GMT+0000 (Coordinated Universal Time)} (at http://localhost:8080/src/hooks/useAgendaData.ts:97:24)
[WARNING] useAgendaData: Datas inválidas ou iguais: {startDate: Tue Oct 14 2025 03:16:12 GMT+0000 (Coordinated Universal Time), endDate: Tue Oct 14 2025 03:16:12 GMT+0000 (Coordinated Universal Time)} (at http://localhost:8080/src/hooks/useAgendaData.ts:97:24)
[WARNING] useAgendaData: Datas inválidas ou iguais: {startDate: Tue Oct 14 2025 03:16:12 GMT+0000 (Coordinated Universal Time), endDate: Tue Oct 14 2025 03:16:12 GMT+0000 (Coordinated Universal Time)} (at http://localhost:8080/src/hooks/useAgendaData.ts:97:24)
[WARNING] useAgendaData: Datas inválidas ou iguais: {startDate: Tue Oct 14 2025 03:16:13 GMT+0000 (Coordinated Universal Time), endDate: Tue Oct 14 2025 03:16:13 GMT+0000 (Coordinated Universal Time)} (at http://localhost:8080/src/hooks/useAgendaData.ts:97:24)
[WARNING] useAgendaData: Datas inválidas ou iguais: {startDate: Tue Oct 14 2025 03:16:13 GMT+0000 (Coordinated Universal Time), endDate: Tue Oct 14 2025 03:16:13 GMT+0000 (Coordinated Universal Time)} (at http://localhost:8080/src/hooks/useAgendaData.ts:97:24)
[WARNING] useAgendaData: Datas inválidas ou iguais: {startDate: Tue Oct 14 2025 03:16:13 GMT+0000 (Coordinated Universal Time), endDate: Tue Oct 14 2025 03:16:13 GMT+0000 (Coordinated Universal Time)} (at http://localhost:8080/src/hooks/useAgendaData.ts:97:24)
[WARNING] useAgendaData: Datas inválidas ou iguais: {startDate: Tue Oct 14 2025 03:16:13 GMT+0000 (Coordinated Universal Time), endDate: Tue Oct 14 2025 03:16:13 GMT+0000 (Coordinated Universal Time)} (at http://localhost:8080/src/hooks/useAgendaData.ts:97:24)
[WARNING] useAgendaData: Datas inválidas ou iguais: {startDate: Tue Oct 14 2025 03:16:13 GMT+0000 (Coordinated Universal Time), endDate: Tue Oct 14 2025 03:16:13 GMT+0000 (Coordinated Universal Time)} (at http://localhost:8080/src/hooks/useAgendaData.ts:97:24)
[WARNING] useAgendaData: Datas inválidas ou iguais: {startDate: Tue Oct 14 2025 03:16:13 GMT+0000 (Coordinated Universal Time), endDate: Tue Oct 14 2025 03:16:13 GMT+0000 (Coordinated Universal Time)} (at http://localhost:8080/src/hooks/useAgendaData.ts:97:24)
[WARNING] useAgendaData: Datas inválidas ou iguais: {startDate: Tue Oct 14 2025 03:16:13 GMT+0000 (Coordinated Universal Time), endDate: Tue Oct 14 2025 03:16:13 GMT+0000 (Coordinated Universal Time)} (at http://localhost:8080/src/hooks/useAgendaData.ts:97:24)
[WARNING] useAgendaData: Datas inválidas ou iguais: {startDate: Tue Oct 14 2025 03:16:13 GMT+0000 (Coordinated Universal Time), endDate: Tue Oct 14 2025 03:16:13 GMT+0000 (Coordinated Universal Time)} (at http://localhost:8080/src/hooks/useAgendaData.ts:97:24)
[WARNING] useAgendaData: Datas inválidas ou iguais: {startDate: Tue Oct 14 2025 03:16:13 GMT+0000 (Coordinated Universal Time), endDate: Tue Oct 14 2025 03:16:13 GMT+0000 (Coordinated Universal Time)} (at http://localhost:8080/src/hooks/useAgendaData.ts:97:24)
[ERROR] 🚨 LOOP INFINITO DETECTADO! Bloqueando requisições por 5 segundos (at http://localhost:8080/src/hooks/useAgendaData.ts:84:28)
[WARNING] useAgendaData: Requisição bloqueada temporariamente (at http://localhost:8080/src/hooks/useAgendaData.ts:77:28)
[WARNING] useAgendaData: Requisição bloqueada temporariamente (at http://localhost:8080/src/hooks/useAgendaData.ts:77:28)
- **Test Visualization and Result:** https://www.testsprite.com/dashboard/mcp/tests/07778ff7-3d99-4338-b6f6-3ebe4abc57b3/3307fbc0-da1b-4cc0-8fe9-4bd58a923424
- **Status:** ❌ Failed
- **Analysis / Findings:** {{TODO:AI_ANALYSIS}}.
---

#### Test TC008
- **Test Name:** Calendar Event Creation and Reminders
- **Test Code:** [TC008_Calendar_Event_Creation_and_Reminders.py](./TC008_Calendar_Event_Creation_and_Reminders.py)
- **Test Error:** Failed to go to the start URL. Err: Error executing action go_to_url: Page.goto: Timeout 60000ms exceeded.
Call log:
  - navigating to "http://localhost:8080/", waiting until "load"

- **Test Visualization and Result:** https://www.testsprite.com/dashboard/mcp/tests/07778ff7-3d99-4338-b6f6-3ebe4abc57b3/05030c0e-4f6f-4356-82d0-d15ff9446e64
- **Status:** ❌ Failed
- **Analysis / Findings:** {{TODO:AI_ANALYSIS}}.
---

#### Test TC009
- **Test Name:** AI Sub-Agent Interaction - Business Plan
- **Test Code:** [TC009_AI_Sub_Agent_Interaction___Business_Plan.py](./TC009_AI_Sub_Agent_Interaction___Business_Plan.py)
- **Test Error:** Dashboard page is not loading properly, stuck on loading spinner. Unable to proceed with testing WhatsApp commands for AI sub-agents. Reporting the issue and stopping further testing.
Browser Console Logs:
[WARNING] useAgendaData: Datas inválidas ou iguais: {startDate: Tue Oct 14 2025 03:16:05 GMT+0000 (Coordinated Universal Time), endDate: Tue Oct 14 2025 03:16:05 GMT+0000 (Coordinated Universal Time)} (at http://localhost:8080/src/hooks/useAgendaData.ts:97:24)
[WARNING] useAgendaData: Datas inválidas ou iguais: {startDate: Tue Oct 14 2025 03:16:05 GMT+0000 (Coordinated Universal Time), endDate: Tue Oct 14 2025 03:16:05 GMT+0000 (Coordinated Universal Time)} (at http://localhost:8080/src/hooks/useAgendaData.ts:97:24)
[WARNING] useAgendaData: Datas inválidas ou iguais: {startDate: Tue Oct 14 2025 03:16:05 GMT+0000 (Coordinated Universal Time), endDate: Tue Oct 14 2025 03:16:05 GMT+0000 (Coordinated Universal Time)} (at http://localhost:8080/src/hooks/useAgendaData.ts:97:24)
[WARNING] useAgendaData: Datas inválidas ou iguais: {startDate: Tue Oct 14 2025 03:16:05 GMT+0000 (Coordinated Universal Time), endDate: Tue Oct 14 2025 03:16:05 GMT+0000 (Coordinated Universal Time)} (at http://localhost:8080/src/hooks/useAgendaData.ts:97:24)
[WARNING] useAgendaData: Datas inválidas ou iguais: {startDate: Tue Oct 14 2025 03:16:05 GMT+0000 (Coordinated Universal Time), endDate: Tue Oct 14 2025 03:16:05 GMT+0000 (Coordinated Universal Time)} (at http://localhost:8080/src/hooks/useAgendaData.ts:97:24)
[WARNING] useAgendaData: Datas inválidas ou iguais: {startDate: Tue Oct 14 2025 03:16:06 GMT+0000 (Coordinated Universal Time), endDate: Tue Oct 14 2025 03:16:06 GMT+0000 (Coordinated Universal Time)} (at http://localhost:8080/src/hooks/useAgendaData.ts:97:24)
[WARNING] useAgendaData: Datas inválidas ou iguais: {startDate: Tue Oct 14 2025 03:16:06 GMT+0000 (Coordinated Universal Time), endDate: Tue Oct 14 2025 03:16:06 GMT+0000 (Coordinated Universal Time)} (at http://localhost:8080/src/hooks/useAgendaData.ts:97:24)
[WARNING] useAgendaData: Datas inválidas ou iguais: {startDate: Tue Oct 14 2025 03:16:06 GMT+0000 (Coordinated Universal Time), endDate: Tue Oct 14 2025 03:16:06 GMT+0000 (Coordinated Universal Time)} (at http://localhost:8080/src/hooks/useAgendaData.ts:97:24)
[WARNING] useAgendaData: Datas inválidas ou iguais: {startDate: Tue Oct 14 2025 03:16:06 GMT+0000 (Coordinated Universal Time), endDate: Tue Oct 14 2025 03:16:06 GMT+0000 (Coordinated Universal Time)} (at http://localhost:8080/src/hooks/useAgendaData.ts:97:24)
[WARNING] useAgendaData: Datas inválidas ou iguais: {startDate: Tue Oct 14 2025 03:16:06 GMT+0000 (Coordinated Universal Time), endDate: Tue Oct 14 2025 03:16:06 GMT+0000 (Coordinated Universal Time)} (at http://localhost:8080/src/hooks/useAgendaData.ts:97:24)
[WARNING] useAgendaData: Datas inválidas ou iguais: {startDate: Tue Oct 14 2025 03:16:06 GMT+0000 (Coordinated Universal Time), endDate: Tue Oct 14 2025 03:16:06 GMT+0000 (Coordinated Universal Time)} (at http://localhost:8080/src/hooks/useAgendaData.ts:97:24)
[WARNING] useAgendaData: Datas inválidas ou iguais: {startDate: Tue Oct 14 2025 03:16:06 GMT+0000 (Coordinated Universal Time), endDate: Tue Oct 14 2025 03:16:06 GMT+0000 (Coordinated Universal Time)} (at http://localhost:8080/src/hooks/useAgendaData.ts:97:24)
[WARNING] useAgendaData: Datas inválidas ou iguais: {startDate: Tue Oct 14 2025 03:16:06 GMT+0000 (Coordinated Universal Time), endDate: Tue Oct 14 2025 03:16:06 GMT+0000 (Coordinated Universal Time)} (at http://localhost:8080/src/hooks/useAgendaData.ts:97:24)
[WARNING] useAgendaData: Datas inválidas ou iguais: {startDate: Tue Oct 14 2025 03:16:06 GMT+0000 (Coordinated Universal Time), endDate: Tue Oct 14 2025 03:16:06 GMT+0000 (Coordinated Universal Time)} (at http://localhost:8080/src/hooks/useAgendaData.ts:97:24)
[WARNING] useAgendaData: Datas inválidas ou iguais: {startDate: Tue Oct 14 2025 03:16:06 GMT+0000 (Coordinated Universal Time), endDate: Tue Oct 14 2025 03:16:06 GMT+0000 (Coordinated Universal Time)} (at http://localhost:8080/src/hooks/useAgendaData.ts:97:24)
[WARNING] useAgendaData: Datas inválidas ou iguais: {startDate: Tue Oct 14 2025 03:16:06 GMT+0000 (Coordinated Universal Time), endDate: Tue Oct 14 2025 03:16:06 GMT+0000 (Coordinated Universal Time)} (at http://localhost:8080/src/hooks/useAgendaData.ts:97:24)
[WARNING] useAgendaData: Datas inválidas ou iguais: {startDate: Tue Oct 14 2025 03:16:06 GMT+0000 (Coordinated Universal Time), endDate: Tue Oct 14 2025 03:16:06 GMT+0000 (Coordinated Universal Time)} (at http://localhost:8080/src/hooks/useAgendaData.ts:97:24)
[ERROR] 🚨 LOOP INFINITO DETECTADO! Bloqueando requisições por 5 segundos (at http://localhost:8080/src/hooks/useAgendaData.ts:84:28)
[WARNING] useAgendaData: Requisição bloqueada temporariamente (at http://localhost:8080/src/hooks/useAgendaData.ts:77:28)
[WARNING] useAgendaData: Requisição bloqueada temporariamente (at http://localhost:8080/src/hooks/useAgendaData.ts:77:28)
- **Test Visualization and Result:** https://www.testsprite.com/dashboard/mcp/tests/07778ff7-3d99-4338-b6f6-3ebe4abc57b3/e641e4b7-802c-4e13-9af4-20e845dacff9
- **Status:** ❌ Failed
- **Analysis / Findings:** {{TODO:AI_ANALYSIS}}.
---

#### Test TC010
- **Test Name:** AI Sub-Agent Inactive in Free Plan
- **Test Code:** [TC010_AI_Sub_Agent_Inactive_in_Free_Plan.py](./TC010_AI_Sub_Agent_Inactive_in_Free_Plan.py)
- **Test Error:** Failed to go to the start URL. Err: Error executing action go_to_url: Page.goto: Timeout 60000ms exceeded.
Call log:
  - navigating to "http://localhost:8080/", waiting until "load"

- **Test Visualization and Result:** https://www.testsprite.com/dashboard/mcp/tests/07778ff7-3d99-4338-b6f6-3ebe4abc57b3/728884db-7e2d-4026-9feb-2bff2852b18b
- **Status:** ❌ Failed
- **Analysis / Findings:** {{TODO:AI_ANALYSIS}}.
---

#### Test TC011
- **Test Name:** Support Ticket Creation and Tracking - Premium Plan
- **Test Code:** [TC011_Support_Ticket_Creation_and_Tracking___Premium_Plan.py](./TC011_Support_Ticket_Creation_and_Tracking___Premium_Plan.py)
- **Test Error:** Failed to go to the start URL. Err: Error executing action go_to_url: Page.goto: Timeout 60000ms exceeded.
Call log:
  - navigating to "http://localhost:8080/", waiting until "load"

- **Test Visualization and Result:** https://www.testsprite.com/dashboard/mcp/tests/07778ff7-3d99-4338-b6f6-3ebe4abc57b3/60c04897-a050-4cef-8be9-c1829b20ceff
- **Status:** ❌ Failed
- **Analysis / Findings:** {{TODO:AI_ANALYSIS}}.
---

#### Test TC012
- **Test Name:** Plan Upgrade Unlocks Features
- **Test Code:** [TC012_Plan_Upgrade_Unlocks_Features.py](./TC012_Plan_Upgrade_Unlocks_Features.py)
- **Test Error:** Upgrade button for Business plan is not working, blocking verification of premium feature access after upgrade. Task stopped due to this issue.
Browser Console Logs:
[WARNING] useAgendaData: Datas inválidas ou iguais: {startDate: Tue Oct 14 2025 03:16:06 GMT+0000 (Coordinated Universal Time), endDate: Tue Oct 14 2025 03:16:06 GMT+0000 (Coordinated Universal Time)} (at http://localhost:8080/src/hooks/useAgendaData.ts:97:24)
[WARNING] useAgendaData: Datas inválidas ou iguais: {startDate: Tue Oct 14 2025 03:16:06 GMT+0000 (Coordinated Universal Time), endDate: Tue Oct 14 2025 03:16:06 GMT+0000 (Coordinated Universal Time)} (at http://localhost:8080/src/hooks/useAgendaData.ts:97:24)
[WARNING] useAgendaData: Datas inválidas ou iguais: {startDate: Tue Oct 14 2025 03:16:06 GMT+0000 (Coordinated Universal Time), endDate: Tue Oct 14 2025 03:16:06 GMT+0000 (Coordinated Universal Time)} (at http://localhost:8080/src/hooks/useAgendaData.ts:97:24)
[WARNING] useAgendaData: Datas inválidas ou iguais: {startDate: Tue Oct 14 2025 03:16:06 GMT+0000 (Coordinated Universal Time), endDate: Tue Oct 14 2025 03:16:06 GMT+0000 (Coordinated Universal Time)} (at http://localhost:8080/src/hooks/useAgendaData.ts:97:24)
[WARNING] useAgendaData: Datas inválidas ou iguais: {startDate: Tue Oct 14 2025 03:16:06 GMT+0000 (Coordinated Universal Time), endDate: Tue Oct 14 2025 03:16:06 GMT+0000 (Coordinated Universal Time)} (at http://localhost:8080/src/hooks/useAgendaData.ts:97:24)
[WARNING] useAgendaData: Datas inválidas ou iguais: {startDate: Tue Oct 14 2025 03:16:07 GMT+0000 (Coordinated Universal Time), endDate: Tue Oct 14 2025 03:16:07 GMT+0000 (Coordinated Universal Time)} (at http://localhost:8080/src/hooks/useAgendaData.ts:97:24)
[WARNING] useAgendaData: Datas inválidas ou iguais: {startDate: Tue Oct 14 2025 03:16:07 GMT+0000 (Coordinated Universal Time), endDate: Tue Oct 14 2025 03:16:07 GMT+0000 (Coordinated Universal Time)} (at http://localhost:8080/src/hooks/useAgendaData.ts:97:24)
[WARNING] useAgendaData: Datas inválidas ou iguais: {startDate: Tue Oct 14 2025 03:16:07 GMT+0000 (Coordinated Universal Time), endDate: Tue Oct 14 2025 03:16:07 GMT+0000 (Coordinated Universal Time)} (at http://localhost:8080/src/hooks/useAgendaData.ts:97:24)
[WARNING] useAgendaData: Datas inválidas ou iguais: {startDate: Tue Oct 14 2025 03:16:07 GMT+0000 (Coordinated Universal Time), endDate: Tue Oct 14 2025 03:16:07 GMT+0000 (Coordinated Universal Time)} (at http://localhost:8080/src/hooks/useAgendaData.ts:97:24)
[WARNING] useAgendaData: Datas inválidas ou iguais: {startDate: Tue Oct 14 2025 03:16:07 GMT+0000 (Coordinated Universal Time), endDate: Tue Oct 14 2025 03:16:07 GMT+0000 (Coordinated Universal Time)} (at http://localhost:8080/src/hooks/useAgendaData.ts:97:24)
[WARNING] useAgendaData: Datas inválidas ou iguais: {startDate: Tue Oct 14 2025 03:16:07 GMT+0000 (Coordinated Universal Time), endDate: Tue Oct 14 2025 03:16:07 GMT+0000 (Coordinated Universal Time)} (at http://localhost:8080/src/hooks/useAgendaData.ts:97:24)
[WARNING] useAgendaData: Datas inválidas ou iguais: {startDate: Tue Oct 14 2025 03:16:07 GMT+0000 (Coordinated Universal Time), endDate: Tue Oct 14 2025 03:16:07 GMT+0000 (Coordinated Universal Time)} (at http://localhost:8080/src/hooks/useAgendaData.ts:97:24)
[WARNING] useAgendaData: Datas inválidas ou iguais: {startDate: Tue Oct 14 2025 03:16:07 GMT+0000 (Coordinated Universal Time), endDate: Tue Oct 14 2025 03:16:07 GMT+0000 (Coordinated Universal Time)} (at http://localhost:8080/src/hooks/useAgendaData.ts:97:24)
[WARNING] useAgendaData: Datas inválidas ou iguais: {startDate: Tue Oct 14 2025 03:16:07 GMT+0000 (Coordinated Universal Time), endDate: Tue Oct 14 2025 03:16:07 GMT+0000 (Coordinated Universal Time)} (at http://localhost:8080/src/hooks/useAgendaData.ts:97:24)
[WARNING] useAgendaData: Datas inválidas ou iguais: {startDate: Tue Oct 14 2025 03:16:07 GMT+0000 (Coordinated Universal Time), endDate: Tue Oct 14 2025 03:16:07 GMT+0000 (Coordinated Universal Time)} (at http://localhost:8080/src/hooks/useAgendaData.ts:97:24)
[WARNING] useAgendaData: Datas inválidas ou iguais: {startDate: Tue Oct 14 2025 03:16:07 GMT+0000 (Coordinated Universal Time), endDate: Tue Oct 14 2025 03:16:07 GMT+0000 (Coordinated Universal Time)} (at http://localhost:8080/src/hooks/useAgendaData.ts:97:24)
[WARNING] useAgendaData: Datas inválidas ou iguais: {startDate: Tue Oct 14 2025 03:16:07 GMT+0000 (Coordinated Universal Time), endDate: Tue Oct 14 2025 03:16:07 GMT+0000 (Coordinated Universal Time)} (at http://localhost:8080/src/hooks/useAgendaData.ts:97:24)
[WARNING] useAgendaData: Datas inválidas ou iguais: {startDate: Tue Oct 14 2025 03:16:07 GMT+0000 (Coordinated Universal Time), endDate: Tue Oct 14 2025 03:16:07 GMT+0000 (Coordinated Universal Time)} (at http://localhost:8080/src/hooks/useAgendaData.ts:97:24)
[WARNING] useAgendaData: Datas inválidas ou iguais: {startDate: Tue Oct 14 2025 03:16:07 GMT+0000 (Coordinated Universal Time), endDate: Tue Oct 14 2025 03:16:07 GMT+0000 (Coordinated Universal Time)} (at http://localhost:8080/src/hooks/useAgendaData.ts:97:24)
[WARNING] useAgendaData: Datas inválidas ou iguais: {startDate: Tue Oct 14 2025 03:16:07 GMT+0000 (Coordinated Universal Time), endDate: Tue Oct 14 2025 03:16:07 GMT+0000 (Coordinated Universal Time)} (at http://localhost:8080/src/hooks/useAgendaData.ts:97:24)
- **Test Visualization and Result:** https://www.testsprite.com/dashboard/mcp/tests/07778ff7-3d99-4338-b6f6-3ebe4abc57b3/bdb08ba9-3a6c-4b57-afdf-d9f1e9851aad
- **Status:** ❌ Failed
- **Analysis / Findings:** {{TODO:AI_ANALYSIS}}.
---

#### Test TC013
- **Test Name:** Backup Execution and Integrity Validation - Premium Plan
- **Test Code:** [TC013_Backup_Execution_and_Integrity_Validation___Premium_Plan.py](./TC013_Backup_Execution_and_Integrity_Validation___Premium_Plan.py)
- **Test Visualization and Result:** https://www.testsprite.com/dashboard/mcp/tests/07778ff7-3d99-4338-b6f6-3ebe4abc57b3/187b3392-3ad2-415f-9f28-fa156787d324
- **Status:** ✅ Passed
- **Analysis / Findings:** {{TODO:AI_ANALYSIS}}.
---

#### Test TC014
- **Test Name:** Enforcement of LGPD Consent and Privacy Settings
- **Test Code:** [TC014_Enforcement_of_LGPD_Consent_and_Privacy_Settings.py](./TC014_Enforcement_of_LGPD_Consent_and_Privacy_Settings.py)
- **Test Error:** User consent management and privacy options were verified. Consent toggles can be modified and saved. However, the data deletion functionality does not provide any confirmation or indication of success, which is a critical issue. No initial consent prompt was observed before login, which may also be a compliance concern. Task stopped and issue reported.
Browser Console Logs:
[WARNING] useAgendaData: Datas inválidas ou iguais: {startDate: Tue Oct 14 2025 03:16:15 GMT+0000 (Coordinated Universal Time), endDate: Tue Oct 14 2025 03:16:15 GMT+0000 (Coordinated Universal Time)} (at http://localhost:8080/src/hooks/useAgendaData.ts:97:24)
[WARNING] useAgendaData: Datas inválidas ou iguais: {startDate: Tue Oct 14 2025 03:16:15 GMT+0000 (Coordinated Universal Time), endDate: Tue Oct 14 2025 03:16:15 GMT+0000 (Coordinated Universal Time)} (at http://localhost:8080/src/hooks/useAgendaData.ts:97:24)
[WARNING] useAgendaData: Datas inválidas ou iguais: {startDate: Tue Oct 14 2025 03:16:15 GMT+0000 (Coordinated Universal Time), endDate: Tue Oct 14 2025 03:16:15 GMT+0000 (Coordinated Universal Time)} (at http://localhost:8080/src/hooks/useAgendaData.ts:97:24)
[WARNING] useAgendaData: Datas inválidas ou iguais: {startDate: Tue Oct 14 2025 03:16:15 GMT+0000 (Coordinated Universal Time), endDate: Tue Oct 14 2025 03:16:15 GMT+0000 (Coordinated Universal Time)} (at http://localhost:8080/src/hooks/useAgendaData.ts:97:24)
[WARNING] useAgendaData: Datas inválidas ou iguais: {startDate: Tue Oct 14 2025 03:16:15 GMT+0000 (Coordinated Universal Time), endDate: Tue Oct 14 2025 03:16:15 GMT+0000 (Coordinated Universal Time)} (at http://localhost:8080/src/hooks/useAgendaData.ts:97:24)
[WARNING] useAgendaData: Datas inválidas ou iguais: {startDate: Tue Oct 14 2025 03:16:15 GMT+0000 (Coordinated Universal Time), endDate: Tue Oct 14 2025 03:16:15 GMT+0000 (Coordinated Universal Time)} (at http://localhost:8080/src/hooks/useAgendaData.ts:97:24)
[WARNING] useAgendaData: Datas inválidas ou iguais: {startDate: Tue Oct 14 2025 03:16:15 GMT+0000 (Coordinated Universal Time), endDate: Tue Oct 14 2025 03:16:15 GMT+0000 (Coordinated Universal Time)} (at http://localhost:8080/src/hooks/useAgendaData.ts:97:24)
[WARNING] useAgendaData: Datas inválidas ou iguais: {startDate: Tue Oct 14 2025 03:16:15 GMT+0000 (Coordinated Universal Time), endDate: Tue Oct 14 2025 03:16:15 GMT+0000 (Coordinated Universal Time)} (at http://localhost:8080/src/hooks/useAgendaData.ts:97:24)
[WARNING] useAgendaData: Datas inválidas ou iguais: {startDate: Tue Oct 14 2025 03:16:15 GMT+0000 (Coordinated Universal Time), endDate: Tue Oct 14 2025 03:16:15 GMT+0000 (Coordinated Universal Time)} (at http://localhost:8080/src/hooks/useAgendaData.ts:97:24)
[WARNING] useAgendaData: Datas inválidas ou iguais: {startDate: Tue Oct 14 2025 03:16:15 GMT+0000 (Coordinated Universal Time), endDate: Tue Oct 14 2025 03:16:15 GMT+0000 (Coordinated Universal Time)} (at http://localhost:8080/src/hooks/useAgendaData.ts:97:24)
[WARNING] useAgendaData: Datas inválidas ou iguais: {startDate: Tue Oct 14 2025 03:16:15 GMT+0000 (Coordinated Universal Time), endDate: Tue Oct 14 2025 03:16:15 GMT+0000 (Coordinated Universal Time)} (at http://localhost:8080/src/hooks/useAgendaData.ts:97:24)
[WARNING] useAgendaData: Datas inválidas ou iguais: {startDate: Tue Oct 14 2025 03:16:15 GMT+0000 (Coordinated Universal Time), endDate: Tue Oct 14 2025 03:16:15 GMT+0000 (Coordinated Universal Time)} (at http://localhost:8080/src/hooks/useAgendaData.ts:97:24)
[WARNING] useAgendaData: Datas inválidas ou iguais: {startDate: Tue Oct 14 2025 03:16:15 GMT+0000 (Coordinated Universal Time), endDate: Tue Oct 14 2025 03:16:15 GMT+0000 (Coordinated Universal Time)} (at http://localhost:8080/src/hooks/useAgendaData.ts:97:24)
[WARNING] useAgendaData: Datas inválidas ou iguais: {startDate: Tue Oct 14 2025 03:16:15 GMT+0000 (Coordinated Universal Time), endDate: Tue Oct 14 2025 03:16:15 GMT+0000 (Coordinated Universal Time)} (at http://localhost:8080/src/hooks/useAgendaData.ts:97:24)
[WARNING] useAgendaData: Datas inválidas ou iguais: {startDate: Tue Oct 14 2025 03:16:15 GMT+0000 (Coordinated Universal Time), endDate: Tue Oct 14 2025 03:16:15 GMT+0000 (Coordinated Universal Time)} (at http://localhost:8080/src/hooks/useAgendaData.ts:97:24)
[WARNING] useAgendaData: Datas inválidas ou iguais: {startDate: Tue Oct 14 2025 03:16:15 GMT+0000 (Coordinated Universal Time), endDate: Tue Oct 14 2025 03:16:15 GMT+0000 (Coordinated Universal Time)} (at http://localhost:8080/src/hooks/useAgendaData.ts:97:24)
[WARNING] useAgendaData: Datas inválidas ou iguais: {startDate: Tue Oct 14 2025 03:16:15 GMT+0000 (Coordinated Universal Time), endDate: Tue Oct 14 2025 03:16:15 GMT+0000 (Coordinated Universal Time)} (at http://localhost:8080/src/hooks/useAgendaData.ts:97:24)
[ERROR] 🚨 LOOP INFINITO DETECTADO! Bloqueando requisições por 5 segundos (at http://localhost:8080/src/hooks/useAgendaData.ts:84:28)
[WARNING] useAgendaData: Requisição bloqueada temporariamente (at http://localhost:8080/src/hooks/useAgendaData.ts:77:28)
[WARNING] useAgendaData: Requisição bloqueada temporariamente (at http://localhost:8080/src/hooks/useAgendaData.ts:77:28)
- **Test Visualization and Result:** https://www.testsprite.com/dashboard/mcp/tests/07778ff7-3d99-4338-b6f6-3ebe4abc57b3/ef695e69-c488-4d88-a81e-6df9f4505c49
- **Status:** ❌ Failed
- **Analysis / Findings:** {{TODO:AI_ANALYSIS}}.
---

#### Test TC015
- **Test Name:** Google Workspace Integration Functionality
- **Test Code:** [TC015_Google_Workspace_Integration_Functionality.py](./TC015_Google_Workspace_Integration_Functionality.py)
- **Test Error:** The task to verify correct and secure integration with Google Calendar and Drive for event syncing and document handling was partially completed. We successfully logged in, navigated through profile and settings, but did not find an explicit toggle or option to enable Google Workspace integration. Despite this, we created and saved a calendar event in the Meu Agente app, which should sync with Google Calendar if integration is active. However, we could not verify the event's appearance in Google Calendar directly within the app. We did not perform the document upload or linking from Google Drive due to lack of visible UI elements for this feature. Therefore, the integration verification is incomplete and requires further access or UI support to fully confirm document handling and permissions. Task success is set to false due to incomplete verification.
Browser Console Logs:
[WARNING] useAgendaData: Datas inválidas ou iguais: {startDate: Tue Oct 14 2025 03:16:11 GMT+0000 (Coordinated Universal Time), endDate: Tue Oct 14 2025 03:16:11 GMT+0000 (Coordinated Universal Time)} (at http://localhost:8080/src/hooks/useAgendaData.ts:97:24)
[WARNING] useAgendaData: Datas inválidas ou iguais: {startDate: Tue Oct 14 2025 03:16:11 GMT+0000 (Coordinated Universal Time), endDate: Tue Oct 14 2025 03:16:11 GMT+0000 (Coordinated Universal Time)} (at http://localhost:8080/src/hooks/useAgendaData.ts:97:24)
[WARNING] useAgendaData: Datas inválidas ou iguais: {startDate: Tue Oct 14 2025 03:16:11 GMT+0000 (Coordinated Universal Time), endDate: Tue Oct 14 2025 03:16:11 GMT+0000 (Coordinated Universal Time)} (at http://localhost:8080/src/hooks/useAgendaData.ts:97:24)
[WARNING] useAgendaData: Datas inválidas ou iguais: {startDate: Tue Oct 14 2025 03:16:11 GMT+0000 (Coordinated Universal Time), endDate: Tue Oct 14 2025 03:16:11 GMT+0000 (Coordinated Universal Time)} (at http://localhost:8080/src/hooks/useAgendaData.ts:97:24)
[WARNING] useAgendaData: Datas inválidas ou iguais: {startDate: Tue Oct 14 2025 03:16:11 GMT+0000 (Coordinated Universal Time), endDate: Tue Oct 14 2025 03:16:11 GMT+0000 (Coordinated Universal Time)} (at http://localhost:8080/src/hooks/useAgendaData.ts:97:24)
[WARNING] useAgendaData: Datas inválidas ou iguais: {startDate: Tue Oct 14 2025 03:16:11 GMT+0000 (Coordinated Universal Time), endDate: Tue Oct 14 2025 03:16:11 GMT+0000 (Coordinated Universal Time)} (at http://localhost:8080/src/hooks/useAgendaData.ts:97:24)
[WARNING] useAgendaData: Datas inválidas ou iguais: {startDate: Tue Oct 14 2025 03:16:11 GMT+0000 (Coordinated Universal Time), endDate: Tue Oct 14 2025 03:16:11 GMT+0000 (Coordinated Universal Time)} (at http://localhost:8080/src/hooks/useAgendaData.ts:97:24)
[WARNING] useAgendaData: Datas inválidas ou iguais: {startDate: Tue Oct 14 2025 03:16:11 GMT+0000 (Coordinated Universal Time), endDate: Tue Oct 14 2025 03:16:11 GMT+0000 (Coordinated Universal Time)} (at http://localhost:8080/src/hooks/useAgendaData.ts:97:24)
[WARNING] useAgendaData: Datas inválidas ou iguais: {startDate: Tue Oct 14 2025 03:16:11 GMT+0000 (Coordinated Universal Time), endDate: Tue Oct 14 2025 03:16:11 GMT+0000 (Coordinated Universal Time)} (at http://localhost:8080/src/hooks/useAgendaData.ts:97:24)
[WARNING] useAgendaData: Datas inválidas ou iguais: {startDate: Tue Oct 14 2025 03:16:11 GMT+0000 (Coordinated Universal Time), endDate: Tue Oct 14 2025 03:16:11 GMT+0000 (Coordinated Universal Time)} (at http://localhost:8080/src/hooks/useAgendaData.ts:97:24)
[WARNING] useAgendaData: Datas inválidas ou iguais: {startDate: Tue Oct 14 2025 03:16:11 GMT+0000 (Coordinated Universal Time), endDate: Tue Oct 14 2025 03:16:11 GMT+0000 (Coordinated Universal Time)} (at http://localhost:8080/src/hooks/useAgendaData.ts:97:24)
[WARNING] useAgendaData: Datas inválidas ou iguais: {startDate: Tue Oct 14 2025 03:16:11 GMT+0000 (Coordinated Universal Time), endDate: Tue Oct 14 2025 03:16:11 GMT+0000 (Coordinated Universal Time)} (at http://localhost:8080/src/hooks/useAgendaData.ts:97:24)
[WARNING] useAgendaData: Datas inválidas ou iguais: {startDate: Tue Oct 14 2025 03:16:11 GMT+0000 (Coordinated Universal Time), endDate: Tue Oct 14 2025 03:16:11 GMT+0000 (Coordinated Universal Time)} (at http://localhost:8080/src/hooks/useAgendaData.ts:97:24)
[WARNING] useAgendaData: Datas inválidas ou iguais: {startDate: Tue Oct 14 2025 03:16:11 GMT+0000 (Coordinated Universal Time), endDate: Tue Oct 14 2025 03:16:11 GMT+0000 (Coordinated Universal Time)} (at http://localhost:8080/src/hooks/useAgendaData.ts:97:24)
[WARNING] useAgendaData: Datas inválidas ou iguais: {startDate: Tue Oct 14 2025 03:16:11 GMT+0000 (Coordinated Universal Time), endDate: Tue Oct 14 2025 03:16:11 GMT+0000 (Coordinated Universal Time)} (at http://localhost:8080/src/hooks/useAgendaData.ts:97:24)
[WARNING] useAgendaData: Datas inválidas ou iguais: {startDate: Tue Oct 14 2025 03:16:11 GMT+0000 (Coordinated Universal Time), endDate: Tue Oct 14 2025 03:16:11 GMT+0000 (Coordinated Universal Time)} (at http://localhost:8080/src/hooks/useAgendaData.ts:97:24)
[WARNING] useAgendaData: Datas inválidas ou iguais: {startDate: Tue Oct 14 2025 03:16:11 GMT+0000 (Coordinated Universal Time), endDate: Tue Oct 14 2025 03:16:11 GMT+0000 (Coordinated Universal Time)} (at http://localhost:8080/src/hooks/useAgendaData.ts:97:24)
[ERROR] 🚨 LOOP INFINITO DETECTADO! Bloqueando requisições por 5 segundos (at http://localhost:8080/src/hooks/useAgendaData.ts:84:28)
[WARNING] useAgendaData: Requisição bloqueada temporariamente (at http://localhost:8080/src/hooks/useAgendaData.ts:77:28)
[WARNING] useAgendaData: Requisição bloqueada temporariamente (at http://localhost:8080/src/hooks/useAgendaData.ts:77:28)
- **Test Visualization and Result:** https://www.testsprite.com/dashboard/mcp/tests/07778ff7-3d99-4338-b6f6-3ebe4abc57b3/f1ea9b45-c1c9-43be-afcf-d6bb26a3f37a
- **Status:** ❌ Failed
- **Analysis / Findings:** {{TODO:AI_ANALYSIS}}.
---

#### Test TC016
- **Test Name:** Real-time Notification System Functionality
- **Test Code:** [TC016_Real_time_Notification_System_Functionality.py](./TC016_Real_time_Notification_System_Functionality.py)
- **Test Error:** Failed to go to the start URL. Err: Error executing action go_to_url: Page.goto: Timeout 60000ms exceeded.
Call log:
  - navigating to "http://localhost:8080/", waiting until "load"

- **Test Visualization and Result:** https://www.testsprite.com/dashboard/mcp/tests/07778ff7-3d99-4338-b6f6-3ebe4abc57b3/e0da5946-13c2-4422-ba43-f92fdf7ab6f3
- **Status:** ❌ Failed
- **Analysis / Findings:** {{TODO:AI_ANALYSIS}}.
---

#### Test TC017
- **Test Name:** Dark and Light Theme Toggle Responsiveness
- **Test Code:** [TC017_Dark_and_Light_Theme_Toggle_Responsiveness.py](./TC017_Dark_and_Light_Theme_Toggle_Responsiveness.py)
- **Test Error:** Testing stopped due to critical login issue blocking access to dashboard and theme switch verification. Reported the issue for developer review.
Browser Console Logs:
[WARNING] useAgendaData: Datas inválidas ou iguais: {startDate: Tue Oct 14 2025 03:16:12 GMT+0000 (Coordinated Universal Time), endDate: Tue Oct 14 2025 03:16:12 GMT+0000 (Coordinated Universal Time)} (at http://localhost:8080/src/hooks/useAgendaData.ts:97:24)
[WARNING] useAgendaData: Datas inválidas ou iguais: {startDate: Tue Oct 14 2025 03:16:12 GMT+0000 (Coordinated Universal Time), endDate: Tue Oct 14 2025 03:16:12 GMT+0000 (Coordinated Universal Time)} (at http://localhost:8080/src/hooks/useAgendaData.ts:97:24)
[WARNING] useAgendaData: Datas inválidas ou iguais: {startDate: Tue Oct 14 2025 03:16:12 GMT+0000 (Coordinated Universal Time), endDate: Tue Oct 14 2025 03:16:12 GMT+0000 (Coordinated Universal Time)} (at http://localhost:8080/src/hooks/useAgendaData.ts:97:24)
[WARNING] useAgendaData: Datas inválidas ou iguais: {startDate: Tue Oct 14 2025 03:16:12 GMT+0000 (Coordinated Universal Time), endDate: Tue Oct 14 2025 03:16:12 GMT+0000 (Coordinated Universal Time)} (at http://localhost:8080/src/hooks/useAgendaData.ts:97:24)
[WARNING] useAgendaData: Datas inválidas ou iguais: {startDate: Tue Oct 14 2025 03:16:12 GMT+0000 (Coordinated Universal Time), endDate: Tue Oct 14 2025 03:16:12 GMT+0000 (Coordinated Universal Time)} (at http://localhost:8080/src/hooks/useAgendaData.ts:97:24)
[WARNING] useAgendaData: Datas inválidas ou iguais: {startDate: Tue Oct 14 2025 03:16:13 GMT+0000 (Coordinated Universal Time), endDate: Tue Oct 14 2025 03:16:13 GMT+0000 (Coordinated Universal Time)} (at http://localhost:8080/src/hooks/useAgendaData.ts:97:24)
[WARNING] useAgendaData: Datas inválidas ou iguais: {startDate: Tue Oct 14 2025 03:16:13 GMT+0000 (Coordinated Universal Time), endDate: Tue Oct 14 2025 03:16:13 GMT+0000 (Coordinated Universal Time)} (at http://localhost:8080/src/hooks/useAgendaData.ts:97:24)
[WARNING] useAgendaData: Datas inválidas ou iguais: {startDate: Tue Oct 14 2025 03:16:13 GMT+0000 (Coordinated Universal Time), endDate: Tue Oct 14 2025 03:16:13 GMT+0000 (Coordinated Universal Time)} (at http://localhost:8080/src/hooks/useAgendaData.ts:97:24)
[WARNING] useAgendaData: Datas inválidas ou iguais: {startDate: Tue Oct 14 2025 03:16:13 GMT+0000 (Coordinated Universal Time), endDate: Tue Oct 14 2025 03:16:13 GMT+0000 (Coordinated Universal Time)} (at http://localhost:8080/src/hooks/useAgendaData.ts:97:24)
[WARNING] useAgendaData: Datas inválidas ou iguais: {startDate: Tue Oct 14 2025 03:16:13 GMT+0000 (Coordinated Universal Time), endDate: Tue Oct 14 2025 03:16:13 GMT+0000 (Coordinated Universal Time)} (at http://localhost:8080/src/hooks/useAgendaData.ts:97:24)
[WARNING] useAgendaData: Datas inválidas ou iguais: {startDate: Tue Oct 14 2025 03:16:13 GMT+0000 (Coordinated Universal Time), endDate: Tue Oct 14 2025 03:16:13 GMT+0000 (Coordinated Universal Time)} (at http://localhost:8080/src/hooks/useAgendaData.ts:97:24)
[WARNING] useAgendaData: Datas inválidas ou iguais: {startDate: Tue Oct 14 2025 03:16:13 GMT+0000 (Coordinated Universal Time), endDate: Tue Oct 14 2025 03:16:13 GMT+0000 (Coordinated Universal Time)} (at http://localhost:8080/src/hooks/useAgendaData.ts:97:24)
[WARNING] useAgendaData: Datas inválidas ou iguais: {startDate: Tue Oct 14 2025 03:16:13 GMT+0000 (Coordinated Universal Time), endDate: Tue Oct 14 2025 03:16:13 GMT+0000 (Coordinated Universal Time)} (at http://localhost:8080/src/hooks/useAgendaData.ts:97:24)
[WARNING] useAgendaData: Datas inválidas ou iguais: {startDate: Tue Oct 14 2025 03:16:13 GMT+0000 (Coordinated Universal Time), endDate: Tue Oct 14 2025 03:16:13 GMT+0000 (Coordinated Universal Time)} (at http://localhost:8080/src/hooks/useAgendaData.ts:97:24)
[WARNING] useAgendaData: Datas inválidas ou iguais: {startDate: Tue Oct 14 2025 03:16:13 GMT+0000 (Coordinated Universal Time), endDate: Tue Oct 14 2025 03:16:13 GMT+0000 (Coordinated Universal Time)} (at http://localhost:8080/src/hooks/useAgendaData.ts:97:24)
[WARNING] useAgendaData: Datas inválidas ou iguais: {startDate: Tue Oct 14 2025 03:16:13 GMT+0000 (Coordinated Universal Time), endDate: Tue Oct 14 2025 03:16:13 GMT+0000 (Coordinated Universal Time)} (at http://localhost:8080/src/hooks/useAgendaData.ts:97:24)
[WARNING] useAgendaData: Datas inválidas ou iguais: {startDate: Tue Oct 14 2025 03:16:13 GMT+0000 (Coordinated Universal Time), endDate: Tue Oct 14 2025 03:16:13 GMT+0000 (Coordinated Universal Time)} (at http://localhost:8080/src/hooks/useAgendaData.ts:97:24)
[WARNING] useAgendaData: Datas inválidas ou iguais: {startDate: Tue Oct 14 2025 03:16:13 GMT+0000 (Coordinated Universal Time), endDate: Tue Oct 14 2025 03:16:13 GMT+0000 (Coordinated Universal Time)} (at http://localhost:8080/src/hooks/useAgendaData.ts:97:24)
[WARNING] useAgendaData: Datas inválidas ou iguais: {startDate: Tue Oct 14 2025 03:16:13 GMT+0000 (Coordinated Universal Time), endDate: Tue Oct 14 2025 03:16:13 GMT+0000 (Coordinated Universal Time)} (at http://localhost:8080/src/hooks/useAgendaData.ts:97:24)
[WARNING] useAgendaData: Datas inválidas ou iguais: {startDate: Tue Oct 14 2025 03:16:13 GMT+0000 (Coordinated Universal Time), endDate: Tue Oct 14 2025 03:16:13 GMT+0000 (Coordinated Universal Time)} (at http://localhost:8080/src/hooks/useAgendaData.ts:97:24)
- **Test Visualization and Result:** https://www.testsprite.com/dashboard/mcp/tests/07778ff7-3d99-4338-b6f6-3ebe4abc57b3/b83e0fa3-c790-455a-b00f-28b826cfa7ea
- **Status:** ❌ Failed
- **Analysis / Findings:** {{TODO:AI_ANALYSIS}}.
---

#### Test TC018
- **Test Name:** Global Search and Filtering Across Modules
- **Test Code:** [TC018_Global_Search_and_Filtering_Across_Modules.py](./TC018_Global_Search_and_Filtering_Across_Modules.py)
- **Test Error:** Tested global search input with query 'Salário' after successful login. No relevant results or filtering appeared across financial, task, goals, and calendar modules as expected. Reporting this as a website issue and stopping further testing.
Browser Console Logs:
[WARNING] useAgendaData: Datas inválidas ou iguais: {startDate: Tue Oct 14 2025 03:16:12 GMT+0000 (Coordinated Universal Time), endDate: Tue Oct 14 2025 03:16:12 GMT+0000 (Coordinated Universal Time)} (at http://localhost:8080/src/hooks/useAgendaData.ts:97:24)
[WARNING] useAgendaData: Datas inválidas ou iguais: {startDate: Tue Oct 14 2025 03:16:12 GMT+0000 (Coordinated Universal Time), endDate: Tue Oct 14 2025 03:16:12 GMT+0000 (Coordinated Universal Time)} (at http://localhost:8080/src/hooks/useAgendaData.ts:97:24)
[WARNING] useAgendaData: Datas inválidas ou iguais: {startDate: Tue Oct 14 2025 03:16:12 GMT+0000 (Coordinated Universal Time), endDate: Tue Oct 14 2025 03:16:12 GMT+0000 (Coordinated Universal Time)} (at http://localhost:8080/src/hooks/useAgendaData.ts:97:24)
[WARNING] useAgendaData: Datas inválidas ou iguais: {startDate: Tue Oct 14 2025 03:16:12 GMT+0000 (Coordinated Universal Time), endDate: Tue Oct 14 2025 03:16:12 GMT+0000 (Coordinated Universal Time)} (at http://localhost:8080/src/hooks/useAgendaData.ts:97:24)
[WARNING] useAgendaData: Datas inválidas ou iguais: {startDate: Tue Oct 14 2025 03:16:12 GMT+0000 (Coordinated Universal Time), endDate: Tue Oct 14 2025 03:16:12 GMT+0000 (Coordinated Universal Time)} (at http://localhost:8080/src/hooks/useAgendaData.ts:97:24)
[WARNING] useAgendaData: Datas inválidas ou iguais: {startDate: Tue Oct 14 2025 03:16:12 GMT+0000 (Coordinated Universal Time), endDate: Tue Oct 14 2025 03:16:12 GMT+0000 (Coordinated Universal Time)} (at http://localhost:8080/src/hooks/useAgendaData.ts:97:24)
[WARNING] useAgendaData: Datas inválidas ou iguais: {startDate: Tue Oct 14 2025 03:16:12 GMT+0000 (Coordinated Universal Time), endDate: Tue Oct 14 2025 03:16:12 GMT+0000 (Coordinated Universal Time)} (at http://localhost:8080/src/hooks/useAgendaData.ts:97:24)
[WARNING] useAgendaData: Datas inválidas ou iguais: {startDate: Tue Oct 14 2025 03:16:12 GMT+0000 (Coordinated Universal Time), endDate: Tue Oct 14 2025 03:16:12 GMT+0000 (Coordinated Universal Time)} (at http://localhost:8080/src/hooks/useAgendaData.ts:97:24)
[WARNING] useAgendaData: Datas inválidas ou iguais: {startDate: Tue Oct 14 2025 03:16:12 GMT+0000 (Coordinated Universal Time), endDate: Tue Oct 14 2025 03:16:12 GMT+0000 (Coordinated Universal Time)} (at http://localhost:8080/src/hooks/useAgendaData.ts:97:24)
[WARNING] useAgendaData: Datas inválidas ou iguais: {startDate: Tue Oct 14 2025 03:16:12 GMT+0000 (Coordinated Universal Time), endDate: Tue Oct 14 2025 03:16:12 GMT+0000 (Coordinated Universal Time)} (at http://localhost:8080/src/hooks/useAgendaData.ts:97:24)
[WARNING] useAgendaData: Datas inválidas ou iguais: {startDate: Tue Oct 14 2025 03:16:12 GMT+0000 (Coordinated Universal Time), endDate: Tue Oct 14 2025 03:16:12 GMT+0000 (Coordinated Universal Time)} (at http://localhost:8080/src/hooks/useAgendaData.ts:97:24)
[WARNING] useAgendaData: Datas inválidas ou iguais: {startDate: Tue Oct 14 2025 03:16:12 GMT+0000 (Coordinated Universal Time), endDate: Tue Oct 14 2025 03:16:12 GMT+0000 (Coordinated Universal Time)} (at http://localhost:8080/src/hooks/useAgendaData.ts:97:24)
[WARNING] useAgendaData: Datas inválidas ou iguais: {startDate: Tue Oct 14 2025 03:16:12 GMT+0000 (Coordinated Universal Time), endDate: Tue Oct 14 2025 03:16:12 GMT+0000 (Coordinated Universal Time)} (at http://localhost:8080/src/hooks/useAgendaData.ts:97:24)
[WARNING] useAgendaData: Datas inválidas ou iguais: {startDate: Tue Oct 14 2025 03:16:12 GMT+0000 (Coordinated Universal Time), endDate: Tue Oct 14 2025 03:16:12 GMT+0000 (Coordinated Universal Time)} (at http://localhost:8080/src/hooks/useAgendaData.ts:97:24)
[WARNING] useAgendaData: Datas inválidas ou iguais: {startDate: Tue Oct 14 2025 03:16:12 GMT+0000 (Coordinated Universal Time), endDate: Tue Oct 14 2025 03:16:12 GMT+0000 (Coordinated Universal Time)} (at http://localhost:8080/src/hooks/useAgendaData.ts:97:24)
[WARNING] useAgendaData: Datas inválidas ou iguais: {startDate: Tue Oct 14 2025 03:16:12 GMT+0000 (Coordinated Universal Time), endDate: Tue Oct 14 2025 03:16:12 GMT+0000 (Coordinated Universal Time)} (at http://localhost:8080/src/hooks/useAgendaData.ts:97:24)
[WARNING] useAgendaData: Datas inválidas ou iguais: {startDate: Tue Oct 14 2025 03:16:12 GMT+0000 (Coordinated Universal Time), endDate: Tue Oct 14 2025 03:16:12 GMT+0000 (Coordinated Universal Time)} (at http://localhost:8080/src/hooks/useAgendaData.ts:97:24)
[ERROR] 🚨 LOOP INFINITO DETECTADO! Bloqueando requisições por 5 segundos (at http://localhost:8080/src/hooks/useAgendaData.ts:84:28)
[WARNING] useAgendaData: Requisição bloqueada temporariamente (at http://localhost:8080/src/hooks/useAgendaData.ts:77:28)
[WARNING] useAgendaData: Requisição bloqueada temporariamente (at http://localhost:8080/src/hooks/useAgendaData.ts:77:28)
- **Test Visualization and Result:** https://www.testsprite.com/dashboard/mcp/tests/07778ff7-3d99-4338-b6f6-3ebe4abc57b3/1b4c7716-e04f-4201-9637-659bd282e5c5
- **Status:** ❌ Failed
- **Analysis / Findings:** {{TODO:AI_ANALYSIS}}.
---

#### Test TC019
- **Test Name:** Video Content Generation Request - Business Plan
- **Test Code:** [TC019_Video_Content_Generation_Request___Business_Plan.py](./TC019_Video_Content_Generation_Request___Business_Plan.py)
- **Test Error:** Failed to go to the start URL. Err: Error executing action go_to_url: Page.goto: Timeout 60000ms exceeded.
Call log:
  - navigating to "http://localhost:8080/", waiting until "load"

- **Test Visualization and Result:** https://www.testsprite.com/dashboard/mcp/tests/07778ff7-3d99-4338-b6f6-3ebe4abc57b3/ecc4aef8-1dd0-4c31-9c7a-ec6c2dd306fb
- **Status:** ❌ Failed
- **Analysis / Findings:** {{TODO:AI_ANALYSIS}}.
---

#### Test TC020
- **Test Name:** UI Responsiveness and Accessibility Check
- **Test Code:** [TC020_UI_Responsiveness_and_Accessibility_Check.py](./TC020_UI_Responsiveness_and_Accessibility_Check.py)
- **Test Error:** Failed to go to the start URL. Err: Error executing action go_to_url: Page.goto: Timeout 60000ms exceeded.
Call log:
  - navigating to "http://localhost:8080/", waiting until "load"

- **Test Visualization and Result:** https://www.testsprite.com/dashboard/mcp/tests/07778ff7-3d99-4338-b6f6-3ebe4abc57b3/78513afb-73ce-4864-a4e2-b5717de7e880
- **Status:** ❌ Failed
- **Analysis / Findings:** {{TODO:AI_ANALYSIS}}.
---


## 3️⃣ Coverage & Matching Metrics

- **5.00** of tests passed

| Requirement        | Total Tests | ✅ Passed | ❌ Failed  |
|--------------------|-------------|-----------|------------|
| ...                | ...         | ...       | ...        |
---


## 4️⃣ Key Gaps / Risks
{AI_GNERATED_KET_GAPS_AND_RISKS}
---