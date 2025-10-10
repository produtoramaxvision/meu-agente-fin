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
        # Input username and password, then click Entrar to authenticate and open financial management
        frame = context.pages[-1]
        elem = frame.locator('xpath=html/body/div/div[2]/main/div/div[2]/form/div/div/div/input').nth(0)
        await page.wait_for_timeout(3000); await elem.fill('5511949746110')
        

        frame = context.pages[-1]
        elem = frame.locator('xpath=html/body/div/div[2]/main/div/div[2]/form/div/div[2]/div/input').nth(0)
        await page.wait_for_timeout(3000); await elem.fill('12345678')
        

        frame = context.pages[-1]
        elem = frame.locator('xpath=html/body/div/div[2]/main/div/div[2]/form/button').nth(0)
        await page.wait_for_timeout(3000); await elem.click(timeout=5000)
        

        # Navigate to the export option and select JSON format for financial data export
        frame = context.pages[-1]
        elem = frame.locator('xpath=html/body/div/div[2]/div/aside/nav/a[6]').nth(0)
        await page.wait_for_timeout(3000); await elem.click(timeout=5000)
        

        # Click the 'Exportar JSON' button to export financial data in JSON format
        frame = context.pages[-1]
        elem = frame.locator('xpath=html/body/div/div[2]/div/div/main/div/div/div/div[2]/button[2]').nth(0)
        await page.wait_for_timeout(3000); await elem.click(timeout=5000)
        

        # Assertion: Verify the exported JSON file content for valid JSON structure and expected financial data fields
        import json
        import re
        # Wait for the download to start and get the download object
        download = await frame.wait_for_event('download')
        # Get the path of the downloaded file
        download_path = await download.path()
        # Read the content of the downloaded file
        with open(download_path, 'r', encoding='utf-8') as f:
            content = f.read()
        # Assert the content is valid JSON
        try:
            data = json.loads(content)
        except json.JSONDecodeError:
            assert False, 'Exported file is not a valid JSON'
        # Assert the data contains expected keys and structure
        assert 'transactions' in data, 'Missing transactions key in exported JSON'
        assert isinstance(data['transactions'], list), 'Transactions should be a list'
        # Check each transaction has all expected fields
        expected_fields = {'date', 'type', 'status', 'category', 'description', 'value'}
        for transaction in data['transactions']:
            assert isinstance(transaction, dict), 'Each transaction should be a dictionary'
            assert expected_fields.issubset(transaction.keys()), f'Missing fields in transaction: {transaction}'
            # Validate date format DD/MM/YYYY
            assert re.match(r'\d{2}/\d{2}/\d{4}', transaction['date']), f'Invalid date format: {transaction['date']}'
            # Validate type is either Entrada or Saída
            assert transaction['type'] in ['Entrada', 'Saída'], f'Invalid type: {transaction['type']}'
            # Validate status is either Pago or Pendente
            assert transaction['status'] in ['Pago', 'Pendente'], f'Invalid status: {transaction['status']}'
            # Validate value format with currency symbol and sign
            assert re.match(r'^[+-]R\$ \d{1,3}(\.\d{3})*,\d{2}$', transaction['value']), f'Invalid value format: {transaction['value']}'
        # Assert total transactions count matches expected
        assert len(data['transactions']) == 33, f'Expected 33 transactions, found {len(data['transactions'])}'
        await asyncio.sleep(5)
    
    finally:
        if context:
            await context.close()
        if browser:
            await browser.close()
        if pw:
            await pw.stop()
            
asyncio.run(run_test())
    