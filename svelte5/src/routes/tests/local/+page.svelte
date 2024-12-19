<script lang="ts">
  import { targetNetwork } from "$lib/scaffold-eth/classes";
  import { Account, wagmiConfig } from "$lib/wagmi/classes";
  import { getChainId } from "@wagmi/core";

  const account = new Account();
  let chainId = $state(getChainId(wagmiConfig));
  let chainId2 = $derived(getChainId(wagmiConfig));

</script>

<div class="p-4">
  account.chainId = {account.chainId}
</div>

<div class="p-4">
  targetNetwork.id = {targetNetwork.id}
</div>

<div class="p-4">
  wagmiConfig.state.chainId = {wagmiConfig.state.chainId}
</div>

<hr/>

<div class="p-4">
  <button class="btn btn-info" onclick={() => (chainId = getChainId(wagmiConfig))}> Refresh </button>
</div>

<div class="p-4">
  chainId = {chainId}
</div>

<hr/>

<div class="p-4">
  getChainId(wagmiConfig) = {getChainId(wagmiConfig)}
</div>

<div class="p-4">
  chainId2 = {chainId2}
</div>
