import { PaymentStatus } from '@prisma/client';
import paymaya from '@api/paymaya';

/**
 * Maps PayMaya status strings to our internal PaymentStatus enum
 */
export function mapPayMayaStatusToInternal(paymayaStatus: string): PaymentStatus {
  switch (paymayaStatus) {
    case 'PAYMENT_SUCCESS':
      return PaymentStatus.SUCCEEDED;
    case 'AUTH_FAILED':
    case 'PAYMENT_FAILED':
      return PaymentStatus.REJECTED;
    case 'PAYMENT_EXPIRED':
      return PaymentStatus.EXPIRED;
    case 'PAYMENT_CANCELLED':
      return PaymentStatus.CANCELLED;
    case 'REFUNDED':
      return PaymentStatus.REFUNDED;
    case 'VOIDED':
      return PaymentStatus.VOIDED;
    default:
      return PaymentStatus.PENDING;
  }
}

/**
 * Initializes PayMaya with sandbox credentials
 */
export function initializePayMaya() {
  paymaya.auth('sk-X8qolYjy62kIzEbr0QRK1h4b4KDVHaNcwMYk39jInSl');
  paymaya.server('https://pg-sandbox.paymaya.com');
}

/**
 * Gets payment status from PayMaya and maps it to our internal status
 */
export async function getPayMayaStatus(checkoutId: string): Promise<PaymentStatus> {
  initializePayMaya();
  const { data } = await paymaya.getPaymentViaPaymentId({
    paymentId: checkoutId
  });
  return mapPayMayaStatusToInternal(data.status);
}