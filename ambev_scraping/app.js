const { chromium } = require('playwright');
const { performance } = require('perf_hooks');

(
    async() => {
        const browser = await chromium.launch({headless: false, slowMo: 100});
        const page = await browser.newPage();

        await page.goto('https://www.ambev.com.br/marcas/cervejas/');
        // await page.goto('https://www.ambev.com.br/marcas/cervejas/caracu/caracu/');
        // await page.goto('https://www.ambev.com.br/marcas/cervejas/budweiser/budweiser/');
        // await page.goto('https://www.ambev.com.br/marcas/cervejas/berrio-do-piaui/berrio-do-piaui/');
        // await page.goto('https://www.ambev.com.br/marcas/cervejas/brahma/brahma-malzibier/');
        await page.waitForTimeout(1000); 
        
        //Click in button "yes"
        await page.click('#age-gate__form > div.age-gate-dialog__body > div.age-gate-dialog__content > div > button');
        
        // // Find all links and save in array
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
        listOfLinksWithinBrands.forEach( async (link) => {
            const splitLink = link.split('/');
            if(splitLink[5] === splitLink[6]){
                const startTime = performance.now();
                console.log(link);
                await getElementsBeer(link);
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

    const beerInformation = {
        name: '',
        logo: '',
        nationality: '',
        description: '',
        percent_alcohol: '',
        ideal_temperature: '',
        ibu: '',
        ingredients: '',
        allergic_ingredients: '',
        nutricional_information: '',
        calories: '',
        carbohydrates: '',
        color: ''
    };
    
    //Pegar os textos dos ingredientes e alergênicos
    
    try{
        const allergicAndIngredients = await page.$$eval('body > div.page-wrap > div.internal-page > section.main-section__wrap.product-info > div.product-info__description-wrapper > div.product-info__text-feature.product-info__no-mobile',
            elements => {
                const allergicAndIngredients = []
                elements.forEach(element => {
                    allergicAndIngredients.push(element.textContent);
                });
                return allergicAndIngredients;
            }
        );
        beerInformation.ingredients = allergicAndIngredients[0];
        beerInformation.allergic_ingredients = allergicAndIngredients[1];
        }catch(error){
            console.log('Error happened in calories: ', error);
            beerInformation.ingredients = 'Error';
            beerInformation.allergic_ingredients = 'Error';
        }
    
    //TODO: Fazer condicionais para quando nao tiver os valores procurados

    try{
        beerInformation.name = await page.locator('body > div.page-wrap > div.internal-page > section > div.product-info__description-wrapper > h1 > span').textContent();
    }catch(error){
        console.log('Error happened in name: ', error);
        beerInformation.name = 'Error';
    }
    
    try{
        beerInformation.logo = await page.locator('body > div.page-wrap > div.internal-page > section.main-section__wrap.product-info > div.product-info__description-wrapper > div.product-info__logo-wrapper > a').href();
    }catch(error){
        console.log('Error happened in logo: ', error);
        beerInformation.logo = 'Error';
    }

    try{
        beerInformation.nationality = await page.locator('body > div.page-wrap > div.internal-page > section.main-section__wrap.product-info > div.product-info__description-wrapper > div.product-info__category > div > img').href();        
    }catch(error){
        console.log('Error happened in nationality: ', error);
        beerInformation.nationality = 'Error';
    }
    
    try{
        beerInformation.description = await page.locator('body > div.page-wrap > div.internal-page > section.main-section__wrap.product-info > div.product-info__description-wrapper > div.product-info__description--has-socials.product-info__no-desktop > p').textContent();        
    }catch(error){
        console.log('Error happened in description: ', error);
        beerInformation.description = 'Error';
    }
    
    try{
        beerInformation.percent_alcohol = await page.locator('#product-additional-info > p.product-info__item.product-info__item-icon.product-info__item-icon--alcohol-content').textContent();
    }catch(error){
        console.log('Error happened in percent_alcohol: ', error);
        beerInformation.percent_alcohol = 'Error';
    }
    
    try{
        beerInformation.ideal_temperature = await page.locator('#product-additional-info > p.product-info__item.product-info__item-icon.product-info__item-icon--ideal-temperature').textContent();     
    }catch(error){
        console.log('Error happened in ideal_temperature: ', error);
        beerInformation.ideal_temperature = 'Error';
    }

    
    try{
        beerInformation.ibu =  await page.locator('#product-additional-info > p.product-info__item.product-info__item-icon.product-info__item-icon--ibu').textContent();
    }catch(error){
        console.log('Error happened in ibu: ', error);
        beerInformation.ibu = 'Error';
    }
    
    try{
        beerInformation.nutricional_information = await page.locator('#product-additional-info > p.product-info__item.product-info__item-icon--nutritional-information.product-info__item-nutritional-information.product-info__item-nutritional-information--active').textContent();
    }catch(error){
        console.log('Error happened in nutricional_information: ', error);
        beerInformation.nutricional_information = 'Error';
    }
    
    try{
        beerInformation.calories = await page.locator('#product-additional-info > p.product-info__item.product-info__item-icon.product-info__item-icon--calories.product-info__item-calories.product-info__item-calories--active').textContent();
    }catch(error){
        console.log('Error happened in calories: ', error);
        beerInformation.calories = 'Error';
    }

    
    try{
        beerInformation.carbohydrates = await page.locator('#product-additional-info > p.product-info__item.product-info__item-icon.product-info__item-icon--carbohydrates.product-info__item-carbohydrates.product-info__item-carbohydrates--active').textContent();
    }catch(error){
        console.log('Error happened in calories: ', error);
        beerInformation.carbohydrates = 'Error';
    }

    //min:2 / max: 173 / step: 19 => n / 171
    //TODO: implementar condicionais para quando nao tiver cor
    const color = await getColor() / 171;

    async function getColor(){
        try{
            const rootDiv = page.locator('#product-additional-info > p.product-info__item.product-info__color');
            const color = await rootDiv.evaluate((element) => {
                return window.getComputedStyle(element, 'before').getPropertyValue("left")
            });
            beerInformation.color = color / 171;
            return color;
        }catch(error){
            console.log('Error happened in calories: ', error);
            beerInformation.color = 'Error';
        }
    }

    console.log(beerInformation);

    await browser.close();
}