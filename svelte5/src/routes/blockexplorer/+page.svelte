<script lang="ts">
	import { createFetchBlocks } from "$lib/runes/fetchBlocks.svelte";
	import PaginationButton from "../../lib/components/blockexplorer/PaginationButton.svelte";
	import SearchBar from "../../lib/components/blockexplorer/SearchBar.svelte";
	import TransactionsTable from "../../lib/components/blockexplorer/TransactionsTable.svelte";

	const { blocks, transactionReceipts, currentPage, totalBlocks, setCurrentPage } =
		$derived.by(createFetchBlocks());
</script>

<div class="container mx-auto my-10">
	<SearchBar />
	<TransactionsTable {blocks} {transactionReceipts} />
	<PaginationButton {currentPage} totalItems={Number(totalBlocks)} {setCurrentPage} />
</div>
