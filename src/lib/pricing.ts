// Shared by client (cart preview) and server (authoritative order totals).
export const FREE_DELIVERY_THRESHOLD_CENTS = 3500;
export const DELIVERY_FEE_CENTS = 499;
export const TAX_RATE = 0.08;

export interface Pricing {
  deliveryCents: number;
  taxCents: number;
  totalCents: number;
}

export function computePricing(subtotalCents: number): Pricing {
  const deliveryCents = subtotalCents === 0 || subtotalCents >= FREE_DELIVERY_THRESHOLD_CENTS ? 0 : DELIVERY_FEE_CENTS;
  const taxCents = Math.round(subtotalCents * TAX_RATE);
  return { deliveryCents, taxCents, totalCents: subtotalCents + deliveryCents + taxCents };
}
