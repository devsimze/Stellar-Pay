"use client";

function shortenAddress(address: string): string {
  return `${address.slice(0, 4)}...${address.slice(-4)}`;
}

export default function WalletConnect({
  address,
  connecting,
  onConnect,
  onDisconnect,
}: {
  address: string | null;
  connecting: boolean;
  onConnect: () => void;
  onDisconnect: () => void;
}) {
  if (address) {
    return (
      <div className="flex items-center gap-3 rounded-full border border-slate-700 bg-slate-800/60 px-4 py-2">
        <span className="h-2 w-2 rounded-full bg-emerald-400" />
        <span className="font-mono text-sm text-slate-200">{shortenAddress(address)}</span>
        <button
          onClick={onDisconnect}
          className="rounded-full bg-slate-700 px-3 py-1 text-xs font-medium text-slate-200 transition hover:bg-slate-600"
        >
          Disconnect
        </button>
      </div>
    );
  }

  return (
    <button
      onClick={onConnect}
      disabled={connecting}
      className="rounded-full bg-indigo-500 px-5 py-2 text-sm font-semibold text-white transition hover:bg-indigo-400 disabled:cursor-not-allowed disabled:opacity-60"
    >
      {connecting ? "Connecting..." : "Connect Freighter"}
    </button>
  );
}
