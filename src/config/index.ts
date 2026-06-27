export type NameSearchCollation = {
  locale: string;
  strength?: 1 | 2 | 3 | 4 | 5;
};

let _collation: { value: NameSearchCollation | undefined } | null = null;

export function getNameSearchCollation(): NameSearchCollation | undefined {
  if (_collation !== null) return _collation.value;

  const disabled = (process.env.FS_DB_NAME_COLLATION_DISABLED || '').toLowerCase();
  if (disabled === 'true' || disabled === '1') {
    _collation = { value: undefined };
    return undefined;
  }

  const locale = process.env.FS_DB_NAME_COLLATION_LOCALE || 'en';
  const strengthRaw = process.env.FS_DB_NAME_COLLATION_STRENGTH;
  const strengthNum = strengthRaw ? Number(strengthRaw) : 2;

  const strength = (Number.isFinite(strengthNum) && strengthNum >= 1 && strengthNum <= 5)
    ? strengthNum as NameSearchCollation['strength']
    : 2;

  _collation = { value: { locale, strength } };
  return _collation.value;
}

export function resetNameSearchCollation(): void {
  _collation = null;
}
