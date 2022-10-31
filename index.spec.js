const { Builder, By } = require('selenium-webdriver');
const chrome = require('selenium-webdriver/chrome');
const service = new chrome.ServiceBuilder('/Users/kasule/Downloads/chromedriver');

const driver = new Builder().forBrowser('chrome').setChromeService(service).build();

const { suite } = require('selenium-webdriver/testing');
const assert = require("assert");

suite(function() {
    describe('First script', function() {

        // after(async () => await driver.quit());

        it('First Selenium script', async function(done) {
            await driver.get('');

            let title = await driver.getTitle();
            const username = 'techsystems@safeboda.com';
            const password = 'Safeboda123$'
            assert.equal("title My Store", title);
            console.log("=====::::::LLL 1112");


            await driver.manage().setTimeouts({ implicit: 500 });
            console.log("=====::::::LLL 111");
            const signinButton = await driver.findElement(By.className('login'));
            const emailTextBox = await driver.findElement(By.id('email'));
            const passwordTextBox = await driver.findElement(By.id('passwd'));
            const submitButton = await driver.findElement(By.id('SubmitLogin'));
            console.log("=====::::::LLL");
            await signinButton.click();
            await emailTextBox.sendKeys(username);
            await passwordTextBox.sendKeys(password);
            //submit form
            await submitButton.click();

            let textBox = await driver.findElement(By.name('my-text'));
            // let submitButton = await driver.findElement(By.css('button'));

            await textBox.sendKeys('Selenium');
            await submitButton.click();

            let message = await driver.findElement(By.id('message'));
            let value = await message.getText();
            assert.equal("Received!", value);
            setImmediate(done);
        });

    });
});