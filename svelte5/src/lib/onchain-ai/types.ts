import type { Address, Log } from "viem";

type EntriesToObject<E extends [PropertyKey, any][]> = {
  [K in E[number] as K[0]]: K[1];
};

type EntriesToTuple<E extends [PropertyKey, any][]> = {
  [I in keyof E]: E[I][1];
} extends infer U
  ? { [K in keyof U]: U[K] }
  : never;

type InteractionTypeOrdered = [
  ["requestId", string],
  ["sender", Address],
  ["isResponse", boolean],
  ["prompt", string],
  ["response", string]
];
type InteractionType = EntriesToObject<InteractionTypeOrdered>;
type InteractionTypeTuple = EntriesToTuple<InteractionTypeOrdered>;

type LogWithArgs = Log & { args: InteractionType; index: number };

type LogsParamsType = {
  address: Address;
  abi: any;
  eventName: string;
  args?: { sender: Address };
};

export type { InteractionType, InteractionTypeTuple, LogWithArgs, LogsParamsType };
