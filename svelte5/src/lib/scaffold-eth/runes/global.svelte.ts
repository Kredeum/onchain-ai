import scaffoldConfig from "$lib/scaffold.config";
import type { ChainWithAttributes } from "$lib/scaffold-eth/ts";

let _targetNetworkId: number = $state(scaffoldConfig.targetNetworks[0].id);

const createTargetNetworkId = () => ({
  get targetNetworkId() {
    return _targetNetworkId;
  },
  set targetNetworkId(newTargetNetworkId: number) {
    _targetNetworkId = newTargetNetworkId;
  }
});

// we store this as a property so we can directly export it
const targetNetwork: { targetNetwork: ChainWithAttributes } = $state({
  targetNetwork: scaffoldConfig.targetNetworks[0]
});

const setTargetNetwork = (newTargetNetwork: ChainWithAttributes) => {
  targetNetwork.targetNetwork = newTargetNetwork;
  _targetNetworkId = newTargetNetwork.id;
};

const nativeCurrencyPrice = $state({ price: 0 });

const setNativeCurrencyPrice = (price: number) => {
  nativeCurrencyPrice.price = price;
};

export { createTargetNetworkId, targetNetwork, nativeCurrencyPrice, setTargetNetwork, setNativeCurrencyPrice };
