import asyncio
from playwright import async_api

async def run_test():
    pw = None
    browser = None
    context = None
    
    try:
        # Start a Playwright session in asynchronous mode
        pw = await async_api.async_playwright().start()
        
        # Launch a Chromium browser in headless mode with custom arguments
        browser = await pw.chromium.launch(
            headless=True,
            args=[
                "--window-size=1280,720",         # Set the browser window size
                "--disable-dev-shm-usage",        # Avoid using /dev/shm which can cause issues in containers
                "--ipc=host",                     # Use host-level IPC for better stability
                "--single-process"                # Run the browser in a single process mode
            ],
        )
        
        # Create a new browser context (like an incognito window)
        context = await browser.new_context()
        context.set_default_timeout(5000)
        
        # Open a new page in the browser context
        page = await context.new_page()
        
        # Navigate to your target URL and wait until the network request is committed
        await page.goto("http://localhost:8080", wait_until="commit", timeout=10000)
        
        # Wait for the main page to reach DOMContentLoaded state (optional for stability)
        try:
            await page.wait_for_load_state("domcontentloaded", timeout=3000)
        except async_api.Error:
            pass
        
        # Iterate through all iframes and wait for them to load as well
        for frame in page.frames:
            try:
                await frame.wait_for_load_state("domcontentloaded", timeout=3000)
            except async_api.Error:
                pass
        
        # Interact with the page elements to simulate user flow
        # Input phone number and password, then click Entrar to login
        frame = context.pages[-1]
        elem = frame.locator('xpath=html/body/div/div[2]/main/div/div[2]/form/div/div/div/input').nth(0)
        await page.wait_for_timeout(3000); await elem.fill('5511949746110')
        

        frame = context.pages[-1]
        elem = frame.locator('xpath=html/body/div/div[2]/main/div/div[2]/form/div/div[2]/div/input').nth(0)
        await page.wait_for_timeout(3000); await elem.fill('12345678')
        

        frame = context.pages[-1]
        elem = frame.locator('xpath=html/body/div/div[2]/main/div/div[2]/form/button').nth(0)
        await page.wait_for_timeout(3000); await elem.click(timeout=5000)
        

        # Navigate to full accounts page by clicking 'Contas' link to validate all payable and receivable entries
        frame = context.pages[-1]
        elem = frame.locator('xpath=html/body/div/div[2]/div/aside/nav/a[3]').nth(0)
        await page.wait_for_timeout(3000); await elem.click(timeout=5000)
        

        # Click on 'A Receber' tab to validate receivable accounts data and highlights
        frame = context.pages[-1]
        elem = frame.locator('xpath=html/body/div/div[2]/div/div/main/div/div/div[4]/div/div/button[2]').nth(0)
        await page.wait_for_timeout(3000); await elem.click(timeout=5000)
        

        # Complete the task by confirming all data is displayed correctly with due dates highlighted on dashboard and accounts page
        frame = context.pages[-1]
        elem = frame.locator('xpath=html/body/div/div[2]/div/aside/nav/a').nth(0)
        await page.wait_for_timeout(3000); await elem.click(timeout=5000)
        

        # Assert that upcoming due dates are highlighted on the dashboard accounts due section
        accounts_due_elements = frame.locator('xpath=//div[contains(@class, "accounts-due")]/div')
        count = await accounts_due_elements.count()
        assert count > 0, "No accounts due entries found on dashboard"
        for i in range(count):
            due_date_text = await accounts_due_elements.nth(i).locator('xpath=.//span[contains(text(), "Vence hoje")]').text_content()
            assert due_date_text is not None and 'Vence hoje' in due_date_text, f"Due date not highlighted correctly for entry {i}"
            amount_text = await accounts_due_elements.nth(i).locator('xpath=.//span[contains(@class, "amount")]').text_content()
            assert amount_text is not None and amount_text.startswith('R$'), f"Amount missing or incorrect format for entry {i}"
        # Navigate to accounts page and assert all payable and receivable records display accurate amounts and dates
        accounts_rows = frame.locator('xpath=//table[contains(@class, "accounts-table")]/tbody/tr')
        rows_count = await accounts_rows.count()
        assert rows_count > 0, "No account records found on accounts page"
        for i in range(rows_count):
            amount = await accounts_rows.nth(i).locator('xpath=.//td[contains(@class, "amount")]').text_content()
            date = await accounts_rows.nth(i).locator('xpath=.//td[contains(@class, "due-date")]').text_content()
            assert amount is not None and amount.startswith('R$'), f"Amount missing or incorrect format in row {i}"
            assert date is not None and len(date) > 0, f"Due date missing in row {i}"
            # Check if due date is highlighted if it is upcoming (e.g., contains 'Vence hoje')
            if 'Vence hoje' in date:
                highlight = await accounts_rows.nth(i).locator('xpath=.//td[contains(@class, "due-date") and contains(@class, "highlight")]').count()
                assert highlight > 0, f"Upcoming due date not highlighted in row {i}"
        await asyncio.sleep(5)
    
    finally:
        if context:
            await context.close()
        if browser:
            await browser.close()
        if pw:
            await pw.stop()
            
asyncio.run(run_test())
    