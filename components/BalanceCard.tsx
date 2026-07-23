"use client";

export default function BalanceCard({
  balance,
  loading,
  unfunded,
  onRefresh,
  onFund,
  funding,
}: {
  balance: string | null;
  loading: boolean;
  unfunded: boolean;
  onRefresh: () => void;
  onFund: () => void;
  funding: boolean;
}) {
  return (
    <div className="rounded-2xl border border-slate-700 bg-slate-800/60 p-6">
      <div className="flex items-center justify-between">
        <p className="text-sm font-medium uppercase tracking-wide text-slate-400">Balance</p>
        <button
          onClick={onRefresh}
          disabled={loading}
          className="text-xs font-medium text-indigo-300 transition hover:text-indigo-200 disabled:opacity-50"
        >
          {loading ? "Refreshing..." : "Refresh"}
        </button>
      </div>

      {unfunded ? (
        <div className="mt-3 space-y-3">
          <p className="text-sm text-amber-300">
            This account doesn&apos;t exist on Testnet yet. Fund it with Friendbot to get started.
          </p>
          <button
            onClick={onFund}
            disabled={funding}
            className="rounded-lg bg-amber-500 px-4 py-2 text-sm font-semibold text-slate-900 transition hover:bg-amber-400 disabled:cursor-not-allowed disabled:opacity-60"
          >
            {funding ? "Funding..." : "Fund with Friendbot"}
          </button>
        </div>
      ) : (
        <p className="mt-2 text-4xl font-semibold text-white">
          {balance ?? "—"} <span className="text-lg font-normal text-slate-400">XLM</span>
        </p>
      )}
    </div>
  );
}
