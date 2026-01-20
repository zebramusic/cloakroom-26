/**
 * Format currency (RON)
 */
export function formatCurrency(amount: number, locale: string = 'ro-RO'): string {
  return new Intl.NumberFormat(locale, {
    style: 'currency',
    currency: 'RON',
    minimumFractionDigits: 2,
  }).format(amount)
}

/**
 * Format date
 */
export function formatDate(date: string | Date, locale: string = 'ro-RO'): string {
  const d = typeof date === 'string' ? new Date(date) : date
  return new Intl.DateTimeFormat(locale, {
    year: 'numeric',
    month: 'long',
    day: 'numeric',
  }).format(d)
}

/**
 * Format date and time
 */
export function formatDateTime(date: string | Date, locale: string = 'ro-RO'): string {
  const d = typeof date === 'string' ? new Date(date) : date
  return new Intl.DateTimeFormat(locale, {
    year: 'numeric',
    month: 'long',
    day: 'numeric',
    hour: '2-digit',
    minute: '2-digit',
  }).format(d)
}

/**
 * Format number
 */
export function formatNumber(num: number, locale: string = 'ro-RO'): string {
  return new Intl.NumberFormat(locale).format(num)
}

/**
 * Generate quote number (QT-YYYY-XXX)
 */
export function generateQuoteNumber(): string {
  const year = new Date().getFullYear()
  const random = Math.floor(Math.random() * 1000).toString().padStart(3, '0')
  return `QT-${year}-${random}`
}

/**
 * Generate order number (ORD-YYYY-XXX)
 */
export function generateOrderNumber(): string {
  const year = new Date().getFullYear()
  const random = Math.floor(Math.random() * 1000).toString().padStart(3, '0')
  return `ORD-${year}-${random}`
}

/**
 * Generate invoice number (INV-SERIES-NUMBER)
 */
export function generateInvoiceNumber(series: string, number: number): string {
  return `INV-${series}-${number.toString().padStart(4, '0')}`
}

/**
 * Calculate tax amount
 */
export function calculateTax(amount: number, taxRate: number): number {
  return (amount * taxRate) / 100
}

/**
 * Calculate total with tax
 */
export function calculateTotalWithTax(amount: number, taxRate: number): number {
  return amount + calculateTax(amount, taxRate)
}

/**
 * Truncate text
 */
export function truncate(text: string, length: number): string {
  if (text.length <= length) return text
  return text.substring(0, length) + '...'
}

/**
 * Slugify string
 */
export function slugify(text: string): string {
  return text
    .toString()
    .toLowerCase()
    .trim()
    .replace(/\s+/g, '-')
    .replace(/[^\w\-]+/g, '')
    .replace(/\-\-+/g, '-')
    .replace(/^-+/, '')
    .replace(/-+$/, '')
}

/**
 * Get initials from name
 */
export function getInitials(name: string): string {
  return name
    .split(' ')
    .map((n) => n[0])
    .join('')
    .toUpperCase()
    .substring(0, 2)
}

/**
 * Delay function (for testing)
 */
export function delay(ms: number): Promise<void> {
  return new Promise((resolve) => setTimeout(resolve, ms))
}
