import type { ChainWithAttributes } from "$lib/scaffold-eth/ts";
import scaffoldConfig from "$lib/scaffold.config";

const _chainDefault: ChainWithAttributes = scaffoldConfig.targetNetworks[0];

const createChainId = () => ({
  get chainIdCurrent() {
    return targetNetwork.targetNetwork.id;
  },
  get chainIdDefault() {
    return _chainDefault.id;
  },
  get chainIdLocal() {
    return 31337;
  }
});

// we store this as a property so we can directly export it
const targetNetwork: { targetNetwork: ChainWithAttributes } = $state({ targetNetwork: _chainDefault });

const setTargetNetwork = (network: ChainWithAttributes) => (targetNetwork.targetNetwork = network);

const nativeCurrencyPrice = $state({ price: 0 });

const setNativeCurrencyPrice = (price: number) => (nativeCurrencyPrice.price = price);

export { createChainId, targetNetwork, nativeCurrencyPrice, setTargetNetwork, setNativeCurrencyPrice };
