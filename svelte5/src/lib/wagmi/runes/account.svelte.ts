import { getAccount, watchAccount } from "@wagmi/core";
import { createConfig } from "$lib/wagmi/runes";

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

  // $inspect("createAccount account", account);

  return {
    get account() {
      return account;
    }
  };
};

export { createAccount };
