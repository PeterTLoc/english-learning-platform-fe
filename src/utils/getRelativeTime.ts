export function getRelativeTime(dateInput: string | Date): string {
  const now = new Date()
  const date = typeof dateInput === "string" ? new Date(dateInput) : dateInput

  const diffMs = now.getTime() - date.getTime()
  const diffSec = Math.floor(diffMs / 1000)
  const diffMin = Math.floor(diffSec / 60)
  const diffHr = Math.floor(diffMin / 60)
  const diffDay = Math.floor(diffHr / 24)

  if (diffSec < 60) return `${diffSec} seconds ago`
  if (diffMin < 60) return `${diffMin} minutes ago`
  if (diffHr < 24) return `${diffHr} hours ago`
  if (diffDay < 30) return `${diffDay} days ago`

  const diffMonth = Math.floor(diffDay / 30)
  if (diffMonth < 12) return `${diffMonth} months ago`

  const diffYear = Math.floor(diffDay / 365)
  if (diffYear >= 1) return `${diffYear} years ago`
}
