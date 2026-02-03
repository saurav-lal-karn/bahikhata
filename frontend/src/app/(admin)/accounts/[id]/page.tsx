import React from "react";
import WalletDetailsClient from "./WalletDetailsClient";

export default async function WalletDetailsPage({
  params,
}: {
  params: Promise<{ id: string }>;
}) {
  const { id } = await params;
  return <WalletDetailsClient walletId={id} />;
}
