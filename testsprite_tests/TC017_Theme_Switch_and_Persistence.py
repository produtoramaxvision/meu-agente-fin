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
        # -> Input phone number and continue login to access the main dashboard where theme switch control might be located.
        frame = context.pages[-1]
        # Input the phone number for login
        elem = frame.locator('xpath=html/body/div/div[2]/main/div/div[2]/div/form/div/div/input').nth(0)
        await page.wait_for_timeout(3000); await elem.fill('5511949746110')
        

        frame = context.pages[-1]
        # Click the Continue button to proceed with login
        elem = frame.locator('xpath=html/body/div/div[2]/main/div/div[2]/div/form/button').nth(0)
        await page.wait_for_timeout(3000); await elem.click(timeout=5000)
        

        # -> Input password and click 'Entrar' to log in and access the main dashboard where theme switch control might be located.
        frame = context.pages[-1]
        # Input the password for login
        elem = frame.locator('xpath=html/body/div/div[2]/main/div/div[2]/div/form/div[2]/div/input').nth(0)
        await page.wait_for_timeout(3000); await elem.fill('123456789')
        

        frame = context.pages[-1]
        # Click the 'Entrar' button to submit login
        elem = frame.locator('xpath=html/body/div/div[2]/main/div/div[2]/div/form/button[2]').nth(0)
        await page.wait_for_timeout(3000); await elem.click(timeout=5000)
        

        # -> Click the theme switch button to toggle to light mode and verify UI updates accordingly.
        frame = context.pages[-1]
        # Click the 'Switch to light mode' button to toggle theme to light mode
        elem = frame.locator('xpath=html/body/div/div[2]/div[2]/header/div[2]/button').nth(0)
        await page.wait_for_timeout(3000); await elem.click(timeout=5000)
        

        # -> Reload the page to verify if the light mode preference persists after reload.
        await page.goto('http://localhost:8080/dashboard', timeout=10000)
        await asyncio.sleep(3)
        

        # -> Log out and log back in to verify if the light mode preference is retained after a new session.
        frame = context.pages[-1]
        # Click the 'Sair' button to log out
        elem = frame.locator('xpath=html/body/div/div[2]/div/aside/div[3]/div[2]/button').nth(0)
        await page.wait_for_timeout(3000); await elem.click(timeout=5000)
        

        # -> Input phone number and continue login to verify theme persistence after logout/login cycle.
        frame = context.pages[-1]
        # Input phone number for login
        elem = frame.locator('xpath=html/body/div/div[2]/main/div/div[2]/div/form/div/div/input').nth(0)
        await page.wait_for_timeout(3000); await elem.fill('5511949746110')
        

        frame = context.pages[-1]
        # Click 'Continuar' button to proceed to password input
        elem = frame.locator('xpath=html/body/div/div[2]/main/div/div[2]/div/form/button').nth(0)
        await page.wait_for_timeout(3000); await elem.click(timeout=5000)
        

        # -> Input password and click 'Entrar' to log in and verify theme persistence after logout/login.
        frame = context.pages[-1]
        # Input password for login
        elem = frame.locator('xpath=html/body/div/div[2]/main/div/div[2]/div/form/div[2]/div/input').nth(0)
        await page.wait_for_timeout(3000); await elem.fill('123456789')
        

        frame = context.pages[-1]
        # Click 'Entrar' button to log in
        elem = frame.locator('xpath=html/body/div/div[2]/main/div/div[2]/div/form/button[2]').nth(0)
        await page.wait_for_timeout(3000); await elem.click(timeout=5000)
        

        # -> Click the theme switch button to toggle back to dark mode and verify immediate UI update.
        frame = context.pages[-1]
        # Click the 'Switch to dark mode' button to toggle theme to dark mode
        elem = frame.locator('xpath=html/body/div/div[2]/div[2]/header/div[2]/button').nth(0)
        await page.wait_for_timeout(3000); await elem.click(timeout=5000)
        

        # -> Reload the page to verify if the dark mode preference persists after reload.
        await page.goto('http://localhost:8080/dashboard', timeout=10000)
        await asyncio.sleep(3)
        

        # --> Assertions to verify final state
        frame = context.pages[-1]
        await expect(frame.locator('text=Meu Agente®').first).to_be_visible(timeout=30000)
        await expect(frame.locator('text=AÇÕES RÁPIDAS').first).to_be_visible(timeout=30000)
        await expect(frame.locator('text=Nova Ação').first).to_be_visible(timeout=30000)
        await expect(frame.locator('text=Dashboard').first).to_be_visible(timeout=30000)
        await expect(frame.locator('text=Agenda').first).to_be_visible(timeout=30000)
        await expect(frame.locator('text=Contas').first).to_be_visible(timeout=30000)
        await expect(frame.locator('text=Metas').first).to_be_visible(timeout=30000)
        await expect(frame.locator('text=Tarefas').first).to_be_visible(timeout=30000)
        await expect(frame.locator('text=Relatórios').first).to_be_visible(timeout=30000)
        await expect(frame.locator('text=Notificações').first).to_be_visible(timeout=30000)
        await expect(frame.locator('text=Perfil').first).to_be_visible(timeout=30000)
        await expect(frame.locator('text=Ajuda').first).to_be_visible(timeout=30000)
        await expect(frame.locator('text=Sair').first).to_be_visible(timeout=30000)
        await expect(frame.locator('text=Max teste Muller').first).to_be_visible(timeout=30000)
        await expect(frame.locator('text=5511949746110').first).to_be_visible(timeout=30000)
        await expect(frame.locator('text=MT').first).to_be_visible(timeout=30000)
        await expect(frame.locator('text=Dashboard').first).to_be_visible(timeout=30000)
        await expect(frame.locator('text=Visão geral das suas finanças').first).to_be_visible(timeout=30000)
        await expect(frame.locator('text=24/09/2025 - 23/10/2025').first).to_be_visible(timeout=30000)
        await expect(frame.locator('text=Total Receitas').first).to_be_visible(timeout=30000)
        await expect(frame.locator('text=R$ 28.795,19').first).to_be_visible(timeout=30000)
        await expect(frame.locator('text=Total Despesas').first).to_be_visible(timeout=30000)
        await expect(frame.locator('text=R$ 7.648,75').first).to_be_visible(timeout=30000)
        await expect(frame.locator('text=Saldo').first).to_be_visible(timeout=30000)
        await expect(frame.locator('text=R$ 21.146,44').first).to_be_visible(timeout=30000)
        await expect(frame.locator('text=Transações').first).to_be_visible(timeout=30000)
        await expect(frame.locator('text=84').first).to_be_visible(timeout=30000)
        await expect(frame.locator('text=Evolução Diária (Últimos 30 dias)').first).to_be_visible(timeout=30000)
        await expect(frame.locator('text=28/09/2025').first).to_be_visible(timeout=30000)
        await expect(frame.locator('text=04/10/2025').first).to_be_visible(timeout=30000)
        await expect(frame.locator('text=07/10/2025').first).to_be_visible(timeout=30000)
        await expect(frame.locator('text=12/10/2025').first).to_be_visible(timeout=30000)
        await expect(frame.locator('text=15/10/2025').first).to_be_visible(timeout=30000)
        await expect(frame.locator('text=23/10/2025').first).to_be_visible(timeout=30000)
        await expect(frame.locator('text=EntradasSaídas').first).to_be_visible(timeout=30000)
        await expect(frame.locator('text=Distribuição de Despesas').first).to_be_visible(timeout=30000)
        await expect(frame.locator('text=Despesas').first).to_be_visible(timeout=30000)
        await expect(frame.locator('text=Receitas').first).to_be_visible(timeout=30000)
        await expect(frame.locator('text=Saúde').first).to_be_visible(timeout=30000)
        await expect(frame.locator('text=(51.3%)').first).to_be_visible(timeout=30000)
        await expect(frame.locator('text=Investimento').first).to_be_visible(timeout=30000)
        await expect(frame.locator('text=(27.5%)').first).to_be_visible(timeout=30000)
        await expect(frame.locator('text=Alimentação').first).to_be_visible(timeout=30000)
        await expect(frame.locator('text=(13.4%)').first).to_be_visible(timeout=30000)
        await expect(frame.locator('text=Viagem').first).to_be_visible(timeout=30000)
        await expect(frame.locator('text=(4.4%)').first).to_be_visible(timeout=30000)
        await expect(frame.locator('text=Transporte').first).to_be_visible(timeout=30000)
        await expect(frame.locator('text=(2.9%)').first).to_be_visible(timeout=30000)
        await expect(frame.locator('text=Moradia').first).to_be_visible(timeout=30000)
        await expect(frame.locator('text=(0.6%)').first).to_be_visible(timeout=30000)
        await expect(frame.locator('text=Pets').first).to_be_visible(timeout=30000)
        await expect(frame.locator('text=(0.0%)').first).to_be_visible(timeout=30000)
        await expect(frame.locator('text=Meta Principal').first).to_be_visible(timeout=30000)
        await expect(frame.locator('text=Moto').first).to_be_visible(timeout=30000)
        await expect(frame.locator('text=Progresso').first).to_be_visible(timeout=30000)
        await expect(frame.locator('text=33%').first).to_be_visible(timeout=30000)
        await expect(frame.locator('text=Atual').first).to_be_visible(timeout=30000)
        await expect(frame.locator('text=R$ 500,00').first).to_be_visible(timeout=30000)
        await expect(frame.locator('text=Meta').first).to_be_visible(timeout=30000)
        await expect(frame.locator('text=R$ 1.500,00').first).to_be_visible(timeout=30000)
        await expect(frame.locator('text=Faltam R$ 1.000,00 • 3 meses restantes').first).to_be_visible(timeout=30000)
        await expect(frame.locator('text=Contas a Vencer').first).to_be_visible(timeout=30000)
        await expect(frame.locator('text=Pets').first).to_be_visible(timeout=30000)
        await expect(frame.locator('text=Vence hoje').first).to_be_visible(timeout=30000)
        await expect(frame.locator('text=R$ 1,00').first).to_be_visible(timeout=30000)
        await expect(frame.locator('text=Alimentação').first).to_be_visible(timeout=30000)
        await expect(frame.locator('text=https://allowed-source.com/api/data').first).to_be_visible(timeout=30000)
        await expect(frame.locator('text=Ver todos os alertas').first).to_be_visible(timeout=30000)
        await expect(frame.locator('text=Tarefas Urgentes').first).to_be_visible(timeout=30000)
        await expect(frame.locator('text=3').first).to_be_visible(timeout=30000)
        await expect(frame.locator('text=reuniao').first).to_be_visible(timeout=30000)
        await expect(frame.locator('text=Média').first).to_be_visible(timeout=30000)
        await expect(frame.locator('text=trabalho').first).to_be_visible(timeout=30000)
        await expect(frame.locator('text=Atrasada 22d').first).to_be_visible(timeout=30000)
        await expect(frame.locator('text=01/10').first).to_be_visible(timeout=30000)
        await expect(frame.locator('text=Alerta Proativo LGPD - Template A').first).to_be_visible(timeout=30000)
        await expect(frame.locator('text=Atrasada 13d').first).to_be_visible(timeout=30000)
        await expect(frame.locator('text=10/10').first).to_be_visible(timeout=30000)
        await expect(frame.locator('text=Test Task').first).to_be_visible(timeout=30000)
        await expect(frame.locator('text=Teste').first).to_be_visible(timeout=30000)
        await expect(frame.locator('text=Atrasada 8d').first).to_be_visible(timeout=30000)
        await expect(frame.locator('text=15/10').first).to_be_visible(timeout=30000)
        await expect(frame.locator('text=Ver todas as tarefas').first).to_be_visible(timeout=30000)
        await expect(frame.locator('text=Últimas Transações').first).to_be_visible(timeout=30000)
        await expect(frame.locator('text=Salário').first).to_be_visible(timeout=30000)
        await expect(frame.locator('text=23/10/2025').first).to_be_visible(timeout=30000)
        await expect(frame.locator('text=+R$ 10,00').first).to_be_visible(timeout=30000)
        await expect(frame.locator('text=Alimentação').first).to_be_visible(timeout=30000)
        await expect(frame.locator('text=-R$ 1,00').first).to_be_visible(timeout=30000)
        await expect(frame.locator('text=Investimento').first).to_be_visible(timeout=30000)
        await expect(frame.locator('text=Pets').first).to_be_visible(timeout=30000)
        await expect(frame.locator('text=Ações Rápidas').first).to_be_visible(timeout=30000)
        await expect(frame.locator('text=Adicionar Registro').first).to_be_visible(timeout=30000)
        await expect(frame.locator('text=Desenvolvido por © Produtora MaxVision 2025 – Todos os direitos reservados.').first).to_be_visible(timeout=30000)
        await asyncio.sleep(5)
    
    finally:
        if context:
            await context.close()
        if browser:
            await browser.close()
        if pw:
            await pw.stop()
            
asyncio.run(run_test())
    