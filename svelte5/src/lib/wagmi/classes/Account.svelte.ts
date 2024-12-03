import {
  deepEqual,
  getAccount,
  watchAccount,
  getBalance as getBalanceWagmi,
  type GetBalanceReturnType
} from "@wagmi/core";
import { Balance, wagmiConfig } from "$lib/wagmi/classes";
import { isAddress } from "$lib/scaffold-eth/ts";

type AccountType = ReturnType<typeof getAccount>;

class Account {
  account = $state<AccountType>(getAccount(wagmiConfig));

  get chain() {
    return this.account?.chain;
  }
  get chainId() {
    return this.account?.chainId;
  }
  get address() {
    return this.account?.address;
  }
  get isConnected() {
    return this.account?.isConnected;
  }
  get connectorId() {
    return this.account?.connector?.id;
  }

  watch = () =>
    watchAccount(wagmiConfig, {
      onChange: (newAccount: AccountType) => (this.account = newAccount)
    });

  constructor() {
    this.watch();

    // $inspect("Account", this.chainId, this.address, this.connectorId);
  }
}

export { Account };
