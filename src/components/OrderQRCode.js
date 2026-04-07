"use client";

import { QRCodeCanvas } from "qrcode.react";

export default function OrderQRCode({
  payload,
  size = 180,
  label = "Scan at reception",
  className = "",
}) {
  return (
    <div
      className={`rounded-3xl border border-white/10 bg-[#141414] p-6 flex flex-col items-center gap-4 ${className}`}
    >
      <div className="rounded-2xl bg-white p-3">
        <QRCodeCanvas value={payload} size={size} />
      </div>
      {label ? (
        <p className="text-xs uppercase tracking-[0.3em] text-white/50">
          {label}
        </p>
      ) : null}
    </div>
  );
}
