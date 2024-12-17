<script lang="ts">
  import { blo } from "blo";
  import { isAddress, type Address as AddressType } from "viem";
  import { type CommonInputProps } from "$lib/scaffold-eth/ts";
  import { isEns } from "$lib/wagmi/ts";

  import { InputBase } from "$lib/scaffold-eth/components";
  import { Address } from "$lib/wagmi/classes";

  let {
    value = $bindable(),
    name,
    placeholder,
    onchange,
    disabled
  }: CommonInputProps<AddressType | string> & {
    ens?: string | undefined;
  } = $props();

  const addr = new Address(value);
  $effect(() => {
    addr.setAddressOrName(value);
    if (addr.address && value === addr.ensName) value = addr.address;
  });

  const reFocus = $derived(isAddress(value));

  // $inspect("<AddressInput", value);
  // $inspect("<AddressInput", value, addr.address, addr.ensName, addr.ensAvatar);
</script>

<InputBase
  {name}
  bind:value={value as AddressType}
  {placeholder}
  error={addr.address == null}
  {onchange}
  {disabled}
  {reFocus}
>
  {#snippet prefix()}
    {#if addr.ensName}
      <div class="flex items-center rounded-l-full bg-base-300">
        {#if addr.ensAvatar}
          <span class="w-[35px]">
            <img class="w-full rounded-full" src={addr.ensAvatar} alt="{addr.address} avatar" />
          </span>
        {:else}
          <div class="skeleton h-[35px] w-[35px] shrink-0 rounded-full bg-base-200"></div>
        {/if}
        <span class="px-2 text-accent">{addr.ensName}</span>
      </div>
    {/if}
  {/snippet}
  {#snippet suffix()}
    {#if value}
      <img alt="" class="!rounded-full" src={blo(value as AddressType)} width="35" height="35" />
    {/if}
  {/snippet}
</InputBase>
