# TODOs at application

- Create functionality to create accounts. User should be able to create accounts, we can create a
  seed with those actual values (wallet) but user need a possibility to create new accounts or edit.
  Accounts

- Create a functionality to transfer values between accounts. User should be able to transfer values
  from account 'x' to account 'y'

- Should @src/features/transactions/components/sidebar-quick-stats.tsx show status from current
  month same that dashboard.

- User should de able to create a recurring expense or income, For example: "Description: Rent
  payment", is recurring ? (user mark checkbox for yes) and after that this expense or income repeat
  rest of the year.

- User should be able to create an installment payment. For example: "Description: New MacBook",
  "isInstallment: Yes (user mark checkbox)", "how many installment? 3 times" after that application
  create 3 expense, example: "MacBook 1/3", "MacBook 2/3", "MacBook 3/3". Annotation: application
  should add SubFix based on installment

- Update Input to select date component at
  @src/features/transactions/components/transaction-form.tsx at lines 266 - 291 to use DatePicker,
  check shadcnUI mcp to get more info.
