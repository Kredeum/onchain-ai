import scaffoldConfig from "$lib/scaffold.config";
import type { ChainWithAttributes } from "$lib/scaffold-eth/ts";

const _chainIdDefault: number = scaffoldConfig.targetNetworks[0].id;
let _chainIdCurrent: number = $state(_chainIdDefault);

const createChainId = () => ({
  get chainIdCurrent() {
    return _chainIdCurrent;
  },
  get chainIdDefault() {
    return _chainIdDefault;
  },
  get chainIdLocal() {
    return 31337;
  }
});

// we store this as a property so we can directly export it
const targetNetwork: { targetNetwork: ChainWithAttributes } = $state({
  targetNetwork: scaffoldConfig.targetNetworks[0]
});

const setTargetNetwork = (newTargetNetwork: ChainWithAttributes) => {
  targetNetwork.targetNetwork = newTargetNetwork;
  _chainIdCurrent = newTargetNetwork.id;
};

const nativeCurrencyPrice = $state({ price: 0 });

const setNativeCurrencyPrice = (price: number) => {
  nativeCurrencyPrice.price = price;
};

export { createChainId, targetNetwork, nativeCurrencyPrice, setTargetNetwork, setNativeCurrencyPrice };
