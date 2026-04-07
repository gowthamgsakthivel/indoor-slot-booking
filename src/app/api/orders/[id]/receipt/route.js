import { NextResponse } from "next/server";
import { getServerSession } from "next-auth/next";
import PDFDocument from "pdfkit/js/pdfkit.standalone";
import { authOptions } from "@/lib/auth";
import connectMongoose from "@/lib/mongoose";
import User from "@/models/User";
import Order from "@/models/Order";

export const runtime = "nodejs";

const formatAmount = (value) => {
  const safeValue = Number.isFinite(value) ? value : 0;
  return safeValue.toLocaleString("en-IN", {
    minimumFractionDigits: 2,
    maximumFractionDigits: 2,
  });
};

const buildReceiptPdf = ({ order, user, createdAt, baseAmount, serviceFee, tax, total }) =>
  new Promise((resolve, reject) => {
    const doc = new PDFDocument({ size: "A4", margin: 48 });
    const chunks = [];

    doc.on("data", (chunk) => chunks.push(chunk));
    doc.on("end", () => resolve(Buffer.concat(chunks)));
    doc.on("error", reject);

    const pageWidth = doc.page.width - doc.page.margins.left - doc.page.margins.right;
    const startX = doc.page.margins.left;
    const headerHeight = 72;
    const accent = "#FF6B00";

    doc.save();
    doc
      .rect(startX, doc.y, pageWidth, headerHeight)
      .fill("#111111");
    doc
      .rect(startX, doc.y, 6, headerHeight)
      .fill(accent);
    doc
      .fillColor("#FFFFFF")
      .font("Helvetica-Bold")
      .fontSize(20)
      .text("NKL Sports Club", startX + 18, doc.y + 16, { align: "left" })
      .font("Helvetica")
      .fontSize(10)
      .fillColor("#D1D1D1")
      .text("Order Receipt", startX + 18, doc.y + 40, { align: "left" });
    doc.restore();

    doc.moveDown(3.2);

    const pillText = order.status || "Confirmed";
    const pillWidth = doc.widthOfString(pillText) + 24;
    doc
      .roundedRect(startX, doc.y, pillWidth, 24, 12)
      .fill("#EAF8E5");
    doc
      .fillColor("#1A6413")
      .font("Helvetica-Bold")
      .fontSize(10)
      .text(pillText, startX + 12, doc.y + 6);

    doc.moveDown(2);

    const drawSection = (title, y) => {
      doc
        .roundedRect(startX, y, pageWidth, 10, 5)
        .fill("#F3F3F3");
      doc
        .fillColor("#333333")
        .font("Helvetica-Bold")
        .fontSize(11)
        .text(title, startX + 12, y - 2);
      return y + 20;
    };

    let cursorY = doc.y;
    cursorY = drawSection("Order Summary", cursorY);

    const leftColumnX = startX + 12;
    const rightColumnX = startX + pageWidth / 2 + 8;
    const columnWidth = pageWidth / 2 - 32;
    const rowGap = 14;

    const summaryRows = [
      ["Order ID", order.orderId],
      ["Date", createdAt.toLocaleString("en-IN")],
      ["Member", user?.name || user?.email || "Member"],
      ["Court", order.court || "-"],
      ["Slot", order.slot || "-"],
      ["Duration", order.duration || "-"],
      ["Players", String(order.members || 1)],
      ["Payment ID", order.paymentId || "Pending"],
    ];

    for (let i = 0; i < summaryRows.length; i += 2) {
      const leftRow = summaryRows[i];
      const rightRow = summaryRows[i + 1];
      const rowY = cursorY;

      doc
        .font("Helvetica-Bold")
        .fillColor("#555555")
        .fontSize(9)
        .text(leftRow[0].toUpperCase(), leftColumnX, rowY, { width: columnWidth });
      doc
        .font("Helvetica")
        .fillColor("#111111")
        .fontSize(11)
        .text(leftRow[1], leftColumnX, rowY + 10, { width: columnWidth });

      if (rightRow) {
        doc
          .font("Helvetica-Bold")
          .fillColor("#555555")
          .fontSize(9)
          .text(rightRow[0].toUpperCase(), rightColumnX, rowY, { width: columnWidth });
        doc
          .font("Helvetica")
          .fillColor("#111111")
          .fontSize(11)
          .text(rightRow[1], rightColumnX, rowY + 10, { width: columnWidth });
      }

      const leftHeight =
        doc.heightOfString(leftRow[1], { width: columnWidth }) + 10;
      const rightHeight = rightRow
        ? doc.heightOfString(rightRow[1], { width: columnWidth }) + 10
        : 0;
      cursorY += Math.max(leftHeight, rightHeight, 22) + rowGap;
    }

    cursorY += 4;
    cursorY = drawSection("Payment Breakdown", cursorY);

    const amountRows = [
      ["Base Amount", `Rs ${formatAmount(baseAmount)}`],
      ["Service Fee", `Rs ${formatAmount(serviceFee)}`],
      ["Tax", `Rs ${formatAmount(tax)}`],
    ];

    amountRows.forEach(([label, value], index) => {
      const rowY = cursorY + index * 18;
      doc
        .font("Helvetica")
        .fillColor("#444444")
        .fontSize(10)
        .text(label, leftColumnX, rowY);
      doc
        .font("Helvetica-Bold")
        .fillColor("#111111")
        .text(value, rightColumnX, rowY, {
          align: "right",
          width: pageWidth / 2 - 24,
        });
    });

    const totalY = cursorY + amountRows.length * 18 + 10;
    doc
      .roundedRect(startX, totalY, pageWidth, 36, 10)
      .fill("#FFF4EC");
    doc
      .font("Helvetica-Bold")
      .fillColor("#B34100")
      .fontSize(12)
      .text("Total Paid", leftColumnX, totalY + 10);
    doc
      .font("Helvetica-Bold")
      .fillColor("#111111")
      .fontSize(12)
      .text(`Rs ${formatAmount(total)}`, rightColumnX, totalY + 10, {
        align: "right",
        width: pageWidth / 2 - 24,
      });

    doc
      .font("Helvetica")
      .fontSize(9)
      .fillColor("#777777")
      .text(
        "Thank you for booking with NKL Sports Club. For support, contact our front desk.",
        startX,
        totalY + 54,
        { align: "left" }
      );

    doc.end();
  });

export async function GET(request, { params }) {
  const session = await getServerSession(authOptions);

  if (!session?.user?.email) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  await connectMongoose();

  const user = await User.findOne({ email: session.user.email });
  if (!user) {
    return NextResponse.json({ error: "User not found" }, { status: 404 });
  }

  const order = await Order.findOne({ _id: params.id, userId: user._id }).lean();
  if (!order) {
    return NextResponse.json({ error: "Order not found" }, { status: 404 });
  }

  const baseAmount = (order.baseAmount ?? order.amount ?? 0) / 100;
  const serviceFee = (order.serviceFee ?? 0) / 100;
  const tax = (order.tax ?? 0) / 100;
  const total = (order.amount ?? 0) / 100;
  const createdAt = new Date(order.createdAt);

  const pdfBuffer = await buildReceiptPdf({
    order,
    user,
    createdAt,
    baseAmount,
    serviceFee,
    tax,
    total,
  });
  const filename = `receipt_${order.orderId}.pdf`;

  return new NextResponse(pdfBuffer, {
    headers: {
      "Content-Type": "application/pdf",
      "Content-Disposition": `attachment; filename="${filename}"`,
    },
  });
}
