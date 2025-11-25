import { test, Page } from '@playwright/test';
import { HomePage } from '../../Page_Objects/HomePage';
import { SignInPage } from '../../Page_Objects/SignInPage';
import { PayBillsPage } from '../../Page_Objects/PayBillsPage';
import { AddNewPayeePage } from '../../Page_Objects/AddNewPayeePage';
import { NavBar } from '../../Page_Objects/Components/NavBar';

interface PayeeData {
  name: string;
  address: string;
  account: string;
  details: string;
}

const payeeData: PayeeData = {
  name: 'Livevox',
  address: 'RichmondCircle',
  account: 'SavingsAccount',
  details: 'SalaryAccount'
};

test.describe('Add New Payee', () => {
  let homePage: HomePage;
  let signInPage: SignInPage;
  let payBillsPage: PayBillsPage;
  let navBar: NavBar;
  let addNewPayeePage: AddNewPayeePage;

  test.beforeEach(async ({ page }: { page: Page }) => {
    homePage = new HomePage(page);
    signInPage = new SignInPage(page);
    payBillsPage = new PayBillsPage(page);
    navBar = new NavBar(page);
    addNewPayeePage = new AddNewPayeePage(page);

    await homePage.visit();
    await homePage.clickOnSignIn();
    await signInPage.login(
      process.env.zeroBankUserName as string,
      process.env.zeroBankPassword as string);
    await page.goto('http://zero.webappsecurity.com/bank/transfer-funds.html', { waitUntil: 'networkidle' });
  });

  test('Should allow adding a new payee', async () => {
    await navBar.clickOnTab('Pay Bills');
    await payBillsPage.clickOnPayBillsTab('Add New Payee');

    await addNewPayeePage.createNewPayee(
      payeeData.name,
      payeeData.address,
      payeeData.account,
      payeeData.details
    );
    await addNewPayeePage.addPayeeButton();
    await addNewPayeePage.assertSuccessMessage();
  });
});
