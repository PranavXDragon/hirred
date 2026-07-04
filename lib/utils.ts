/** Formats a date as "X days ago", "today", etc. */
export function timeAgo(dateString: string): string {
  const date = new Date(dateString);
  const now = new Date();
  const diffMs = now.getTime() - date.getTime();
  const diffDays = Math.floor(diffMs / (1000 * 60 * 60 * 24));
  if (diffDays === 0) return 'Posted today';
  if (diffDays === 1) return 'Posted 1 day ago';
  if (diffDays < 7) return `Posted ${diffDays} days ago`;
  if (diffDays < 30) return `Posted ${Math.floor(diffDays / 7)} week${Math.floor(diffDays / 7) > 1 ? 's' : ''} ago`;
  return `Posted ${Math.floor(diffDays / 30)} month${Math.floor(diffDays / 30) > 1 ? 's' : ''} ago`;
}

/** Formats salary range for display */
export function formatSalary(salary: number): string {
  if (salary >= 100000) return `₹${(salary / 100000).toFixed(1)}L`;
  if (salary >= 1000) return `₹${(salary / 1000).toFixed(0)}K`;
  return `₹${salary}`;
}

/** Countdown string from a deadline date */
export function deadlineLabel(deadline: string): { label: string; urgency: 'urgent' | 'soon' | 'ok' } {
  const diff = new Date(deadline).getTime() - Date.now();
  const days = Math.ceil(diff / (1000 * 60 * 60 * 24));
  if (days <= 0) return { label: 'Closed', urgency: 'urgent' };
  if (days === 1) return { label: 'Closes today!', urgency: 'urgent' };
  if (days <= 3) return { label: `Closes in ${days} days`, urgency: 'urgent' };
  if (days <= 7) return { label: `Closes in ${days} days`, urgency: 'soon' };
  return { label: `${days} days left`, urgency: 'ok' };
}

/** Highlights a search term inside text */
export function highlightText(text: string, query: string): string {
  if (!query.trim()) return text;
  const escaped = query.replace(/[.*+?^${}()|[\]\\]/g, '\\$&');
  return text.replace(new RegExp(`(${escaped})`, 'gi'), '<mark>$1</mark>');
}

/** Truncates text to N characters */
export function truncate(text: string, n: number): string {
  return text.length > n ? text.slice(0, n) + '…' : text;
}

/** Calculates profile strength percentage */
export function calcProfileStrength(profile: Record<string, unknown>): number {
  const fields: [string, number][] = [
    ['full_name', 10], ['email', 10], ['bio', 10], ['phone', 5], ['location', 5],
    ['profile_photo', 10], ['resume', 15], ['skills', 15], ['experience', 10], ['education', 10],
  ];
  let score = 0;
  for (const [field, weight] of fields) {
    const val = profile[field];
    if (Array.isArray(val) ? val.length > 0 : Boolean(val)) score += weight;
  }
  return Math.min(score, 100);
}
