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
        # Input phone number and password, then click Entrar button to login
        frame = context.pages[-1]
        elem = frame.locator('xpath=html/body/div/div[2]/main/div/div[2]/form/div/div/div/input').nth(0)
        await page.wait_for_timeout(3000); await elem.fill('5511949746110')
        

        frame = context.pages[-1]
        elem = frame.locator('xpath=html/body/div/div[2]/main/div/div[2]/form/div/div[2]/div/input').nth(0)
        await page.wait_for_timeout(3000); await elem.fill('12345678')
        

        frame = context.pages[-1]
        elem = frame.locator('xpath=html/body/div/div[2]/main/div/div[2]/form/button').nth(0)
        await page.wait_for_timeout(3000); await elem.click(timeout=5000)
        

        # Assert recent transactions list with accurate data
        transactions = await frame.locator('css=div.recent-transactions-list > div.transaction-item').all_text_contents()
        assert any('Transporte' in t and '-R$ 1,00' in t for t in transactions), 'Expected transaction Transporte -R$ 1,00 not found'
        assert any('Alimentação' in t and '-R$ 1,00' in t for t in transactions), 'Expected transaction Alimentação -R$ 1,00 not found'
        assert any('Salário' in t and '+R$ 15,00' in t for t in transactions), 'Expected transaction Salário +R$ 15,00 not found'
        assert any('Alimentação' in t and '-R$ 500,00' in t for t in transactions), 'Expected transaction Alimentação -R$ 500,00 not found'
        
# Assert financial metrics cards show correct summarized values
        total_revenues_text = await frame.locator('css=div.metrics-card.revenues').text_content()
        assert 'R$ 8.391,98' in total_revenues_text, 'Total revenues value mismatch'
        total_expenses_text = await frame.locator('css=div.metrics-card.expenses').text_content()
        assert 'R$ 6.491,06' in total_expenses_text, 'Total expenses value mismatch'
        balance_text = await frame.locator('css=div.metrics-card.balance').text_content()
        assert 'R$ 1.900,92' in balance_text, 'Balance value mismatch'
        
# Assert graphs/chart components render properly
        daily_evolution_graph = await frame.locator('css=canvas#daily-evolution-chart').count()
        assert daily_evolution_graph > 0, 'Daily evolution chart not rendered'
        expense_distribution_graph = await frame.locator('css=canvas#expense-distribution-chart').count()
        assert expense_distribution_graph > 0, 'Expense distribution chart not rendered'
        await asyncio.sleep(5)
    
    finally:
        if context:
            await context.close()
        if browser:
            await browser.close()
        if pw:
            await pw.stop()
            
asyncio.run(run_test())
    