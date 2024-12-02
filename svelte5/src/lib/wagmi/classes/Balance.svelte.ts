import { type Address } from "viem";
import { deepEqual, getBalance as getBalanceWagmi, type GetBalanceReturnType } from "@wagmi/core";
import { wagmiConfig, Watcher } from "$lib/wagmi/classes";
import { isAddress } from "$lib/scaffold-eth/ts";

// class Balance {
class Balance {
  #address = $state<Address | undefined>();
  get address() {
    return this.#address;
  }
  set address(address: Address | undefined) {
    if (this.#address !== address) {
      this.#address = address;
      this.getBalance();
    }
  }

  balance = $state<GetBalanceReturnType>();
  get value() {
    return this.balance?.value;
  }

  getBalance = async () => {
    if (!(this.address && isAddress(this.address))) return;

    const balance = await getBalanceWagmi(wagmiConfig, { address: this.address });

    if (!deepEqual($state.snapshot(this.balance), balance)) this.balance = balance;

    return balance;
  };

  watcher?: Watcher;

  constructor({ address, watchBalance = true }: { address?: Address; watchBalance?: boolean } = {}) {
    this.address = address;

    if (watchBalance) this.watcher = new Watcher(this.getBalance);

    $inspect("Balance", this.address, this.balance?.value);
  }
}
export { Balance };
