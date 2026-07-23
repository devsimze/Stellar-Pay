"use client";

export interface TxResultData {
  status: "success" | "error";
  message: string;
  hash?: string;
}

export default function TxResult({ result }: { result: TxResultData | null }) {
  if (!result) return null;

  const isSuccess = result.status === "success";

  return (
    <div
      className={`rounded-2xl border p-4 ${
        isSuccess
          ? "border-emerald-600/50 bg-emerald-950/40"
          : "border-red-600/50 bg-red-950/40"
      }`}
    >
      <p className={`text-sm font-semibold ${isSuccess ? "text-emerald-300" : "text-red-300"}`}>
        {isSuccess ? "Transaction successful" : "Transaction failed"}
      </p>
      <p className="mt-1 text-sm text-slate-300 break-words">{result.message}</p>
      {result.hash && (
        <a
          href={`https://stellar.expert/explorer/testnet/tx/${result.hash}`}
          target="_blank"
          rel="noopener noreferrer"
          className="mt-2 inline-block break-all font-mono text-xs text-indigo-300 underline hover:text-indigo-200"
        >
          {result.hash}
        </a>
      )}
    </div>
  );
}
