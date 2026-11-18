import type { HandTested, Language, LocalizedText } from '../types/domain';

/**
 * Formats numbers using Western numerals (0-9) in both English and Arabic,
 * aligning with standard clinical EHR readability preferences.
 */
export function formatNumber(
  value: number,
  language: Language,
  maximumFractionDigits: number = 2,
  minimumFractionDigits: number = 0,
): string {
  const locale = language === 'ar' ? 'ar-EG-u-nu-latn' : 'en-US';
  return new Intl.NumberFormat(locale, {
    maximumFractionDigits,
    minimumFractionDigits,
  }).format(value);
}

export function formatInteger(value: number, language: Language): string {
  return formatNumber(Math.round(value), language, 0, 0);
}

export function formatDecimal(
  value: number,
  language: Language,
  decimals: number = 2,
): string {
  return formatNumber(value, language, decimals, decimals);
}

export function formatDate(isoString: string, language: Language): string {
  const date = new Date(isoString);
  if (Number.isNaN(date.getTime())) return isoString;

  const locale = language === 'ar' ? 'ar-EG-u-nu-latn-ca-gregory' : 'en-US';
  return new Intl.DateTimeFormat(locale, {
    year: 'numeric',
    month: 'short',
    day: 'numeric',
    calendar: 'gregory',
  }).format(date);
}

export function formatDateTime(isoString: string, language: Language): string {
  const date = new Date(isoString);
  if (Number.isNaN(date.getTime())) return isoString;

  const locale = language === 'ar' ? 'ar-EG-u-nu-latn-ca-gregory' : 'en-US';
  return new Intl.DateTimeFormat(locale, {
    year: 'numeric',
    month: 'short',
    day: 'numeric',
    hour: '2-digit',
    minute: '2-digit',
    calendar: 'gregory',
  }).format(date);
}

export function formatShortDate(isoString: string, language: Language): string {
  const date = new Date(isoString);
  if (Number.isNaN(date.getTime())) return isoString;

  const locale = language === 'ar' ? 'ar-EG-u-nu-latn-ca-gregory' : 'en-US';
  return new Intl.DateTimeFormat(locale, {
    month: 'short',
    day: 'numeric',
    calendar: 'gregory',
  }).format(date);
}

export function getLocalizedText(text: LocalizedText, language: Language): string {
  return text[language];
}

export function formatHandLabel(hand: HandTested, language: Language): string {
  if (language === 'ar') {
    return hand === 'right' ? 'اليد اليمنى' : 'اليد اليسرى';
  }
  return hand === 'right' ? 'Right Hand' : 'Left Hand';
}

