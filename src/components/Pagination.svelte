<script>
  export let lastpage = 1
  export let query = {}
	import { qs } from '../lib/helpers'
	$: currentpage = (query.p || 1)
	$: pagearray = [...Array(lastpage).keys()]
</script>

<style>
	.pages {
		display: flex;
		flex-wrap: wrap;
		justify-content: center;
	}
	a, span {
		display: block;
		padding: 5px;
		border-radius: 5px;
		text-decoration: none;
		margin-right: 8px;
		width: 46px;
		line-height: 34px;
		text-align: center;
	}
	span {
		font-weight: bold;
	}
	.pages :last-child {
		margin-right: 0px;
	}
</style>

<div class="pages">
	{#if query.p > 1}
		<a href={qs('', { ...query, p: currentpage - 1})}>&lt;</a>
	{/if}
	{#each pagearray as page}
		{#if page === currentpage - 1}
			<span class="secondary">{page + 1}</span>
		{:else if page === 0 || page === pagearray.length - 1 || Math.abs(page - currentpage + 1) < 3}
			<a href={qs('', { ...query, p: page + 1 })}>{page + 1}</a>
		{:else if Math.abs(page - currentpage + 1) === 3}
			<span class="separator">•••</span>
		{/if}
	{/each}
	{#if pagearray.length > currentpage}
		<a href={qs('', { ...query, p: currentpage + 1})}>&gt;</a>
	{/if}
</div>
