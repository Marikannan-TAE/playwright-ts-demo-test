import { expect, Locator, Page } from "@playwright/test";
import { BasePage } from "./BasePage";

export class AccountActivityPage extends BasePage{

    readonly showTransaction: Locator;
    readonly findTransaction: Locator;
    readonly accType: Locator;
    readonly saveAccType: Locator;
    readonly savingsAccType: Locator;
    readonly loanAccType: Locator;
    readonly brokerAccType: Locator;
    readonly creditcardAccType: Locator;
    readonly rowCount: Locator;

    constructor(page: Page) {
        super(page);
        this.showTransaction = page.getByRole('link', { name: 'Show Transaction' });
        this.findTransaction = page.getByRole('link', { name: 'Find Transactions' });
        this.accType = page.locator('#aa_accountId');
        this.saveAccType = page.getByRole('option', { name: 'Savings' });
        this.savingsAccType = page.getByRole('option', { name: 'Savings' });
        this.loanAccType = page.getByRole('option', { name: 'Loan' });
        this.brokerAccType = page.getByRole('option', { name: 'Brokerage' });
        this.creditcardAccType = page.getByRole('option', { name: 'Credit Card' });
        this.rowCount = page.locator('#all_transactions_for_account tbody>tr');

    }

 async getSavingsAccountTransactionCount(): Promise<number> {
    await this.accType.selectOption('Savings');
     // Wait for the table to load
    await this.waitForNetworkIdle(); 
    
    // Count all matching rows
    const totalRows = await this.rowCount.count();
    console.log(`Total savings transaction rows found: ${totalRows}`);
    
    return totalRows;
  }

  async getCheckingAccountTransactionCount(): Promise<number> {
    await this.accType.selectOption('Checking');
    await this.waitForNetworkIdle(); 
    const totalRows = await this.rowCount.count();
    console.log(`Total checking transaction rows found: ${totalRows}`);
    
    return totalRows;
  }

  async getLoanAccountTransactionCount(): Promise<number> {
    await this.accType.selectOption('Loan'); 
    await this.waitForNetworkIdle(); 
    const totalRows = await this.rowCount.count();
    console.log(`Total loan transaction rows found: ${totalRows}`);
    
    return totalRows;
  }

  async getBrokerageAccountTransactionCount(): Promise<number> {
    await this.accType.selectOption('Brokerage');
    await this.waitForNetworkIdle(); 
    const totalRows = await this.rowCount.count();
    console.log(`Total brokerage transaction rows found: ${totalRows}`);
    
    return totalRows;
  }

  async getCreditCardAccountTransactionCount(): Promise<number> {
    await this.accType.selectOption('Credit Card');    
    await this.waitForNetworkIdle(); 
    const totalRows = await this.rowCount.count();
    console.log(`Total credit card transaction rows found: ${totalRows}`);
    
    return totalRows;
  }
}