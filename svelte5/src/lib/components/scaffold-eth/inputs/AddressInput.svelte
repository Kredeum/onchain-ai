<script lang="ts">
  import { isAddress, type Address } from "viem";
  import { isEns, type CommonInputProps } from "./utils";
  import InputBase from "./InputBase.svelte";
  import { createEnsAddress, createEnsName, createEnsAvatar } from "$lib/wagmi/runes";
  import { blo } from "blo";
  import { normalize } from "viem/ens";

  let {
    value = $bindable(),
    address = $bindable(),
    name,
    placeholder,
    onchange,
    disabled
  }: CommonInputProps<Address | string> & {
    address?: string | undefined;
    ens?: string | undefined;
  } = $props();

  const { ensAddress } = $derived(
    isEns(value) ? createEnsAddress(value) : { ensAddress: "0x" } //
  );

  const { ensName } = $derived(
    isAddress(value)
      ? createEnsName(value)
      : isAddress(ensAddress)
        ? createEnsName(ensAddress)
        : { ensName: "" }
  );
  const { ensAvatar } = $derived(
    ensName ? createEnsAvatar(ensName) : { ensAvatar: "" } //
  );

  $effect(() => {
    address = isAddress(value) ? value : isAddress(ensAddress) ? ensAddress : undefined;
    if (address && isAddress(address)) value = address;
  });

  const handleChange = (newValue: Address | string) => {
    onchange?.(newValue);
  };

  const reFocus = $derived(!(isAddress(value) || isAddress(ensAddress)));

  $inspect("$effect ~ value:", value);
  $inspect("ensName:", ensName);
  $inspect("ensAvatar:", ensAvatar);
  $inspect("ensAddress:", ensAddress);
</script>

<InputBase
  bind:value={value as Address}
  {name}
  {placeholder}
  error={ensAddress === null}
  onchange={handleChange}
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
