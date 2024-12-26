<script lang="ts">
  import { ViewEvents } from "@kredeum/wagmi-svelte5";
  import { Account } from "@kredeum/wagmi-svelte5";
  import { wagmi } from "@kredeum/wagmi-svelte5";

  const account = new Account();

  $inspect("PAGE EVENTS chainId", account.chainId, wagmi.chainId);
</script>

<ViewEvents />
