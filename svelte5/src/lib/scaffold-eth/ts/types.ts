import type { Config } from "@wagmi/core";
import type { Readable } from "svelte/store";

export type ConfigParameter<config extends Config = Config> = {
  config?: Config | config | undefined;
};

export type EnabledParameter = {
  enabled?: boolean | undefined;
};

export type FuncOrVal<T> = T | (() => T);
export const resolveVal = <T>(val: FuncOrVal<T>): T => (val instanceof Function ? val() : val);
export type ParamType<T> = T extends FuncOrVal<infer U> ? U : never;

export type RuneReturnType<T> = () => T;

export type RuneReturnTypeToStore<T> = T extends RuneReturnType<infer U> ? Readable<U> : never;

export type Evaluate<type> = { [key in keyof type]: type[key] } & unknown;
