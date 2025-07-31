"use client";

import WalletView from "@/components/WalletView";

export default function WalletPage() {
  return (
    <div className="max-w-7xl mx-auto p-4">
      <div className="mb-8 text-center">
        <h2 className="text-3xl font-bold  mb-4">Your Wallet</h2>
        <p className="">
          View and manage all your collected rewards
        </p>
      </div>
      <WalletView />
    </div>
  );
}
