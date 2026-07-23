"use client";

import { FormEvent, useState } from "react";

export default function SendForm({
  disabled,
  sending,
  onSend,
}: {
  disabled: boolean;
  sending: boolean;
  onSend: (destination: string, amount: string, memo: string) => void;
}) {
  const [destination, setDestination] = useState("");
  const [amount, setAmount] = useState("");
  const [memo, setMemo] = useState("");

  function handleSubmit(e: FormEvent) {
    e.preventDefault();
    onSend(destination.trim(), amount.trim(), memo.trim());
  }

  return (
    <form onSubmit={handleSubmit} className="rounded-2xl border border-slate-700 bg-slate-800/60 p-6">
      <p className="text-sm font-medium uppercase tracking-wide text-slate-400">Send XLM</p>

      <div className="mt-4 space-y-4">
        <div>
          <label htmlFor="destination" className="mb-1 block text-xs font-medium text-slate-400">
            Destination address
          </label>
          <input
            id="destination"
            type="text"
            required
            placeholder="G..."
            value={destination}
            onChange={(e) => setDestination(e.target.value)}
            className="w-full rounded-lg border border-slate-600 bg-slate-900 px-3 py-2 font-mono text-sm text-slate-100 outline-none focus:border-indigo-400"
          />
        </div>

        <div className="grid grid-cols-2 gap-4">
          <div>
            <label htmlFor="amount" className="mb-1 block text-xs font-medium text-slate-400">
              Amount (XLM)
            </label>
            <input
              id="amount"
              type="number"
              min="0.0000001"
              step="any"
              required
              placeholder="10"
              value={amount}
              onChange={(e) => setAmount(e.target.value)}
              className="w-full rounded-lg border border-slate-600 bg-slate-900 px-3 py-2 text-sm text-slate-100 outline-none focus:border-indigo-400"
            />
          </div>
          <div>
            <label htmlFor="memo" className="mb-1 block text-xs font-medium text-slate-400">
              Memo (optional)
            </label>
            <input
              id="memo"
              type="text"
              maxLength={28}
              placeholder="Thanks!"
              value={memo}
              onChange={(e) => setMemo(e.target.value)}
              className="w-full rounded-lg border border-slate-600 bg-slate-900 px-3 py-2 text-sm text-slate-100 outline-none focus:border-indigo-400"
            />
          </div>
        </div>

        <button
          type="submit"
          disabled={disabled || sending}
          className="w-full rounded-lg bg-indigo-500 px-4 py-2.5 text-sm font-semibold text-white transition hover:bg-indigo-400 disabled:cursor-not-allowed disabled:opacity-50"
        >
          {sending ? "Sending..." : "Send payment"}
        </button>
      </div>
    </form>
  );
}
