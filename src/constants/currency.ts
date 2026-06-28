export interface CurrencyOption {
  label: string;
  value: string; // Currency code
  symbol: string;
}

export const CURRENCY_OPTIONS: CurrencyOption[] = [
  { label: 'Dollar ($)', value: 'USD', symbol: '$' },
  { label: 'Rupee (₹)', value: 'INR', symbol: '₹' },
  { label: 'Pound (£)', value: 'GBP', symbol: '£' },
  { label: 'Euro (€)', value: 'EUR', symbol: '€' },
  { label: 'Yen (¥)', value: 'JPY', symbol: '¥' },
];

export const getCurrencySymbol = (code: string): string => {
  const currency = CURRENCY_OPTIONS.find((c) => c.value === code);
  return currency ? currency.symbol : '$';
};
