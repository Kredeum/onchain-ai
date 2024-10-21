import type { Address, Log } from "viem";

type InteractionType = {
  requestId: string;
  sender: Address;
  isResponse: boolean;
  prompt: string;
  response: string;
};
type ReadType = [string, Address, boolean, string, string];

type LogWithArgs = Log & { args: InteractionType, index: number };

export type { InteractionType, LogWithArgs, ReadType };
