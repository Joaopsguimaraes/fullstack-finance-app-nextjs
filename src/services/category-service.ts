import { prisma } from '@/lib/prisma'

export type CategoryServiceResponse = {
  id: string
  name: string
  userId: string | null
}

export class CategoryService {
  static async getUserCategories(
    userId: string
  ): Promise<CategoryServiceResponse[]> {
    const [systemCategories, userCategories] = await Promise.all([
      prisma.category.findMany({
        where: { userId: null },
        select: { id: true, name: true, userId: true },
        orderBy: { name: 'asc' },
      }),
      prisma.category.findMany({
        where: { userId },
        select: { id: true, name: true, userId: true },
        orderBy: { name: 'asc' },
      }),
    ])

    return [...systemCategories, ...userCategories]
  }

  static async getCategoryById(
    id: string,
    userId: string
  ): Promise<CategoryServiceResponse | null> {
    const category = await prisma.category.findFirst({
      where: {
        id,
        OR: [{ userId: null }, { userId }],
      },
      select: { id: true, name: true, userId: true },
    })

    return category
  }

  static async createCategory(
    userId: string,
    name: string
  ): Promise<CategoryServiceResponse> {
    const normalizedName = name.toUpperCase()

    const existing = await prisma.category.findFirst({
      where: {
        name: normalizedName,
        OR: [{ userId: null }, { userId }],
      },
    })

    if (existing) {
      throw new Error('Category already exists')
    }

    const category = await prisma.category.create({
      data: {
        name: normalizedName,
        userId,
      },
      select: { id: true, name: true, userId: true },
    })

    return category
  }

  static async updateCategory(
    id: string,
    userId: string,
    name: string
  ): Promise<CategoryServiceResponse> {
    const normalizedName = name.toUpperCase()

    const category = await prisma.category.findUnique({
      where: { id },
    })

    if (!category) {
      throw new Error('Category not found')
    }

    if (category.userId !== userId) {
      throw new Error('Cannot modify system categories')
    }

    const duplicate = await prisma.category.findFirst({
      where: {
        name: normalizedName,
        OR: [{ userId: null }, { userId }],
        NOT: { id },
      },
    })

    if (duplicate) {
      throw new Error('Category name already exists')
    }

    const updated = await prisma.category.update({
      where: { id },
      data: { name: normalizedName },
      select: { id: true, name: true, userId: true },
    })

    return updated
  }

  static async deleteCategory(id: string, userId: string): Promise<void> {
    const category = await prisma.category.findUnique({
      where: { id },
    })

    if (!category) {
      throw new Error('Category not found')
    }

    if (category.userId !== userId) {
      throw new Error('Cannot delete system categories')
    }

    const transactionCount = await prisma.transaction.count({
      where: { categoryId: id },
    })

    if (transactionCount > 0) {
      throw new Error(
        'Cannot delete category that is used by transactions'
      )
    }

    await prisma.category.delete({
      where: { id },
    })
  }
}
