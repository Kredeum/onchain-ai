import type { ConfigParameter, FuncOrVal, RuneReturnType } from "../ts/types";
import { getAccount, watchAccount, type Config, type GetAccountReturnType } from "@wagmi/core";
import { createConfig } from "./config.svelte";

const createAccount = () => {
  const config = $derived.by(createConfig());
  let account = $state(getAccount(config));

  let unsubscribe: (() => void) | undefined;
  $effect(() => {
    unsubscribe?.();
    unsubscribe = watchAccount(config, {
      onChange: (newAccount) => {
        account = newAccount;
      }
    });
  });

  return {
    get account() {
      return account;
    }
  };
};

export { createAccount };
