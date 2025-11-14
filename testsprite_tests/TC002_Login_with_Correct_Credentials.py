import asyncio
from playwright import async_api
from playwright.async_api import expect

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
        # -> Input registered phone number and click continue to proceed with login.
        frame = context.pages[-1]
        # Input registered phone number for login
        elem = frame.locator('xpath=html/body/div/div[2]/main/div/div[2]/div/form/div/div/input').nth(0)
        await page.wait_for_timeout(3000); await elem.fill('5511949746110')
        

        frame = context.pages[-1]
        # Click the continue button to proceed with login
        elem = frame.locator('xpath=html/body/div/div[2]/main/div/div[2]/div/form/button').nth(0)
        await page.wait_for_timeout(3000); await elem.click(timeout=5000)
        

        # -> Input the registered password and click the login button.
        frame = context.pages[-1]
        # Input registered password
        elem = frame.locator('xpath=html/body/div/div[2]/main/div/div[2]/div/form/div[2]/div/input').nth(0)
        await page.wait_for_timeout(3000); await elem.fill('123456789')
        

        frame = context.pages[-1]
        # Click the login button to submit credentials
        elem = frame.locator('xpath=html/body/div/div[2]/main/div/div[2]/div/form/button[2]').nth(0)
        await page.wait_for_timeout(3000); await elem.click(timeout=5000)
        

        # --> Assertions to verify final state
        frame = context.pages[-1]
        await expect(frame.locator('text=Max Muller').first).to_be_visible(timeout=30000)
        await expect(frame.locator('text=Dashboard').first).to_be_visible(timeout=30000)
        await expect(frame.locator('text=Visão geral das suas finanças').first).to_be_visible(timeout=30000)
        await expect(frame.locator('text=16/10/2025 - 14/11/2025').first).to_be_visible(timeout=30000)
        await expect(frame.locator('text=Total Receitas').first).to_be_visible(timeout=30000)
        await expect(frame.locator('text=R$ 0,00').first).to_be_visible(timeout=30000)
        await expect(frame.locator('text=Total Despesas').first).to_be_visible(timeout=30000)
        await expect(frame.locator('text=Saldo').first).to_be_visible(timeout=30000)
        await expect(frame.locator('text=Transações').first).to_be_visible(timeout=30000)
        await expect(frame.locator('text=Evolução Diária (Últimos 30 dias)').first).to_be_visible(timeout=30000)
        await expect(frame.locator('text=Nenhum dado disponível').first).to_be_visible(timeout=30000)
        await expect(frame.locator('text=Distribuição de Despesas').first).to_be_visible(timeout=30000)
        await expect(frame.locator('text=Nenhuma despesa registrada.').first).to_be_visible(timeout=30000)
        await expect(frame.locator('text=Meta Principal').first).to_be_visible(timeout=30000)
        await expect(frame.locator('text=Nenhuma meta principal definida.').first).to_be_visible(timeout=30000)
        await expect(frame.locator('text=Contas a Vencer').first).to_be_visible(timeout=30000)
        await expect(frame.locator('text=Nenhuma conta próxima do vencimento.').first).to_be_visible(timeout=30000)
        await expect(frame.locator('text=Tarefas Urgentes').first).to_be_visible(timeout=30000)
        await expect(frame.locator('text=Nenhuma tarefa urgente!').first).to_be_visible(timeout=30000)
        await expect(frame.locator('text=Últimas Transações').first).to_be_visible(timeout=30000)
        await expect(frame.locator('text=Nenhuma transação registrada').first).to_be_visible(timeout=30000)
        await asyncio.sleep(5)
    
    finally:
        if context:
            await context.close()
        if browser:
            await browser.close()
        if pw:
            await pw.stop()
            
asyncio.run(run_test())
    