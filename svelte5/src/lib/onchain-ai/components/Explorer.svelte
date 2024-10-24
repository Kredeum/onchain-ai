<script lang="ts">
  import { createOnchainAI } from "../runes/contract.svelte";

  const { tx = "", address = "", requestId = "" } = $props();

  const { config } = $derived.by(createOnchainAI);

  const etherscanLinkAddress = $derived(address ? `${config.explorer}/address/${address}` : "");
  const etherscanLinkTx = $derived(tx ? `${config.explorer}/tx/${tx}` : "");

  const chainlinkLink = $derived(
    `https://functions.chain.link/${config.chainName}/${config.subscriptionId}` +
      (requestId ? `#/side-drawer/request/${requestId}` : "")
  );
</script>

<div class="text-gray-300">
  view
  {#if etherscanLinkAddress}
    <a href={etherscanLinkAddress} target="_blank">
      <em>contract</em>
    </a>,
  {/if}
  {#if etherscanLinkTx}
    <a href={etherscanLinkTx} target="_blank">
      <em>last transaction</em>
    </a>,
  {/if}
  <a href={chainlinkLink} target="_blank"> <em>chainlink</em></a>
</div>
