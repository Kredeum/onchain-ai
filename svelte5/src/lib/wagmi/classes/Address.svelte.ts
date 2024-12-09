import { type Address as AddressType, checksumAddress } from "viem";
import { deepEqual, getBalance as getBalanceWagmi, type GetBalanceReturnType } from "@wagmi/core";

import { isAddress, isEns } from "$lib/scaffold-eth/ts";
import type { Nullable } from "$lib/wagmi/ts";
import { Account as AccountClass, wagmiConfig, Watcher } from "$lib/wagmi/classes";
import { getEnsAddress, getEnsAvatar, getEnsName } from "@wagmi/core";
import { mainnet } from "viem/chains";

class Address {
  watcher: Nullable<Watcher>;
  #address = $state<Nullable<AddressType>>();
  #balance = $state<Nullable<GetBalanceReturnType>>();
  #ensName = $state<Nullable<string>>();
  #ensAvatar = $state<Nullable<string>>();

  #reset = () => {
    this.watcher?.stop();
    this.#address = null;
    this.#balance = null;
    this.#ensName = null;
    this.#ensAvatar = null;
  };

  #getAndWatchBalance = () => {
    this.#getBalance();

    console.log("#getAndWatchBalance:", Boolean(this.watcher));
    this.watcher?.restart(this.#getBalance);
  };
  #getBalance = async () => {
    if (!(this.address && isAddress(this.address))) return;

    const balance = await getBalanceWagmi(wagmiConfig, { address: this.address });
    if (!deepEqual($state.snapshot(this.#balance), balance)) this.#balance = balance;
  };

  #setAddressPlus = async (address: AddressType, ens = true) => {
    this.#address = address;
    if (ens) {
      const ensName = address ? await getEnsName(wagmiConfig, { chainId: mainnet.id, address }) : null;
      this.#ensName = ensName;
      this.#ensAvatar = ensName ? await getEnsAvatar(wagmiConfig, { chainId: mainnet.id, name: ensName }) : null;
    } else {
      this.#ensName = null;
      this.#ensAvatar = null;
    }
  };
  #setEnsNamePlus = async (ensName: string) => {
    this.#ensName = ensName;
    this.#ensAvatar = await getEnsAvatar(wagmiConfig, { chainId: mainnet.id, name: ensName });
    this.#address = await getEnsAddress(wagmiConfig, { chainId: mainnet.id, name: ensName });
  };

  setAddressOrName = (addressOrName: AddressType | string) => {
    if (isAddress(addressOrName)) {
      this.address = addressOrName;
    } else if (isEns(addressOrName)) {
      this.ensName = addressOrName as string;
    } else {
      this.#reset();
    }
  };
  set address(addr: AddressType) {
    const checkSumAddr = isAddress(addr) ? checksumAddress(addr as AddressType) : addr;

    // let noChange = false;
    // untrack(() => (noChange = this.#address === checkSumAddr));
    // if (noChange) return;

    if (!isAddress(checkSumAddr)) this.#reset();

    this.#setAddressPlus(checkSumAddr!);
    this.#getAndWatchBalance();
  }
  set ensName(ensName: string) {
    if (this.#ensName === ensName) return;
    if (!isEns(ensName)) this.#reset();

    this.#setEnsNamePlus(ensName!);
    this.#getAndWatchBalance();
  }

  get address(): Nullable<AddressType> {
    return this.#address;
  }
  get ensName(): Nullable<string> {
    return this.#ensName;
  }
  get ensAvatar(): Nullable<string> {
    return this.#ensAvatar;
  }
  get balance() {
    return this.#balance?.value;
  }
  get decimals() {
    return this.#balance?.decimals;
  }
  get symbol() {
    return this.#balance?.symbol;
  }

  constructor(addressOrName?: Nullable<AddressType | string>, watchBalance = false) {
    // console.log("<Address constructor", addressOrName);

    if (watchBalance) this.watcher = new Watcher();
    if (addressOrName) this.setAddressOrName(addressOrName);

    // $inspect("<Address", this.address, this.ensName);
  }
}

export { Address };
