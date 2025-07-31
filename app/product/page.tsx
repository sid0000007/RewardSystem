"use client";

import CodeScanner from "@/components/actions/CodeScanner";

export default function ScanPage() {
  return (
    <div className="mx-auto p-4">
      <div className="mb-8 text-center">
        <h2 className="text-3xl font-bold  mb-4">Scan QR Codes</h2>
        <p className="">
          Enter codes manually or scan QR codes to unlock rewards
        </p>
      </div>
      <CodeScanner />
    </div>
  );
}
