<script lang="ts">
  import { createTransactor } from "$lib/scaffold-eth/runes/transactor.svelte";
  import { createAccount, createContract, createWriteContract } from "$lib/wagmi/runes";
  import { Balance } from "$lib/wagmi/classes";

  import { Banknotes, Icon } from "svelte-hero-icons";
  import { createWalletClient, http, parseUnits, zeroAddress, type Address as AddressType } from "viem";
  import { anvil } from "viem/chains";
  import { createTargetNetwork } from "$lib/scaffold-eth/runes";
  import Address from "./Address.svelte";

  let { faucetAddress: address }: { faucetAddress: AddressType } = $props();

  const { account } = $derived(createAccount());

  const { chainId, abi } = $derived.by(() => createContract("Faucet"));

  let { send, wait, waitingTxReceipt } = $derived(
    createWriteContract({
      chainId,
      address,
      abi,
      functionName: "requestSomeEther",
      args: [account.address],
      value: parseUnits("10", 15)
    })
  );

  let loading = $state(false);
  let txHash = $state<`0x${string}`>();
  let txReceipt = $state();
  const sendETH = async () => {
    // loading = true;
    txHash = await send();
    if (!txHash) return;
    console.log("handleWrite ~ txHash:", txHash);

    txReceipt = await wait(txHash);
    console.log("handleWrite ~ txReceipt:", txReceipt);
    loading = false;
  };

  let balance = new Balance({ address });
  const isBalanceZero = $derived(balance.value === 0n);
</script>

<div
  class={!isBalanceZero
    ? "ml-1"
    : "tooltip tooltip-bottom tooltip-open tooltip-secondary ml-1 font-bold before:left-auto before:right-0 before:transform-none before:content-[attr(data-tip)]"}
  data-tip="Grab funds from faucet"
>
  <button id="faucet-button" class="btn btn-secondary btn-sm rounded-full px-2" onclick={sendETH} disabled={loading}>
    {#if loading}
      <span class="loading loading-spinner loading-xs"></span>
    {:else}
      <Icon src={Banknotes} class="h-4 w-4" />
    {/if}
  </button>
</div>
