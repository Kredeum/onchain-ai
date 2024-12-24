<script lang="ts">
  import { ViewEvents } from "$lib/wagmi/components";
  import { Account } from "$lib/wagmi/classes";
  import { wagmi } from "$lib/wagmi/classes";

  const account = new Account();

  $inspect("PAGE EVENTS chainId", account.chainId, wagmi.chainId);
</script>

<ViewEvents />
