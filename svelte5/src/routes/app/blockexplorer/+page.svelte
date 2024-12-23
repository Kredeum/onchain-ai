<script lang="ts">
  import { createFetchBlocks } from "$lib/scaffold-eth/runes/fetchBlocks.svelte";
  import { PaginationButton, SearchBar, TransactionsTable } from "$lib/scaffold-eth/components";

  const { blocks, transactionReceipts, currentPage, totalBlocks, setCurrentPage } = $derived.by(createFetchBlocks());
</script>

<div class="container mx-auto my-10">
  <SearchBar />
  <TransactionsTable {blocks} {transactionReceipts} />
  <PaginationButton {currentPage} totalItems={Number(totalBlocks)} {setCurrentPage} />
</div>
