export const bankAccountKeys = {
  all: ['bankAccounts'] as const,
  lists: () => [...bankAccountKeys.all, 'list'] as const,
  list: () => [...bankAccountKeys.lists()] as const,
  details: () => [...bankAccountKeys.all, 'detail'] as const,
  detail: (id: string) => [...bankAccountKeys.details(), id] as const,
}
