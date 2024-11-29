import { getAccount, watchAccount } from "@wagmi/core";
import { wagmiConfig } from "$lib/wagmi/classes";

type AccountType = ReturnType<typeof getAccount>;

class Account {
  account = $state<AccountType>(getAccount(wagmiConfig));

  chain = $derived(this.account.chain);
  chainId = $derived(this.account.chainId);
  address = $derived(this.account.address);
  isConnected = $derived(this.account.isConnected);
  connectorId = $derived(this.account.connector?.id);

  watch = () =>
    watchAccount(wagmiConfig, {
      onChange: (newAccount: AccountType) => (this.account = newAccount)
    });

  constructor(label?: string) {
    $inspect("Account", label, this.chainId, this.address, this.connectorId);

    this.watch();
  }
}

export { Account };
