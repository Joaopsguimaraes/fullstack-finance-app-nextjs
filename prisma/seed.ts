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
