import { PrismaClient } from '../prisma/.generated/prisma'

const prisma = new PrismaClient()

const SYSTEM_CATEGORIES = [
  'FOOD',
  'TRANSPORT',
  'ENTERTAINMENT',
  'UTILITIES',
  'HEALTH',
  'EDUCATION',
  'DEBTS',
  'SALARY',
  'FREELANCE',
  'INVESTMENTS',
  'OTHER',
]

async function main() {
  console.log('Starting database seed...')

  // Seed system categories
  for (const categoryName of SYSTEM_CATEGORIES) {
    await prisma.category.upsert({
      where: {
        name_userId: {
          name: categoryName,
          userId: null as unknown as string,
        },
      },
      update: {},
      create: {
        name: categoryName,
        userId: null,
      },
    })
    console.log(`Created/verified system category: ${categoryName}`)
  }

  // Seed sample bank accounts for development
  // Note: This seeds accounts for a test user - adjust userId as needed
  const testUserId = 'test-user-id' // Replace with actual user ID if needed

  const sampleAccounts = [
    {
      id: 'sample-wallet-id',
      name: 'Wallet',
      type: 'CHECKING' as const,
      balance: 1000,
    },
    {
      id: 'sample-savings-id',
      name: 'Savings Account',
      type: 'SAVINGS' as const,
      balance: 5000,
    },
    {
      id: 'sample-credit-id',
      name: 'Credit Card',
      type: 'CREDIT' as const,
      balance: -200,
    },
    {
      id: 'sample-investment-id',
      name: 'Investment Portfolio',
      type: 'INVESTMENT' as const,
      balance: 10000,
    },
  ]

  // Check if test user exists
  const userExists = await prisma.user.findUnique({
    where: { id: testUserId },
  })

  if (userExists) {
    console.log('Seeding sample bank accounts...')
    for (const account of sampleAccounts) {
      await prisma.bankAccount.upsert({
        where: {
          id: account.id,
        },
        update: {
          balance: account.balance,
          type: account.type,
        },
        create: {
          id: account.id,
          name: account.name,
          type: account.type,
          balance: account.balance,
          userId: testUserId,
        },
      })
      console.log(`Created/verified bank account: ${account.name}`)
    }
  } else {
    console.log('Skipping bank account seed - test user does not exist')
  }

  console.log('Seed completed successfully!')
}

main()
  .catch((e) => {
    console.error('Error during seed:', e)
    process.exit(1)
  })
  .finally(async () => {
    await prisma.$disconnect()
  })
