import { test, Page } from '@playwright/test';
import { BasePage } from '../../Page_Objects/BasePage';
import { HomePage } from '../../Page_Objects/HomePage';
import { SignInPage } from '../../Page_Objects/SignInPage';
import { NavBar } from '../../Page_Objects/Components/NavBar';
import { PayBillsPage } from '../../Page_Objects/PayBillsPage';
import { PurchaseForeignCurrencyPage } from '../../Page_Objects/PurchaseForeignCurrencyPage';
import path from 'path';

interface ForeignCurrencyData {
  TestCaseID: string;
  SelectCurrency: string;
  EnterAmount: string;
  SelectRadioButton: string;
  Result: string;
}

// Read JSON data
const dataPath = path.resolve(process.cwd(), 'tests', 'TestData', 'Foreign_Currency.json');
const usersData: ForeignCurrencyData[] = BasePage.readDataFromJSONFile(dataPath);

test.describe('Purchase Foreign Currency Cash ', () => {

  test.beforeEach(async ({ page }: { page: Page }) => {
    const homePage = new HomePage(page);
    const signInPage = new SignInPage(page);

    await homePage.visit();
    await homePage.clickOnSignIn();
    await signInPage.login(
      process.env.zeroBankUserName as string,
      process.env.zeroBankPassword as string
    );

 
  });

  for (const record of usersData) {
    test(`Purchase Foreign Currency: ${record.TestCaseID}`, async ({ page }: { page: Page }) => {
      const navbar = new NavBar(page);
      const payBillsPage = new PayBillsPage(page);
      const purchaseCurrency = new PurchaseForeignCurrencyPage(page);

      await navbar.clickOnTab('Pay Bills');
      await payBillsPage.clickOnPayBillsTab('Purchase Foreign Currency');
      await payBillsPage.assertPurchaseForeignCurrencyTitle();

      await purchaseCurrency.selectCurrency(record.SelectCurrency);
      await purchaseCurrency.assertTodaysSellRate();
      await purchaseCurrency.enterAmount(record.EnterAmount);
      await purchaseCurrency.selectRadioButton(record.SelectRadioButton);
      await purchaseCurrency.clickCalculateCostsButton();
      await purchaseCurrency.assertConversionAmount();
      await purchaseCurrency.clickPurchaseButton();
      await purchaseCurrency.assertSuccessMessage(record.Result);
    });
  }
});
