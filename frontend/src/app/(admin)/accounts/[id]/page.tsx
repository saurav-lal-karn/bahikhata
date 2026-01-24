import React from "react";
import WalletDetailsClient from "./WalletDetailsClient";

export default function WalletDetailsPage({ params }: { params: { id: string } }) {
  return <WalletDetailsClient walletId={params.id} />;
}
