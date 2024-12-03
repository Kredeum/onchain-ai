import { type Account, type Address } from "viem";
import { deepEqual, getBalance as getBalanceWagmi, type GetBalanceReturnType } from "@wagmi/core";
import { Account as AccountClass, wagmiConfig, Watcher } from "$lib/wagmi/classes";
import { isAddress } from "$lib/scaffold-eth/ts";

// class Balance {
class Balance {
  #address = $state<Address | undefined>();
  get address() {
    return this.#address;
  }
  set address(address: Address | undefined) {
    if (this.#address !== address) this.#address = address;
    this.getBalance();
  }

  balance = $state<GetBalanceReturnType>();
  get value() {
    return this.balance?.value;
  }

  getBalance = async () => {
    if (!(this.address && isAddress(this.address))) return;

    const balance = await getBalanceWagmi(wagmiConfig, { address: this.address });

    if (!deepEqual($state.snapshot(this.balance), balance)) this.balance = balance;
    // console.log("getBalance", this.address, balance);

    return balance;
  };

  watcher?: Watcher;

  constructor(param?: Address | Account | AccountClass, watchBalance = true) {
    if (param) {
      const paramIsAddress = typeof param === "string";
      const paramIsAccount = typeof param === "object" && typeof param.address === "string";

      this.address = paramIsAddress ? param : paramIsAccount ? param.address : param.account.address;

      if (watchBalance) this.watcher = new Watcher(this.getBalance);
    }
    console.log("BALANCE", this.address);

    $inspect("BALANCE", this.address, this.balance?.value, this.watcher?.id);
  }
}

export { Balance };
