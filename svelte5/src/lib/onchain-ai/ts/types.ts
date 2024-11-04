import type { Address, Log } from "viem";

type InteractionTypeTuple = [string, Address, string, string]
type InteractionType = {
  requestId: string,
  sender: Address,
  prompt: string,
  response: string,
  isResponse?: boolean
};

type InteractionLogWithArgs = Log & { args: InteractionType; index: number };
type InteractionLogsParamsType = {
  address: Address;
  abi: any;
  eventName: string;
  args?: { sender: Address };
};

export type {
  InteractionType,
  InteractionTypeTuple,
  InteractionLogWithArgs,
  InteractionLogsParamsType
};
