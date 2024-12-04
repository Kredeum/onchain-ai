import { type Address as AddressType } from "viem";
import { getAccount, watchAccount } from "@wagmi/core";
import { AddressEns, wagmiConfig } from "$lib/wagmi/classes";
import type { Nullable } from "../ts";

type AccountType = ReturnType<typeof getAccount>;

// Account => account & chain & chainId & isConnected & connectorId
// AddressEns => ensName & ensAvatar
// Address => address & balance & symbol & decimals
//
// Account extends AddressEns extends Address
class Account extends AddressEns {
  #account = $state<Nullable<AccountType>>();

  get account(): Nullable<AccountType> {
    return this.#account;
  }
  set account(account: Nullable<AccountType>) {
    this.#account = account;
    super.address = account?.address;
  }

  get chain() {
    return this.account?.chain;
  }
  get chainId() {
    return this.account?.chainId;
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
    super();
    this.account = getAccount(wagmiConfig);

    this.watch();
    $inspect("Account account", this.account);
    $inspect("Account", this.chainId, this.address, this.connectorId);
  }
}

export { Account };
