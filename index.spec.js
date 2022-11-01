require("chromedriver");
const { Builder, By } = require("selenium-webdriver");
const chrome = require("selenium-webdriver/chrome");

// const driver = new Builder().forBrowser('chrome').setChromeService(service).build();

const { suite } = require("selenium-webdriver/testing");
const assert = require("assert");
const { describe } = require("mocha");

describe("", function () {
  describe("shopping cart", function () {
    let driver;

    before(async function () {
      let options = new chrome.Options();
      driver = await new Builder()
        .setChromeOptions(options)
        .forBrowser("chrome")
        .build();
    });

    after(async () => await driver.quit());

    it("sample", async function () {
      assert(1, true);
    });

    const addLabelAndPriceToArray = async (popularListItems) => {
      const listOfApparels = [];
      let popularListCount = popularListItems.length;

      for (let i = 1; i < popularListCount + 1; i++) {
        let apparel = { label: "", price: 0 };
        apparel.label = await driver
          .findElement(
            By.css(
              `#homefeatured .ajax_block_product:nth-child(${i}) .product-name`
            )
          )
          .getText();
        apparel.price = await driver
          .findElement(
            By.css(
              `#homefeatured .ajax_block_product:nth-child(${i}) .right-block .price`
            )
          )
          .getText();
        listOfApparels.push(apparel);
      }
      return listOfApparels;
    };

    it("should login and add items to the cart", async function () {
      await driver.get(process.env.SELENIUM_URL);

      await driver.manage().setTimeouts({ implicit: 100000 });

      let title = await driver.getTitle();
      assert("title My Store", title);
      const username = "techsystems@safeboda.com";
      const password = "Safeboda123$";

      await driver.manage().setTimeouts({ implicit: 500 });
      const signinButton = await driver.findElement(By.className("login"));
      await signinButton.click();
      const navigationTab = await driver.findElement(
        By.css("#columns > div.breadcrumb > span.navigation_page")
      );
      assert.equal("Authentication", await navigationTab.getText());

      const emailTextBox = await driver.findElement(By.id("email"));
      const passwordTextBox = await driver.findElement(By.id("passwd"));
      await emailTextBox.sendKeys(username);
      await passwordTextBox.sendKeys(password);
      const submitButton = await driver.findElement(By.id("SubmitLogin"));
      //submit form
      await submitButton.click();
      const myAccountHeader = await driver
        .findElement(By.css("#center_column > h1"))
        .getText();
      assert.equal("my account", myAccountHeader.toLowerCase());

      //click the logo icon to go back to the home page
      await driver.findElement(By.className("logo")).click();
      const isHomepageSliderDisplayed = await driver
        .findElement(By.id("homepage-slider"))
        .isDisplayed();
      assert.ok(isHomepageSliderDisplayed);

      const popularListItems = await driver.findElements(
        By.css("#homefeatured .ajax_block_product")
      );
      assert(popularListItems.length > 0);

      const showListOfApparel = await addLabelAndPriceToArray(popularListItems);
      showListOfApparel.sort(
        (a, b) =>
          parseFloat(a.price.replace("$", "")) -
          parseFloat(b.price.replace("$", ""))
      );

      console.log("List of apparels sorted: ", showListOfApparel);

      //Scroll Up - Navigate to Women >> Tops>> T-shirts
      await driver.findElement(By.css("a[title='Women']")).click();
      const topAndDressAddButtons = await driver.findElements(
        By.css(".tree.dynamized > li > .grower.CLOSE")
      );
      assert.equal(2, topAndDressAddButtons.length);

      await driver
        .findElement(
          By.css("#categories_block_left > div > ul > li:nth-child(1) > a")
        )
        .click();
      const isBlousesDisplayed = await driver
        .findElement(
          By.css(
            "a[title='Match your favorites blouses with the right accessories for the perfect look.']"
          )
        )
        .isDisplayed();
      assert.ok(isBlousesDisplayed);

      await driver
        .findElement(
          By.css("#categories_block_left > div > ul > li:nth-child(1) > a")
        )
        .click();
      const tshirtCards = await driver.findElements(
        By.css(".ajax_block_product > .product-container")
      );
      assert(tshirtCards.length > 0);

      //Go to Catalog and filter out a dress Size [L]>>Color [Orange]>>Styles [Casual]>> SetRange: $16.00 - $17.00
      const sizeLargeCheckBox = await driver.findElement(
        By.id("layered_id_attribute_group_3")
      );
      await sizeLargeCheckBox.click();
      await driver.findElement(By.id("layered_id_attribute_group_13")).click();
      await driver.findElement(By.id("layered_id_feature_11")).click();
      // BUG: Color does not uncheck
      const sizeLargeCheckBoxChecked = await sizeLargeCheckBox.getAttribute(
        "checked"
      );
      assert.ok(sizeLargeCheckBoxChecked);

      // Once the entry is found click More.
      // await new Promise(resolve => setTimeout(resolve, 18000));
      await driver
        .findElement(By.css(".product_list > .ajax_block_product"))
        .click();
      // await new Promise(resolve => setTimeout(resolve, 18000));
      await driver
        .findElement(
          By.css(
            "#center_column > ul > li > div > div.right-block > div.button-container > a.button.lnk_view.btn.btn-default"
          )
        )
        .click();

      const isImageDisplayed = await driver
        .findElement(By.id("bigpic"))
        .isDisplayed();
      const isTitleDisplayed = await driver
        .findElement(
          By.css("#center_column > div > div > div.pb-center-column > h1")
        )
        .isDisplayed();
      assert.ok(isImageDisplayed);
      assert.ok(isTitleDisplayed);

      //Set Quantity = 3 >> Size = L >>Color=Orange
      const quantity = "3";
      const tshirtPrice = await driver
        .findElement(By.id("our_price_display"))
        .getText();
      const productSize = "L";
      const quantityTextBox = await driver.findElement(
        By.id("quantity_wanted")
      );
      await quantityTextBox.clear();
      await quantityTextBox.sendKeys(quantity);
      await driver.findElement(By.id("group_1")).click();
      await driver
        .findElement(By.css("#group_1 > option:nth-child(3)"))
        .click();
      await driver.findElement(By.css("a[name='Orange']")).click();

      // Click Add to Cart
      await driver.findElement(By.css("button[name='Submit']")).click();
      await new Promise((resolve) => setTimeout(resolve, 18000));

      const successMessage = await driver
        .findElement(
          By.css("#layer_cart > div.clearfix > div.layer_cart_product > h2")
        )
        .getText();
      assert.equal(
        "product successfully added to your shopping cart",
        successMessage.toLowerCase()
      );

      // Verify quantity, size, color, and total cost of the product on pop-up
      const productQuantityElement = await driver.findElement(
        By.css("#layer_cart_product_quantity")
      );
      const productQuantity = await productQuantityElement.getText();
      assert.equal(quantity, productQuantity);
      // BUG: Quantity multiplies itself
      const totalCostElement = await driver
        .findElement(By.id("layer_cart_product_price"))
        .getText();
      const totalCost = await totalCostElement.replace("$", "");
      const productOfPriceAndQuantity =
        parseInt(quantity) * parseFloat(tshirtPrice.replace("$", ""));
      assert.equal(productOfPriceAndQuantity, totalCost);

      const productSizeCartElement = await driver
        .findElement(By.id("layer_cart_product_attributes"))
        .getText();
      const productSizeCart = await productSizeCartElement.split(", ")[1];
      const productColorCart = await productSizeCartElement.split(", ")[0];
      assert.equal(productSize, productSizeCart);
      assert.equal("Orange", productColorCart);

      // Find out shipping cost
      const shippingCost = await driver
        .findElement(By.css(".layer_cart_row > .ajax_cart_shipping_cost"))
        .getText();
      const shippingCostFloatValue = parseFloat(shippingCost.replace("$", ""));
      console.log("shipping cost: ", shippingCost);
      assert.ok(shippingCostFloatValue > 0);

      // Verify total cost (total products cost + shipping cost).
      const productAndShippingCostElement = await driver
        .findElement(By.css(".layer_cart_row > .ajax_block_cart_total"))
        .getText();
      const productAndShippingCost = parseFloat(
        productAndShippingCostElement.replace("$", "")
      );
      const productOfPriceAndQuantityAndShipping =
        productOfPriceAndQuantity + shippingCostFloatValue;
      console.log(
        `Actual total cost is: ${productAndShippingCost}, Expected total cost: ${productOfPriceAndQuantityAndShipping}`
      );
      assert.equal(
        productOfPriceAndQuantityAndShipping,
        productAndShippingCost
      );

      // Print all values (quantity, size,color, total product cost, shipping cost, total cost), on the console.
      console.log(
        `Actual Quantity is: ${productQuantity}, Expected Quantity: ${quantity}`
      );
      console.log(
        `Actual size is: ${productSizeCart}, Expected size: ${productSize}`
      );
      console.log(
        `Actual Color is: ${productColorCart}, Expected Color: Orange`
      );
      console.log(
        `Actual total product cost is: ${productOfPriceAndQuantity}, Expected total product cost: ${totalCost}`
      );
      console.log(
        `Actual total cost is: ${productAndShippingCost}, Expected size: ${productOfPriceAndQuantity}`
      );
      console.log(`Shipping cost is: ${shippingCostFloatValue}`);
    });
  });
});
