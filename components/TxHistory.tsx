"use client";

import type { SimpleTransaction } from "@/lib/stellar";

export default function TxHistory({
  transactions,
  loading,
}: {
  transactions: SimpleTransaction[];
  loading: boolean;
}) {
  return (
    <div className="rounded-2xl border border-slate-700 bg-slate-800/60 p-6">
      <p className="text-sm font-medium uppercase tracking-wide text-slate-400">Recent activity</p>

      {loading ? (
        <p className="mt-3 text-sm text-slate-500">Loading...</p>
      ) : transactions.length === 0 ? (
        <p className="mt-3 text-sm text-slate-500">No transactions yet.</p>
      ) : (
        <ul className="mt-3 divide-y divide-slate-700">
          {transactions.map((tx) => (
            <li key={tx.id} className="flex items-center justify-between py-3 text-sm">
              <div>
                <span
                  className={`mr-2 rounded-full px-2 py-0.5 text-xs font-medium ${
                    tx.successful
                      ? "bg-emerald-900/60 text-emerald-300"
                      : "bg-red-900/60 text-red-300"
                  }`}
                >
                  {tx.successful ? "success" : "failed"}
                </span>
                <span className="text-slate-400">{new Date(tx.createdAt).toLocaleString()}</span>
              </div>
              <a
                href={`https://stellar.expert/explorer/testnet/tx/${tx.hash}`}
                target="_blank"
                rel="noopener noreferrer"
                className="font-mono text-xs text-indigo-300 underline hover:text-indigo-200"
              >
                {tx.hash.slice(0, 8)}...
              </a>
            </li>
          ))}
        </ul>
      )}
    </div>
  );
}
