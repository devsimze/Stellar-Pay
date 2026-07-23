"use client";

import { useCallback, useState } from "react";
import WalletConnect from "@/components/WalletConnect";
import BalanceCard from "@/components/BalanceCard";
import SendForm from "@/components/SendForm";
import TxResult, { TxResultData } from "@/components/TxResult";
import TxHistory from "@/components/TxHistory";
import { connectFreighter, signXdr } from "@/lib/freighter";
import {
  buildPaymentTransaction,
  fundWithFriendbot,
  getRecentTransactions,
  getXlmBalance,
  submitSignedTransaction,
  type SimpleTransaction,
} from "@/lib/stellar";

export default function Home() {
  const [address, setAddress] = useState<string | null>(null);
  const [connecting, setConnecting] = useState(false);
  const [connectError, setConnectError] = useState<string | null>(null);

  const [balance, setBalance] = useState<string | null>(null);
  const [balanceLoading, setBalanceLoading] = useState(false);
  const [unfunded, setUnfunded] = useState(false);
  const [funding, setFunding] = useState(false);

  const [history, setHistory] = useState<SimpleTransaction[]>([]);
  const [historyLoading, setHistoryLoading] = useState(false);

  const [sending, setSending] = useState(false);
  const [txResult, setTxResult] = useState<TxResultData | null>(null);

  const refreshAccountData = useCallback(async (publicKey: string) => {
    setBalanceLoading(true);
    setHistoryLoading(true);
    try {
      const [bal, txs] = await Promise.all([
        getXlmBalance(publicKey),
        getRecentTransactions(publicKey),
      ]);
      setUnfunded(bal === null);
      setBalance(bal);
      setHistory(txs);
    } finally {
      setBalanceLoading(false);
      setHistoryLoading(false);
    }
  }, []);

  async function handleConnect() {
    setConnecting(true);
    setConnectError(null);
    try {
      const publicKey = await connectFreighter();
      setAddress(publicKey);
      await refreshAccountData(publicKey);
    } catch (err) {
      setConnectError(err instanceof Error ? err.message : "Failed to connect wallet.");
    } finally {
      setConnecting(false);
    }
  }

  function handleDisconnect() {
    setAddress(null);
    setBalance(null);
    setUnfunded(false);
    setHistory([]);
    setTxResult(null);
    setConnectError(null);
  }

  async function handleFund() {
    if (!address) return;
    setFunding(true);
    try {
      await fundWithFriendbot(address);
      await refreshAccountData(address);
    } catch (err) {
      setConnectError(err instanceof Error ? err.message : "Friendbot funding failed.");
    } finally {
      setFunding(false);
    }
  }

  async function handleSend(destination: string, amount: string, memo: string) {
    if (!address) return;
    setSending(true);
    setTxResult(null);
    try {
      const unsignedXdr = await buildPaymentTransaction({
        sourcePublicKey: address,
        destinationPublicKey: destination,
        amount,
        memo: memo || undefined,
      });
      const signedXdr = await signXdr(unsignedXdr, address);
      const response = await submitSignedTransaction(signedXdr);

      setTxResult({
        status: "success",
        message: `Sent ${amount} XLM to ${destination.slice(0, 4)}...${destination.slice(-4)}.`,
        hash: response.hash,
      });
      await refreshAccountData(address);
    } catch (err) {
      setTxResult({
        status: "error",
        message: err instanceof Error ? err.message : "Transaction failed.",
      });
    } finally {
      setSending(false);
    }
  }

  return (
    <div className="min-h-screen flex-1 bg-slate-950">
      <main className="mx-auto flex max-w-2xl flex-col gap-6 px-6 py-12">
        <header className="flex items-center justify-between">
          <div>
            <h1 className="text-2xl font-bold text-white">StellarPay</h1>
            <p className="text-sm text-slate-400">Send XLM on Stellar Testnet</p>
          </div>
          <WalletConnect
            address={address}
            connecting={connecting}
            onConnect={handleConnect}
            onDisconnect={handleDisconnect}
          />
        </header>

        {connectError && (
          <div className="rounded-2xl border border-red-600/50 bg-red-950/40 p-4 text-sm text-red-300">
            {connectError}
          </div>
        )}

        {!address ? (
          <div className="rounded-2xl border border-dashed border-slate-700 bg-slate-900/40 p-10 text-center">
            <p className="text-slate-300">Connect your Freighter wallet to get started.</p>
            <p className="mt-2 text-sm text-slate-500">
              Make sure the Freighter extension is installed and switched to Test Net.
            </p>
          </div>
        ) : (
          <>
            <BalanceCard
              balance={balance}
              loading={balanceLoading}
              unfunded={unfunded}
              onRefresh={() => refreshAccountData(address)}
              onFund={handleFund}
              funding={funding}
            />

            <SendForm disabled={!address || unfunded} sending={sending} onSend={handleSend} />

            <TxResult result={txResult} />

            <TxHistory transactions={history} loading={historyLoading} />
          </>
        )}
      </main>
    </div>
  );
}
