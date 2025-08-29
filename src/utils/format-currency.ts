/**
 * Format currency values with proper locale and currency symbol
 * @param amount - Amount to format
 * @param currency - Currency code (default: BRL)
 * @param locale - Locale for formatting (default: pt-BR)
 * @returns Formatted currency string
 */
export function formatCurrency(
  amount: number,
  currency: string = 'BRL',
  locale: string = 'pt-BR'
): string {
  return new Intl.NumberFormat(locale, {
    style: 'currency',
    currency,
  }).format(amount)
}
