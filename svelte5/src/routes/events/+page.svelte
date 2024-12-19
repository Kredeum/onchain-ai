<script lang="ts">
  import { ViewEvents } from "$lib/wagmi/components";
  import { Account, wagmiConfig } from "$lib/wagmi/classes";
  import { getChainId } from "@wagmi/core";
  import { targetNetwork } from "$lib/scaffold-eth/classes";

  const account = new Account();

  $inspect("PAGE EVENTS chainId", account.chainId,wagmiConfig.state.chainId, targetNetwork.id);
</script>

<ViewEvents />
