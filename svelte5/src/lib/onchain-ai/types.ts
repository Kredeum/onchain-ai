import type { Address, Log } from "viem";

type InteractionType = {
  requestId: string;
  sender: Address;
  isResponse: boolean;
  prompt: string;
  response: string;
};
type ReadType = [string, Address, boolean, string, string];

type LogWithArgs = Log & { args: InteractionType; index: number };

type LogsParamsType = {
  address: Address;
  abi: any;
  eventName: string;
  args?: { sender: Address };
};

export type { InteractionType, LogWithArgs, LogsParamsType, ReadType };
