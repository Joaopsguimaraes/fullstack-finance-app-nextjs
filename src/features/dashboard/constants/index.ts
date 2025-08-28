// Raw data without JSX elements (server-safe)
export const MOCK_DASHBOARD_STATS_DATA = [
  {
    title: 'Total Balance',
    value: '$45,231.89',
    change: 12.5,
    iconName: 'DollarSign' as const,
  },
  {
    title: 'Monthly Income',
    value: '$8,420.00',
    change: 8.2,
    iconName: 'TrendingUp' as const,
  },
  {
    title: 'Monthly Expenses',
    value: '$3,280.50',
    change: -2.1,
    iconName: 'TrendingDown' as const,
  },
  {
    title: 'Savings Rate',
    value: '61.0%',
    change: 4.3,
    iconName: 'CreditCard' as const,
  },
]

export const MOCK_RECENT_TRANSACTIONS_DATA = [
  {
    id: '1',
    description: 'Salary Deposit',
    amount: 4200.0,
    type: 'income' as const,
    category: 'Salary',
    date: '2024-01-15',
    iconName: 'DollarSign' as const,
  },
  {
    id: '2',
    description: 'Grocery Shopping',
    amount: -156.8,
    type: 'expense' as const,
    category: 'Food',
    date: '2024-01-14',
    iconName: 'ShoppingCart' as const,
  },
  {
    id: '3',
    description: 'Coffee Shop',
    amount: -12.5,
    type: 'expense' as const,
    category: 'Food',
    date: '2024-01-14',
    iconName: 'Coffee' as const,
  },
  {
    id: '4',
    description: 'Freelance Project',
    amount: 850.0,
    type: 'income' as const,
    category: 'Freelance',
    date: '2024-01-13',
    iconName: 'Receipt' as const,
  },
  {
    id: '5',
    description: 'Gas Station',
    amount: -65.2,
    type: 'expense' as const,
    category: 'Transportation',
    date: '2024-01-13',
    iconName: 'Car' as const,
  },
]

export const DASHBOARD_CONFIG = {
  RECENT_TRANSACTIONS_LIMIT: 5,
  CURRENCY: 'USD',
  LOCALE: 'en-US',
} as const
