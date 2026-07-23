import { Horizon, Networks, TransactionBuilder, Operation, Asset, BASE_FEE, Memo } from "@stellar/stellar-sdk";

export const NETWORK_PASSPHRASE = Networks.TESTNET;
export const HORIZON_URL = "https://horizon-testnet.stellar.org";
export const FRIENDBOT_URL = "https://friendbot.stellar.org";

export const server = new Horizon.Server(HORIZON_URL);

export interface SimpleTransaction {
  id: string;
  hash: string;
  createdAt: string;
  sourceAccount: string;
  successful: boolean;
  operationCount: number;
}

/** Returns the native XLM balance for an account, or null if the account does not exist on the network yet. */
export async function getXlmBalance(publicKey: string): Promise<string | null> {
  try {
    const account = await server.loadAccount(publicKey);
    const native = account.balances.find((b) => b.asset_type === "native");
    return native ? native.balance : "0";
  } catch (err: unknown) {
    if (isNotFoundError(err)) return null;
    throw err;
  }
}

export async function getRecentTransactions(publicKey: string, limit = 5): Promise<SimpleTransaction[]> {
  try {
    const page = await server
      .transactions()
      .forAccount(publicKey)
      .order("desc")
      .limit(limit)
      .call();

    return page.records.map((tx) => ({
      id: tx.id,
      hash: tx.hash,
      createdAt: tx.created_at,
      sourceAccount: tx.source_account,
      successful: tx.successful,
      operationCount: tx.operation_count,
    }));
  } catch (err: unknown) {
    if (isNotFoundError(err)) return [];
    throw err;
  }
}

export async function buildPaymentTransaction(params: {
  sourcePublicKey: string;
  destinationPublicKey: string;
  amount: string;
  memo?: string;
}): Promise<string> {
  const { sourcePublicKey, destinationPublicKey, amount, memo } = params;

  const sourceAccount = await server.loadAccount(sourcePublicKey);

  const builder = new TransactionBuilder(sourceAccount, {
    fee: BASE_FEE,
    networkPassphrase: NETWORK_PASSPHRASE,
  })
    .addOperation(
      Operation.payment({
        destination: destinationPublicKey,
        asset: Asset.native(),
        amount,
      })
    )
    .setTimeout(180);

  if (memo) {
    builder.addMemo(Memo.text(memo));
  }

  const transaction = builder.build();
  return transaction.toXDR();
}

export async function submitSignedTransaction(signedXdr: string) {
  const transaction = TransactionBuilder.fromXDR(signedXdr, NETWORK_PASSPHRASE);
  return server.submitTransaction(transaction);
}

export async function fundWithFriendbot(publicKey: string): Promise<void> {
  const response = await fetch(`${FRIENDBOT_URL}?addr=${encodeURIComponent(publicKey)}`);
  if (!response.ok) {
    throw new Error("Friendbot funding failed. The account may already be funded.");
  }
}

function isNotFoundError(err: unknown): boolean {
  return (
    typeof err === "object" &&
    err !== null &&
    "response" in err &&
    (err as { response?: { status?: number } }).response?.status === 404
  );
}
