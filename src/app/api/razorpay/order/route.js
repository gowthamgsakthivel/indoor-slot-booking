import { NextResponse } from "next/server";
import Razorpay from "razorpay";

export async function POST(request) {
  const body = await request.json();
  const amount = Number(body?.amount || 0);

  if (!amount || amount <= 0) {
    return NextResponse.json({ error: "Invalid amount" }, { status: 400 });
  }

  const keyId = process.env.RAZORPAY_KEY_ID;
  const keySecret = process.env.RAZORPAY_KEY_SECRET;

  if (!keyId || !keySecret) {
    return NextResponse.json({ error: "Missing Razorpay keys" }, { status: 500 });
  }

  const razorpay = new Razorpay({
    key_id: keyId,
    key_secret: keySecret,
  });

  try {
    const order = await razorpay.orders.create({
      amount,
      currency: "INR",
      receipt: `membership_${Date.now()}`,
      notes: {
        slot: body?.slot || "6-7",
        plan: body?.plan || "Monthly",
      },
    });

    return NextResponse.json({
      orderId: order.id,
      amount: order.amount,
      currency: order.currency,
    });
  } catch (error) {
    return NextResponse.json({ error: "Order creation failed" }, { status: 500 });
  }
}
