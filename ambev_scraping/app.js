const { chromium } = require('playwright');
const { performance } = require('perf_hooks');

(
    async() => {
        const browser = await chromium.launch({headless: false, slowMo: 100});
        const page = await browser.newPage();

        // await page.goto('https://www.ambev.com.br/marcas/cervejas/');
        // await page.goto('https://www.ambev.com.br/marcas/cervejas/caracu/caracu/');
        // await page.goto('https://www.ambev.com.br/marcas/cervejas/budweiser/budweiser/');
        // await page.goto('https://www.ambev.com.br/marcas/cervejas/berrio-do-piaui/berrio-do-piaui/');
        await page.goto('https://www.ambev.com.br/marcas/cervejas/brahma/brahma-malzibier/');
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
    
    const name = await page.locator('body > div.page-wrap > div.internal-page > section > div.product-info__description-wrapper > h1 > span').textContent();
    const logo = await page.locator('body > div.page-wrap > div.internal-page > section.main-section__wrap.product-info > div.product-info__description-wrapper > div.product-info__logo-wrapper > a').href;
    const nationality = await page.locator('body > div.page-wrap > div.internal-page > section.main-section__wrap.product-info > div.product-info__description-wrapper > div.product-info__category > div > img').href;
    const description = await page.locator('body > div.page-wrap > div.internal-page > section.main-section__wrap.product-info > div.product-info__description-wrapper > div.product-info__description--has-socials.product-info__no-desktop > p').textContent();
    const percent_alcohol = await page.locator('#product-additional-info > p.product-info__item.product-info__item-icon.product-info__item-icon--alcohol-content').textContent();
    const ideal_temperature = await page.locator('#product-additional-info > p.product-info__item.product-info__item-icon.product-info__item-icon--ideal-temperature').textContent();
    const ibu =  await page.locator('#product-additional-info > p.product-info__item.product-info__item-icon.product-info__item-icon--ibu').textContent();
    
    //TODO: testar sem a numeração no final
    const ingredients = await page.locator('body > div.page-wrap > div.internal-page > section.main-section__wrap.product-info > div.product-info__description-wrapper > div:nth-child(5)').textContent();

    const allergic_ingredients = await page.locator('body > div.page-wrap > div.internal-page > section.main-section__wrap.product-info > div.product-info__description-wrapper > div:nth-child(6)').textContent();
    const nutricional_information = await page.locator('#product-additional-info > p.product-info__item.product-info__item-icon--nutritional-information.product-info__item-nutritional-information.product-info__item-nutritional-information--active').textContent();
    const calories = await page.locator('#product-additional-info > p.product-info__item.product-info__item-icon.product-info__item-icon--calories.product-info__item-calories.product-info__item-calories--active').textContent();
    const carbohydrates = await page.locator('#product-additional-info > p.product-info__item.product-info__item-icon.product-info__item-icon--carbohydrates.product-info__item-carbohydrates.product-info__item-carbohydrates--active').textContent();
    
    //min:2 / max: 173 / step: 19 => n / 171
    //TODO: implementar condicionais para quando nao tem cor
    const color = await getColor() / 171;

    async function getColor(){
        const rootDiv = page.locator('#product-additional-info > p.product-info__item.product-info__color');
        const color = await rootDiv.evaluate((element) => {
            return window.getComputedStyle(element, 'before').getPropertyValue("left")
        });
        return color;
    }

    await browser.close();
}