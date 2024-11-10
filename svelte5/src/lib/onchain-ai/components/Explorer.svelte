<script lang="ts">
  import { createTargetNetworkId } from "$lib/scaffold-eth/runes";
  import { readConfig } from "@onchain-ai/common";
  const { txHash = "", address = "", requestId = "" } = $props();

  const { targetNetworkId: chainId } = $derived.by(createTargetNetworkId);
  const config = $derived(readConfig(chainId));

  const etherscanLinkAddress = $derived(address ? `${config.explorer}/address/${address}` : "");
  const etherscanLinkTx = $derived(txHash ? `${config.explorer}/tx/${txHash}` : "");

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
