import { NextResponse } from "next/server";
import { isPaymentSuccessful, verifyMidtransSignature } from "@/lib/midtrans";
import { supabase } from "@/lib/supabase";

export async function POST(request: Request) {
  const body = (await request.json()) as {
    order_id?: string;
    status_code?: string;
    gross_amount?: string;
    signature_key?: string;
    transaction_status?: string;
    fraud_status?: string;
  };

  const verified = verifyMidtransSignature({
    orderId: body.order_id ?? "",
    statusCode: body.status_code ?? "",
    grossAmount: body.gross_amount ?? "",
    signatureKey: body.signature_key,
  });

  if (!verified) {
    return NextResponse.json({ ok: false, message: "Invalid signature" }, { status: 403 });
  }

  const success = isPaymentSuccessful({
    status_code: body.status_code,
    transaction_status: body.transaction_status,
    fraud_status: body.fraud_status,
  });

  if (success && body.order_id) {
    await supabase
      .from("orders")
      .update({
        status: "paid",
        payment_type: body.transaction_status ?? null,
        midtrans_response: body as Record<string, unknown>,
      })
      .eq("order_id", body.order_id);

    const { data: order } = await supabase
      .from("orders")
      .select("user_email, course_slug")
      .eq("order_id", body.order_id)
      .single();

    if (order) {
      await supabase
        .from("enrollments")
        .upsert(
          { user_email: order.user_email, course_slug: order.course_slug, status: "active" },
          { onConflict: "user_email,course_slug" },
        );
    }
  }

  return NextResponse.json({
    ok: true,
    acknowledged: true,
    success,
  });
}
