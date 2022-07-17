const { chromium, TimeoutError } = require('playwright');

async function getElementsBeer() {
    const link = "https://www.ambev.com.br/marcas/cervejas/tres-fidalgas/tres-fidalgas/";
    const browser = await chromium.launch({headless: false, slowMo: 100});
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
    
    //TODO: verify all links and issues
    // https://www.ambev.com.br/marcas/cervejas/michelob-ultra/michelob-ultra/ - Error happened in description:
    // https://www.ambev.com.br/marcas/cervejas/tres-fidalgas/tres-fidalgas/ - Error happened in nutricional_information:
    // https://www.ambev.com.br/marcas/cervejas/andes/andes/ - Error happened in ideal_temperature:
    // https://www.ambev.com.br/marcas/cervejas/adriatica/adriatica/ - Error happened in nutricional_information:
    // https://www.ambev.com.br/marcas/cervejas/tres-fidalgas/tres-fidalgas/ - Error happened in calories:

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
        beerInformation.ingredients = null;
        beerInformation.allergic_ingredients = null;
    }

    try{
        beerInformation.name = await page.locator('body > div.page-wrap > div.internal-page > section > div.product-info__description-wrapper > h1 > span').textContent();
    }catch(error){
        // if (error instanceof errors.TimeoutError){
        //     beerInformation.name = 'not found';
        //     return;
        // }
        console.log('Error happened in name: ', error);
        beerInformation.name = null;
    }
    
    try{
        const logo = await page.$$eval('body > div.page-wrap > div.internal-page > section.main-section__wrap.product-info > div.product-info__description-wrapper > div.product-info__logo-wrapper > a', 
        (elements) => {
            return elements.map(element => element.href);
        });
        
        beerInformation.logo = logo[0];
    }catch(error){
        console.log('Error happened in logo: ', error);
        beerInformation.logo = null;
    }

    try{
        const nationality = await page.$$eval('body > div.page-wrap > div.internal-page > section.main-section__wrap.product-info > div.product-info__description-wrapper > div.product-info__category > div > img', 
        (elements) => {
            return elements.map(element => element.src);
        });
        beerInformation.nationality = nationality[0]; 
    }catch(error){
        console.log('Error happened in nationality: ', error);
        beerInformation.nationality = null;
    }
    
    try{
        // beerInformation.description = await page.locator('body > div.page-wrap > div.internal-page > section.main-section__wrap.product-info > div.product-info__description-wrapper > div.product-info__description--has-socials.product-info__no-desktop > p').textContent();        
        const description = await page.$$eval('body > div.page-wrap > div.internal-page > section.main-section__wrap.product-info > div.product-info__description-wrapper > div.product-info__description--has-socials.product-info__no-desktop > p',
            (elements) => {
                return elements.map(element => element.textContent);
            });

        beerInformation.description = description;
    }catch(error){
        // if (error instanceof playwright.errors.TimeoutError){
        //     beerInformation.description = 'not found';
        //     // console.log(error);
        //     return;
        // }
        console.log('------------------------------------------------------');
        console.log(link);
        console.log('Error happened in description: ');
        console.log(error);
        console.log('------------------------------------------------------');
        beerInformation.description = null;
    }
    
    try{
        beerInformation.percent_alcohol = await page.locator('#product-additional-info > p.product-info__item.product-info__item-icon.product-info__item-icon--alcohol-content').textContent();
    }catch(error){
        console.log('Error happened in percent_alcohol: ', error);
        beerInformation.percent_alcohol = null;
    }
    
    try{
        beerInformation.ideal_temperature = await page.locator('#product-additional-info > p.product-info__item.product-info__item-icon.product-info__item-icon--ideal-temperature').textContent();     
    }catch(error){
        // if (stringError.includes('Timeout')){
        //     beerInformation.ideal_temperature = 'not found';
        //     return;
        // }
        console.log('------------------------------------------------------');
        console.log(link);
        console.log('Error happened in ideal_temperature: ');
        console.log(error);
        console.log('------------------------------------------------------');
        beerInformation.ideal_temperature = null;
    }

    
    try{
        beerInformation.ibu =  await page.locator('#product-additional-info > p.product-info__item.product-info__item-icon.product-info__item-icon--ibu').textContent();
    }catch(error){
        console.log('Error happened in ibu: ', error);
        beerInformation.ibu = null;
    }
    
    try{
        beerInformation.nutricional_information = await page.locator('#product-additional-info > p.product-info__item.product-info__item-icon--nutritional-information.product-info__item-nutritional-information.product-info__item-nutritional-information--active').textContent();
    }catch(error){
        // if (error instanceof playwright.errors.TimeoutError){
        //     beerInformation.nutricional_information = 'not found';
        //     return;
        // }
        console.log('------------------------------------------------------');
        console.log(link);
        console.log('Error happened in nutricional_information: ');
        console.log(error);
        console.log('------------------------------------------------------');
        beerInformation.nutricional_information = null;
    }
    
    try{
        beerInformation.calories = await page.locator('#product-additional-info > p.product-info__item.product-info__item-icon.product-info__item-icon--calories.product-info__item-calories.product-info__item-calories--active').textContent();
    }catch(error){
        // if (error instanceof playwright.errors.TimeoutError){
        //     beerInformation.calories = 'not found';
        //     return;
        // }
        console.log('------------------------------------------------------');
        console.log(link);
        console.log('Error happened in calories: ');
        console.log(error);
        console.log('------------------------------------------------------');
        beerInformation.calories = null;
    }

    
    try{
        beerInformation.carbohydrates = await page.locator('#product-additional-info > p.product-info__item.product-info__item-icon.product-info__item-icon--carbohydrates.product-info__item-carbohydrates.product-info__item-carbohydrates--active').textContent();
    }catch(error){
        // if (error instanceof playwright.errors.TimeoutError){
        //     beerInformation.carbohydrates = 'not found';
        //     return;
        // }
        console.log('------------------------------------------------------');
        console.log(link);
        console.log('Error happened in calories: ');
        console.log(error);
        console.log('------------------------------------------------------');
        beerInformation.carbohydrates = null;
    }

    //min:2 / max: 173 / step: 19 => n / 171
    //TODO: implementar condicionais para quando nao tiver cor
    // const color = await getColor() / 171;

    beerInformation.color = await getColor() / 171;

    async function getColor(){
        try{
            const rootDiv = page.locator('#product-additional-info > p.product-info__item.product-info__color');
            const color = await rootDiv.evaluate((element) => {
                return window.getComputedStyle(element, 'before').getPropertyValue("left")
            });
            // beerInformation.color = color / 171;
            console.log('value of color: ', color);
            return parseInt(color);
        }catch(error){
            // if (error instanceof playwright.errors.TimeoutError){
            //     beerInformation.color = 'not found';
            //     return;
            // }

            console.log('------------------------------------------------------');
            console.log(link);
            console.log('Error happened in calories: ');
            console.log(error);
            console.log('------------------------------------------------------');
            beerInformation.color = null;
        }
    }

    console.log(link);
    console.log(beerInformation);

    await browser.close();
}

getElementsBeer();