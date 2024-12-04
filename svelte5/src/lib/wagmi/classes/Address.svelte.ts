import { type Account, type Address as AddressType, checksumAddress } from "viem";
import { deepEqual, getBalance as getBalanceWagmi, type GetBalanceReturnType } from "@wagmi/core";

import { isAddress } from "$lib/scaffold-eth/ts";
import type { Nullable } from "$lib/wagmi/ts";
import { Account as AccountClass, wagmiConfig, Watcher } from "$lib/wagmi/classes";

// Address => address & balance & symbol & decimals
class Address {
  #address: Nullable<AddressType> = $state();

  get address(): Nullable<AddressType> {
    return this.#address;
  }
  set address(addr: Nullable<AddressType>) {
    if (!isAddress(addr)) return;

    if (this.#address !== checksumAddress(addr)) {
      this.#address = checksumAddress(addr);
    }
    this.getBalance();
  }

  #balance = $state<GetBalanceReturnType>();
  get balance() {
    return this.#balance?.value;
  }
  getBalance = async () => {
    if (!(this.address && isAddress(this.address))) return;

    const balance = await getBalanceWagmi(wagmiConfig, { address: this.address });

    if (!deepEqual($state.snapshot(this.#balance), balance)) this.#balance = balance;
    // console.log("getBalance", this.address, balance);

    return balance;
  };
  get decimals() {
    return this.#balance?.decimals;
  }
  get symbol() {
    return this.#balance?.symbol;
  }

  watcher?: Watcher;

  constructor(address?: Nullable<AddressType>, watchBalance = true) {
    console.log("<Address constructor ~ address:", address);

    if (isAddress(address)) {
      this.address = address;
      if (watchBalance) this.watcher = new Watcher(this.getBalance);
    }

    $inspect("<Address", this.#address);
  }
}

export { Address };
