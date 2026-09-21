export const WOMPI_PAYMENT_URL =
  import.meta.env.VITE_WOMPI_PAYMENT_URL?.trim() ||
  'https://checkout.wompi.co/l/Y1sx5h';

export function openWompiCheckout(): void {
  window.open(WOMPI_PAYMENT_URL, '_blank', 'noopener,noreferrer');
}
