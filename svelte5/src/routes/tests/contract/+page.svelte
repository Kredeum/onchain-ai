<script lang="ts">
  import { SmartContract } from "$lib/wagmi/classes";

  const smartContract = new SmartContract({ name: "OnChainAIv1" });

  let refresh = $state<number>();
  let data = $state();

  const smartContractCall = async () => (data = await smartContract.call({ functionName: "owner" }));

  $effect(() => {
    refresh;
    smartContractCall();
  });

  $inspect("data", data);
</script>

<div class="p-4">
  data = {smartContract.dataRead}
</div>
<div class="p-4">
  <button class="btn btn-primary" onclick={smartContractCall}>Refresh</button>
</div>
