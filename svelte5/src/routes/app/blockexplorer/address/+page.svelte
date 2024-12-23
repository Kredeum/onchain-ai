<script lang="ts">
  import { page } from "$app/stores";
  import { AddressComponent } from "$lib/scaffold-eth/components";

  const { data }: { data: { contractData: { bytecode: string; assembly: string } } } = $props();

  const { contractData } = $derived(data);
  const address = $derived($page.url.hash.slice(1));
</script>

<AddressComponent {address} {contractData} />
