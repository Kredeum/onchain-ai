import {
	type Address,
	type Chain,
	createPublicClient,
	createWalletClient,
	getContract,
	custom
} from "viem";
import type { WindowEthereum } from "./types";

import addresses from "@scaffold-eth-alt/foundry/addresses.json";
import { abi } from "@scaffold-eth-alt/foundry/out/Counter.sol/Counter.json";

const counter = async (chain: Chain) => {
	if (!window) throw new Error("Not in browser");

	const windowEthereum = (window as WindowEthereum).ethereum;
	if (!windowEthereum) throw new Error("Ethereum Wallet extension not found");

	const address = addresses[11155111]["Counter"] as Address;

	const publicClient = createPublicClient({ chain, transport: custom(windowEthereum) });

	const [account] = await windowEthereum.request({ method: "eth_requestAccounts" });
	const walletClient = createWalletClient({ account, chain, transport: custom(windowEthereum) });

	const contract = getContract({
		address,
		abi,
		client: { public: publicClient, wallet: walletClient }
	});

	return { contract, publicClient, walletClient };
};

export { counter };
