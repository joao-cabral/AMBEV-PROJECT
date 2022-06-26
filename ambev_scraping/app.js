const { chromium } = require('playwright');
const { performance } = require('perf_hooks');

(
    async() => {
        const browser = await chromium.launch({headless: false, slowMo: 100});
        const page = await browser.newPage();

        await page.goto('https://www.ambev.com.br/marcas/cervejas/');
        await page.waitForTimeout(1000); 
        
        //Click in button "yes"
        await page.click('#age-gate__form > div.age-gate-dialog__body > div.age-gate-dialog__content > div > button');
        
        // Find all links and save in array
        const linksBrands = await page.$$eval('.brand__link', elements => {
            const data = [];
            elements.forEach(element => {
                data.push(element.href);
            });
            return data;
        })

        const listOfLinksWithinBrands = [];
        
        //Enter in each link
        const startTime = performance.now();
        for (let i = 0; i < linksBrands.length; i++) {
            await page.goto(linksBrands[i]);
            await page.waitForTimeout(1000);
            listOfLinksWithinBrands.push(page.url());
        }
        const endTime = performance.now();

        console.log("Performance each link: " + (endTime - startTime) + "ms");
        await browser.close();

        //check if the link has one or more beers
        listOfLinksWithinBrands.forEach((link) => {
            const splitLink = link.split('/');
            if(splitLink[5] === splitLink[6]){
                const startTime = performance.now();
                getElementsBeer(link);
                const endTime = performance.now();
                console.log("Performance GetELementsBeer: " + (endTime - startTime) + "ms");
            }

            //getBeerList(link);
        })

        await browser.close();
    }
)()

async function getBeerList(linkBeerList) {
    //Access link and get all beers
}

async function getElementsBeer(link) {
    const browser = await chromium.launch();
    const page = await browser.newPage();
    await page.goto(link);
    await page.waitForTimeout(1000);
    const BeerTitle = await page.locator('body > div.page-wrap > div.internal-page > section > div.product-info__description-wrapper > h1 > span').textContent();

    console.log('Nome da cerveja: ', BeerTitle);
    await browser.close();
}