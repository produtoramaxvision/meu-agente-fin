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
        # Input username and password, then click Entrar button to login
        frame = context.pages[-1]
        elem = frame.locator('xpath=html/body/div/div[2]/main/div/div[2]/form/div/div/div/input').nth(0)
        await page.wait_for_timeout(3000); await elem.fill('5511949746110')
        

        frame = context.pages[-1]
        elem = frame.locator('xpath=html/body/div/div[2]/main/div/div[2]/form/div/div[2]/div/input').nth(0)
        await page.wait_for_timeout(3000); await elem.fill('12345678')
        

        frame = context.pages[-1]
        elem = frame.locator('xpath=html/body/div/div[2]/main/div/div[2]/form/button').nth(0)
        await page.wait_for_timeout(3000); await elem.click(timeout=5000)
        

        # Click on 'Relatórios' menu to access reports section for verifying API access and report generation
        frame = context.pages[-1]
        elem = frame.locator('xpath=html/body/div/div[2]/div/aside/nav/a[6]').nth(0)
        await page.wait_for_timeout(3000); await elem.click(timeout=5000)
        

        # Click on 'Exportar' button to check available export formats and trigger report generation
        frame = context.pages[-1]
        elem = frame.locator('xpath=html/body/div/div[2]/div[2]/main/div/div/div/div[2]/button').nth(0)
        await page.wait_for_timeout(3000); await elem.click(timeout=5000)
        

        # Click on 'Exportar JSON' to trigger JSON report generation and verify API access and report content.
        frame = context.pages[-1]
        elem = frame.locator('xpath=html/body/div[2]/div/div[2]').nth(0)
        await page.wait_for_timeout(3000); await elem.click(timeout=5000)
        

        # Click on 'Exportar CSV' button to trigger CSV report generation and verify API access and report content.
        frame = context.pages[-1]
        elem = frame.locator('xpath=html/body/div/div[2]/div[2]/main/div/div/div[5]/div[2]/div/div[2]/div[16]/div[2]/button').nth(0)
        await page.wait_for_timeout(3000); await elem.click(timeout=5000)
        

        # Assert that the agent accessed only allowed external APIs by checking network requests
        allowed_api_domains = ['api.permitted1.com', 'api.permitted2.com']  # example allowed domains
        requests = []
        async def capture_requests(route, request):
            requests.append(request)
            await route.continue_()
        page.on('route', capture_requests)
        # After triggering the scrape agent and report generation, verify requests
        for req in requests:
            url = req.url
            assert any(domain in url for domain in allowed_api_domains), f'Unauthorized API access detected: {url}'
        # Assert that JSON report is generated and contains expected data
        json_report_locator = frame.locator('xpath=html/body/div[2]/div/div[2]')
        json_report_text = await json_report_locator.text_content()
        assert '"dashboard"' in json_report_text, 'JSON report missing dashboard data'
        assert '"transactions"' in json_report_text, 'JSON report missing transactions data'
        # Assert that CSV report is generated and contains expected headers and data
        csv_report_locator = frame.locator('xpath=html/body/div/div[2]/div[2]/main/div/div/div[5]/div[2]/div/div[2]/div[16]/div[2]/button')
        csv_report_text = await csv_report_locator.text_content()
        assert 'data' in csv_report_text.lower() or 'date' in csv_report_text.lower(), 'CSV report missing date column'
        assert 'tipo' in csv_report_text.lower() or 'type' in csv_report_text.lower(), 'CSV report missing type column'
        assert 'valor' in csv_report_text.lower() or 'value' in csv_report_text.lower(), 'CSV report missing value column'
        await asyncio.sleep(5)
    
    finally:
        if context:
            await context.close()
        if browser:
            await browser.close()
        if pw:
            await pw.stop()
            
asyncio.run(run_test())
    