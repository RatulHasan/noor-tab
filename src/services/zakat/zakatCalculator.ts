export interface ZakatAssets {
  cash: number;
  goldValue: number;
  silverValue: number;
  businessAssets: number;
  receivables: number;
}

export interface ZakatLiabilities {
  debtsDue: number;
}

export interface ZakatCalculation {
  totalAssets: number;
  totalLiabilities: number;
  netAssets: number;
  nisabThreshold: number;
  isEligible: boolean;
  zakatDue: number;
  currency: string;
  savedAt: string;
}

export function calculateZakat(
  assets: ZakatAssets,
  liabilities: ZakatLiabilities,
  nisabThreshold: number
): Omit<ZakatCalculation, 'currency' | 'savedAt'> {
  const totalAssets = assets.cash + assets.goldValue + assets.silverValue + assets.businessAssets + assets.receivables;
  const totalLiabilities = liabilities.debtsDue;
  const netAssets = totalAssets - totalLiabilities;
  const isEligible = netAssets >= nisabThreshold;
  const zakatDue = isEligible ? netAssets * 0.025 : 0;

  return {
    totalAssets,
    totalLiabilities,
    netAssets,
    nisabThreshold,
    isEligible,
    zakatDue,
  };
}
