<script lang="ts">
  import { onMount } from "svelte";
  import { SmartContract } from "./contract.svelte";

  const contract = new SmartContract();

  let counter = $derived(contract.result("counter"));

  const refresh = () => contract.callAsync("counter");

  onMount(() => refresh());
</script>

<div class="p-4">
  <button class="btn-primary" onclick={() => refresh()}>
    #{contract.isFetching ? "??" : counter}
  </button>
</div>

<style>
  .btn-primary {
    background-color: #007bff;
    color: white;
    padding: 8px;
    font-size: 16px;
    cursor: pointer;
    border-radius: 8px;
    transition: background-color 0.3s ease;
  }

  .btn-primary:hover {
    background-color: #0056b3;
  }

  .btn-primary:active {
    background-color: #004085;
  }
</style>
