import { PaymentFinalizer } from "@/components/payment-finalizer";

export default async function PaymentResultPage({
  searchParams,
}: {
  searchParams: Promise<{
    order_id?: string;
    status_code?: string;
    transaction_status?: string;
    source?: string;
  }>;
}) {
  const params = await searchParams;

  return (
    <div className="mx-auto max-w-4xl px-6 py-16">
      <PaymentFinalizer
        orderId={params.order_id ?? ""}
        statusCode={params.status_code}
        transactionStatus={params.transaction_status}
        source={params.source}
      />
    </div>
  );
}
