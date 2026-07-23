import {
  isConnected,
  isAllowed,
  setAllowed,
  requestAccess,
  getAddress,
  getNetwork,
  signTransaction,
} from "@stellar/freighter-api";

export const TESTNET_PASSPHRASE = "Test SDF Network ; September 2015";

export class FreighterNotInstalledError extends Error {
  constructor() {
    super("Freighter wallet extension was not detected. Install it from freighter.app to continue.");
    this.name = "FreighterNotInstalledError";
  }
}

export class WrongNetworkError extends Error {
  constructor(network: string) {
    super(`Freighter is set to "${network}". Switch it to Testnet in the Freighter extension settings.`);
    this.name = "WrongNetworkError";
  }
}

/** Requests account access from Freighter and verifies it is set to Testnet. Returns the connected public key. */
export async function connectFreighter(): Promise<string> {
  const { isConnected: connected } = await isConnected();
  if (!connected) {
    throw new FreighterNotInstalledError();
  }

  const accessResult = await requestAccess();
  if (accessResult.error) {
    throw new Error(accessResult.error.message || "Wallet access was denied.");
  }

  const { network } = await getNetwork();
  if (network !== "TESTNET") {
    throw new WrongNetworkError(network);
  }

  await setAllowed();

  return accessResult.address;
}

export async function getConnectedAddress(): Promise<string | null> {
  const { isConnected: connected } = await isConnected();
  if (!connected) return null;

  const { isAllowed: allowed } = await isAllowed();
  if (!allowed) return null;

  const { address, error } = await getAddress();
  if (error || !address) return null;
  return address;
}

export async function signXdr(transactionXdr: string, publicKey: string): Promise<string> {
  const result = await signTransaction(transactionXdr, {
    networkPassphrase: TESTNET_PASSPHRASE,
    address: publicKey,
  });
  if (result.error) {
    throw new Error(result.error.message || "Transaction signing was rejected.");
  }
  return result.signedTxXdr;
}
