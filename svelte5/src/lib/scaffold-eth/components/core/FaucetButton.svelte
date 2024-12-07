<script lang="ts">
  import { createTransactor } from "$lib/scaffold-eth/runes/transactor.svelte";
  import { Account } from "$lib/wagmi/classes";

  import { Banknotes, Icon } from "svelte-hero-icons";
  import { createWalletClient, http, parseEther } from "viem";
  import { anvil } from "viem/chains";
  import { Address } from "$lib/wagmi/classes";

  const AMOUNT_TO_SEND = "1";
  const FAUCET_ADDRESS = "0xf39Fd6e51aad88F6F4ce6aB8827279cffFb92266";

  const account = new Account();

  const localWalletClient = createWalletClient({
    chain: anvil,
    transport: http()
  });

  const faucetTxn = $derived.by(createTransactor(() => localWalletClient));

  let addr = new Address(FAUCET_ADDRESS, true);

  const isBalanceZero = $derived(addr.balance === 0n);

  let loading = $state(false);

  const sendETH = async () => {
    try {
      loading = true;
      await faucetTxn({
        chain: anvil,
        account: FAUCET_ADDRESS,
        to: account.address,
        value: parseEther(AMOUNT_TO_SEND)
      });
      loading = false;
    } catch (error) {
      console.error("⚡️ ~ file: FaucetButton.tsx:sendETH ~ error", error);
      loading = false;
    }
  };
</script>

{#if account.chainId === anvil.id}
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
{/if}
