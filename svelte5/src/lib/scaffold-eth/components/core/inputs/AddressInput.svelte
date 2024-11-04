<script lang="ts">
  import { blo } from "blo";
  import { type Address } from "viem";
  import { isAddress, isEns, type CommonInputProps } from "$lib/scaffold-eth/ts";
  import { createEnsAddress, createEnsName, createEnsAvatar } from "$lib/wagmi/runes";
  import InputBase from "./InputBase.svelte";
  import { untrack } from "svelte";

  let {
    value = $bindable(),
    name,
    placeholder,
    onchange,
    disabled
  }: CommonInputProps<Address | string> & {
    ens?: string | undefined;
  } = $props();

  const { ensName: ensNameFromValue } = $derived(createEnsName(value));
  const { ensAddress: ensAddressFromValue } = $derived(createEnsAddress(value));
  const validEnsNameFromValue = $derived(isEns(ensNameFromValue));
  const validEnsAddressFromValue = $derived(isAddress(ensAddressFromValue));

  const ensName = $derived(validEnsAddressFromValue ? value : ensNameFromValue);
  const ensAddress = $derived(validEnsNameFromValue ? ensAddressFromValue : null);
  const { ensAvatar } = $derived(ensName ? createEnsAvatar(ensName) : { ensAvatar: null });

  $effect(() => {
    if (validEnsAddressFromValue) value = ensAddressFromValue!;
  });

  $effect(() => {
    if (isAddress(value)) onchange?.(value);
  });

  const reFocus = $derived(isAddress(value));

  $inspect("AddressInput ~ value:", value);
</script>

<InputBase
  bind:value={value as Address}
  {name}
  {placeholder}
  error={ensAddress === null}
  {disabled}
  {reFocus}
>
  {#snippet prefix()}
    {#if ensName}
      <div class="flex items-center rounded-l-full bg-base-300">
        {#if ensAvatar}
          <span class="w-[35px]">
            <img class="w-full rounded-full" src={ensAvatar} alt="{ensAddress} avatar" />
          </span>
        {:else}
          <div class="skeleton h-[35px] w-[35px] shrink-0 rounded-full bg-base-200"></div>
        {/if}
        <span class="px-2 text-accent">{ensName}</span>
      </div>
    {/if}
  {/snippet}
  {#snippet suffix()}
    {#if value}
      <img alt="" class="!rounded-full" src={blo(value as Address)} width="35" height="35" />
    {/if}
  {/snippet}
</InputBase>
