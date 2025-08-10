export type NameSearchCollation = {
  locale: string;
  strength?: 1 | 2 | 3 | 4 | 5;
};

/**
 * Returns the collation to use for name-based searches, if enabled.
 * Configured via environment variables:
 * - FS_DB_NAME_COLLATION_LOCALE (default: 'en')
 * - FS_DB_NAME_COLLATION_STRENGTH (default: '2' -> case-insensitive)
 * - FS_DB_NAME_COLLATION_DISABLED ('true' to disable collation entirely)
 */
export function getNameSearchCollation(): NameSearchCollation | undefined {
  const disabled = (process.env.FS_DB_NAME_COLLATION_DISABLED || '').toLowerCase();
  if (disabled === 'true' || disabled === '1') return undefined;

  const locale = process.env.FS_DB_NAME_COLLATION_LOCALE || 'en';
  const strengthRaw = process.env.FS_DB_NAME_COLLATION_STRENGTH;
  const strengthNum = strengthRaw ? Number(strengthRaw) : 2;

  if (!Number.isFinite(strengthNum) || strengthNum < 1 || strengthNum > 5) {
    return { locale, strength: 2 };
  }

  return { locale, strength: strengthNum as NameSearchCollation['strength'] };
}
