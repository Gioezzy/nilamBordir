import midtransclient from 'midtrans-client';

if (!process.env.MIDTRANS_SERVER_KEY) {
  throw new Error('Midtrans server key is not set in environment variables');
}

if (!process.env.MIDTRANS_CLIENT_KEY) {
  throw new Error('Midtrans client key is not set in environment variables');
}

export const snap = new midtransclient.Snap({
  isProduction: process.env.MIDTRANS_IS_PRODUCTION === 'true',
  serverKey: process.env.MIDTRANS_SERVER_KEY,
  clientKey: process.env.MIDTRANS_CLIENT_KEY,
});

export async function createMidtransTransaction(params: {
  orderId: string;
  amount: number;
  customerDetails: {
    firstName: string;
    email: string;
    phone: string;
  };
  itemDetails: Array<{
    id: string;
    name: string;
    price: number;
    quantity: number;
  }>;
}) {
  try {
    const transaction = await snap.createTransaction({
      transaction_details: {
        order_id: params.orderId,
        gross_amount: params.amount,
      },
      customer_details: {
        first_name: params.customerDetails.firstName,
        email: params.customerDetails.email,
        phone: params.customerDetails.phone,
      },
      item_details: params.itemDetails,
      enabled_payments: [
        'credit_card',
        'bca_va',
        'bni_va',
        'bri_va',
        'mandiri_va',
        'permata_va',
        'gopay',
        'shopeepay',
        'qris',
        'dana',
      ],
      credit_card: {
        secure: true,
      },
    });
    return {
      success: true,
      token: transaction.token,
      redirectUrl: transaction.redirect_url,
    };
  } catch (error) {
    console.log('Midtrans transaction error: ', error);
    return {
      success: false,
      error: error instanceof Error ? error.message : 'Unknown error',
    };
  }
}

export async function chackTransactionStatus(orderId: string) {
  try {
    const status = await snap.transaction.status(orderId);
    return {
      success: true,
      data: status,
    };
  } catch (error) {
    console.log('Check transaction status error: ', error);
    return {
      success: false,
      error: error instanceof Error ? error.message : 'Unknown error',
    };
  }
}
