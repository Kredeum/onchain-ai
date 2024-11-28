import { getAccount, watchAccount } from "@wagmi/core";
import { wagmiConfig } from "$lib/wagmi/ts";

const createAccount = () => {
  let account = $state(getAccount(wagmiConfig));
  watchAccount(wagmiConfig, {
    onChange: (newAccount) => {
      account = newAccount;
    }
  });

  // $inspect("createAccount account", account);

  return {
    get account() {
      return account;
    }
  };
};

export { createAccount };
