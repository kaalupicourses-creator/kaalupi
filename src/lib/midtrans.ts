import { createHash } from "node:crypto";

const sandboxBase = "https://app.sandbox.midtrans.com";
const productionBase = "https://app.midtrans.com";
const apiSandboxBase = "https://api.sandbox.midtrans.com";
const apiProductionBase = "https://api.midtrans.com";

function getAuthHeader(serverKey: string) {
  return `Basic ${Buffer.from(`${serverKey}:`).toString("base64")}`;
}

export function getMidtransConfig() {
  const serverKey = process.env.MIDTRANS_SERVER_KEY;
  const clientKey = process.env.NEXT_PUBLIC_MIDTRANS_CLIENT_KEY;
  const isProduction = process.env.MIDTRANS_IS_PRODUCTION === "true";

  return {
    serverKey,
    clientKey,
    isProduction,
    enabled: Boolean(serverKey),
    snapBaseUrl: isProduction ? productionBase : sandboxBase,
    apiBaseUrl: isProduction ? apiProductionBase : apiSandboxBase,
  };
}

export async function createMidtransTransaction(input: {
  orderId: string;
  amount: number;
  courseTitle: string;
  customer: { firstName: string; email: string };
}) {
  const config = getMidtransConfig();
  if (!config.serverKey) {
    throw new Error("Midtrans server key belum dikonfigurasi.");
  }

  const response = await fetch(`${config.snapBaseUrl}/snap/v1/transactions`, {
    method: "POST",
    headers: {
      Accept: "application/json",
      "Content-Type": "application/json",
      Authorization: getAuthHeader(config.serverKey),
    },
    body: JSON.stringify({
      transaction_details: {
        order_id: input.orderId,
        gross_amount: input.amount,
      },
      item_details: [
        {
          id: input.orderId,
          price: input.amount,
          quantity: 1,
          name: input.courseTitle,
        },
      ],
      customer_details: {
        first_name: input.customer.firstName,
        email: input.customer.email,
      },
      credit_card: {
        secure: true,
      },
    }),
  });

  if (!response.ok) {
    throw new Error("Gagal membuat transaksi Midtrans.");
  }

  return (await response.json()) as {
    token: string;
    redirect_url: string;
  };
}

export async function getMidtransTransactionStatus(orderId: string) {
  const config = getMidtransConfig();
  if (!config.serverKey) {
    throw new Error("Midtrans server key belum dikonfigurasi.");
  }

  const response = await fetch(`${config.apiBaseUrl}/v2/${orderId}/status`, {
    headers: {
      Accept: "application/json",
      Authorization: getAuthHeader(config.serverKey),
    },
    cache: "no-store",
  });

  if (!response.ok) {
    throw new Error("Gagal mengambil status pembayaran dari Midtrans.");
  }

  return (await response.json()) as {
    status_code: string;
    transaction_status: string;
    fraud_status?: string;
    payment_type?: string;
    gross_amount?: string;
    order_id?: string;
  };
}

export function isPaymentSuccessful(status: {
  status_code?: string;
  transaction_status?: string;
  fraud_status?: string;
}) {
  const successStatus =
    status.transaction_status === "settlement" ||
    status.transaction_status === "capture";

  const allowedFraudStatus =
    !status.fraud_status || status.fraud_status.toLowerCase() === "accept";

  return status.status_code === "200" && successStatus && allowedFraudStatus;
}

export function verifyMidtransSignature(input: {
  orderId: string;
  statusCode: string;
  grossAmount: string;
  signatureKey?: string;
}) {
  const serverKey = process.env.MIDTRANS_SERVER_KEY;
  if (!serverKey || !input.signatureKey) {
    return false;
  }

  const computed = createHash("sha512")
    .update(`${input.orderId}${input.statusCode}${input.grossAmount}${serverKey}`)
    .digest("hex");

  return computed === input.signatureKey;
}
