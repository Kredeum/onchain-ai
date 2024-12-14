<script lang="ts">
  import { Counter } from "$lib/onchain-ai/classes";

  const contract = new Counter();
</script>

<div class="p-4">
  <button class="btn btn-primary" onclick={() => contract.increment()}>
    {contract.isFetching ? "??" : contract.number}
  </button>
</div>

<div class="p-4">
  <button class="btn btn-primary">
    3² = {contract.square(3)}
  </button>
</div>

<div class="p-4">
  <button class="btn btn-primary" onclick={() => contract.setNumber(42)}> setNumber to 42 </button>
</div>
