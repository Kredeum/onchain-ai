import type { WatchBlockNumberReturnType, GetPublicClientReturnType as WagmiPublicClient } from "@wagmi/core";
import { Client } from "$lib/wagmi/runes";

class BlockNumber {
  latest: number | undefined = $state();

  client: WagmiPublicClient | undefined = $state();

  fetch = async () => (this.latest = Number(await this.client?.getBlockNumber()));

  watching = $state(false);

  unwatch: WatchBlockNumberReturnType | undefined;

  watch = () => {
    if (this.watching) return;

    this.watching = true;
    const unwatch = this.client?.watchBlockNumber({
      emitOnBegin: true,
      onBlockNumber: (latest) => (this.latest = Number(latest))
    });

    this.unwatch = () => {
      this.watching = false;
      unwatch?.();
    };
  };

  constructor({ watch = true }: { watch?: boolean } = {}) {
    ({ publicClient: this.client } = new Client());
    this.fetch();

    if (watch) this.watch();
  }
}
export { BlockNumber };
