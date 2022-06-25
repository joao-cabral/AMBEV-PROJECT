const { chromium } = require('playwright');

(
    async() => {
        const browser = await chromium.launch();
        const page = await browser.newPage();

        await page.goto('https://www.ambev.com.br/marcas/cervejas/');
        
        await page.waitForTimeout(1000); 
        //Click in button "yes"
        await page.click('#age-gate__form > div.age-gate-dialog__body > div.age-gate-dialog__content > div > button');
        //Find all links and save in array
        const links = await page.$$eval('.brand__link', elements => {
            const data = [];
            elements.forEach(element => {
                data.push(element.href);
            });
            return data;
        })

        //Enter in each link
        for (let i = 0; i < links.length; i++) {
            await page.goto(links[i]);
            await page.waitForTimeout(1000);
        }

        await browser.close();
    }
)()