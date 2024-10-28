import type { Config, ResolvedRegister } from "@wagmi/core";
import { getContext } from "svelte";
import { resolveVal, type ConfigParameter, type FuncOrVal, type RuneReturnType } from "../types";

type CreateConfigParameters<config extends Config = Config> = FuncOrVal<ConfigParameter<config>>;
type CreateConfigReturnType<config extends Config = Config> = RuneReturnType<config>;

const createConfig = <config extends Config = ResolvedRegister["config"]>(
  parameters: CreateConfigParameters<config> = {}
): CreateConfigReturnType => {
  const { config: providerConfig } = getContext<{ config: Config }>("wagmi");

  if (!providerConfig) throw new Error("createConfig failed");

  const config = $derived(resolveVal(parameters).config ?? providerConfig);

  return () => config;
};

export { createConfig };
