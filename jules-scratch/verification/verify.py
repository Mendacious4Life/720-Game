import asyncio
from playwright.async_api import async_playwright

async def main():
    async with async_playwright() as p:
        electron_app = await p._electron.launch(args=['release/app/dist/main/main.js'])
        window = await electron_app.first_window()
        await window.screenshot(path='jules-scratch/verification/screenshot.png')
        await electron_app.close()

if __name__ == '__main__':
    asyncio.run(main())
