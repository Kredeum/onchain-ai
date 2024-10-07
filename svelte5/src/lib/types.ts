/* eslint-disable @typescript-eslint/no-explicit-any */
import { type EIP1193Provider } from "viem";

type GetContractReturnGenericType = {
	read: {
		[functionName: string]: (...args: any[]) => Promise<any>;
	};
	simulate: {
		[functionName: string]: (...args: any[]) => Promise<any>;
	};
	estimateGas: {
		[functionName: string]: (...args: any[]) => Promise<any>;
	};
	createEventFilter: {
		[eventName: string]: (...args: any[]) => any;
	};
	getEvents: {
		[eventName: string]: (...args: any[]) => Promise<any>;
	};
	watchEvent: {
		[eventName: string]: (...args: any[]) => any;
	};
	write: {
		[functionName: string]: (...args: any[]) => Promise<any>;
	};
	address: string; // The contract address
	abi: any[]; // The contract ABI
};

type WindowEthereum = Window & typeof globalThis & { ethereum: EIP1193Provider };

export type { GetContractReturnGenericType, WindowEthereum };
