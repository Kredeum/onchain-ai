import { type Address as AddressType } from "viem";
import { mainnet } from "viem/chains";
import { getEnsAddress, getEnsAvatar, getEnsName } from "@wagmi/core";

import { isAddress } from "$lib/scaffold-eth/ts";
import type { Nullable } from "$lib/wagmi/ts";
import { Address, wagmiConfig } from "$lib/wagmi/classes";

// AddressEns => ensName & ensAvatar
// Address => address & balance & symbol & decimals
class AddressEns extends Address {
  #ensName: string | null = $state(null);
  #ensAvatar: string | null = $state(null);

  #addressToName = async (): Promise<string | null> =>
    (this.#ensName = await getEnsName(wagmiConfig, { chainId: mainnet.id, address: super.address! }));

  #nameToAddress = async (): Promise<Nullable<AddressType>> =>
    (super.address = await getEnsAddress(wagmiConfig, { chainId: mainnet.id, name: this.ensName! }));

  #nameToAvatar = async (): Promise<string | null> =>
    (this.#ensAvatar = await getEnsAvatar(wagmiConfig, { chainId: mainnet.id, name: this.ensName! }));

  get address(): Nullable<AddressType> {
    if (!super.address && this.#ensName) this.#nameToAddress();
    return super.address;
  }
  set address(addr: Nullable<AddressType>) {
    super.address = addr;
  }

  get ensName(): string | null {
    if (!this.#ensName && super.address) this.#addressToName();
    return this.#ensName;
  }

  get ensAvatar(): string | null {
    if (!this.#ensAvatar && this.#ensName) this.#nameToAvatar();
    return this.#ensAvatar;
  }

  constructor(addressOrName?: AddressType | string) {
    if (isAddress(addressOrName)) {
      super(addressOrName);
      super.address = addressOrName as AddressType;
    } else {
      super();
      if (addressOrName) this.#ensName = addressOrName as string;
    }

    $inspect("<AddressEns", super.address, this.#ensName, this.#ensAvatar);
  }
}

export { AddressEns };
